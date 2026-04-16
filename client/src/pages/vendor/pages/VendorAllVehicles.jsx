import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import {
  setVendorDeleteSuccess,
  setVendorEditSuccess,
  setVendorError,
  setVenodrVehilces,
} from "../../../redux/vendor/vendorDashboardSlice";
import { GrStatusGood } from "react-icons/gr";
import { MdOutlinePending } from "react-icons/md";
import VendorHeader from "../Components/VendorHeader";
import { getApiUrl } from "../../../utils/api";
import { getVehicleImage } from "../../../utils/vehicleImage";

const VendorAllVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const {
    vendorVehilces,
    vendorEditSuccess,
    vendorDeleteSuccess,
    vendorError,
  } = useSelector((state) => state.vendorDashboardSlice);
  const currentUserId = useSelector((state) => state.user.currentUser?._id);
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(getApiUrl("/api/vendor/showVendorVehilces"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken},${accessToken}`,
          },
          body: JSON.stringify({
            _id: currentUserId,
          }),
        });

        if (!res.ok) {
          dispatch(setVendorError(true));
          return;
        }

        const data = await res.json();
        dispatch(setVenodrVehilces(Array.isArray(data) ? data : []));
      } catch (error) {
        console.log(error);
        dispatch(setVendorError(true));
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [
    accessToken,
    currentUserId,
    dispatch,
    isAddVehicleClicked,
    refreshToken,
    vendorDeleteSuccess,
    vendorEditSuccess,
  ]);

  const handleEditVehicle = (vehicleId) => {
    navigate(`/vendorDashboard/vendorEditProductComponent?vehicle_id=${vehicleId}`);
  };

  const handleDeleteVehicles = (vehicleId) => {
    navigate(`/vendorDashboard/vendorDeleteVehicleModal?vehicle_id=${vehicleId}`);
  };

  const normalizeStatus = (vehicle) => {
    if (vehicle.isRejected) return "rejected";
    if (vehicle.isAdminApproved) return "approved";
    return "pending";
  };

  const filteredVehicles = useMemo(() => {
    const availableVehicles = (vendorVehilces || []).filter(
      (vehicle) => vehicle.isDeleted === "false" || vehicle.isDeleted === false
    );

    if (statusFilter === "all") return availableVehicles;

    return availableVehicles.filter(
      (vehicle) => normalizeStatus(vehicle) === statusFilter
    );
  }, [statusFilter, vendorVehilces]);

  const stats = useMemo(() => {
    const total = vendorVehilces.length;
    const approved = vendorVehilces.filter((vehicle) => vehicle.isAdminApproved).length;
    const pending = vendorVehilces.filter(
      (vehicle) => !vehicle.isAdminApproved && !vehicle.isRejected
    ).length;
    const rejected = vendorVehilces.filter((vehicle) => vehicle.isRejected).length;

    return { total, approved, pending, rejected };
  }, [vendorVehilces]);

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 110,
      renderCell: (params) => (
        <img
          src={params.value}
          style={{
            width: "60px",
            height: "44px",
            borderRadius: "8px",
            objectFit: "contain",
            background: "#f8fafc",
          }}
          alt="vehicle"
        />
      ),
    },
    {
      field: "registeration_number",
      headerName: "Register Number",
      width: 160,
    },
    { field: "company", headerName: "Company", width: 140 },
    { field: "name", headerName: "Name", width: 140 },
    { field: "district", headerName: "District", width: 130 },
    { field: "location", headerName: "Location", width: 220 },
    { field: "price", headerName: "Price / Day", width: 120 },
    {
      field: "status",
      headerName: "Approval",
      width: 160,
      renderCell: (params) =>
        params.row.status === "rejected" ? (
          <div className="flex items-center justify-center gap-x-1 rounded-lg bg-red-100 p-2 text-red-500">
            <span className="text-[10px]">Rejected</span>
            <MdOutlinePending />
          </div>
        ) : params.row.status === "pending" ? (
          <div className="flex items-center justify-center gap-x-1 rounded-lg bg-yellow-100 p-2 text-yellow-600">
            <span className="text-[10px]">Pending</span>
            <MdOutlinePending />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-x-1 rounded-lg bg-green-100 p-2 text-green-600">
            <span className="text-[10px]">Approved</span>
            <GrStatusGood />
          </div>
        ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 90,
      renderCell: (params) => (
        <Button onClick={() => handleEditVehicle(params.row.id)}>
          <ModeEditOutlineIcon />
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      renderCell: (params) => (
        <Button onClick={() => handleDeleteVehicles(params.row.id)}>
          <DeleteForeverIcon />
        </Button>
      ),
    },
  ];

  const rows = filteredVehicles.map((vehicle) => ({
    id: vehicle._id,
    image: getVehicleImage(vehicle),
    registeration_number: vehicle.registeration_number,
    company: vehicle.company,
    name: vehicle.name,
    district: vehicle.district,
    location: vehicle.location,
    price: vehicle.price,
    status: normalizeStatus(vehicle),
  }));

  useEffect(() => {
    if (vendorEditSuccess) {
      toast.success("Vehicle updated and re-submitted for review.");
      dispatch(setVendorEditSuccess(false));
    }

    if (vendorDeleteSuccess) {
      toast.success("Vehicle deleted successfully.");
      dispatch(setVendorDeleteSuccess(false));
    }

    if (vendorError) {
      toast.error("Could not load vendor vehicles.");
      dispatch(setVendorError(false));
    }
  }, [dispatch, vendorDeleteSuccess, vendorEditSuccess, vendorError]);

  return (
    <div className="rounded-2xl bg-slate-100 p-6">
      <Toaster />
      <VendorHeader category="Vendor Workspace" title="My Vehicles" />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.approved}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">{stats.rejected}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {["all", "approved", "pending", "rejected"].map((value) => (
          <button
            key={value}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              statusFilter === value
                ? "bg-slate-950 text-white"
                : "bg-white text-slate-700"
            }`}
            onClick={() => setStatusFilter(value)}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading your fleet...
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-semibold text-slate-900">No vehicles found</p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first vehicle or switch the approval filter to see more listings.
          </p>
        </div>
      ) : (
        <Box sx={{ height: "100%", width: "100%", backgroundColor: "white", borderRadius: 4, padding: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[8, 12]}
            disableRowSelectionOnClick
            sx={{
              ".MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "&.MuiDataGrid-root": {
                border: "none",
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default VendorAllVehicles;
