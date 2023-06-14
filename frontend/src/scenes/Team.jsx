import React, { useEffect } from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
} from "../redux/userSlice";
import { getUsers } from "../redux/apiCalls";
import Loader from "../components/Loader";

const Team = () => {
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
      flex: 1,
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
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row }) => {
        const { accessLevel } = row;

        let icon;
        let access;

        switch (accessLevel) {
          case 10:
            icon = <AdminPanelSettingsOutlinedIcon />;
            access = "Admin";
            break;
          case 20:
            icon = <SecurityOutlinedIcon />;
            access = "Manager";
            break;
          case 30:
            icon = <LockOpenOutlinedIcon />;
            access = "User";
            break;
          default:
            icon = null;
            access = "";
            break;
        }

        return (
          <Box
            width="60%"
            m="0 auto"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessLevel === 30
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {icon}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
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
      <Header title="TEAM" subtitle="Managing the Team Members" />
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
        }}
      >
        <DataGrid rows={users} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
