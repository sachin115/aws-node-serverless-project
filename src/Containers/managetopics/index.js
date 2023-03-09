import useStyle from "../styles";
import { Box, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import { useHistory } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

export default function ManageTopics() {
  const classes = useStyle();
  let { userDetails } = useUserState();
  const { dispatch, setUserDetails } = useUserDispatch();
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { entityDetails } = userDetails;
  const history = useHistory();

  const [permissions, setPermissions] = useState([]);

  const columns = [
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

  const GetAllEntityTopics = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_TOPICS",
        entityDetails.id
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Topics ", response.data);
        setTopics([...response.data]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    if (userDetails.activeUserDetails) {
      setPermissions([...userDetails.permissions]);
    }
  }, [userDetails]);

  useEffect(() => {
    GetAllEntityTopics();
  }, []);

  const onRowClick = (rowData) => {
    history.push({
      pathname: `/app/managetopics/edittopic/${rowData[2]}`,
    });
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        {permissions.find((ele) => ele === "ADD_AGENCY_TOPIC") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/app/managetopics/add");
            }}
            className={classes.createButton}
          >
            + CREATE TOPIC
          </Button>
        )}
      </Box>

      <>
        {!isLoading ? (
          <>
            <MaterialUiTable
              title="Topics"
              data={topics}
              columns={columns}
              onRowClick={onRowClick}
            />
          </>
        ) : (
          <CircularProgress />
        )}
      </>
    </>
  );
}
