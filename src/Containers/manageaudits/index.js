import useStyle from "../styles";
import {
  Box,
  Button,
  Card,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Divider,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";

import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopicsQuestionsByAuditId from "./topicsquestionsbyauditid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
toast.configure();
const notify = () => toast("Session Expired...!");

export default function ManageAudits() {
  const classes = useStyle();
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch, setUserDetails } = useUserDispatch();
  let { userDetails } = useUserState();
  const { entityDetails, permissions } = userDetails;
  const history = useHistory();
  const [audits, setAudits] = useState([]);
  console.log("audits====", audits);
  const [givePopup, setGivePopup] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState("");
  console.log("selctedAuditId", selectedAuditId);

  const columns = [
    {
      name: "Actions",
      label: "Actions",

      options: {
        selectableRows: "multiple",
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log("value", tableMeta);
          return (
            <>
              {/* {audits[tableMeta.rowIndex].users.find(
                (el) => el.status !== "Active"
              ) ? ( */}
              {/* <Tooltip title="Edit">
                  <IconButton disabled size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              ) : ( */}
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={function (e) {
                    e.stopPropagation();
                    history.push({
                      pathname: `/app/manageaudits/editaudit/${tableMeta.rowData[6]}`,
                    });
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {/* )} */}
            </>
          );
        },
      },
    },
    {
      name: "auditName",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "auditStartOnDate",
      label: "Audit Start After Date",
      options: {
        customBodyRender: (auditStartAfterDate) => (
          <div>{new Date(auditStartAfterDate).toLocaleString()}</div>
        ),
        filter: true,
        sort: false,
      },
    },
    {
      name: "auditCompleteOnDate",
      label: "Audit Complete Before Date",
      options: {
        customBodyRender: (auditCompleteBeforeDate) => (
          <div>{new Date(auditCompleteBeforeDate).toLocaleString()}</div>
        ),
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
      name: "View Topics And Questions",
      label: "View Topics And Questions",
      options: {
        selectableRows: "multiple",
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPopup(tableMeta.rowData[6]);
                  }}
                  // onClick={function (e) {
                  //   e.stopPropagation();
                  //   history.push({
                  //     pathname: `/app/manageaudits/editaudit/${tableMeta.rowData[6]}`,
                  //   });
                  // }}
                >
                  view topic & qus
                </Button>
              }
              ,
              {/* {
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={function () {
                      history.push({
                        pathname: `/app/auditd/${tableMeta.rowData[3]}/viewauditdetails`,
                      });
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              } */}
            </>
          );
        },
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
      pathname: `/app/auditd/${rowData[6]}/viewauditdetails`,
    });
  };

  const handleClosePopup = () => {
    setGivePopup(false);
  };

  const handleOpenPopup = (audit) => {
    setSelectedAuditId(audit);
    setGivePopup(true);
  };

  const GetAllEntityAudits = async (id) => {
    try {
      const response = await callApi("GET", "GET_ALL_ENTITY_AUDITS", id);
      console.log("response", response);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Audits ", response.data);
        const allAudits = response.data.getAllEntityAuditsResponse.audits;
        if (allAudits.length > 0) {
          setAudits([...allAudits]);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    GetAllEntityAudits(entityDetails.id);
  }, []);

  return (
    <>
      <Box
        className={classes.headerContainer}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6">Audits</Typography>
        {permissions.find((ele) => ele === "ADD_AUDIT") ? (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.createButton}
            style={{ textTransform: "capitalize" }}
            onClick={() => {
              history.push("/app/add-audit");
            }}
          >
            Create New
          </Button>
        ) : null}
      </Box>
      <Divider style={{ width: "100%", height: "2px" }} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {audits.length === 0 && (
            <Typography
              variant="h4"
              style={{ position: "fixed", top: "44.5%", left: "44.5%" }}
            >
              No Audits Available
            </Typography>
          )}
          <Grid container spacing={1} style={{ marginTop: "1%" }}>
            {audits.length > 0 &&
              audits.map((audit, index) => (
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
                      {audit.auditName}
                    </Typography>
                    {audit.edit ? (
                      <FontAwesomeIcon
                        onClick={() => {
                          history.push(`/app/edit-audit/${audit.id}`);
                        }}
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
}
