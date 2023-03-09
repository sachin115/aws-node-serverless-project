import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import useStyle from "../styles";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import { MultiSelect } from "react-multi-select-component";
import Breadcrumb from "../../Components/Breadcrumbs";
import { useHistory, useParams } from "react-router-dom";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const EditRole = (props) => {
  const classes = useStyle();
  const { dispatch, setUserDetails } = useUserDispatch();
  const [roleStatus, setRoleStatus] = useState("");
  const [name, setName] = useState("");
  const [entityFeatures, setEntityFeatures] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [roleId, setRoleId] = useState("");
  const history = useHistory();
  const { userDetails } = useUserState();
  const params = useParams();
  let { id } = params;
  const { entityDetails, activeUserDetails, clientDetails } = userDetails;
  const [activeStep, setActiveStep] = useState(0);

  const getRoleDetails = async (agencyId) => {
    try {
      let allNewFeatures = [];
      if (clientDetails.name === "Internal") {
        const allFeaturesResponse = await callApi(
          "GETLIST",
          "GET_INTERNAL_FEATURES"
        );
        if (allFeaturesResponse.status === 403) {
          setUserDetails({});
          notify();
          dispatch({ type: "TOKEN_EXPIRED" });
        }
        allNewFeatures = allFeaturesResponse.data;
      } else {
        const allFeaturesResponse = await callApi(
          "GETLIST",
          "GET_SALES_FEATURES"
        );
        if (allFeaturesResponse.status === 403) {
          setUserDetails({});
          notify();
          dispatch({ type: "TOKEN_EXPIRED" });
        }
        allNewFeatures = allFeaturesResponse.data;
      }

      allNewFeatures = allNewFeatures.map((feature) => {
        const updatedPermissions = feature.permissions.map((permission) => {
          return {
            ...permission,
            label: permission.name.replaceAll("_", " "),
            value: permission.id,
          };
        });
        return {
          ...feature,
          label: feature.name.replaceAll("_", " "),
          value: feature.id,
          permissions: updatedPermissions,
        };
      });
      const entityResponse = await callApi(
        "GET",
        "GET_ENTITY_DETAILS_BY_ID",
        agencyId
      );
      if (entityResponse.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      const entityFeaturesFromDataBase = entityResponse.data.entityFeatures;

      let newEntityFeature = [];
      entityFeaturesFromDataBase.forEach((feature) => {
        const findFeature = allNewFeatures.find((ele) => ele.id === feature.id);
        if (!!findFeature) {
          newEntityFeature.push({
            ...feature,
            label: feature.name.replaceAll("_", " "),
            value: feature.id,
            permissions: findFeature.permissions,
          });
        }
      });

      allNewFeatures = allNewFeatures.map((feature) => {
        const updatedPermissions = feature.permissions.map((permission) => {
          return {
            ...permission,
            label: permission.name.replaceAll("_", " "),
            value: permission.id,
          };
        });
        return {
          ...feature,
          label: feature.name.replaceAll("_", " "),
          value: feature.id,
          permissions: updatedPermissions,
        };
      });
      const response = await callApi("GET", "GET_ROLE_DETAILS", id);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        const { roleDetails, rolePermissions } = response.data;
        let newPermission = {};
        allNewFeatures.forEach((feature) => {
          rolePermissions.forEach((permission) => {
            permission = {
              ...permission,
              label: permission.name.replaceAll("_", " "),
              value: permission.id,
            };
            let isPermission = feature.permissions.find(
              (featurePermission) => permission.id === featurePermission.id
            );

            if (!!isPermission) {
              if (!!newPermission[feature.name]) {
                newPermission[feature.name].push(permission);
              } else {
                newPermission[feature.name] = [permission];
              }
            }
          });
        });
        setName(roleDetails.name);
        setRoleStatus(roleDetails.status);
        setRoleId(roleDetails.id);
        setRolePermissions({ ...newPermission });
      }
      setEntityFeatures(newEntityFeature);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    if (userDetails.entityDetails) {
      getRoleDetails(entityDetails.id);
    }
  }, [userDetails]);

  const handlePermissionChange = (value, feature) => {
    let newAdminPermissions = { ...rolePermissions };
    newAdminPermissions[feature.name] = value;
    setRolePermissions({
      ...newAdminPermissions,
    });
  };

  const UpdateRoleDetails = async (e) => {
    try {
      e.preventDefault();
      setIsApiLoading(true);
      const rolePermissionsIds = [];
      console.log(rolePermissions);
      for (let [key, value] of Object.entries(rolePermissions)) {
        value.forEach((permission) => {
          rolePermissionsIds.push(permission.id);
        });
      }

      const params = {
        roleDetails: {
          name,
          roleId,
          status: roleStatus,
          createdBy: activeUserDetails.id,
        },
        rolePermissionsIds,
      };
      const response = await callApi("CREATE", "UPDATE_ROLE_DETAILS", params);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        history.push("/app/roles");
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error", err);
      setIsApiLoading(false);
    }
  };

  const steps = ["Role Details", "Permissions"];

  const handleNext = (event) => {
    event.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      {name && (
        <Breadcrumb
          breadcrumbElements={[
            { label: "Roles", path: "/app/manageroles" },
            { label: name },
            { label: "Edit" },
          ]}
        />
      )}

      {name ? (
        <Paper elevation={0}>
          {/* <Typography mt={2} className={classes.headerContainer}>
            <span className={classes.headerText}>Edit Role</span>
          </Typography> */}
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel
                  className={
                    activeStep === index
                      ? classes.activeStep
                      : classes.inactiveStep
                  }
                >
                  {step}
                </StepLabel>
                <StepContent>
                  {activeStep === 0 && (
                    <ValidatorForm onSubmit={handleNext}>
                      <Grid container spacing={2}>
                        <Grid item md={7} xs={12}>
                          <TextField
                            fullWidth
                            required
                            disabled
                            size="small"
                            value={name}
                            label="Name"
                          />
                        </Grid>
                        <Grid
                          item
                          md={7}
                          xs={12}
                          className={classes.fieldContainer}
                        >
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
                              value={roleStatus}
                              onChange={(event) => {
                                setRoleStatus(event.target.value);
                              }}
                              label="Select Status"
                              fullWidth
                            >
                              <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                              <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={7} xs={12}>
                          <Box sx={{ mb: 2 }} className={classes.stepperButton}>
                            <Button
                              type="submit"
                              variant="contained"
                              size="small"
                              color="primary"
                              style={{
                                marginRight: "11px",
                              }}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              {index === steps.length - 1
                                ? "Finish"
                                : "Save & Continue"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </ValidatorForm>
                  )}
                  {activeStep === 1 && (
                    <ValidatorForm onSubmit={handleNext}>
                      <Grid container spacing={2}>
                        <Grid item md={7} xs={12}>
                          <Box
                            className={classes.featureBox}
                            onClick={() => {
                              setIsPermissionsOpen(!isPermissionsOpen);
                            }}
                          >
                            Permissions Settings
                            {isPermissionsOpen ? (
                              <ArrowDropUpIcon />
                            ) : (
                              <ArrowDropDownIcon />
                            )}
                          </Box>
                        </Grid>
                        <Grid container spacing={2}>
                          {entityFeatures &&
                            entityFeatures.map(
                              (feature, index) =>
                                isPermissionsOpen && (
                                  <Grid key={index} item md={12} xs={12}>
                                    <span className={classes.permissionBox}>
                                      {feature.label}
                                    </span>
                                    <MultiSelect
                                      options={feature.permissions}
                                      value={
                                        rolePermissions[feature.name]
                                          ? rolePermissions[feature.name]
                                          : []
                                      }
                                      valueRenderer={(selected) => {
                                        if (selected.length === 0) {
                                          return <span>Select</span>;
                                        } else if (selected.length > 3) {
                                          return (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "5px",
                                              }}
                                            >
                                              <Chip label={selected[0].label} />
                                              <Chip label={selected[1].label} />
                                              <Chip label={selected[2].label} />
                                              <Chip
                                                label={`${
                                                  selected.length - 3
                                                }+`}
                                              />
                                            </Box>
                                          );
                                        }
                                        return (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: "5px",
                                            }}
                                          >
                                            {selected.map((value) => (
                                              <Chip
                                                key={value.id}
                                                label={value.label}
                                              />
                                            ))}
                                          </Box>
                                        );
                                      }}
                                      onChange={(value) => {
                                        handlePermissionChange(value, feature);
                                      }}
                                      labelledBy="Select"
                                    />
                                  </Grid>
                                )
                            )}
                        </Grid>
                      </Grid>
                      <Divider variant="middle" style={{ width: "98%" }} />
                      {/* <Box className={classes.formButton}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                type="submit"
                style={{
                  marginRight: "8px",
                }}
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  props.history.push("/app/manageroles");
                }}
                variant="contained"
                color="secondary"
                size="small"
                style={{
                  marginRight: "11px",
                }}
              >
                CANCEL
              </Button>
            </Box> */}
                      <Grid item md={12} xs={12}>
                        <Box sx={{ mb: 2 }} className={classes.stepperButton}>
                          <Button
                            onClick={handleBack}
                            size="small"
                            variant="outlined"
                            style={{
                              marginRight: "8px",
                            }}
                          >
                            Previous
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            color="primary"
                            style={{
                              marginRight: "11px",
                            }}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {/* {">"} */}
                            {index === steps.length - 1
                              ? "Finish"
                              : "Save & Continue"}
                          </Button>
                        </Box>
                      </Grid>
                    </ValidatorForm>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Box component={"div"}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button
                color="inherit"
                disabled={isApiLoading}
                variant="contained"
                size="small"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Box className={classes.formButton}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isApiLoading}
                  style={{
                    marginRight: "8px",
                  }}
                  onClick={UpdateRoleDetails}
                >
                  Update
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
                  onClick={() => {
                    props.history.push("/app/dashboard");
                  }}
                  disabled={isApiLoading}
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{
                    marginRight: "11px",
                  }}
                >
                  CANCEL
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default EditRole;
