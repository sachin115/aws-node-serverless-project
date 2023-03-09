import { useEffect, useState } from "react";
import MaterialUiTable from "../../Components/MaterialUiTable";
import callApi from "../../Customutils/callApi";
import { useUserState,useUserDispatch } from "../../Customutils/UserContext";
import { CircularProgress,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Grid,
  Typography 
} from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyle from "../styles";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import Breadcrumb from "../../Components/Breadcrumbs";
toast.configure();
const notify = () => toast("Session Expired...!");

const ManageSubmitedAudits = () => {
  const { userDetails } = useUserState();
  const { roleDetails } = userDetails;
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch, setUserDetails } = useUserDispatch();
  const classes = useStyle();
  // const [selectedAuditId, setSelectedAuditId] = useState("");

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
    // {
    //   name: "Actions",
    //   label: "Actions",
    //   options: {
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <>
    //           {/* {permissions.find((ele) => ele === "") && ( */}
    //           <Tooltip>
    //             <Button
    //               size="small"
    //               color="primary"
    //               variant="contained"
    //               onClick={() => {
    //                 handleOpenPopup(tableMeta.rowData[2]);
    //               }}
    //             >
    //               START
    //             </Button>
    //           </Tooltip>
    //           {/* )} */}
    //         </>
    //       );
    //     },
    //   },
    // },
  ];

  const getAllInprogressAuditsById = async (id,entityId) => {
    try {
      const response = await callApi("CREATE", "GET_ALL_ASIGNED_AUDITS", {
        userId: id,
        status: "Submitted",
        role: roleDetails.name,
        entityId:entityId
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
      }
      setIsLoading(false);
    } catch (err) {
      console.log("Error", err);
    }
  };
  useEffect(() => {
    getAllInprogressAuditsById(userDetails.activeUserDetails.id, userDetails.entityDetails.id);
  }, []);
  return (
    <>
       <Breadcrumb
              breadcrumbElements={[
                { label: "Audits", path: "/app/dashboard", color: "primary" },
                { label: "Submitted Audits" },
              ]}
        />
      {isLoading ? (
        <CircularProgress />
      ) : (
          audits.length === 0 ?
          (
            <Typography
              style={{
                
              }} 
              variant="h4"
            >
              No Audits Available
            </Typography>
          ) :
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
        {audits.map((audit) => (
          <Grid item md={4} xs={12}>
            <Card
              elevation={9}
              onClick={() => {
                // if(audit.status === "ActionRequired" && roleDetails.name === "auditee"){
                //   handleClick(audit.auditId, audit.auditeeId);
                // } else if(audit.status === "SubmittedByAuditee" && roleDetails.name === 'auditor'){
                //   handleClick(audit.auditId, audit.auditeeId);
                // }
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
                          Audit Start Date
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          :{" "}
                          {new Date(audit.startDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableCell}>
                          Audit End Date
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          : {new Date(audit.endDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableCell}>
                          Status
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          : {audit.status}
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

export default ManageSubmitedAudits;
