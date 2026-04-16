import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IoMdClose } from "react-icons/io";
import { FiArrowLeft, FiMapPin, FiShield, FiTruck } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  setLoading,
  setadminAddVehicleSuccess,
  setadminCrudError,
} from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { fetchModelData } from "./modelDataActions";
import { getApiUrl } from "../../../utils/api";

const textFieldStyles = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    backgroundColor: "#fff",
  },
};

const formatPreviewName = (files) => {
  if (!files || files.length === 0) return "No vehicle photos selected";
  if (files.length === 1) return files[0].name;
  return `${files.length} photos selected`;
};

const AddProductModal = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      company: "",
      model: "",
      fuelType: "",
      carType: "",
      Seats: "",
      transmitionType: "",
      vehicleDistrict: "",
      vehicleLocation: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { modelData, companyData } = useSelector((state) => state.modelDataSlice);
  const { wholeData } = useSelector((state) => state.selectRideSlice);
  const { loading } = useSelector((state) => state.statusSlice);

  const selectedDistrict = watch("vehicleDistrict");
  const selectedImages = watch("image");
  const selectedCompany = watch("company");
  const selectedModel = watch("model");
  const selectedName = watch("name");
  const selectedPrice = watch("price");

  useEffect(() => {
    fetchModelData(dispatch);
    dispatch(addVehicleClicked(true));
  }, [dispatch]);

  const availableLocations = useMemo(() => {
    if (!Array.isArray(wholeData) || !selectedDistrict) {
      return [];
    }

    return wholeData
      .filter((entry) => entry.district === selectedDistrict)
      .map((entry) => entry.location);
  }, [wholeData, selectedDistrict]);

  useEffect(() => {
    if (selectedDistrict && availableLocations.length > 0) {
      setValue("vehicleLocation", availableLocations[0]);
      return;
    }

    if (!selectedDistrict) {
      setValue("vehicleLocation", "");
    }
  }, [availableLocations, selectedDistrict, setValue]);

  const onSubmit = async (addData) => {
    try {
      const imageFiles = Array.from(addData.image || []);
      const formData = new FormData();

      formData.append("registeration_number", addData.registeration_number);
      formData.append("company", addData.company);
      imageFiles.forEach((file) => {
        formData.append("image", file);
      });
      formData.append("name", addData.name);
      formData.append("model", addData.model);
      formData.append("title", addData.title || "");
      formData.append("base_package", addData.base_package || "");
      formData.append("price", addData.price || "");
      formData.append("description", addData.description || "");
      formData.append("year_made", addData.year_made);
      formData.append("fuel_type", addData.fuelType);
      formData.append("seat", addData.Seats);
      formData.append("transmition_type", addData.transmitionType);
      if (addData.insurance_end_date?.$d) {
        formData.append("insurance_end_date", addData.insurance_end_date.$d);
      }
      if (addData.Registeration_end_date?.$d) {
        formData.append("registeration_end_date", addData.Registeration_end_date.$d);
      }
      if (addData.polution_end_date?.$d) {
        formData.append("polution_end_date", addData.polution_end_date.$d);
      }
      formData.append("car_type", addData.carType);
      formData.append("location", addData.vehicleLocation);
      formData.append("district", addData.vehicleDistrict);

      const toastId = toast.loading("Saving vehicle...", {
        position: "bottom-center",
      });
      dispatch(setLoading(true));

      const res = await fetch(getApiUrl("/api/admin/addProduct"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error("Vehicle could not be saved.");
        dispatch(setLoading(false));
        dispatch(setadminCrudError(true));
        return;
      }

      dispatch(setadminAddVehicleSuccess(true));
      dispatch(setLoading(false));
      toast.dismiss(toastId);
      toast.success("Vehicle added successfully.");
      reset();
      dispatch(addVehicleClicked(false));
      navigate("/adminDashboard/allProduct");
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setadminCrudError(true));
      console.log(error);
    }
  };

  const handleClose = () => {
    dispatch(addVehicleClicked(false));
    navigate("/adminDashboard/allProduct");
  };

  return (
    <>
      {loading ? <Toaster /> : null}
      {isAddVehicleClicked ? (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(155deg,#eff6ff_0%,#ffffff_42%,#f8fafc_100%)] px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <button
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-900 hover:bg-slate-50"
                onClick={handleClose}
                type="button"
              >
                <FiArrowLeft />
                Back to fleet
              </button>
              <button
                onClick={handleClose}
                className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-slate-900 hover:bg-slate-50"
                type="button"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Admin Fleet
                  </p>
                  <h1 className="mt-3 text-3xl font-bold text-slate-950">
                    Add a new vehicle
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                    Create a polished listing with correct registration, pricing,
                    coverage dates, and pickup location so users can book it
                    immediately after approval.
                  </p>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <FiTruck />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Vehicle details</h2>
                      <p className="text-sm text-slate-500">
                        Core listing and pricing information.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <TextField
                      required
                      id="registeration_number"
                      label="Registration number"
                      {...register("registeration_number")}
                      sx={textFieldStyles}
                    />

                    <Controller
                      control={control}
                      name="company"
                      render={({ field }) => (
                        <TextField {...field} required select label="Company" sx={textFieldStyles}>
                          {companyData.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>
                              {cur}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <TextField
                      required
                      id="name"
                      label="Display name"
                      {...register("name")}
                      sx={textFieldStyles}
                    />

                    <Controller
                      control={control}
                      name="model"
                      render={({ field }) => (
                        <TextField {...field} required select label="Model" sx={textFieldStyles}>
                          {modelData.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>
                              {cur}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <TextField id="title" label="Short title" {...register("title")} sx={textFieldStyles} />
                    <TextField
                      id="base_package"
                      label="Base package"
                      {...register("base_package")}
                      sx={textFieldStyles}
                    />
                    <TextField
                      id="price"
                      type="number"
                      label="Price per day"
                      {...register("price")}
                      sx={textFieldStyles}
                    />
                    <TextField
                      required
                      id="year_made"
                      type="number"
                      label="Year made"
                      {...register("year_made")}
                      sx={textFieldStyles}
                    />
                    <Controller
                      control={control}
                      name="fuelType"
                      render={({ field }) => (
                        <TextField {...field} required select label="Fuel type" sx={textFieldStyles}>
                          <MenuItem value={"petrol"}>Petrol</MenuItem>
                          <MenuItem value={"diesel"}>Diesel</MenuItem>
                          <MenuItem value={"electirc"}>Electric</MenuItem>
                          <MenuItem value={"hybrid"}>Hybrid</MenuItem>
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="carType"
                      render={({ field }) => (
                        <TextField {...field} required select label="Vehicle type" sx={textFieldStyles}>
                          <MenuItem value="sedan">Sedan</MenuItem>
                          <MenuItem value="suv">SUV</MenuItem>
                          <MenuItem value="hatchback">Hatchback</MenuItem>
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="Seats"
                      render={({ field }) => (
                        <TextField {...field} required select label="Seats" sx={textFieldStyles}>
                          <MenuItem value={"5"}>5</MenuItem>
                          <MenuItem value={"7"}>7</MenuItem>
                          <MenuItem value={"8"}>8</MenuItem>
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="transmitionType"
                      render={({ field }) => (
                        <TextField {...field} required select label="Transmission" sx={textFieldStyles}>
                          <MenuItem value={"automatic"}>Automatic</MenuItem>
                          <MenuItem value={"manual"}>Manual</MenuItem>
                        </TextField>
                      )}
                    />
                  </div>

                  <TextField
                    id="description"
                    label="Description"
                    multiline
                    rows={4}
                    sx={{ ...textFieldStyles, marginTop: "1.5rem" }}
                    {...register("description")}
                  />
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <FiMapPin />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Availability and location</h2>
                      <p className="text-sm text-slate-500">
                        Assign the district, pickup point, and compliance dates.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Controller
                      control={control}
                      name="vehicleDistrict"
                      render={({ field }) => (
                        <TextField {...field} required select label="District" sx={textFieldStyles}>
                          {[...new Set((wholeData || []).map((cur) => cur.district))].map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>
                              {cur}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="vehicleLocation"
                      render={({ field }) => (
                        <TextField {...field} required select label="Pickup location" sx={textFieldStyles}>
                          {availableLocations.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>
                              {cur}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Controller
                      name="insurance_end_date"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            {...field}
                            label="Insurance end"
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            slotProps={{ textField: { sx: textFieldStyles } }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <Controller
                      control={control}
                      name="Registeration_end_date"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            {...field}
                            label="Registration end"
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            slotProps={{ textField: { sx: textFieldStyles } }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <Controller
                      control={control}
                      name="polution_end_date"
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            {...field}
                            label="Pollution end"
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            slotProps={{ textField: { sx: textFieldStyles } }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                      <FiShield />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Uploads</h2>
                      <p className="text-sm text-slate-500">
                        Add the vehicle photos and optional compliance documents.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5">
                      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="image">
                        Vehicle photos
                      </label>
                      <input
                        className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800"
                        id="image"
                        type="file"
                        multiple
                        {...register("image")}
                      />
                      <p className="mt-3 text-sm text-slate-500">
                        {formatPreviewName(selectedImages)}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-3xl border border-slate-200 p-4">
                        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="insurance_image">
                          Insurance document
                        </label>
                        <input
                          className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800"
                          id="insurance_image"
                          type="file"
                          multiple
                          {...register("insurance_image")}
                        />
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-4">
                        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="rc_book_image">
                          RC book document
                        </label>
                        <input
                          className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800"
                          id="rc_book_image"
                          type="file"
                          multiple
                          {...register("rc_book_image")}
                        />
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-4">
                        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="polution_image">
                          Pollution document
                        </label>
                        <input
                          className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800"
                          id="polution_image"
                          type="file"
                          multiple
                          {...register("polution_image")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-50"
                    onClick={handleClose}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? "Saving vehicle..." : "Save vehicle"}
                  </button>
                </div>
              </form>

              <aside className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Preview
                  </p>
                  <div className="mt-4 rounded-[28px] bg-slate-950 p-5 text-white">
                    <p className="text-sm text-slate-300">
                      {selectedCompany || "Company"}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                      {selectedName || "Vehicle name"}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300">
                      {selectedModel || "Model will appear here"}
                    </p>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Daily price
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {selectedPrice ? `Rs. ${selectedPrice}` : "Rs. --"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm">
                        Admin listing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Good listing checklist</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Use the exact registration number to avoid duplicate entries.</p>
                    <p>Select a district first so the pickup location stays valid.</p>
                    <p>Add at least one vehicle image for a better booking experience.</p>
                    <p>Fill title, package, and description to make the card more convincing.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddProductModal;
