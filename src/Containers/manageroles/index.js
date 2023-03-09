import useStyle from "../styles";
import { Box, Button, Divider, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import { useHistory } from "react-router-dom";
import { useUserState, useUserDispatch } from "../../Customutils/UserContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const notify = () => toast("Session Expired...!");

export default function ManageRoles(props) {
  const classes = useStyle();
  let { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const history = useHistory();
  const [roleList, setRoleList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const { dispatch, setUserDetails } = useUserDispatch();

  const getAllRoles = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_ROLES",
        entityDetails.id
      );
      console.log("data", response.data);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setRoleList([...response.data.entityRoles]);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);
  useEffect(() => {
    if (userDetails.activeUserDetails) {
      setPermissions([...userDetails.permissions]);
    }
  }, [userDetails]);

  //Datatable columns

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const redirectToCreateRole = () => {
    history.push("/app/add-role");
  };

  const onRowClick = (rowData) => {
    history.push({
      pathname: `/app/edit-role/${rowData[0]}`,
    });
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        <Typography variant="h6">Roles</Typography>
        {permissions.find(
          (ele) =>
            ele === "ADD_AGENCY_ROLE" || ele === "ADD_PROVISION_AGENCY_ROLE"
        ) && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ textTransform: "capitalize" }}
            onClick={redirectToCreateRole}
            className={classes.createButton}
          >
            create new
          </Button>
        )}
      </Box>
      <Divider style={{ width: "100%", height: "2px" }} />
      {roleList.length === 0 ? (
        <CircularProgress />
      ) : (
        <>
          <MaterialUiTable
            // title="Roles"
            data={roleList}
            columns={columns}
            onRowClick={onRowClick}
          />
        </>
      )}
    </>
  );
}
