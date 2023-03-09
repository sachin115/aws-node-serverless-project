import React, { useEffect, useState } from "react";
import MaterialUIDatePickers from "../../Components/MaterialUIDatePickers";
import {
  TextField,
  Grid,
  Stepper,
  StepLabel,
  Button,
  Typography,
  Step,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import dayjs from "dayjs";
import { Autocomplete } from "@mui/material";
import callApi from "../../Customutils/callApi";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import { toast } from "react-toastify";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import useStyle from "../styles";
import { useHistory, useParams } from "react-router-dom";
import CreateAuditTemplate from "./createaudittemplate";
toast.configure();
const notify = () => toast("Session Expired...!");

export default function CreateNewAudit(props) {
  const { id } = useParams();
  console.log("id", id);
  const classes = useStyle();
  const [activeStep, setActiveStep] = React.useState(0);
  const [afterSelectedDate, setAfterSelectedDate] = useState(dayjs());
  const [beforeSelectedDate, setBeforeSelectedDate] = useState(
    dayjs().add(7, "day")
  );
  const [selectedTemplateData, setSelectedTemplateData] = useState({});
  const [allAuditors, setAllAuditors] = useState([]);
  const [allAuditee, setAllAuditee] = useState([]);
  const [isDraftAudit, setIsDraftAudit] = useState(false);
  const [draftAuditId, setDraftAuditId] = useState("");
  const [selectedAuditor, setSelectedAuditor] = useState("");
  const [selectedAuditee, setSelectedAuditee] = useState([]);
  const [allEntityTemplate, setAllEntityTemplate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [handlePop, setHandlePop] = useState(false);
  const { dispatch, setUserDetails } = useUserDispatch();
  const [auditName, setAuditName] = useState("");
  const [auditStatus, setAuditStatus] = useState("");
  const [actionRequired, setActionRequired] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  let { userDetails } = useUserState();
  const history = useHistory();
  const { entityDetails, activeUserDetails } = userDetails;
  const [allAuditorsAuditees, setAllAuditorsAuditees] = useState([null]);
  const [auditTemplateData, setAuditTemplateData] = useState([]);
  console.log("auditTemplateData", auditTemplateData);
  const [auditTemplateDescription, setAuditTemplateDescription] = useState("");
  const [auditTemplateName, setAuditTemplateName] = useState("");
  const [refTemplateId, setRefTemplateId] = useState("");

  const steps = !id
    ? [
        "Audit Details",
        "Select Or Create Template",
        "Finalize Template",
        "Audit Participants",
      ]
    : ["Audit Details", "Finalize Template", "Audit Participants"];

  const handleNext = async (step) => {
    try {
      setIsApiLoading(true);
      let params = {};
      if (id) {
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
              auditStartAfterDate: afterSelectedDate,
              auditCompleteBeforeDate: beforeSelectedDate,
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
                refTemplateId: refTemplateId,
                name: auditTemplateName,
                templateDescription: auditTemplateDescription,
                template: auditTemplateData
                  ? auditTemplateData
                  : auditTemplateData.template,
                isUpdated: auditTemplateData
                  ? JSON.stringify(auditTemplateData.template) !==
                    JSON.stringify(selectedTemplateData)
                  : true,
              },
            };
            console.log("case1 id params", params);
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
              actionRequired,
              status: auditStatus,
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
      } else {
        switch (step) {
          case 0:
            params = isDraftAudit
              ? {
                  name: auditName,
                  auditDetails: {
                    auditName,
                    auditId: draftAuditId,
                  },
                  userId: activeUserDetails.id,
                  entityId: entityDetails.id,
                  final: false,
                  status: auditStatus,
                  actionRequired,
                  stepNo: 0,
                  auditStartAfterDate: afterSelectedDate,
                  auditCompleteBeforeDate: beforeSelectedDate,
                }
              : {
                  name: auditName,
                  userId: activeUserDetails.id,
                  entityId: entityDetails.id,
                  stepNo: 0,
                  status: auditStatus,
                  actionRequired,
                  auditStartAfterDate: afterSelectedDate,
                  auditCompleteBeforeDate: beforeSelectedDate,
                  final: false,
                };
            break;

          case 1:
            params = {
              stepNo: 1,
              userId: activeUserDetails.id,
              entityId: entityDetails.id,
              auditDetails: {
                auditName,
                auditId: draftAuditId,
              },
              template: {
                refTemplateId: selectedTemplateData.id
                  ? selectedTemplateData.id
                  : "",
                name: auditTemplateName,
                templateDescription: auditTemplateDescription,
                template: auditTemplateData,
                isUpdated: auditTemplateData
                  ? JSON.stringify(auditTemplateData.template) !==
                    JSON.stringify(selectedTemplateData)
                  : true,
              },
            };
            console.log("case1 params", params);
            break;

          case 3:
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
              auditDetails: {
                auditName,
                auditId: draftAuditId,
              },
              actionRequired,
              status: auditStatus,
              userId: activeUserDetails.id,
              entityId: entityDetails.id,
              mappedUsers: newMappedUsers,
              stepNo: 2,
              final: true,
            };
            console.log("Params", params);
            break;

          default:
            console.log("Invalid Case !");
        }
      }
      const response = await callApi(
        "CREATE",
        "CREATE_OR_UPDATE_AUDIT",
        params
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        if (!id) {
          await getAuditSavedAsDraft();
        }
        setIsApiLoading(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (id && step === 0) {
          setHandlePop(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleAfterDateChange = (newValue) => {
    setAfterSelectedDate(newValue);
    setBeforeSelectedDate(newValue.add(7, "days"));
  };

  const handleBeforeDateChange = (newValue) => {
    setBeforeSelectedDate(newValue);
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

  const importTemplateData = (activeStep) => {
    setAuditTemplateName(selectedTemplateData.name);
    setAuditTemplateDescription(selectedTemplateData.templateDescription);
    setAuditTemplateData(selectedTemplateData.template);
    setActiveStep(activeStep + 1);
  };

  const handleTemplateChange = (event) => {
    const userId = event.target.value;
    const user = allEntityTemplate.find((u) => u.id === userId);
    setSelectedTemplateData(user);
  };

  const getStepContent = (step) => {
    if (id) {
      switch (step) {
        case 0:
          return isLoading ? (
            <CircularProgress />
          ) : (
            <Paper elevation={0} className={classes.paperPadding}>
              <ValidatorForm
                onSubmit={() => {
                  handleNext(step);
                }}
              >
                <Grid container spacing={2}>
                  <Grid item md={3} xs={4}>
                    <MaterialUIDatePickers
                      label="Audit Start On Date"
                      value={afterSelectedDate}
                      currentDate={dayjs()}
                      minDate={afterSelectedDate}
                      handleDateChange={handleAfterDateChange}
                    />
                  </Grid>
                  <Grid item md={3} xs={4} style={{ margin: "0 0 0 85px" }}>
                    <MaterialUIDatePickers
                      label="Audit Complete On Date"
                      value={beforeSelectedDate}
                      minDate={beforeSelectedDate}
                      currentDate={afterSelectedDate}
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
                <Box sx={{ mb: 2 }} className={classes.formButton}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    //  onClick={() => handleNext(activeStep)}
                    type="submit"
                    className={classes.button}
                    style={{ textTransform: "capitalize" }}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                  {isApiLoading && (
                    <CircularProgress
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "2%",
                        height: "22px",
                        width: "22px",
                      }}
                    />
                  )}
                </Box>
              </ValidatorForm>
            </Paper>
          );
        case 1:
          return (
            <CreateAuditTemplate
              activeStep={activeStep + 1}
              handleNext={handleNext}
              handleBack={handleBack}
              auditTemplateData={auditTemplateData}
              setAuditTemplateData={setAuditTemplateData}
              auditTemplateDescription={auditTemplateDescription}
              setAuditTemplateDescription={setAuditTemplateDescription}
              auditTemplateName={auditTemplateName}
              setAuditTemplateName={setAuditTemplateName}
              isApiLoading={isApiLoading}
            />
          );
        case 2:
          return (
            <Paper elevation={0} className={classes.paperPadding}>
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
                                  variant="outlined"
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
                                  <Typography>{`${option.firstName} ${option.lastName} , `}</Typography>
                                  // variant="outlined"
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Auditee"
                                  placeholder={
                                    selectedAuditee.length > 0 ? "" : "search"
                                  }
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
                <Box sx={{ mb: 2 }} className={classes.formButton}>
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    type="submit"
                    //onClick={() => handleNext(activeStep)}
                    className={classes.button}
                  >
                    {"Finish"}
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
                </Box>
              </ValidatorForm>
            </Paper>
          );
        default:
          props.history.push("/app/audits");
      }
    } else {
      switch (step) {
        case 0:
          return isLoading ? (
            <CircularProgress />
          ) : (
            <Paper elevation={0} className={classes.paperPadding}>
              <ValidatorForm
                onSubmit={() => {
                  handleNext(step);
                }}
              >
                <Grid container spacing={2}>
                  <Grid item md={3} xs={4}>
                    <MaterialUIDatePickers
                      label="Audit Start On Date"
                      value={afterSelectedDate}
                      currentDate={dayjs()}
                      minDate={afterSelectedDate}
                      handleDateChange={handleAfterDateChange}
                    />
                  </Grid>
                  <Grid item md={3} xs={4} style={{ margin: "0 0 0 85px" }}>
                    <MaterialUIDatePickers
                      label="Audit Complete On Date"
                      value={beforeSelectedDate}
                      minDate={beforeSelectedDate}
                      currentDate={afterSelectedDate}
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
                <Box sx={{ mb: 2 }} className={classes.formButton}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    //  onClick={() => handleNext(activeStep)}
                    type="submit"
                    className={classes.button}
                    style={{ textTransform: "capitalize" }}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                  {isApiLoading && (
                    <CircularProgress
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "2%",
                        height: "22px",
                        width: "22px",
                      }}
                    />
                  )}
                </Box>
              </ValidatorForm>
            </Paper>
          );
        case 1:
          return (
            <Paper elevation={0} className={classes.paperPadding}>
              <ValidatorForm>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} className={classes.fieldContainer}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select From Existing</InputLabel>
                      <Select
                        className={classes.selectClass}
                        MenuProps={{
                          PaperProps: {
                            style: { marginTop: 50 },
                          },
                        }}
                        value={
                          selectedTemplateData && selectedTemplateData.name
                        }
                        onChange={(event) => handleTemplateChange(event)}
                        label="Select Template"
                        fullWidth
                      >
                        {allEntityTemplate.map((template) => (
                          <MenuItem value={template.id}>
                            {template.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <Button
                      onClick={() => importTemplateData(activeStep)}
                      size="small"
                      variant="contained"
                      color="primary"
                      style={{ margin: "14px 0px 0px 0px" }}
                      disabled={selectedTemplateData.id ? false : true}
                    >
                      Import
                    </Button>
                  </Grid>
                  <Grid item md={1} xs={12}>
                    <Divider
                      orientation="vertical"
                      flexItem
                      style={{
                        alignSelf: "center",
                        height: "250px",
                        margin: "0px 67px",
                        width: "3px",
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Button
                      disabled={selectedTemplateData.id ? true : false}
                      labelStyle={{ fontSize: "200%" }}
                      style={{ margin: "25% 50%" }}
                      onClick={() => setActiveStep(activeStep + 1)}
                    >
                      <AddCircleOutlineIcon
                        color={selectedTemplateData.id ? "red" : "primary"}
                        fontSize="large"
                      />
                    </Button>
                    <Typography style={{ margin: "-118px 0px 0px 64px" }}>
                      Create New
                    </Typography>
                    {/* {handlePop && (
                  <CreateTemplate
                    onOpen={handlePop}
                    onClose={handleClosePopup}
                    templateId=""
                  />
                )} */}
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2 }} className={classes.formButton}>
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>

                  {/* <Button
                variant="outlined"
                color="primary"
                size="small"
                type="submit"
                onClick={() => handleNext(activeStep)}
                className={classes.button}
                style={{ textTransform: "capitalize" }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
              {isApiLoading && (
                <CircularProgress
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "1%",
                  }}
                />
              )} */}
                </Box>
              </ValidatorForm>
            </Paper>
          );
        case 2:
          return (
            <CreateAuditTemplate
              activeStep={activeStep}
              handleNext={handleNext}
              handleBack={handleBack}
              auditTemplateData={auditTemplateData}
              setAuditTemplateData={setAuditTemplateData}
              auditTemplateDescription={auditTemplateDescription}
              setAuditTemplateDescription={setAuditTemplateDescription}
              auditTemplateName={auditTemplateName}
              setAuditTemplateName={setAuditTemplateName}
              isApiLoading={isApiLoading}
            />
          );
        case 3:
          return (
            <Paper elevation={0} className={classes.paperPadding}>
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
                                  variant="outlined"
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
                                  <Typography>{`${option.firstName} ${option.lastName} , `}</Typography>
                                  // variant="outlined"
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Auditee"
                                  placeholder={
                                    selectedAuditee.length > 0 ? "" : "search"
                                  }
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
                <Box sx={{ mb: 2 }} className={classes.formButton}>
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    type="submit"
                    //onClick={() => handleNext(activeStep)}
                    className={classes.button}
                  >
                    {"Finish"}
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
                </Box>
              </ValidatorForm>
            </Paper>
          );
        default:
          props.history.push("/app/audits");
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    getAuditSavedAsDraft();
    setSelectedTemplateData({});
  };

  const getAllAuditorsAuditeeAndReviewers = async () => {
    try {
      const usersResponse = await callApi(
        "GET",
        "GET_ALL_USERLIST_OF_AUDITOR_AUDITEE",
        entityDetails.id
      );
      if (usersResponse.status === 403) {
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
        setUserDetails({});
      }

      setAllAuditors([...usersResponse.data.auditorList]);
      setAllAuditee([...usersResponse.data.auditeeList]);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getAllEntityTemplate = async () => {
    try {
      const templateResponse = await callApi(
        "GET",
        "GET_ALL_ENTITY_TEMPLATES",
        entityDetails.id
      );
      if (templateResponse.status === 403) {
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
        setUserDetails({});
      }
      if (templateResponse.status === 200) {
        console.log("templateResponsedata", templateResponse);
        setAllEntityTemplate(templateResponse.data.data.Items);
        if (!id) {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getAuditSavedAsDraft = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_AUDIT_SAVED_AS_DRAFT",
        `${entityDetails.id}/${activeUserDetails.id}`
      );
      console.log("Response ", response);
      if (response.status === 403) {
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
        setUserDetails({});
      }
      if (response.status === 200) {
        if (response.data.message === "Draft audits fetched !") {
          const { draftAudit } = response.data;
          console.log("draftAudit", draftAudit);
          setAuditName(draftAudit.auditName && draftAudit.auditName);
          setDraftAuditId(draftAudit.id && draftAudit.id);
          setAuditStatus(draftAudit.status && draftAudit.status);
          setActionRequired(
            draftAudit.actionRequired && draftAudit.actionRequired
          );
          setAfterSelectedDate(draftAudit.auditStartOnDate);
          setBeforeSelectedDate(draftAudit.auditCompleteOnDate);
          setAuditTemplateDescription(
            draftAudit.templateDetails.templateDescription
          );
          setAuditTemplateName(draftAudit.templateDetails.templateName);
          setAuditTemplateData(draftAudit.templateDetails.template);
          setIsDraftAudit(true);
        }
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getAuditDetails = async () => {
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
        console.log("draftAudit", auditDetails);
        setAuditName(auditDetails.auditName && auditDetails.auditName);
        setAuditStatus(auditDetails.status && auditDetails.status);
        setActionRequired(
          auditDetails.actionRequired && auditDetails.actionRequired
        );
        setAfterSelectedDate(auditDetails.auditStartOnDate);
        setBeforeSelectedDate(auditDetails.auditCompleteOnDate);
        setRefTemplateId(auditDetails.templateDetails.refTemplateId);
        setAuditTemplateName(auditDetails.templateDetails.templateName);
        setAuditTemplateDescription(
          auditDetails.templateDetails.templateDescription
        );
        setAuditTemplateData(auditDetails.templateDetails.template);
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
    if (id) {
      getAuditDetails();
    } else {
      getAuditSavedAsDraft();
      getAllAuditorsAuditeeAndReviewers();
    }
    getAllEntityTemplate();
  }, []);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} className={classes.instructions}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        <div>
          <Typography className={classes.instructions}>
            {getStepContent(activeStep)}
          </Typography>
        </div>
      </div>
    </div>
  );
}
