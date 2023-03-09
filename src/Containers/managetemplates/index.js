import {
  Typography,
  Grid,
  Button,
  Box,
  Card,
  CircularProgress,
  IconButton,
  Divider,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyle from "../styles";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

toast.configure();
const notify = () => toast("Session Expired...!");
const ManageTemplates = () => {
  const classes = useStyle();
  const [handlePop, setHandlePop] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch, setUserDetails } = useUserDispatch();
  const { userDetails } = useUserState();
  const { entityDetails, permissions } = userDetails;
  const history = useHistory();

  const handlePopUp = (templateID) => {
    setSelectedTemplateId(templateID);
    setHandlePop(true);
  };

  const handleClosePopup = () => {
    getEntityTemplates();
    setSelectedTemplateId("");
    setHandlePop(false);
  };

  const getEntityTemplates = async () => {
    setIsLoading(true);
    const response = await callApi(
      "GET",
      "GET_ALL_ENTITY_TEMPLATES",
      entityDetails.id
    );
    if (response.status === 403) {
      setUserDetails({});
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
    }
    if (response.status === 200) {
      const { Items } = response.data.data;
      setTemplateList([...Items]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getEntityTemplates();
  }, []);

  return (
    <>
      <Box className={classes.headerContainer}>
        <Typography variant="h6">Templates</Typography>
        {/* {permissions.find((ele) => ele === "ADD_TEMPLATE") ? (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ textTransform: "capitalize" }}
            className={classes.createButton}
            onClick={() => setHandlePop(true)}
          >
            create new
          </Button>
        ) : null} */}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          style={{ textTransform: "capitalize" }}
          className={classes.createButton}
          onClick={() => {
            history.push("/app/add-template");
          }}
        >
          create new
        </Button>
      </Box>
      <Divider style={{ width: "100%", height: "2px" }} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {templateList.length === 0 && (
            <Typography
              variant="h4"
              style={{ position: "fixed", top: "44.5%", left: "44.5%" }}
            >
              No Templates Available
            </Typography>
          )}
          <Grid container spacing={1} style={{ marginTop: "1%" }}>
            {templateList.length > 0 &&
              templateList.map((template, index) => (
                <Grid item xs={12} md={12} key={`grid${index}`}>
                  <Card
                    elevation={1}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      cursor: "text",
                    }}
                    key={`card${index}`}
                  >
                    <Typography style={{ fontSize: "13px" }}>
                      {template.name}
                    </Typography>
                    {permissions.find((ele) => ele === "EDIT_TEMPLATE") ? (
                      <FontAwesomeIcon
                        onClick={() =>
                          history.push(`/app/edit-template/${template.id}`)
                        }
                        icon={faPenToSquare}
                        fontSize="small"
                        style={{
                          marginTop: "3px",
                          color: "gray",
                          cursor: "pointer",
                        }}
                      />
                    ) : null}
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default ManageTemplates;
