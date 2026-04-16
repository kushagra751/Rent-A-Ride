import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Header } from "../components";
import { getApiUrl } from "../../../utils/api";

const columns = [
  { field: "username", headerName: "Vendor", width: 180 },
  { field: "email", headerName: "Email", width: 260 },
  { field: "phoneNumber", headerName: "Phone", width: 160 },
  { field: "adress", headerName: "Address", width: 220 },
];

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(getApiUrl("/api/admin/showVendors"));
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setVendors(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVendors();
  }, []);

  const rows = vendors.map((vendor) => ({
    id: vendor._id,
    username: vendor.username,
    email: vendor.email,
    phoneNumber: vendor.phoneNumber || "-",
    adress: vendor.adress || "-",
  }));

  return (
    <div className="max-w-[1000px] d-flex justify-end text-start items-end p-10">
      <Header title="All Vendors" />
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
          pageSizeOptions={[5, 8, 10]}
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

export default AllVendors;
