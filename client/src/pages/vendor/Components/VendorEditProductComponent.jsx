import { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Toaster, toast } from "react-hot-toast";
import { setVendorEditSuccess, setVenodrVehilces } from "../../../redux/vendor/vendorDashboardSlice";
import { fetchModelData } from "../../admin/components/modelDataActions";
import { getApiUrl } from "../../../utils/api";

export default function VendorEditProductComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);
  const { register, handleSubmit, control, watch } = useForm();
  const vendorVehilces = useSelector((state) => state.vendorDashboardSlice.vendorVehilces);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );
  const currentUserId = useSelector((state) => state.user.currentUser?._id);
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicleId = queryParams.get("vehicle_id");

  useEffect(() => {
    fetchModelData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const fetchVehiclesIfNeeded = async () => {
      if (!currentUserId) {
        setIsLoadingVehicle(false);
        return;
      }

      if (Array.isArray(vendorVehilces) && vendorVehilces.length > 0) {
        setIsLoadingVehicle(false);
        return;
      }

      try {
        const res = await fetch(getApiUrl("/api/vendor/showVendorVehilces"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken},${accessToken}`,
          },
          body: JSON.stringify({ _id: currentUserId }),
        });

        const data = await res.json().catch(() => []);
        dispatch(setVenodrVehilces(Array.isArray(data) ? data : []));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingVehicle(false);
      }
    };

    fetchVehiclesIfNeeded();
  }, [accessToken, currentUserId, dispatch, refreshToken, vendorVehilces]);

  const updatingItem = useMemo(
    () => vendorVehilces.find((cur) => cur._id === vehicleId),
    [vehicleId, vendorVehilces]
  );

  const insuranceDefaultDate = updatingItem?.insurance_end
    ? dayjs(new Date(updatingItem.insurance_end))
    : null;
  const registerationDefaultDate = updatingItem?.registeration_end
    ? dayjs(new Date(updatingItem.registeration_end))
    : null;
  const pollutionDefaultDate = updatingItem?.pollution_end
    ? dayjs(new Date(updatingItem.pollution_end))
    : null;

  const selectedCompany = watch("company", updatingItem?.company || "");
  const selectedDistrict = watch("vehicleDistrict", updatingItem?.district || "");

  const filteredModels = useMemo(() => {
    if (!selectedCompany) return modelData;
    return modelData.filter((model) =>
      String(model).toLowerCase().includes(String(selectedCompany).toLowerCase())
    );
  }, [modelData, selectedCompany]);

  const filteredLocations = useMemo(() => {
    if (!selectedDistrict) return locationData;
    return locationData.filter((entry) =>
      String(entry).toLowerCase().includes(String(selectedDistrict).toLowerCase())
    );
  }, [locationData, selectedDistrict]);

  const onEditSubmit = async (editData) => {
    try {
      const toastId = toast.loading("Saving changes...", {
        position: "bottom-center",
      });

      const formData = {
        ...editData,
        insurance_end_date: editData.insurance_end_date?.$d || null,
        Registeration_end_date: editData.Registeration_end_date?.$d || null,
        polution_end_date: editData.polution_end_date?.$d || null,
      };

      const res = await fetch(getApiUrl(`/api/vendor/vendorEditVehicles/${vehicleId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken},${accessToken}`,
        },
        body: JSON.stringify({ formData }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error(data?.message || "Could not update vehicle");
        return;
      }

      toast.dismiss(toastId);
      dispatch(setVendorEditSuccess(true));
      navigate("/vendorDashboard/vehicles");
    } catch (error) {
      console.log(error);
      toast.error("Could not update vehicle");
    }
  };

  const handleClose = () => {
    navigate("/vendorDashboard/vehicles");
  };

  if (isLoadingVehicle) {
    return (
      <div className="p-10 text-center text-slate-500">Loading vehicle details...</div>
    );
  }

  if (!updatingItem) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 shadow-sm">
        <p className="text-2xl font-semibold text-slate-900">Vehicle not found</p>
        <p className="mt-2 text-sm text-slate-500">
          This listing may have been removed or the page was opened without valid vehicle data.
        </p>
        <button
          type="button"
          className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          onClick={handleClose}
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <button onClick={handleClose} className="relative left-10 top-5" type="button">
        <div className="rounded-full bg-slate-100 p-2 drop-shadow-md transition hover:translate-x-1 hover:translate-y-1 hover:bg-blue-200 hover:shadow-lg">
          <IoMdClose style={{ fontSize: "30" }} />
        </div>
      </button>

      <form onSubmit={handleSubmit(onEditSubmit)}>
        <div className="mx-auto max-w-[1000px] bg-white">
          <Box
            sx={{
              "& .MuiTextField-root": {
                m: 4,
                width: "25ch",
                color: "black",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "@media (max-width: 640px)": {
                  width: "30ch",
                },
              },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="registeration_number"
                label="registeration_number"
                {...register("registeration_number")}
                defaultValue={updatingItem?.registeration_number || ""}
              />

              <Controller
                control={control}
                name="company"
                defaultValue={updatingItem?.company || ""}
                render={({ field }) => (
                  <TextField {...field} required id="company" select label="Company">
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
                label="name"
                {...register("name")}
                defaultValue={updatingItem?.name || ""}
              />

              <Controller
                control={control}
                name="model"
                defaultValue={updatingItem?.model || ""}
                render={({ field }) => (
                  <TextField {...field} required id="model" select label="Model">
                    {filteredModels.map((cur, idx) => (
                      <MenuItem value={cur} key={idx}>
                        {cur}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                id="title"
                label="title"
                {...register("title")}
                defaultValue={updatingItem?.car_title || ""}
              />
              <TextField
                id="base_package"
                label="base_package"
                {...register("base_package")}
                defaultValue={updatingItem?.base_package || ""}
              />
              <TextField
                id="price"
                type="number"
                label="Price"
                {...register("price")}
                defaultValue={updatingItem?.price || ""}
              />

              <TextField
                required
                id="year_made"
                type="number"
                label="year_made"
                {...register("year_made")}
                defaultValue={updatingItem?.year_made || ""}
              />
              <Controller
                control={control}
                name="fuelType"
                defaultValue={updatingItem?.fuel_type || ""}
                render={({ field }) => (
                  <TextField {...field} required id="fuel_type" select label="Fuel type">
                    <MenuItem value={"petrol"}>petrol</MenuItem>
                    <MenuItem value={"diesel"}>diesel</MenuItem>
                    <MenuItem value={"electirc"}>electric</MenuItem>
                    <MenuItem value={"hybrid"}>hybrid</MenuItem>
                  </TextField>
                )}
              />
            </div>

            <div>
              <Controller
                name="carType"
                control={control}
                defaultValue={updatingItem?.car_type || ""}
                render={({ field }) => (
                  <TextField {...field} required id="car_type" select label="Car Type">
                    <MenuItem value="sedan">Sedan</MenuItem>
                    <MenuItem value="suv">SUV</MenuItem>
                    <MenuItem value="hatchback">Hatchback</MenuItem>
                    <MenuItem value="mpv">MPV</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="Seats"
                defaultValue={String(updatingItem?.seats || "")}
                render={({ field }) => (
                  <TextField {...field} required id="seats" select label="Seats">
                    <MenuItem value={"5"}>5</MenuItem>
                    <MenuItem value={"7"}>7</MenuItem>
                    <MenuItem value={"8"}>8</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="transmitionType"
                defaultValue={updatingItem?.transmition || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="transmittion_type"
                    select
                    label="transmittion_type"
                  >
                    <MenuItem value={"automatic"}>automatic</MenuItem>
                    <MenuItem value={"manual"}>manual</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="vehicleDistrict"
                defaultValue={updatingItem?.district || ""}
                render={({ field }) => (
                  <TextField {...field} required id="vehicleDistrict" select label="vehicleDistrict">
                    {districtData.map((cur, idx) => (
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
                defaultValue={updatingItem?.location || ""}
                render={({ field }) => (
                  <TextField {...field} required id="vehicleLocation" select label="vehicleLocation">
                    {filteredLocations.map((cur, idx) => (
                      <MenuItem value={cur} key={idx}>
                        {cur}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                id="description"
                label="description"
                defaultValue={updatingItem?.car_description || ""}
                multiline
                rows={4}
                sx={{
                  width: "100%",
                  "@media (min-width: 1280px)": {
                    minWidth: 565,
                  },
                }}
                {...register("description")}
              />
            </div>

            <div>
              <Controller
                name="insurance_end_date"
                control={control}
                defaultValue={insuranceDefaultDate}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Insurance end Date"
                      value={field.value || null}
                      onChange={(date) => field.onChange(date)}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                control={control}
                name="Registeration_end_date"
                defaultValue={registerationDefaultDate}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="registeration end Date"
                      value={field.value || null}
                      onChange={(date) => field.onChange(date)}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                control={control}
                name="polution_end_date"
                defaultValue={pollutionDefaultDate}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="polution end Date"
                      value={field.value || null}
                      onChange={(date) => field.onChange(date)}
                    />
                  </LocalizationProvider>
                )}
              />

              <div className="ml-7 mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Images and document uploads stay unchanged during edit. Update the vehicle details here and resubmit for admin approval.
              </div>
            </div>

            <div className="mb-10 ml-7 mt-10 flex items-center justify-start">
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </div>
          </Box>
        </div>
      </form>
    </div>
  );
}
