import React, { useEffect } from "react";
import { Box, useTheme, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockDataContacts } from "../data/mockData";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
} from "../redux/userSlice";
import { getUsers } from "../redux/apiCalls";
import Loader from "../components/Loader";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(getUsersRequest());
        const fetchedUsers = await getUsers();

        // Assign unique ids to each user object
        const usersWithIds = fetchedUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));

        dispatch(getUsersSuccess(usersWithIds));
      } catch (error) {
        dispatch(getUsersFailure(error));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone Number",
    },
    {
      field: "city",
      headerName: "city",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "postalCode",
      headerName: "Postal Code",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
  ];

  if (!users) {
    // You can display a loading indicator or a message while users are being fetched
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
