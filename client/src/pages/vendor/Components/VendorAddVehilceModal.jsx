import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiImage,
  FiInfo,
  FiMapPin,
  FiUploadCloud,
} from "react-icons/fi";
import { fetchModelData } from "../../admin/components/modelDataActions";
import { getApiUrl } from "../../../utils/api";
import { getVehicleImage } from "../../../utils/vehicleImage";

const currentYear = new Date().getFullYear();

const defaultValues = {
  registeration_number: "",
  company: "",
  name: "",
  model: "",
  title: "",
  base_package: "12 Hours / 120 km",
  price: "",
  description: "",
  year_made: currentYear,
  fuelType: "petrol",
  Seats: "5",
  transmitionType: "manual",
  carType: "hatchback",
  vehicleLocation: "",
  vehicleDistrict: "",
  insurance_end_date: "",
  Registeration_end_date: "",
  polution_end_date: "",
  image: undefined,
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200";
const labelClass = "text-sm font-semibold text-slate-700";
const helperClass = "mt-2 text-xs text-rose-500";

function toLabel(value) {
  return String(value || "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildVehicleName(model) {
  const text = String(model || "").trim();
  const upper = text.toUpperCase();

  if (upper.includes("SCORPIO N")) return "Scorpio N";
  if (upper.includes("INNOVA CRYSTA")) return "Innova Crysta";
  if (upper.includes("XUV300")) return "XUV300";
  if (upper.includes("HONDA CITY")) return "City";
  if (upper.includes("MARUTI SWIFT")) return "Swift";
  if (upper.includes("BALENO")) return "Baleno";
  if (upper.includes("CRETA")) return "Creta";
  if (upper.includes("VENUE")) return "Venue";
  if (upper.includes("NEXON")) return "Nexon";
  if (upper.includes("PUNCH")) return "Punch";
  if (upper.includes("SONET")) return "Sonet";
  if (upper.includes("SELTOS")) return "Seltos";

  const cleaned = text
    .replace(/^(MARUTI SUZUKI|MARUTI|HYUNDAI|TATA|MAHINDRA|KIA|TOYOTA|HONDA)\s+/i, "")
    .trim();

  return cleaned.split(" ").slice(0, 2).join(" ") || text;
}

function VendorAddProductModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );

  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  const selectedCompany = watch("company");
  const selectedDistrict = watch("vehicleDistrict");
  const selectedModel = watch("model");
  const vehicleName = watch("name");
  const vehicleTitle = watch("title");
  const vehiclePrice = watch("price");
  const vehicleType = watch("carType");
  const selectedSeats = watch("Seats");
  const transmissionType = watch("transmitionType");
  const fuelType = watch("fuelType");
  const selectedLocation = watch("vehicleLocation");
  const uploadedFiles = watch("image");

  const companyOptions = useMemo(
    () => [...companyData].sort((left, right) => String(left).localeCompare(String(right))),
    [companyData]
  );

  const districtOptions = useMemo(
    () => [...districtData].sort((left, right) => String(left).localeCompare(String(right))),
    [districtData]
  );

  const filteredModels = useMemo(() => {
    if (!selectedCompany) return [...modelData].sort();

    return modelData
      .filter((model) =>
        String(model).toLowerCase().includes(String(selectedCompany).toLowerCase())
      )
      .sort();
  }, [modelData, selectedCompany]);

  const filteredLocations = useMemo(() => {
    if (!selectedDistrict) return [...locationData].sort();

    return locationData
      .filter((location) =>
        String(location).toLowerCase().includes(String(selectedDistrict).toLowerCase())
      )
      .sort();
  }, [locationData, selectedDistrict]);

  const previewImage =
    imagePreviews[0] ||
    getVehicleImage({
      model: selectedModel,
      company: selectedCompany,
      name: vehicleName,
    });

  useEffect(() => {
    fetchModelData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompany && selectedModel && !filteredModels.includes(selectedModel)) {
      setValue("model", "");
    }
  }, [filteredModels, selectedCompany, selectedModel, setValue]);

  useEffect(() => {
    if (selectedDistrict && selectedLocation && !filteredLocations.includes(selectedLocation)) {
      setValue("vehicleLocation", "");
    }
  }, [filteredLocations, selectedDistrict, selectedLocation, setValue]);

  useEffect(() => {
    if (!selectedModel) return;

    const suggestedName = buildVehicleName(selectedModel);
    if (!vehicleName) {
      setValue("name", suggestedName);
    }
    if (!vehicleTitle) {
      setValue("title", `${suggestedName} self-drive rental`);
    }
  }, [selectedModel, setValue, vehicleName, vehicleTitle]);

  useEffect(() => {
    const files = Array.from(uploadedFiles || []);
    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedFiles]);

  const handleClose = () => {
    dispatch(addVehicleClicked(false));
    navigate("/vendorDashboard/vehicles");
  };

  const onSubmit = async (addData) => {
    if (!refreshToken) {
      toast.error("Your vendor session expired. Please sign in again.");
      navigate("/vendorSignin");
      return;
    }

    const formData = new FormData();
    const toastId = toast.loading("Saving vehicle...", {
      position: "bottom-center",
    });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const appendIfPresent = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    };

    try {
      setIsSubmitting(true);

      appendIfPresent("registeration_number", addData.registeration_number);
      appendIfPresent("company", addData.company);
      appendIfPresent("name", addData.name);
      appendIfPresent("model", addData.model);
      appendIfPresent("title", addData.title);
      appendIfPresent("base_package", addData.base_package);
      appendIfPresent("price", addData.price);
      appendIfPresent("description", addData.description);
      appendIfPresent("year_made", addData.year_made);
      appendIfPresent("fuel_type", addData.fuelType);
      appendIfPresent("seat", addData.Seats);
      appendIfPresent("transmition_type", addData.transmitionType);
      appendIfPresent("insurance_end_date", addData.insurance_end_date);
      appendIfPresent("registeration_end_date", addData.Registeration_end_date);
      appendIfPresent("polution_end_date", addData.polution_end_date);
      appendIfPresent("car_type", addData.carType);
      appendIfPresent("location", addData.vehicleLocation);
      appendIfPresent("district", addData.vehicleDistrict);

      Array.from(addData.image || [])
        .slice(0, 3)
        .forEach((file) => {
          formData.append("image", file);
        });

      const res = await fetch(getApiUrl("/api/vendor/vendorAddVehicle"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken},${accessToken || ""}`,
        },
        body: formData,
        signal: controller.signal,
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData?.message || "Could not add vehicle");
      }

      toast.success(responseData?.message || "Vehicle added successfully", {
        id: toastId,
      });
      reset(defaultValues);
      dispatch(addVehicleClicked(false));
      navigate("/vendorDashboard/vehicles");
    } catch (error) {
      const message =
        error.name === "AbortError"
          ? "Saving took too long. Try again with smaller images or submit without photos."
          : error.message || "Could not add vehicle";

      toast.error(message, { id: toastId });
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0,_#f8fafc_55%)] px-4 py-6 md:px-8">
      <Toaster />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-950 px-6 py-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
              Vendor Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Add a new vehicle
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Create a listing with the right brand, location, pricing and vehicle
              details. The form saves more reliably now, and local testing still works
              even when image upload is unavailable.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <FiArrowLeft />
            Back to vehicles
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                  <FiInfo className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle basics</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Start with the listing identity users will see first.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="registeration_number">
                    Registration Number
                  </label>
                  <input
                    id="registeration_number"
                    className={inputClass}
                    placeholder="GJ-06-AB-1234"
                    {...register("registeration_number", {
                      required: "Registration number is required",
                    })}
                  />
                  {errors.registeration_number && (
                    <p className={helperClass}>{errors.registeration_number.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="company">
                    Brand
                  </label>
                  <select
                    id="company"
                    className={inputClass}
                    {...register("company", { required: "Select a brand" })}
                  >
                    <option value="">Select brand</option>
                    {companyOptions.map((company) => (
                      <option value={company} key={company}>
                        {toLabel(company)}
                      </option>
                    ))}
                  </select>
                  {errors.company && <p className={helperClass}>{errors.company.message}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="model">
                    Model
                  </label>
                  <select
                    id="model"
                    className={inputClass}
                    disabled={!filteredModels.length}
                    {...register("model", { required: "Select a model" })}
                  >
                    <option value="">
                      {selectedCompany ? "Select model" : "Choose a brand first"}
                    </option>
                    {filteredModels.map((model) => (
                      <option value={model} key={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  {errors.model && <p className={helperClass}>{errors.model.message}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="name">
                    Display Name
                  </label>
                  <input
                    id="name"
                    className={inputClass}
                    placeholder="Swift"
                    {...register("name", { required: "Vehicle name is required" })}
                  />
                  {errors.name && <p className={helperClass}>{errors.name.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="title">
                    Listing Title
                  </label>
                  <input
                    id="title"
                    className={inputClass}
                    placeholder="Swift self-drive rental"
                    {...register("title")}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Write a short summary about condition, comfort, luggage space or features."
                    {...register("description")}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                  <FiCheckCircle className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Rental setup</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Configure the pricing and specifications customers compare.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="base_package">
                    Base Package
                  </label>
                  <input
                    id="base_package"
                    className={inputClass}
                    placeholder="12 Hours / 120 km"
                    {...register("base_package")}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="price">
                    Price Per Day
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="1"
                    className={inputClass}
                    placeholder="2999"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than zero",
                      },
                    })}
                  />
                  {errors.price && <p className={helperClass}>{errors.price.message}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="year_made">
                    Year Made
                  </label>
                  <input
                    id="year_made"
                    type="number"
                    min="2000"
                    max={currentYear + 1}
                    className={inputClass}
                    {...register("year_made", {
                      required: "Year made is required",
                      min: {
                        value: 2000,
                        message: "Enter a valid year",
                      },
                      max: {
                        value: currentYear + 1,
                        message: "Enter a valid year",
                      },
                    })}
                  />
                  {errors.year_made && <p className={helperClass}>{errors.year_made.message}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="fuelType">
                    Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    className={inputClass}
                    {...register("fuelType", { required: "Select fuel type" })}
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electirc">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="carType">
                    Body Type
                  </label>
                  <select
                    id="carType"
                    className={inputClass}
                    {...register("carType", { required: "Select body type" })}
                  >
                    <option value="hatchback">Hatchback</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="mpv">MPV</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="Seats">
                    Seats
                  </label>
                  <select
                    id="Seats"
                    className={inputClass}
                    {...register("Seats", { required: "Select seating capacity" })}
                  >
                    <option value="5">5 seats</option>
                    <option value="6">6 seats</option>
                    <option value="7">7 seats</option>
                    <option value="8">8 seats</option>
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className={labelClass} htmlFor="transmitionType">
                    Transmission
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {["manual", "automatic"].map((value) => (
                      <label
                        key={value}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900"
                      >
                        <input
                          type="radio"
                          value={value}
                          className="h-4 w-4 accent-slate-950"
                          {...register("transmitionType", {
                            required: "Select transmission",
                          })}
                        />
                        {toLabel(value)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Location and documents</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Pick the district first, then choose the matching pickup location.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="vehicleDistrict">
                    District
                  </label>
                  <select
                    id="vehicleDistrict"
                    className={inputClass}
                    {...register("vehicleDistrict", { required: "Select a district" })}
                  >
                    <option value="">Select district</option>
                    {districtOptions.map((district) => (
                      <option value={district} key={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleDistrict && (
                    <p className={helperClass}>{errors.vehicleDistrict.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="vehicleLocation">
                    Pickup and Drop-off Location
                  </label>
                  <select
                    id="vehicleLocation"
                    className={inputClass}
                    disabled={!filteredLocations.length}
                    {...register("vehicleLocation", { required: "Select a location" })}
                  >
                    <option value="">
                      {selectedDistrict ? "Select location" : "Choose a district first"}
                    </option>
                    {filteredLocations.map((location) => (
                      <option value={location} key={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleLocation && (
                    <p className={helperClass}>{errors.vehicleLocation.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="insurance_end_date">
                    Insurance Expiry
                  </label>
                  <div className="relative">
                    <input
                      id="insurance_end_date"
                      type="date"
                      className={inputClass}
                      {...register("insurance_end_date")}
                    />
                    <FiCalendar className="pointer-events-none absolute right-4 top-[22px] text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="Registeration_end_date">
                    Registration Expiry
                  </label>
                  <div className="relative">
                    <input
                      id="Registeration_end_date"
                      type="date"
                      className={inputClass}
                      {...register("Registeration_end_date")}
                    />
                    <FiCalendar className="pointer-events-none absolute right-4 top-[22px] text-slate-400" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="polution_end_date">
                    Pollution Certificate Expiry
                  </label>
                  <div className="relative">
                    <input
                      id="polution_end_date"
                      type="date"
                      className={inputClass}
                      {...register("polution_end_date")}
                    />
                    <FiCalendar className="pointer-events-none absolute right-4 top-[22px] text-slate-400" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                  <FiUploadCloud className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle photos</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload up to 3 photos. If you skip them locally, the listing still
                    uses a catalog image so you can continue testing.
                  </p>
                </div>
              </div>

              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-900 hover:bg-white"
              >
                <FiImage className="text-3xl text-slate-600" />
                <p className="mt-4 text-base font-semibold text-slate-900">
                  Click to upload vehicle photos
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  JPG, PNG or WEBP. Up to 3 files, 5 MB each.
                </p>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  {...register("image", {
                    validate: (files) => {
                      const fileList = Array.from(files || []);
                      if (fileList.length > 3) {
                        return "Upload up to 3 images only";
                      }

                      const tooLarge = fileList.find((file) => file.size > 5 * 1024 * 1024);
                      if (tooLarge) {
                        return "Each image must be under 5 MB";
                      }

                      return true;
                    },
                  })}
                />
              </label>

              {errors.image && <p className={helperClass}>{errors.image.message}</p>}

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {imagePreviews.length > 0 ? (
                  imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={preview}
                        alt={`Vehicle preview ${index + 1}`}
                        className="h-44 w-full object-cover"
                      />
                      <div className="px-4 py-3 text-xs font-medium text-slate-500">
                        Photo {index + 1}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
                    No photos selected yet. Your listing preview will use the model
                    image.
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Ready to save?</p>
                <p className="mt-1 text-sm text-slate-500">
                  We will keep you on this page if there is an error, so you do not
                  lose the form.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? "Saving vehicle..." : "Save vehicle"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
              <div className="relative p-6">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                  Live Preview
                </span>
                <img
                  src={previewImage}
                  alt={vehicleName || "Vehicle preview"}
                  className="mt-5 h-60 w-full rounded-3xl bg-white/5 object-cover p-4"
                />

                <div className="mt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold">
                        {vehicleName || buildVehicleName(selectedModel) || "Your vehicle"}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {vehicleTitle || "Add a clear title to improve trust and clicks."}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                        Per Day
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {vehiclePrice ? `Rs. ${vehiclePrice}` : "Set price"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                        Category
                      </p>
                      <p className="mt-2 font-semibold text-white">
                        {toLabel(vehicleType || "hatchback")}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                        Transmission
                      </p>
                      <p className="mt-2 font-semibold text-white">
                        {toLabel(transmissionType)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                        Fuel
                      </p>
                      <p className="mt-2 font-semibold text-white">{toLabel(fuelType)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                        Seats
                      </p>
                      <p className="mt-2 font-semibold text-white">{selectedSeats || "5"}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Pickup Location
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {selectedLocation || "Select district and location"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Submission checklist</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <FiCheckCircle className="mt-0.5 text-emerald-600" />
                  <p>Choose the correct brand first so only matching models appear.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <FiCheckCircle className="mt-0.5 text-emerald-600" />
                  <p>Use a clear display name and price to make the listing easy to trust.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <FiCheckCircle className="mt-0.5 text-emerald-600" />
                  <p>Pick the same district and location your customers can actually access.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <FiCheckCircle className="mt-0.5 text-emerald-600" />
                  <p>The first uploaded photo is the main image shown in your fleet.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default VendorAddProductModal;
