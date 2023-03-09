import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import {
  Button,
  Card,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useStyle from "../styles";
import Breadcrumb from "../../Components/Breadcrumbs";
import moment from "moment/moment";
import { toast } from "react-toastify";
import cookie from "react-cookies";
toast.configure();
const notify = () => toast("Session Expired...!");

const ManageAssignedAudits = () => {
  const { userDetails } = useUserState();
  console.log("userDetails", userDetails);
  const { roleDetails } = userDetails;
  const { dispatch, setUserDetails } = useUserDispatch();

  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState({});
  const [givePopup, setGivePopup] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const history = useHistory();
  const classes = useStyle();

  const handleClosePopup = () => {
    setGivePopup(false);
  };

  const handleOpenPopup = (audit) => {
    setSelectedAudit(audit);
    setGivePopup(true);
  };

  const StartAudit = async () => {
    try {
      setIsApiLoading(true);
      const {
        auditId,
        auditeeId,
        auditorId,
        modifiedDate,
        createdBy,
        entityId,
        modifiedBy,
      } = selectedAudit;
      const params = {
        auditId,
        auditeeId,
        auditorId,
        modifiedDate,
        createdBy,
        entityId,
        modifiedBy,
      };
      const response = await callApi("CREATE", "START_AUDIT", params);
      if (response.status === 200 && response.message !== "DATE NOT MATCH!") {
        history.push(`/app/audit-details/${auditId}/${auditeeId}`);
      }
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error", err);
      setIsApiLoading(false);
    }
  };

  const getAllAsignedAuditsById = async (activeUserid, entityId) => {
    try {
      const response = await callApi("CREATE", "GET_ALL_ASIGNED_AUDITS", {
        userId: activeUserid,
        status: "Active",
        role: roleDetails.name,
        entityId: entityId,
      });
      if (response.status === 200) {
        console.log("Audits ", response.data);
        const allAudits = response.data.auditResponse;
        setAudits(allAudits);
        setIsLoading(false);
      }
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
    } catch (err) {
      console.log("Error", err);
    }
  };
  useEffect(() => {
    getAllAsignedAuditsById(
      userDetails.activeUserDetails.id,
      userDetails.entityDetails.id
    );
  }, []);
  return (
    <>
      <Breadcrumb
        breadcrumbElements={[
          { label: "Audits", path: "/app/dashboard" },
          { label: "Asigned Audits" },
        ]}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {audits.length === 0 ? (
            <Typography style={{}} variant="h4">
              No Audits Available
            </Typography>
          ) : (
            <>
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                {audits.map((audit) => (
                  <Grid item md={4} xs={12}>
                    <Card
                      elevation={9}
                      // onClick={() => {
                      //   if(roleDetails.name === 'auditor' && new Date() >= new Date(audit.auditStartOnDate) && new Date() <= new Date(audit.auditCompleteOnDate)){
                      //     handleOpenPopup(audit);
                      //   } else if(roleDetails.name === 'auditor'){
                      //     toast.error(`You cannot start audit`,{theme:"colored"})
                      //   }
                      // }}
                    >
                      <Grid container>
                        <Grid item md={3} xs={12}>
                          <AssignmentIndOutlinedIcon
                            color="primary"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </Grid>

                        <Grid item md={9}>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className={classes.tableCell}>
                                  Audit Name
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  : {audit.auditName}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className={classes.tableCell}>
                                  Auditee Name
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  : {audit.auditeeName}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className={classes.tableCell}>
                                  Start After Date
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  :{" "}
                                  {new Date(
                                    audit.auditStartOnDate
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className={classes.tableCell}>
                                  Complete Before Date
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  :{" "}
                                  {new Date(
                                    audit.auditCompleteOnDate
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                              {roleDetails.name === "auditor" &&
                              new Date() >= new Date(audit.auditStartOnDate) &&
                              new Date() <=
                                new Date(audit.auditCompleteOnDate) ? (
                                <TableRow>
                                  <TableCell
                                    className={classes.tableCell}
                                    align={"center"}
                                  >
                                    <Button
                                      onClick={() => handleOpenPopup(audit)}
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                    >
                                      Start Audit
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ) : null}
                            </TableBody>
                          </Table>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Dialog
                open={givePopup}
                onClose={handleClosePopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Audit Start "}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Really you want to start the audit?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClosePopup}
                    disabled={isApiLoading}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  {isApiLoading && (
                    <CircularProgress
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "6%",
                      }}
                    />
                  )}
                  <Button
                    disabled={isApiLoading}
                    onClick={StartAudit}
                    color="primary"
                  >
                    START
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ManageAssignedAudits;
