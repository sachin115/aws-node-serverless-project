import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Divider,
  Chip,
} from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import MaterialUIDatePickers from "../../Components/MaterialUIDatePickers";
import dayjs from "dayjs";
import useStyle from "../styles";
import callApi from "../../Customutils/callApi";
import { useParams } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/material";
const notify = () => toast("Session Expired...!");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Audit Details", "Edit Template", "Audit Users"];
}

const EditAudit = (props) => {
  const { id } = useParams();
  const steps = getSteps();
  const classess = useStyles();
  const classes = useStyle();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [auditStartOnDate, setAuditStartOnDate] = useState(dayjs());
  const [auditCompleteOnDate, setAuditCompleteOnDate] = useState(
    dayjs().add(7, "day")
  );
  const [auditName, setAuditName] = useState("");
  const [auditStatus, setAuditStatus] = useState("");
  const [actionRequired, setActionRequired] = useState(false);
  let { userDetails } = useUserState();
  const { entityDetails, activeUserDetails } = userDetails;
  const { dispatch, setUserDetails } = useUserDispatch();
  const [allAuditorsAuditees, setAllAuditorsAuditees] = useState([]);
  const [allAuditors, setAllAuditors] = useState([]);
  const [allAuditee, setAllAuditee] = useState([]);
  const [selectedAuditor, setSelectedAuditor] = useState("");
  const [selectedAuditee, setSelectedAuditee] = useState([]);
  const [templateData, setTemplateData] = useState({});
  const [selectedTemplateData, setSelectedTemplateData] = useState({});
  const [handlePop, setHandlePop] = useState(false);

  const handleAfterDateChange = (newValue) => {
    setAuditStartOnDate(newValue);
    setAuditCompleteOnDate(newValue.add(7, "days"));
  };

  const handleBeforeDateChange = (newValue) => {
    setAuditCompleteOnDate(newValue);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = async (step) => {
    try {
      let params = {};
      switch (step) {
        case 0:
          params = {
            name: auditName,
            auditId: id,
            auditDetails: {
              auditName,
              auditId: id,
            },
            userId: activeUserDetails.id,
            entityId: entityDetails.id,
            status: auditStatus,
            actionRequired,
            stepNo: 0,
            auditStartAfterDate: auditStartOnDate,
            auditCompleteBeforeDate: auditCompleteOnDate,
          };
          break;

        case 1:
          params = {
            stepNo: 1,
            userId: activeUserDetails.id,
            entityId: entityDetails.id,
            auditId: id,
            auditDetails: {
              auditName,
              auditId: id,
            },
            updatedTemplate: {
              refTemplateId: templateData ? templateData.refTemplateId : "",
              template: selectedTemplateData
                ? selectedTemplateData
                : templateData.template,
              isUpdated: templateData
                ? JSON.stringify(templateData.template) !==
                  JSON.stringify(selectedTemplateData)
                : true,
            },
          };
          console.log("case1 params", params);
          break;

        case 2:
          let mappedUsers = [...allAuditorsAuditees];
          let newMappedUsers = [];
          mappedUsers.pop();
          mappedUsers.forEach((ele) => {
            let newAuditee = ele.auditees.map((auditee) => auditee.id);
            newMappedUsers.push({
              auditor: ele.auditor.id,
              auditee: newAuditee,
            });
          });
          params = {
            auditId: id,
            auditDetails: {
              auditName,
              auditId: id,
            },
            userId: activeUserDetails.id,
            entityId: entityDetails.id,
            updatedMappedUsers: newMappedUsers,
            stepNo: 2,
          };
          console.log("Params", params);
          break;

        default:
          console.log("Invalid Case !");
      }
      const response = await callApi(
        "CREATE",
        "CREATE_OR_UPDATE_AUDIT",
        params
      );
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      if (response.status === 403) {
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
        setUserDetails({});
      }
      // if (response.status === 200) {
      //   if (!id) {
      //     await getAuditSavedAsDraft();
      //   }

      //   console.log("response", response);
      //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
      //   if (id && step === 0) {
      //     setHandlePop(true);
      //   }
      // }
    } catch (err) {
      console.log(err);
    }
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const RemoveSetOfAuditorsAuditeeAndReviewers = (auditor, index) => {
    const newSelectedAuditorsAuditeeAndReviewers = [...allAuditorsAuditees];
    const currentInstanceIndex =
      newSelectedAuditorsAuditeeAndReviewers.findIndex((ele) => {
        if (ele) {
          return ele.auditor.id === auditor;
        }
      });
    let instance = newSelectedAuditorsAuditeeAndReviewers[currentInstanceIndex];
    newSelectedAuditorsAuditeeAndReviewers.splice(currentInstanceIndex, 1);
    setAllAuditorsAuditees([...newSelectedAuditorsAuditeeAndReviewers]);
    setAllAuditors([...allAuditors, { ...instance.auditor }]);
    setAllAuditee([...allAuditee, ...instance.auditees]);
  };

  const AddSetOfAuditorsAuditeeAndReviewers = () => {
    console.log("Allselected", selectedAuditor, selectedAuditee);
    const newSelectedAuditorsAuditeeAndReviewers = [...allAuditorsAuditees];
    let selectedNewAuditee = selectedAuditee.map((auditee) => {
      const selectedAuditeeDesc = allAuditee.find(
        (ele) => ele.id === auditee.id
      );
      return { ...selectedAuditeeDesc };
    });
    if (selectedAuditor && selectedAuditee.length > 0) {
      newSelectedAuditorsAuditeeAndReviewers.unshift({
        auditor: allAuditors.find((ele) => ele.id === selectedAuditor.id),
        auditees: [...selectedNewAuditee],
      });

      setAllAuditorsAuditees([...newSelectedAuditorsAuditeeAndReviewers]);
      const allNewAuditors = [...allAuditors];
      const auditorsIndex = allNewAuditors.findIndex(
        (ele) => ele.id === selectedAuditor.id
      );
      allNewAuditors.splice(auditorsIndex, 1);

      const allNewAuditee = [...allAuditee];
      for (let auditee of selectedAuditee) {
        const auditeeIndex = allNewAuditee.findIndex(
          (ele) => ele.id === auditee.id
        );

        allNewAuditee.splice(auditeeIndex, 1);
      }
      setSelectedAuditee([]);
      setSelectedAuditor("");
      setAllAuditee([...allNewAuditee]);
      setAllAuditors([...allNewAuditors]);
    }
  };

  const handleClosePopup = (data) => {
    console.log("data1111====", data);
    setSelectedTemplateData(data);
    // setSelectedTemplateId("");
    setHandlePop(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return isLoading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={0}>
            <ValidatorForm
              onSubmit={() => {
                handleNext(step);
              }}
            >
              <Grid container spacing={2}>
                <Grid item md={3} xs={4}>
                  <MaterialUIDatePickers
                    label="Audit Start On Date"
                    value={auditStartOnDate}
                    currentDate={dayjs()}
                    minDate={auditStartOnDate}
                    handleDateChange={handleAfterDateChange}
                  />
                </Grid>
                <Grid item md={3} xs={4} style={{ margin: "0 0 0 85px" }}>
                  <MaterialUIDatePickers
                    label="Audit Complete On Date"
                    value={auditCompleteOnDate}
                    minDate={auditCompleteOnDate}
                    currentDate={auditStartOnDate}
                    handleDateChange={handleBeforeDateChange}
                  />
                </Grid>
                <Grid item md={7} xs={12}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Audit Name"
                    value={auditName}
                    onChange={(event) => {
                      setAuditName(event.target.value);
                    }}
                  />
                </Grid>

                <Grid item md={7} xs={12} className={classes.fieldContainer}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      className={classes.selectClass}
                      required
                      MenuProps={{
                        PaperProps: {
                          style: { marginTop: 45 },
                        },
                      }}
                      value={auditStatus}
                      onChange={(event) => {
                        setAuditStatus(event.target.value);
                      }}
                      label="Select Status"
                      fullWidth
                    >
                      <MenuItem value={"Active"}>ACTIVE</MenuItem>
                      <MenuItem value={"Inactive"}>INACTIVE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={7}
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={actionRequired}
                        onChange={(event) => {
                          setActionRequired(event.target.checked);
                        }}
                        name="gilad"
                        color="primary"
                      />
                    }
                    label="Action Required"
                  />
                </Grid>
              </Grid>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classess.button}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  //  onClick={() => handleNext(activeStep)}
                  type="submit"
                  className={classess.button}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </ValidatorForm>
          </Paper>
        );
      case 1:
        return (
          <>
            <div>
              <Button onClick={handleBack} className={classess.button}>
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => handleNext(activeStep)}
                className={classess.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <Paper elevation={0}>
            <ValidatorForm
              onSubmit={() => {
                handleNext(step);
              }}
            >
              {allAuditorsAuditees.map((selected, index) =>
                selected === null ? (
                  allAuditors.length > 0 &&
                  allAuditee.length > 0 && (
                    <Grid container spacing={2}>
                      <Grid item md={3} xs={4}>
                        <FormControl fullWidth size="small">
                          <Autocomplete
                            value={selectedAuditor || null}
                            onChange={(event, newValue) => {
                              setSelectedAuditor(newValue);
                            }}
                            id="tags-outlined"
                            options={allAuditors}
                            getOptionLabel={(option) =>
                              `${option.firstName} ${option.lastName}`
                            }
                            renderTags={(value, getTagProps) => (
                              <Chip
                                // variant="outlined"
                                label={`${value.firstName} ${value.lastName}`}
                                {...getTagProps(value)}
                              />
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Auditor"
                                placeholder="search"
                                required
                                // placeholder="Favorites"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={7} xs={4}>
                        <FormControl fullWidth size="small">
                          <Autocomplete
                            value={selectedAuditee}
                            onChange={(event, newValue) => {
                              setSelectedAuditee(newValue);
                            }}
                            multiple
                            id="tags-outlined"
                            options={allAuditee}
                            getOptionLabel={(option) =>
                              `${option.firstName} ${option.lastName}`
                            }
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  // variant="outlined"
                                  label={`${option.firstName} ${option.lastName}`}
                                  {...getTagProps(option)}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Auditee"
                                placeholder="search"
                                required
                                // placeholder="Favorites"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={2} xs={4}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => {
                            AddSetOfAuditorsAuditeeAndReviewers();
                          }}
                        >
                          +
                        </Button>
                      </Grid>
                    </Grid>
                  )
                ) : (
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={4}>
                      <TextField
                        fullWidth
                        disabled
                        value={`${selected.auditor.firstName} ${selected.auditor.lastName}`}
                      />
                    </Grid>

                    <Grid item md={7} xs={4}>
                      <TextField
                        fullWidth
                        disabled
                        value={`${selected.auditees.map(
                          (selectedAuditee) =>
                            `${selectedAuditee.firstName} ${selectedAuditee.lastName}`
                        )}`}
                      />
                    </Grid>

                    <Grid item md={2} xs={4}>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => {
                          if (selected !== null)
                            RemoveSetOfAuditorsAuditeeAndReviewers(
                              selected.auditor.id,
                              index
                            );
                        }}
                      >
                        -
                      </Button>
                    </Grid>
                  </Grid>
                )
              )}

              <Divider variant="middle" style={{ width: "98%" }} />
              <div>
                <Button onClick={handleBack} className={classess.button}>
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  //onClick={() => handleNext(activeStep)}
                  className={classess.button}
                >
                  {"Finish"}
                </Button>
              </div>
            </ValidatorForm>
          </Paper>
        );
      default:
        props.history.push("/app/manageaudits");
    }
  };

  const getAuditByEntityAndAuditId = async () => {
    try {
      const auditorAndAuditeeResponse = await callApi(
        "GET",
        "GET_ALL_USERLIST_OF_AUDITOR_AUDITEE",
        entityDetails.id
      );
      const response = await callApi(
        "GET",
        "GET_AUDIT_DETAILS",
        `${id}/${entityDetails.id}`
      );
      console.log("Response ", response);
      if (response.status === 403) {
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
        setUserDetails({});
      }
      if (response.status === 200) {
        const { auditDetails, mappedUsers } =
          response.data.auditsDetailsResponse;
        console.log("auditDetails", auditDetails);
        setAuditName(auditDetails.auditName);
        setAuditStatus(auditDetails.status);
        setActionRequired(auditDetails.actionRequired);
        setAuditStartOnDate(auditDetails.auditStartOnDate);
        setAuditCompleteOnDate(auditDetails.auditCompleteOnDate);
        setTemplateData(auditDetails.templateDetails);
        setAllAuditorsAuditees([...mappedUsers, null]);
        let auditorList = [...auditorAndAuditeeResponse.data.auditorList];
        let auditeeList = [...auditorAndAuditeeResponse.data.auditeeList];

        mappedUsers.forEach((item) => {
          const currentIndex = auditorList.findIndex(
            (ele) => ele.id === item.auditor.id
          );
          auditorList.splice(currentIndex, 1);
        });

        mappedUsers.map((item) =>
          item.auditees.forEach((auditee) => {
            const currentAuditeeIndex = auditeeList.findIndex(
              (ele) => ele.id === auditee.id
            );
            auditeeList.splice(currentAuditeeIndex, 1);
          })
        );
        setAllAuditors([...auditorList]);
        setAllAuditee([...auditeeList]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getAuditByEntityAndAuditId();
  }, []);

  return (
    <div className={classess.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        <div>
          <Typography className={classess.instructions}>
            {getStepContent(activeStep)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default EditAudit;

// import {
//   Box,
//   Button,
//   Checkbox,
//   Chip,
//   CircularProgress,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   Step,
//   StepContent,
//   StepLabel,
//   Stepper,
//   TextField,
// } from "@material-ui/core";
// import React, { useEffect, useState } from "react";
// import { ValidatorForm } from "react-material-ui-form-validator";
// import useStyle from "../styles";
// import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
// import callApi from "../../Customutils/callApi";
// import Breadcrumb from "../../Components/Breadcrumbs";
// import { useParams } from "react-router-dom";
// import { Autocomplete } from "@material-ui/lab";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";
// import "react-toastify/dist/ReactToastify.css";
// import MaterialUIDatePickers from "../../Components/MaterialUIDatePickers";
// toast.configure();
//

// const steps = ["Audit Details", "Auditor And Auditee"];

// const EditAudit = (props) => {
//   const classes = useStyle();
//   const [auditName, setAuditName] = useState("");
//

//   const params = useParams();
//   const { id } = params;
//   let { userDetails } = useUserState();
//   const { entityDetails, activeUserDetails } = userDetails;
//   const [status, setStatus] = useState("");
//   const [breadcrumbElements, setBreadcrumbElements] = useState([]);
//   const [isApiLoading, setIsApiLoading] = useState(false);
//   const [allAuditorsAuditees, setAllAuditorsAuditees] = useState([]);
//   const [allAuditors, setAllAuditors] = useState([]);
//   const [allAuditee, setAllAuditee] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [mappedCategories, setMappedCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedAuditor, setSelectedAuditor] = useState("");
//   const [selectedAuditee, setSelectedAuditee] = useState([]);
//   const [actionRequired, setActionRequired] = useState(false);
//   const [createdBy, setCreatedBy] = useState("");
//   const [auditStartOnDate, setAuditStartOnDate] = useState("");
//   const [auditCompleteOnDate, setAuditCompleteOnDate] = useState("");

//   const RemoveSetOfAuditorsAuditeeAndReviewers = (auditor, index) => {
//     const newSelectedAuditorsAuditeeAndReviewers = [...allAuditorsAuditees];
//     const currentInstanceIndex =
//       newSelectedAuditorsAuditeeAndReviewers.findIndex((ele) => {
//         if (ele) {
//           return ele.auditor.id === auditor;
//         }
//       });
//     let instance = newSelectedAuditorsAuditeeAndReviewers[currentInstanceIndex];
//     newSelectedAuditorsAuditeeAndReviewers.splice(currentInstanceIndex, 1);
//     setAllAuditorsAuditees([...newSelectedAuditorsAuditeeAndReviewers]);
//     setAllAuditors([...allAuditors, { ...instance.auditor }]);
//     setAllAuditee([...allAuditee, ...instance.auditees]);
//   };

//   const AddSetOfAuditorsAuditeeAndReviewers = () => {
//     const newSelectedAuditorsAuditeeAndReviewers = [...allAuditorsAuditees];
//     let selectedNewAuditee = selectedAuditee.map((auditee) => {
//       const selectedAuditeeDesc = allAuditee.find(
//         (ele) => ele.id === auditee.id
//       );
//       return { ...selectedAuditeeDesc };
//     });
//     if (selectedAuditor && selectedAuditee.length > 0) {
//       newSelectedAuditorsAuditeeAndReviewers.unshift({
//         auditor: allAuditors.find((ele) => ele.id === selectedAuditor.id),
//         auditees: [...selectedNewAuditee],
//       });

//       setAllAuditorsAuditees([...newSelectedAuditorsAuditeeAndReviewers]);
//       const allNewAuditors = [...allAuditors];
//       const auditorsIndex = allNewAuditors.findIndex(
//         (ele) => ele.id === selectedAuditor.id
//       );
//       allNewAuditors.splice(auditorsIndex, 1);

//       const allNewAuditee = [...allAuditee];
//       for (let auditee of selectedAuditee) {
//         const auditeeIndex = allNewAuditee.findIndex(
//           (ele) => ele.id === auditee.id
//         );

//         allNewAuditee.splice(auditeeIndex, 1);
//       }
//       setSelectedAuditee([]);
//       setSelectedAuditor("");
//       setAllAuditee([...allNewAuditee]);
//       setAllAuditors([...allNewAuditors]);
//     }
//   };

//   const GetAuditDetails = async () => {
//     try {
//       const auditorAndAuditeeResponse = await callApi(
//         "GET",
//         "GET_ALL_USERLIST_OF_AUDITOR_AUDITEE",
//         entityDetails.id
//       );

//       const response = await callApi(
//         "GET",
//         "GET_AUDIT_DETAILS",
//         `${id}/${entityDetails.id}`
//       );
//       if (response.status === 403) {
//         notify();
//         dispatch({ type: "TOKEN_EXPIRED" });
//         setUserDetails({});
//       }

//       if (response.status === 200) {
//         const { auditDetails } = response.data.auditsDetailsResponse;
//         const { auditData, mappedCategories, mappedUsers } = auditDetails;
//         auditData.Items.map((action) => {
//           setActionRequired(action.actionRequired);
//           setAuditStartOnDate(action.auditStartOnDate);
//           setAuditCompleteOnDate(action.auditCompleteOnDate);
//           setCreatedBy(action.createdBy);
//         });

//         setAllAuditorsAuditees([...mappedUsers, null]);
//         let auditorList = [...auditorAndAuditeeResponse.data.auditorList];
//         let auditeeList = [...auditorAndAuditeeResponse.data.auditeeList];

//         mappedUsers.forEach((item) => {
//           const currentIndex = auditorList.findIndex(
//             (ele) => ele.id === item.auditor.id
//           );
//           auditorList.splice(currentIndex, 1);
//         });

//         mappedUsers.map((item) =>
//           item.auditees.forEach((auditee) => {
//             const currentAuditeeIndex = auditeeList.findIndex(
//               (ele) => ele.id === auditee.id
//             );
//             auditeeList.splice(currentAuditeeIndex, 1);
//           })
//         );
//         setAllAuditors([...auditorList]);
//         setAllAuditee([...auditeeList]);
//         auditData.Items.map((item) => setAuditName(item.auditName));
//         auditData.Items.map((item) => setStatus(item.auditStatus));
//         setMappedCategories(mappedCategories);
//         setBreadcrumbElements([
//           { label: "Audit", path: "/app/manageaudits" },
//           { label: auditData.name },
//           { label: "edit" },
//         ]);
//         const allCategoriesResponse = await callApi(
//           "GET",
//           "GET_ALL_ENTITY_CATEGORIES",
//           entityDetails.id
//         );
//         if (allCategoriesResponse.status === 403) {
//           notify();
//           dispatch({ type: "TOKEN_EXPIRED" });
//           setUserDetails({});
//         }
//         if (allCategoriesResponse.status === 200) {
//           setCategories(allCategoriesResponse.data);
//           setIsLoading(false);
//         }
//       }
//     } catch (err) {
//       console.log("Error", err);
//     }
//   };

//   const UpdateAudit = async (e) => {
//     try {
//       e.preventDefault();
//       let mappedUsers = [...allAuditorsAuditees];
//       let newMappedUsers = [];
//       mappedUsers.pop();
//       mappedUsers.forEach((ele) => {
//         let newAuditee = ele.auditees.map((auditee) => auditee.id);
//         newMappedUsers.push({ auditor: ele.auditor.id, auditee: newAuditee });
//       });
//       setIsApiLoading(true);
//       const params = {
//         auditId: id,
//         name: auditName,
//         mappedUsers: newMappedUsers,
//         userId: activeUserDetails.id,
//         status,
//         actionRequired,
//         mappedCategories: mappedCategories,
//         entityId: entityDetails.id,
//         auditStartOnDate,
//         auditCompleteOnDate,
//         createdBy,
//       };
//       const response = await callApi("CREATE", "UPDATE_AUDIT", params);
//       if (response.status === 403) {
//         notify();
//         dispatch({ type: "TOKEN_EXPIRED" });
//         setUserDetails({});
//       }

//       if (response.status === 200) {
//         props.history.push("/app/manageaudits");
//       }
//       setIsApiLoading(false);
//     } catch (err) {
//       console.log(err);
//       setIsApiLoading(false);
//     }
//   };

//   useEffect(() => {
//     GetAuditDetails();
//   }, []);

//

//

//   const handleBeforeDateChange = (newValue) => {
//     setAuditCompleteOnDate(newValue);
//   };

//   return isLoading ? (
//     <CircularProgress />
//   ) : (
//     <>
//       <Breadcrumb breadcrumbElements={breadcrumbElements} />
//       <Paper elevation={0}>
//         <Stepper activeStep={activeStep} orientation="vertical">
//           {steps.map((step, index) => (
//             <Step key={index}>
//               <StepLabel
//                 className={
//                   activeStep === index
//                     ? classes.activeStep
//                     : classes.inactiveStep
//                 }
//               >
//                 {step}
//               </StepLabel>
//               <StepContent>
//                 {activeStep === 0 && (
//                   <ValidatorForm onSubmit={handleNext}>
//                     <Grid container spacing={2}>
//                       <Grid item md={3} xs={4}>
//                         <MaterialUIDatePickers
//                           label="Audit Start On Date"
//                           value={auditStartOnDate}
//                           currentDate={dayjs()}
//                           minDate={auditStartOnDate}
//                           handleDateChange={handleAfterDateChange}
//                         />
//                       </Grid>
//                       <Grid item md={3} xs={4} style={{ margin: "0 0 0 85px" }}>
//                         <MaterialUIDatePickers
//                           label="Audit Complete On Date"
//                           value={auditCompleteOnDate}
//                           minDate={auditCompleteOnDate}
//                           currentDate={auditStartOnDate}
//                           handleDateChange={handleBeforeDateChange}
//                         />
//                       </Grid>
//                       <Grid item md={7} xs={12}>
//                         <TextField
//                           fullWidth
//                           required
//                           size="small"
//                           label="Audit Name"
//                           value={auditName}
//                           onChange={(event) => {
//                             setAuditName(event.target.value);
//                           }}
//                         />
//                       </Grid>
//                       <Grid item md={7} xs={12}>
//                         <FormControl fullWidth size="small">
//                           {/* <InputLabel>Category</InputLabel>
//                           <Select
//                             multiple
//                             className={classes.selectClass}
//                             MenuProps={{
//                               PaperProps: {
//                                 style: { marginTop: 45 },
//                               },
//                             }}
//                             value={mappedCategories}
//                             onChange={(event) => {
//                               setMappedCategories(event.target.value);
//                             }}
//                             renderValue={(data) =>
//                               data.map((category) => (
//                                 <Chip
//                                   label={`${
//                                     categories.find(
//                                       (ele) => ele.id === category
//                                     ).name
//                                   }`}
//                                 />
//                               ))
//                             }
//                             label="Select Category"
//                             fullWidth
//                           >
//                             {categories.map((category, index) => (
//                               <MenuItem value={category.id} key={index}>
//                                 {category.name}
//                               </MenuItem>
//                             ))}
//                           </Select> */}
//                           <Autocomplete
//                             value={mappedCategories}
//                             onChange={(event, newValue) => {
//                               setMappedCategories(newValue);
//                             }}
//                             multiple
//                             id="tags-outlined"
//                             options={categories}
//                             getOptionLabel={(option) => option.name}
//                             renderTags={(value, getTagProps) =>
//                               value.map((option, index) => (
//                                 <Chip
//                                   variant="outlined"
//                                   label={option.name}
//                                   {...getTagProps(option)}
//                                 />
//                               ))
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label="Category"
//                                 placeholder="search"
//                                 // placeholder="Favorites"
//                               />
//                             )}
//                           />
//                         </FormControl>
//                       </Grid>
//                       <Grid
//                         item
//                         md={7}
//                         xs={12}
//                         className={classes.fieldContainer}
//                       >
//                         <FormControl fullWidth size="small" required>
//                           <InputLabel>Status</InputLabel>
//                           <Select
//                             className={classes.selectClass}
//                             required
//                             MenuProps={{
//                               PaperProps: {
//                                 style: { marginTop: 45 },
//                               },
//                             }}
//                             value={status}
//                             onChange={(event) => {
//                               setStatus(event.target.value);
//                             }}
//                             label="Select Status"
//                             fullWidth
//                           >
//                             <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
//                             <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
//                           </Select>
//                         </FormControl>
//                       </Grid>
//                       <Grid
//                         item
//                         md={7}
//                         xs={12}
//                         style={{
//                           display: "flex",
//                           justifyContent: "flex-start",
//                         }}
//                       >
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={actionRequired}
//                               onChange={(event) => {
//                                 setActionRequired(event.target.checked);
//                               }}
//                               name="gilad"
//                               color="primary"
//                             />
//                           }
//                           label="Action Required"
//                         />
//                       </Grid>
//                       <Grid item md={7} xs={12}>
//                         <Box sx={{ mb: 2 }} className={classes.stepperButton}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             size="small"
//                             color="primary"
//                             style={{
//                               marginRight: "11px",
//                             }}
//                             sx={{ mt: 1, mr: 1 }}
//                           >
//                             {index === steps.length - 1
//                               ? "Finish"
//                               : "Save & Continue"}
//                           </Button>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </ValidatorForm>
//                 )}
//                 {activeStep === steps.length ||
//                   (activeStep === 1 && (
//                     <ValidatorForm onSubmit={handleNext}>
//                       {allAuditorsAuditees.map((selected, index) =>
//                         selected === null ? (
//                           allAuditors.length > 0 &&
//                           allAuditee.length > 0 && (
//                             <Grid container spacing={2}>
//                               <Grid item md={3} xs={4}>
//                                 <FormControl fullWidth size="small">
//                                   {/* <InputLabel>Auditor</InputLabel>
//                                 <Select
//                                   className={classes.selectClass}
//                                   MenuProps={{
//                                     PaperProps: {
//                                       style: { marginTop: 45 },
//                                     },
//                                   }}
//                                   value={selectedAuditor}
//                                   onChange={(event) => {
//                                     setSelectedAuditor(event.target.value);
//                                   }}
//                                   renderValue={(data) => (
//                                     <Chip
//                                       label={`${
//                                         allAuditors.find(
//                                           (ele) => ele.id === data
//                                         ).firstName
//                                       } ${
//                                         allAuditors.find(
//                                           (ele) => ele.id === data
//                                         ).lastName
//                                       }`}
//                                     />
//                                   )}
//                                   label="Select Auditor"
//                                   fullWidth
//                                 >
//                                   {allAuditors.map((auditor, index) => (
//                                     <MenuItem value={auditor.id} key={index}>
//                                       {auditor.firstName} {auditor.lastName}
//                                     </MenuItem>
//                                   ))}
//                                 </Select> */}
//                                   <Autocomplete
//                                     value={selectedAuditor || null}
//                                     onChange={(event, newValue) => {
//                                       setSelectedAuditor(newValue);
//                                     }}
//                                     id="tags-outlined"
//                                     options={allAuditors}
//                                     getOptionLabel={(option) =>
//                                       `${option.firstName} ${option.lastName}`
//                                     }
//                                     renderTags={(value, getTagProps) => (
//                                       <Chip
//                                         variant="outlined"
//                                         label={value.firstName}
//                                         {...getTagProps(value)}
//                                       />
//                                     )}
//                                     renderInput={(params) => (
//                                       <TextField
//                                         {...params}
//                                         label="Auditor"
//                                         placeholder="search"
//                                         // placeholder="Favorites"
//                                       />
//                                     )}
//                                   />
//                                 </FormControl>
//                               </Grid>
//                               {/* <Grid item md={3} xs={4}>
//                               <FormControl fullWidth size="small">
//                                 <InputLabel>Reviewer</InputLabel>
//                                 <Select
//                                   className={classes.selectClass}
//                                   MenuProps={{
//                                     PaperProps: {
//                                       style: { marginTop: 45 },
//                                     },
//                                   }}
//                                   value={selectedReviewer}
//                                   onChange={(event) => {
//                                     setSelectedReviewer(event.target.value);
//                                   }}
//                                   renderValue={(data) => (
//                                     <Chip
//                                       label={`${
//                                         allReviewers.find(
//                                           (ele) => ele.id === data
//                                         ).firstName
//                                       } ${
//                                         allReviewers.find(
//                                           (ele) => ele.id === data
//                                         ).lastName
//                                       }`}
//                                     />
//                                   )}
//                                   label="Select Reviewer"
//                                   fullWidth
//                                 >
//                                   {allReviewers.map((reviewer, index) => (
//                                     <MenuItem value={reviewer.id} key={index}>
//                                       {reviewer.firstName} {reviewer.lastName}
//                                     </MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </Grid> */}
//                               <Grid item md={7} xs={4}>
//                                 <FormControl fullWidth size="small">
//                                   {/* <InputLabel>Auditee</InputLabel>
//                                 <Select
//                                   multiple
//                                   className={classes.selectClass}
//                                   MenuProps={{
//                                     PaperProps: {
//                                       style: { marginTop: 45 },
//                                     },
//                                   }}
//                                   value={selectedAuditee}
//                                   onChange={(event) => {
//                                     setSelectedAuditee(event.target.value);
//                                   }}
//                                   renderValue={(data) =>
//                                     data.map((auditee, index) => (
//                                       <Chip
//                                         key={index}
//                                         label={`${
//                                           allAuditee.find(
//                                             (ele) => ele.id === auditee
//                                           ).firstName
//                                         } ${
//                                           allAuditee.find(
//                                             (ele) => ele.id === auditee
//                                           ).lastName
//                                         }`}
//                                       />
//                                     ))
//                                   }
//                                   label="Select Auditee"
//                                   fullWidth
//                                 >
//                                   {allAuditee.map((auditee, index) => (
//                                     <MenuItem value={auditee.id} key={index}>
//                                       {auditee.firstName} {auditee.lastName}
//                                     </MenuItem>
//                                   ))}
//                                 </Select> */}
//                                   <Autocomplete
//                                     value={selectedAuditee}
//                                     onChange={(event, newValue) => {
//                                       setSelectedAuditee(newValue);
//                                     }}
//                                     multiple
//                                     id="tags-outlined"
//                                     options={allAuditee}
//                                     getOptionLabel={(option) =>
//                                       `${option.firstName} ${option.lastName}`
//                                     }
//                                     renderTags={(value, getTagProps) =>
//                                       value.map((option, index) => (
//                                         <Chip
//                                           variant="outlined"
//                                           label={`${option.firstName} ${option.lastName}`}
//                                           {...getTagProps(option)}
//                                         />
//                                       ))
//                                     }
//                                     renderInput={(params) => (
//                                       <TextField
//                                         {...params}
//                                         label="Auditee"
//                                         placeholder="search"
//                                         // placeholder="Favorites"
//                                       />
//                                     )}
//                                   />
//                                 </FormControl>
//                               </Grid>

//                               <Grid item md={2} xs={4}>
//                                 <Button
//                                   variant="contained"
//                                   size="small"
//                                   color="primary"
//                                   onClick={() => {
//                                     AddSetOfAuditorsAuditeeAndReviewers();
//                                   }}
//                                 >
//                                   +
//                                 </Button>
//                               </Grid>
//                             </Grid>
//                           )
//                         ) : (
//                           <Grid container spacing={2}>
//                             <Grid item md={3} xs={4}>
//                               <TextField
//                                 fullWidth
//                                 disabled
//                                 value={`${selected.auditor.firstName} ${selected.auditor.lastName}`}
//                               />
//                             </Grid>

//                             <Grid item md={7} xs={4}>
//                               <TextField
//                                 fullWidth
//                                 disabled
//                                 value={`${selected.auditees.map(
//                                   (selectedAuditee) =>
//                                     `${selectedAuditee.firstName} ${selectedAuditee.lastName}`
//                                 )}`}
//                               />
//                             </Grid>

//                             <Grid item md={2} xs={4}>
//                               <Button
//                                 variant="contained"
//                                 size="small"
//                                 color="primary"
//                                 onClick={() => {
//                                   if (selected !== null)
//                                     RemoveSetOfAuditorsAuditeeAndReviewers(
//                                       selected.auditor.id,
//                                       index
//                                     );
//                                 }}
//                               >
//                                 -
//                               </Button>
//                             </Grid>
//                           </Grid>
//                         )
//                       )}

//                       <Divider variant="middle" style={{ width: "98%" }} />
//                       <Box sx={{ mb: 2 }} className={classes.formButton}>
//                         <Button
//                           onClick={handleBack}
//                           size="small"
//                           variant="outlined"
//                           style={{
//                             marginRight: "8px",
//                           }}
//                         >
//                           Previous
//                         </Button>
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           size="small"
//                           color="primary"
//                           disabled={isApiLoading}
//                           onClick={UpdateAudit}
//                           style={{
//                             marginRight: "11px",
//                           }}
//                           sx={{ mt: 1, mr: 1 }}
//                         >
//                           {index === steps.length - 1
//                             ? "Finish"
//                             : "Save & Continue"}
//                         </Button>
//                         {isApiLoading && (
//                           <CircularProgress
//                             style={{
//                               position: "absolute",
//                               top: "-5px",
//                               right: "6%",
//                             }}
//                           />
//                         )}
//                       </Box>
//                     </ValidatorForm>
//                   ))}
//               </StepContent>
//             </Step>
//           ))}
//         </Stepper>
//         {/* {activeStep === steps.length && (
//           <Box component={"div"}>
//             <Typography>All steps completed - you&apos;re finished</Typography>
//             <Button
//               color="inherit"
//               variant="contained"
//               size="small"
//               disabled={isApiLoading}
//               onClick={handleReset}
//             >
//               Reset
//             </Button>
//             <Box className={classes.formButton}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 disabled={isApiLoading}
//                 size="small"
//                 style={{
//                   marginRight: "8px",
//                 }}
//                 onClick={UpdateAudit}
//               >
//                 Update
//               </Button>
//               <Button
//                 onClick={() => {
//                   props.history.push("/app/dashboard");
//                 }}
//                 variant="contained"
//                 color="secondary"
//                 disabled={isApiLoading}
//                 size="small"
//                 style={{
//                   marginRight: "11px",
//                 }}
//               >
//                 CANCEL
//               </Button>
//               {isApiLoading && (
//                 <CircularProgress
//                   style={{
//                     position: "absolute",
//                     top: "-5px",
//                     right: "6%",
//                   }}
//                 />
//               )}
//             </Box>
//           </Box>
//         )} */}
//       </Paper>
//     </>
//   );
// };

// export default EditAudit;

// // {activeStep === 1 && (
// //   <ValidatorForm onSubmit={handleNext}>
// //     {allAuditorsAuditees.length <= 0
// //       ? allAuditors.length > 0 &&
// //         allAuditee.length > 0 && (
// //           <Grid container spacing={2}>
// //             <Grid item md={3} xs={4}>
// //               <FormControl fullWidth size="small">
// //                 <InputLabel>Auditor</InputLabel>
// //                 <Select
// //                   className={classes.selectClass}
// //                   MenuProps={{
// //                     PaperProps: {
// //                       style: { marginTop: 45 },
// //                     },
// //                   }}
// //                   value={selectedAuditor}
// //                   onChange={(event) => {
// //                     setSelectedAuditor(event.target.value);
// //                   }}
// //                   renderValue={(data) => (
// //                     <Chip
// //                       label={`${
// //                         allAuditors.find(
// //                           (ele) => ele.id === data
// //                         ).firstName
// //                       } ${
// //                         allAuditors.find(
// //                           (ele) => ele.id === data
// //                         ).lastName
// //                       }`}
// //                     />
// //                   )}
// //                   label="Select Auditor"
// //                   fullWidth
// //                 >
// //                   {allAuditors.map((auditor, index) => (
// //                     <MenuItem value={auditor.id} key={index}>
// //                       {auditor.firstName} {auditor.lastName}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             </Grid>
// //             {/* <Grid item md={3} xs={4}>
// //               <FormControl fullWidth size="small">
// //                 <InputLabel>Reviewer</InputLabel>
// //                 <Select
// //                   className={classes.selectClass}
// //                   MenuProps={{
// //                     PaperProps: {
// //                       style: { marginTop: 45 },
// //                     },
// //                   }}
// //                   value={selectedReviewer}
// //                   onChange={(event) => {
// //                     setSelectedReviewer(event.target.value);
// //                   }}
// //                   renderValue={(data) => (
// //                     <Chip
// //                       label={`${
// //                         allReviewers.find(
// //                           (ele) => ele.id === data
// //                         ).firstName
// //                       } ${
// //                         allReviewers.find(
// //                           (ele) => ele.id === data
// //                         ).lastName
// //                       }`}
// //                     />
// //                   )}
// //                   label="Select Reviewer"
// //                   fullWidth
// //                 >
// //                   {allReviewers.map((reviewer, index) => (
// //                     <MenuItem value={reviewer.id} key={index}>
// //                       {reviewer.firstName} {reviewer.lastName}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             </Grid> */}
// //             <Grid item md={7} xs={4}>
// //               <FormControl fullWidth size="small">
// //                 <InputLabel>Auditee</InputLabel>
// //                 <Select
// //                   multiple
// //                   className={classes.selectClass}
// //                   MenuProps={{
// //                     PaperProps: {
// //                       style: { marginTop: 45 },
// //                     },
// //                   }}
// //                   value={selectedAuditee}
// //                   onChange={(event) => {
// //                     setSelectedAuditee(event.target.value);
// //                   }}
// //                   renderValue={(data) =>
// //                     data.map((auditee, index) => (
// //                       <Chip
// //                         key={index}
// //                         label={`${
// //                           allAuditee.find(
// //                             (ele) => ele.id === auditee
// //                           ).firstName
// //                         } ${
// //                           allAuditee.find(
// //                             (ele) => ele.id === auditee
// //                           ).lastName
// //                         }`}
// //                       />
// //                     ))
// //                   }
// //                   label="Select Auditee"
// //                   fullWidth
// //                 >
// //                   {allAuditee.map((auditee, index) => (
// //                     <MenuItem value={auditee.id} key={index}>
// //                       {auditee.firstName} {auditee.lastName}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             </Grid>

// //             <Grid item md={2} xs={4}>
// //               <Button
// //                 variant="contained"
// //                 size="small"
// //                 color="primary"
// //                 onClick={() => {
// //                   AddSetOfAuditorsAuditeeAndReviewers();
// //                 }}
// //               >
// //                 +
// //               </Button>
// //             </Grid>
// //           </Grid>
// //         )
// //       : allAuditorsAuditees.map((selected) => (
// //           <Grid container spacing={2}>
// //             <Grid item md={3} xs={4}>
// //               <TextField
// //                 fullWidth
// //                 disabled
// //                 value={`${selected.auditor.firstName} ${selected.auditor.lastName}`}
// //               />
// //             </Grid>

// //             <Grid item md={7} xs={4}>
// //               <TextField
// //                 fullWidth
// //                 disabled
// //                 value={`${selected.auditees.map(
// //                   (selectedAuditee) =>
// //                     `${selectedAuditee.firstName} ${selectedAuditee.lastName}`
// //                 )}`}
// //               />
// //             </Grid>

// //             <Grid item md={2} xs={4}>
// //               <Button
// //                 variant="contained"
// //                 size="small"
// //                 color="primary"
// //                 onClick={() => {
// //                   if (selected !== null)
// //                     RemoveSetOfAuditorsAuditeeAndReviewers(
// //                       selected.auditor.id
// //                     );
// //                 }}
// //               >
// //                 -
// //               </Button>
// //             </Grid>
// //           </Grid>
// //         ))}
// //     {/* {allAuditorsAuditees.map((selected, index) =>
// //       allAuditorsAuditees[index] === 0 ? :
// //     )} */}

// //     <Divider variant="middle" style={{ width: "98%" }} />
// //     <Box sx={{ mb: 2 }} className={classes.stepperButton}>
// //       <Button
// //         onClick={handleBack}
// //         size="small"
// //         variant="outlined"
// //         style={{
// //           marginRight: "8px",
// //         }}
// //       >
// //         Previous
// //       </Button>
// //       <Button
// //         type="submit"
// //         variant="contained"
// //         size="small"
// //         color="primary"
// //         style={{
// //           marginRight: "11px",
// //         }}
// //         sx={{ mt: 1, mr: 1 }}
// //       >
// //         {index === steps.length - 1
// //           ? "Finish"
// //           : "Save & Continue"}
// //       </Button>
// //     </Box>
// //   </ValidatorForm>
// // )}
