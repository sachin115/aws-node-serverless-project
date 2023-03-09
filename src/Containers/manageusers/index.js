import { Box, Button, Divider, Typography } from "@material-ui/core";

import useStyle from "../styles";
import { useUserState, useUserDispatch } from "../../Customutils/UserContext";
import { useHistory } from "react-router-dom";
import callApi from "../../Customutils/callApi";
import { useEffect, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const ManageUsers = () => {
  const classes = useStyle();
  const history = useHistory();
  const { dispatch, setUserDetails } = useUserDispatch();
  const { userDetails } = useUserState();
  const { permissions, entityDetails } = userDetails;
  const [usersList, setUsersList] = useState([]);
  const redirectToCreateUser = () => {
    history.push("/app/add-user");
  };

  const columns = [
    {
      name: "firstName",
      label: "First Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "mobile",
      label: "mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "pincode",
      label: "Pincode",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
  ];

  const onRowClick = (rowData) => {
    history.push({
      pathname: `/app/user-details/${rowData[6]}`,
    });
  };

  const getUsersList = async () => {
    const response = await callApi(
      "GET",
      "GET_USERS_LISTBYENTITYID",
      entityDetails.id
    );
    if (response.status === 403) {
      setUserDetails({});
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
    }
    if (response.status === 200) {
      setUsersList([...response.data]);
    }
  };

  useEffect(() => {
    getUsersList();
  }, []);
  return (
    <>
      <Box className={classes.headerContainer}>
        <Typography variant="h6">Users</Typography>
        {permissions.find(
          (ele) => ele === "ADD_AGENCY_USERS" || ele === "ADD_PROVISION_USER"
        ) && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            style={{ textTransform: "capitalize" }}
            onClick={redirectToCreateUser}
            className={classes.createButton}
          >
            Create New
          </Button>
        )}
      </Box>
      <Divider style={{ width: "100%", height: "2px" }} />
      {usersList.length === 0 ? (
        <CircularProgress />
      ) : (
        <MaterialUiTable
          data={usersList}
          // title="Users"
          columns={columns}
          onRowClick={onRowClick}
        />
      )}
    </>
  );
};

export default ManageUsers;
