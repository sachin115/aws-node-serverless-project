import useStyle from "../styles";
import { Box, Button, IconButton } from "@material-ui/core";
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

export default function ManageQuestions() {
  const classes = useStyle();
  let { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const { dispatch, setUserDetails } = useUserDispatch();
  const history = useHistory();

  const [permissions, setPermissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const GetAllEntityQuestions = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_QUESTIONS",
        entityDetails.id
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Questions ", response.data);
        setQuestions([...response.data]);
        setIsLoading(false);
      } else {
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
    GetAllEntityQuestions();
  }, []);

  const columns = [
    {
      name: "question",
      label: "Question",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "weightage",
      label: "Weightage",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "questionType",
      label: "Type",
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
      pathname: `/app/managequestions/editquestion/${rowData[3]}`,
    });
  };

  return (
    <>
      {}
      <Box className={classes.headerContainer}>
        {permissions.find((ele) => ele === "ADD_AGENCY_QUESTION") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/app/managequestions/add");
            }}
            className={classes.createButton}
          >
            + CREATE QUESTION
          </Button>
        )}
      </Box>

      {!isLoading ? (
        <>
          <MaterialUiTable
            title="Questions"
            data={questions}
            columns={columns}
            onRowClick={onRowClick}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
