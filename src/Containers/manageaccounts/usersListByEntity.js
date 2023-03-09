import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import useStyle from "../styles";
import { useUserState, useUserDispatch } from "../../Customutils/UserContext";
import { useHistory } from "react-router-dom";
import callApi from "../../Customutils/callApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const notify = () => toast("Session Expired...!");

const UserListByEntity = () => {
  const classes = useStyle();
  const history = useHistory();
  const { userDetails } = useUserState();
  const { dispatch, setUserDetails } = useUserDispatch();
  const { permissions } = userDetails;
  const [usersList, setUsersList] = useState([]);
  const params = useParams();
  let { id } = params;
  // const [entityInfo, setEntityInfo] = useState({});
  // const [breadcrumb, setBreadcrumb] = useState([]);

  // const getAgencyDetails = async () => {
  //   try {
  //     const response = await callApi("GET", "GET_ENTITY_DETAILS_BY_ID", id);
  //     if (response.status === 403) {
  //       setUserDetails({});
  //       notify();
  //       dispatch({ type: "TOKEN_EXPIRED" });
  //     }
  //     console.log("Response");
  //     if (response.status === 200) {
  //       const { entityDetails } = response.data;
  //       setEntityInfo(entityDetails);
  //     }
  //   } catch (err) {
  //     console.log("Error", err);
  //   }
  // };

  // useEffect(() => {
  //   if (entityInfo) {
  //     setBreadcrumb([
  //       { label: "Agency", path: "/app/manageaccounts" },
  //       {
  //         label: `${entityInfo.name}`,
  //       },
  //       {
  //         label: "Users",
  //       },
  //     ]);
  //   }
  // }, [entityInfo]);
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

  const getUsersList = async () => {
    const response = await callApi("GET", "GET_USERS_LISTBYENTITYID", id);
    if (response.status === 403) {
      cookie.remove("DSSIdToken");
      cookie.remove("DSSAccessToken");
      cookie.remove("DSSRefreshToken");
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
    }
    if (response.status === 200) {
      setUsersList([...response.data]);
    }
  };
  const redirectToCreateUser = () => {
    history.push(`/app/add-agency-user/${id}`);
  };

  useEffect(() => {
    getUsersList();
    // getAgencyDetails();
  }, []);
  return (
    <>
      {usersList.length === 0 ? (
        <CircularProgress />
      ) : (
        <>
          {/* <Breadcrumb breadcrumbElements={breadcrumb} /> */}
          <Box className={classes.headerContainer}>
            <Typography variant="h6">Users List</Typography>
            {permissions.find((ele) => ele === "ADD_PROVISION_AGENCY_USER") && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                style={{ textTransform: "capitalize" }}
                onClick={redirectToCreateUser}
                className={classes.createButton}
              >
                create new
              </Button>
            )}
          </Box>
          <Divider style={{ width: "100%", height: "2px" }} />
          <MUIDataTable
            data={usersList}
            columns={columns}
            options={{
              elevation: 0,
              download: false,
              print: false,
              selectableRows: false,
              filter: false,
              viewColumns: false,
              rowsPerPage: 5,
              rowsPerPageOptions: [5, 10, 15],
              jumpToPage: true,
              onRowClick: (rowData) => {
                history.push({
                  pathname: `/app/agency-user-detail/${id}/${rowData[6]}`,
                  search: "agency",
                });
              },
              textLabels: {
                pagination: {
                  next: "Next >",
                  previous: "< Previous",
                  rowsPerPage: "Total items Per Page",
                  displayRows: "OF",
                },
              },
            }}
          />
        </>
      )}
    </>
  );
};

export default UserListByEntity;
