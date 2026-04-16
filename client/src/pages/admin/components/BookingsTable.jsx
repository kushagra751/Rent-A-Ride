import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { getApiUrl } from "../../../utils/api";

const statusOptions = [
  "notBooked",
  "booked",
  "onTrip",
  "notPicked",
  "canceled",
  "overDue",
  "tripCompleted",
];

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(getApiUrl("/api/admin/allBookings"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (event, params) => {
    const newStatus = event.target.value;
    const bookingId = params.id;

    try {
      const isStatusChanged = await fetch(getApiUrl("/api/admin/changeStatus"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus,
        }),
      });

      if (!isStatusChanged.ok) {
        return;
      }

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
          alt="vehicle"
        />
      ),
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 170,
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      width: 190,
    },
    {
      field: "Pickup_Location",
      headerName: "Pickup Location",
      width: 180,
    },
    { field: "Pickup_Date", headerName: "Pickup Date", width: 130 },
    { field: "Dropoff_Location", headerName: "Drop-off Location", width: 180 },
    {
      field: "Dropoff_Date",
      headerName: "Drop-off Date",
      width: 130,
    },
    {
      field: "Vehicle_Status",
      headerName: "Booking Status",
      width: 150,
      renderCell: (params) => (
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md mx-auto text-xs font-semibold capitalize">
          {params.value}
        </div>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
    },
    {
      field: "Change_Status",
      headerName: "Change Status",
      width: 170,
      renderCell: (params) => (
        <select
          className="px-3 py-2 rounded-md border border-slate-200 bg-white text-sm"
          value={params.row.Vehicle_Status}
          onChange={(event) => {
            handleStatusChange(event, params);
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const rows = bookings.map((cur) => ({
    id: cur._id,
    image: cur?.vehicleDetails?.image?.[0] || "/car-placeholder.svg",
    customer: cur?.userDetails?.username || cur?.userDetails?.email || "Guest user",
    vehicle:
      cur?.vehicleDetails?.name ||
      cur?.vehicleDetails?.car_title ||
      cur?.vehicleDetails?.company ||
      "Vehicle unavailable",
    Pickup_Location: cur.pickUpLocation || "-",
    Pickup_Date: formatDate(cur.pickupDate),
    Dropoff_Location: cur.dropOffLocation || "-",
    Dropoff_Date: formatDate(cur.dropOffDate),
    Vehicle_Status: cur.status || "notBooked",
    amount: `Rs. ${Number(cur.totalPrice || 0).toLocaleString("en-IN")}`,
    Change_Status: statusOptions,
  }));

  return (
    <div className="max-w-[1100px] d-flex justify-end text-start items-end p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
      <Box sx={{ height: "100%", width: "100%" }}>
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
          pageSizeOptions={[5, 8, 12]}
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
    </div>
  );
};

export default BookingsTable;
