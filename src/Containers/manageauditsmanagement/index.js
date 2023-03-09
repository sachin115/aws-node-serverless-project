import {
  Badge,
  Card,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useUserState, useUserDispatch } from "../../Customutils/UserContext";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import callApi from "../../Customutils/callApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
toast.configure();
const notify = () => toast("Session Expired...!");

export const AuditorAndAuditeeDashboardScreen = () => {
  const { userDetails } = useUserState();
  console.log("userDetails===", userDetails);
  const history = useHistory();
  const { roleDetails, activeUserDetails } = userDetails;
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch, setUserDetails } = useUserDispatch();
  const [allAuditCounts, setAllAuditCount] = useState({});

  const GetCountOfAudits = async () => {
    try {
      setIsLoading(true);
      const response = await callApi("CREATE", "GET_AUDIT_COUNTS", {
        auditorId: roleDetails.name === "auditor" ? activeUserDetails.id : "",
        auditeeId: roleDetails.name === "auditee" ? activeUserDetails.id : "",
      });
      if (response.status === 403) {
        setIsLoading(false);
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setIsLoading(false);
        console.log("Data ", response.data);
        setAllAuditCount({ ...response.data.auditCounts });
      }
    } catch (err) {
      setIsLoading(false);
      console.log("Error", err);
    }
  };

  useEffect(() => {
    GetCountOfAudits();
  }, []);
  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid container spacing={2}>
      <Grid item md={3} xs={6}>
        <Card
          elevation={10}
          onClick={() => {
            history.push(`/app/assigned-audits`);
          }}
        >
          <Grid container>
            <Grid item md={2} xs={2}>
              <Badge
                badgeContent={
                  allAuditCounts.numberAssignedAudits
                    ? allAuditCounts.numberAssignedAudits
                    : "0"
                }
                color="primary"
              >
                <AssignmentIndOutlinedIcon color="primary" auto />
              </Badge>
            </Grid>
            <Grid item md={10} xs={10}>
              <Typography>Assigned Audits </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item md={3} xs={6}>
        <Card
          elevation={10}
          onClick={() => {
            history.push("/app/inprogress-audits");
          }}
        >
          <Grid container>
            <Grid item md={2} xs={2}>
              <Badge
                badgeContent={
                  allAuditCounts.numberOfInprogressAudits
                    ? allAuditCounts.numberOfInprogressAudits
                    : "0"
                }
                color="primary"
              >
                <AssignmentIndOutlinedIcon color="primary" auto />
              </Badge>
            </Grid>
            <Grid item md={10} xs={10}>
              <Typography>Inprogress Audits</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item md={3} xs={6}>
        <Card
          elevation={10}
          onClick={() => {
            history.push("/app/submited-audits");
          }}
        >
          <Grid container>
            <Grid item md={2} xs={2}>
              <Badge
                badgeContent={
                  allAuditCounts.numberOfSubmittedAudits
                    ? allAuditCounts.numberOfSubmittedAudits
                    : "0"
                }
                color="primary"
              >
                <AssignmentIndOutlinedIcon color="primary" auto />
              </Badge>
            </Grid>
            <Grid item md={10} xs={10}>
              <Typography>Submitted Audits </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item md={3} xs={6}>
        <Card
          elevation={10}
          onClick={() => {
            history.push("/app/under-review-audits");
          }}
        >
          <Grid container>
            <Grid item md={2} xs={2}>
              <Badge
                badgeContent={
                  allAuditCounts.numberOfUnderReviewAudits
                    ? allAuditCounts.numberOfUnderReviewAudits
                    : "0"
                }
                color="primary"
              >
                <AssignmentIndOutlinedIcon color="primary" auto />
              </Badge>
            </Grid>
            <Grid item md={10} xs={10}>
              <Typography>Under Review Audits</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
