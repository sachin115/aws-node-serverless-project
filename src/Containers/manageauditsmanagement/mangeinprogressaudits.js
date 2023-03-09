import { useEffect, useState } from "react";
import DescriptionIcon from "@material-ui/icons/Description";
import callApi from "../../Customutils/callApi";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Grid,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useStyle from "../styles";
import Breadcrumb from "../../Components/Breadcrumbs";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import moment from "moment/moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const ManageInprogressAudits = () => {
  const { userDetails } = useUserState();
  const { roleDetails } = userDetails;
  const [audits, setAudits] = useState([]);
  const { dispatch, setUserDetails } = useUserDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const classes = useStyle();

  // const [selectedAuditId, setSelectedAuditId] = useState("");

  const handleClick = (id, auditeeId) => {
    history.push({
      pathname: `/app/audit-details/${id}/${auditeeId}`,
    });
  };

  const getAllInprogressAuditsById = async (activeUserid, entityId) => {
    try {
      const response = await callApi("CREATE", "GET_ALL_ASIGNED_AUDITS", {
        userId: activeUserid,
        status: "Inprogress",
        role: roleDetails.name,
        entityId: entityId,
      });
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Audits ", response.data);
        const allAudits = response.data.auditResponse;
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
    getAllInprogressAuditsById(
      userDetails.activeUserDetails.id,
      userDetails.entityDetails.id
    );
  }, []);
  return (
    <>
      <Breadcrumb
        breadcrumbElements={[
          { label: "Audits", path: "/app/dashboard", color: "primary" },
          { label: "Inprogress Audits" },
        ]}
      />
      {isLoading ? (
        <CircularProgress />
      ) : audits.length === 0 ? (
        <Typography style={{}} variant="h4">
          No Audits Available
        </Typography>
      ) : (
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          {audits.map((audit) => (
            <Grid item md={4} xs={12}>
              <Card
                elevation={9}
                onClick={() => {
                  if (roleDetails.name === "auditor") {
                    handleClick(audit.auditId, audit.auditeeId);
                  }
                }}
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
                            Start Date
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            : {new Date(audit.startDate).toLocaleDateString()}
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
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ManageInprogressAudits;
