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

export default function ManageAccounts(props) {
  const classes = useStyle();
  const { dispatch, setUserDetails } = useUserDispatch();
  let { userDetails } = useUserState();
  const history = useHistory();
  const [agencyList, setAgencyList] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (userDetails.activeUserDetails) {
      setPermissions([...userDetails.permissions]);
    }
  }, [userDetails]);

  //Datatable columns

  const columns = [
    {
      name: "name",
      label: "Agency Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "contactEmail",
      label: "Contact Email",
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

  const getAllAgencies = async () => {
    try {
      const response = await callApi("GETLIST", "GET_ALL_ENTITIES");
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }

      if (response.status === 200) {
        const agencies = response.data;
        setAgencyList(agencies);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };
  useEffect(() => {
    getAllAgencies();
  }, []);
  const redirectToCreateAccount = () => {
    history.push("/app/add-agency");
  };

  const onRowClick = (rowData) => {
    history.push({
      pathname: `/app/agency-details/${rowData[4]}`,
    });
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        <Typography variant="h6">Agencies</Typography>
        {permissions.find((ele) => ele === "ADD_PROVISION_AGENCY") && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ textTransform: "capitalize" }}
            onClick={redirectToCreateAccount}
            className={classes.createButton}
          >
            create new
          </Button>
        )}
      </Box>
      <Divider style={{ width: "100%", height: "2px" }} />
      {agencyList.length === 0 ? (
        <CircularProgress />
      ) : (
        <>
          <MaterialUiTable
            data={agencyList}
            columns={columns}
            onRowClick={onRowClick}
          />
        </>
      )}
    </>
  );
}
