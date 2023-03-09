import useStyle from "../styles";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";

import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

export default function ManageSurveys() {
  const classes = useStyle();
  //   const [isLoading, setIsLoading] = useState(true);
  //   const dispatch = useUserDispatch();
  const [permissions, setPermissions] = useState([]);
  let { userDetails } = useUserState();
  //   const { entityDetails } = userDetails;
  const history = useHistory();
  useEffect(() => {
    if (userDetails.activeUserDetails) {
      setPermissions([...userDetails.permissions]);
    }
  }, [userDetails]);

  const columns = [
    {
      name: "surveyName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "surveyStatus",
      label: "Status",
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

  return (
    <>
      <Box className={classes.headerContainer}>
        {permissions.find((ele) => ele === "ADD_SURVEY") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/app/managesurvey/add");
            }}
            className={classes.createButton}
          >
            + CREATE SURVEY
          </Button>
        )}
      </Box>
      {/* {isLoading ? ( */}
      {/* <CircularProgress /> */}
      {/* ) : ( */}
      <>
        <MaterialUiTable title="Surveys" columns={columns} />
      </>
      {/* )} */}
    </>
  );
}
