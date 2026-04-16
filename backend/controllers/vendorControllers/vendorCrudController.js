import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";

import { uploader } from "../../utils/cloudinaryConfig.js";
import { base64Converter } from "../../utils/multer.js";
import Vehicle from "../../models/vehicleModel.js";

const isLocalAutoApproval = process.env.NODE_ENV !== "production";
const hasCloudinaryConfig = Boolean(
  process.env.CLOUD_NAME?.trim() &&
    process.env.API_KEY?.trim() &&
    process.env.API_SECRET?.trim()
);

const fallbackVehicleImage = (company) => {
  const brand = String(company || "").toLowerCase();

  if (brand.includes("maruti") || brand.includes("maruthi")) return "/cars/maruthi.svg";
  if (brand.includes("hyundai")) return "/cars/hyundai.svg";
  if (brand.includes("tata")) return "/cars/tata.svg";
  if (brand.includes("mahindra")) return "/cars/mahindra.svg";
  if (brand.includes("kia")) return "/cars/kia.svg";
  if (brand.includes("toyota")) return "/cars/toyota.svg";
  if (brand.includes("honda")) return "/cars/honda.svg";
  if (brand.includes("skoda")) return "/cars/skoda.svg";
  if (brand.includes("volkswagen") || brand === "vw") return "/cars/volkswagen.svg";

  return "/car-placeholder.svg";
};

const uploadToCloudinaryWithTimeout = (file, timeoutMs = 12000) =>
  Promise.race([
    uploader.upload(file.data, {
      public_id: file.filename,
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Image upload timed out")), timeoutMs);
    }),
  ]);

const resolveVehicleImages = async (req, company) => {
  if (!req.files || req.files.length === 0) {
    if (isLocalAutoApproval) {
      return [fallbackVehicleImage(company)];
    }

    throw new Error("Please upload at least one vehicle image");
  }

  if (!hasCloudinaryConfig) {
    if (isLocalAutoApproval) {
      return [fallbackVehicleImage(company)];
    }

    throw new Error("Image upload service is not configured");
  }

  const encodedFiles = base64Converter(req);
  const uploadResults = await Promise.allSettled(
    encodedFiles.map((file) => uploadToCloudinaryWithTimeout(file))
  );

  const uploadedImages = uploadResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value.secure_url);

  if (uploadedImages.length > 0) {
    return uploadedImages;
  }

  if (isLocalAutoApproval) {
    return [fallbackVehicleImage(company)];
  }

  const firstFailure = uploadResults.find((result) => result.status === "rejected");
  throw new Error(firstFailure?.reason?.message || "Could not upload vehicle images");
};

// vendor add vehicle
export const vendorAddVehicle = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(400, "Body cannot be empty"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      fuel_type,
      description,
      seat,
      transmition_type,
      registeration_end_date,
      insurance_end_date,
      polution_end_date,
      car_type,
      location,
      district,
    } = req.body;

    if (
      !registeration_number ||
      !company ||
      !name ||
      !model ||
      !price ||
      !year_made ||
      !fuel_type ||
      !seat ||
      !transmition_type ||
      !car_type ||
      !location ||
      !district
    ) {
      return next(errorHandler(400, "Please fill all required vehicle details"));
    }

    const vehicleImages = await resolveVehicleImages(req, company);

    const addVehicle = new vehicle({
      registeration_number,
      company,
      name,
      image: vehicleImages,
      model,
      car_title: title,
      car_description: description,
      base_package,
      price,
      year_made,
      fuel_type,
      seats: seat,
      transmition: transmition_type,
      insurance_end: insurance_end_date,
      registeration_end: registeration_end_date,
      pollution_end: polution_end_date,
      car_type,
      created_at: new Date().toISOString(),
      location,
      district,
      isDeleted: "false",
      isAdminAdded: false,
      addedBy: String(req.user || "admin"),
      isAdminApproved: isLocalAutoApproval,
      isRejected: false,
    });

    await addVehicle.save();

    res.status(201).json({
      message: isLocalAutoApproval
        ? "Vehicle added successfully"
        : "Vehicle submitted for approval",
      vehicle: addVehicle,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(409, "Vehicle already exists"));
    }

    console.log(error);
    next(errorHandler(400, error.message || "Vehicle failed to add"));
  }
};

//edit vendorVehicles
export const vendorEditVehicles = async (req, res, next) => {
  try {
    //get the id of vehicle to edit through req.params
    const vehicle_id = req.params.id;

    if (!vehicle_id) {
      return next(errorHandler(401, "cannot be empty"));
    }

    if (!req.body || !req.body.formData) {
      return next(errorHandler(404, "Add data to edit first"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      description,
      Seats,
      transmitionType,
      Registeration_end_date,
      insurance_end_date,
      polution_end_date,
      carType,
      fuelType,
      vehicleLocation,
      vehicleDistrict,
    } = req.body.formData;

    try {
      const edited = await Vehicle.findByIdAndUpdate(
        vehicle_id,
        {
          registeration_number,
          company,
          name,
          model,
          car_title: title,
          car_description: description,
          base_package,
          price,
          year_made,
          fuel_type: fuelType,
          seats: Seats,
          transmition: transmitionType,
          insurance_end: insurance_end_date,
          registeration_end: Registeration_end_date,
          pollution_end: polution_end_date,
          car_type: carType,
          updated_at: Date.now(),
          location: vehicleLocation,
          district: vehicleDistrict,
          //also resetting adminApproval or rejection when editing data so data request is send again
          isAdminApproved: isLocalAutoApproval,
          isRejected: false,
        },

        { new: true }
      );
      if (!edited) {
        return next(errorHandler(404, "data with this id not found"));
      }

      res.status(200).json(edited);
    } catch (error) {
      if (error.code == 11000 && error.keyPattern && error.keyValue) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];

        return next(
          errorHandler(
            409,
            `${duplicateField} '${duplicateValue}' already exists`
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

//delete vendor Vehcile soft delete
export const vendorDeleteVehicles = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    const softDeleted = await vehicle.findOneAndUpdate(
      { _id: vehicle_id },
      { isDeleted: "true" },
      { new: true }
    );
    if (!softDeleted) {
      next(errorHandler(400, "vehicle not found"));
      return;
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error while vendorDeleteVehilces"));
  }
};

//show vendor vehicles
export const showVendorVehicles = async (req, res, next) => {
  try {
    if (!req.body) {
      throw errorHandler(400, "User not found");
    }

    const { _id } = req.body;

    if (isLocalAutoApproval) {
      await Vehicle.updateMany(
        {
          addedBy: _id,
          isDeleted: { $in: [false, "false"] },
          isAdminAdded: { $in: [false, "false"] },
          isRejected: { $ne: true },
          isAdminApproved: { $ne: true },
        },
        {
          $set: {
            isAdminApproved: true,
          },
        }
      );
    }

    const vendorsVehicles = await vehicle.aggregate([
      {
        $match: {
          isDeleted: { $in: [false, "false"] },
          // historical data uses both boolean and string values
          isAdminAdded: { $in: [false, "false"] },
          addedBy: _id,
        },
      },
    ]);

    // Empty is a valid state for a new vendor.
    res.status(200).json(vendorsVehicles || []);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error in showVendorVehicles"));
  }
};
