import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Header } from "../components";
import { getApiUrl } from "../../../utils/api";

const columns = [
  { field: "username", headerName: "Username", width: 180 },
  { field: "email", headerName: "Email", width: 260 },
  { field: "phoneNumber", headerName: "Phone", width: 160 },
  { field: "adress", headerName: "Address", width: 220 },
];

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(getApiUrl("/api/admin/showUsers"));
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const rows = users.map((user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber || "-",
    adress: user.adress || "-",
  }));

  return (
    <div className="max-w-[1000px] d-flex justify-end text-start items-end p-10">
      <Header title="All Users" />
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

export default AllUsers;
