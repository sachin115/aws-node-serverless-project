import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
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
import { useParams } from "react-router-dom";
import { useUserDispatch } from "../../Customutils/UserContext";

import callApi from "../../Customutils/callApi";
import { FormControl } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { FormLabel } from "@material-ui/core";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Chip } from "@material-ui/core";
import { MultiSelect } from "react-multi-select-component";
import Breadcrumb from "../../Components/Breadcrumbs";
import AWS from "aws-sdk";
import Constants from "../../Customutils/Config";
import { v4 } from "uuid";
import MUIDataTable from "mui-datatables";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import { Country, State, City } from "country-state-city";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const notify = () => toast("Session Expired...!");

const s3 = new AWS.S3({
  region: Constants.AWS.region,
  accessKeyId: Constants.AWS.accessKeyId,
  secretAccessKey: Constants.AWS.secretAccessKey,
});

const steps = [
  "Agency Details",
  "Address Information",
  "Features Setting",
  "Roles",
];

export default function EditAgency(props) {
  const classes = useStyle();
  const params = useParams();
  const agencyId = params.id;
  const [logo, setLogo] = useState({});
  const { dispatch, setUserDetails } = useUserDispatch();
  const [createAudit, setCreateAudit] = useState(false);
  const [createSurvey, setCreateSurvey] = useState(false);
  const [profilePicture, setProfilePicture] = useState({});
  const [allFeatures, setAllFeatures] = useState([]);
  const [entityInfo, setEntityInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [entityFeatures, setEntityFeatures] = useState([]);
  const [roleList, setRoleList] = useState([]);

  const [breadcrumb, setBreadcrumb] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [givePopup, setGivePopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState({});
  const [selectedRoleToDeleteId, setSelectedRoleToDeleteId] = useState("");
  const [rolesAndPermissions, setRolesAndPermissions] = useState([]);
  const countries = Country.getAllCountries();
  const [prevCanCreateAudit, setPrevCanCreateAudit] = useState(false);
  const [featuresWithoutAudit, setFeaturesWithoutAudit] = useState([]);
  const [selectedCountryState, setselectedCountryState] = useState([]);
  const [selectedStateCity, setselectedStateCity] = useState([]);
  const [isAuditAssigned, setIsAuditsAssigned] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const error = !createAudit && !createSurvey;

  const roleColumns = [
    {
      name: "Actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <IconButton
                size="small"
                disabled={
                  tableMeta.rowData[1] === "admin" ||
                  tableMeta.rowData[1] === "basic"
                }
                onClick={() => {
                  handleOpenPopup(tableMeta.rowData[3]);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          );
        },
      },
    },

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
        sort: true,
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

  const handleCountryChange = (event) => {
    setEntityInfo({
      ...entityInfo,
      countryId: event.target.value,
    });
    setUserInfo({
      ...userInfo,
      countryId: event.target.value,
    });
    setselectedCountryState(State.getStatesOfCountry(event.target.value));
  };

  const handleStateChange = (event) => {
    setEntityInfo({
      ...entityInfo,
      stateId: event.target.value,
    });
    setUserInfo({
      ...userInfo,
      stateId: event.target.value,
    });
    setselectedStateCity(
      City.getCitiesOfState(entityInfo.countryId, event.target.value)
    );
    console.log(selectedStateCity);
  };

  const handleCityChange = (event) => {
    setEntityInfo({
      ...entityInfo,
      cityId: event.target.value,
    });
    setUserInfo({
      ...userInfo,
      cityId: event.target.value,
    });
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (activeStep === 0) {
      if (!error) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    setBreadcrumb([
      { label: "Agency", path: "/app/manageaccounts" },
      { label: `${entityInfo.name}` },
      { label: "Edit" },
    ]);
  }, [entityInfo]);

  const getAllRoles = async (agencyId) => {
    try {
      const response = await callApi("GET", "GET_ALL_ENTITY_ROLES", agencyId);
      if (response.status === 403) {
        cookie.remove("DSSIdToken");
        cookie.remove("DSSAccessToken");
        cookie.remove("DSSRefreshToken");
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      console.log("data", response.data);
      if (response.status === 200) {
        setRoleList([...response.data.entityRoles]);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getAgencyDetails = async (agencyId) => {
    try {
      let allNewFeatures = {};
      if (agencyId === Constants.Provision_Entity_Id) {
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

      let auditNotSelected = [];
      allNewFeatures.forEach((feature) => {
        if (!feature.label.includes("AUDIT"))
          auditNotSelected.push({ ...feature });
      });

      setFeaturesWithoutAudit([...auditNotSelected]);
      const response = await callApi(
        "GET",
        "GET_ENTITY_DETAILS_BY_ID",
        agencyId
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }

      const { adminDetails, entityDetails } = response.data;

      setselectedCountryState(
        State.getStatesOfCountry(entityDetails.countryId)
      );
      setselectedStateCity(
        City.getCitiesOfState(entityDetails.countryId, entityDetails.stateId)
      );

      const entityFeaturesFromDataBase = response.data.entityFeatures;
      let { rolesAndPermissions } = response.data;

      setEntityInfo(entityDetails);
      setUserInfo(adminDetails);

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
      const newSelectedRole = [];
      rolesAndPermissions.forEach((role) => {
        let updatedPermissions = {};
        newSelectedRole.push(false);

        allNewFeatures.forEach((feature) => {
          role.permissions.forEach((permission) => {
            permission = {
              ...permission,
              label: permission.name.replaceAll("_", " "),
              value: permission.id,
            };
            let isPermission = feature.permissions.find(
              (featurePermission) => featurePermission.id === permission.id
            );
            if (!!isPermission) {
              if (!!updatedPermissions[feature.name]) {
                updatedPermissions[feature.name].push(permission);
              } else {
                updatedPermissions[feature.name] = [permission];
              }
            }
          });
        });
        role.permissions = { ...updatedPermissions };
      });

      setIsAuditsAssigned(response.data.isAuditsAssigned);
      setAllFeatures(allNewFeatures);
      setCreateAudit(entityDetails.canCreateAudit);
      setPrevCanCreateAudit(entityDetails.canCreateAudit);
      setEntityFeatures(newEntityFeature);
      setRolesAndPermissions([...rolesAndPermissions]);
      setSelectedRole([...newSelectedRole]);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleProfileChange = async (event) => {
    console.log("eve", event);
    try {
      const imageFile = event.target.files[0];
      console.log("image", imageFile);
      setProfilePicture(imageFile);
    } catch (err) {
      console.log("Error in Profile upload", err);
    }
  };

  const handleCapture = async (event) => {
    try {
      const imageFile = event.target.files[0];
      setLogo(imageFile);
    } catch (err) {
      console.log("Error in logo upload", err);
    }
  };

  const handlePermissionChange = (value, feature, roleId) => {
    const updateRoleAndPermissions = [...rolesAndPermissions];
    const currentRoleIndex = rolesAndPermissions.findIndex(
      (ele) => ele.id === roleId
    );
    const role = rolesAndPermissions[currentRoleIndex];

    let newPermissions = { ...role.permissions };
    newPermissions[feature.name] = value;
    updateRoleAndPermissions[currentRoleIndex] = {
      ...role,
      permissions: { ...newPermissions },
    };
    setRolesAndPermissions([...updateRoleAndPermissions]);
  };

  const handleClosePopup = () => {
    setGivePopup(false);
  };

  const handleOpenPopup = (id) => {
    setGivePopup(true);
    setSelectedRoleToDeleteId(id);
  };

  const TogglePermissions = (index) => {
    const newSelectedRole = [...selectedRole];
    newSelectedRole[index] = !newSelectedRole[index];
    setSelectedRole([...newSelectedRole]);
  };

  const CanCreateAuditChanges = (event) => {
    if (!event.target.checked) {
      console.log("EntityFeatures", entityFeatures);
      let newEntityFeatures = [];
      entityFeatures.forEach((feature) => {
        if (!feature.label.includes("AUDIT")) {
          newEntityFeatures.push({ ...feature });
        }
      });

      let newRolesAndPermissions = [];
      rolesAndPermissions.forEach((role, roleIndex) => {
        newRolesAndPermissions.push({ ...role, permissions: {} });
        for (let [key, value] of Object.entries(role.permissions)) {
          console.log("Key", key);
          if (!key.replaceAll("_", " ").includes("AUDIT")) {
            newRolesAndPermissions[roleIndex].permissions[key] = value;
          }
        }
      });
      setEntityFeatures([...newEntityFeatures]);
      setRolesAndPermissions([...newRolesAndPermissions]);
      console.log("RolesAndPermissions", rolesAndPermissions);
    }
    setCreateAudit(event.target.checked);
  };

  const ConfirmDelete = async () => {
    try {
      const ConfirmDelete = await callApi(
        "DELETE",
        "DISABLE_ENTITY_ROLE",
        selectedRoleToDeleteId
      );
      if (ConfirmDelete.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }

      console.log("Confirm Delete ", ConfirmDelete);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getAgencyDetails(agencyId);
    getAllRoles(agencyId);
  }, []);

  const updateDetails = async (e) => {
    try {
      e.preventDefault();
      setIsApiLoading(true);

      const entityFeatureIds = [];
      const rolePermissionIds = {};

      let logolocation = "";
      let profileLocation = "";

      if (logo.name) {
        let fileName = "";
        if (entityInfo.logo) {
          fileName = entityInfo.logo;
        } else {
          fileName = `${v4()}`;
        }

        const uploadResult = await s3
          .upload({
            Bucket: Constants.AWS.bucketName,
            Key: `ua/${agencyId}/${fileName}`,
            Body: logo,
            ContentType: logo.type,
          })
          .promise();
        console.log("Upload Result ", uploadResult);
        logolocation = fileName;
      }

      if (profilePicture.name) {
        let profilePictureName = "";
        if (userInfo.profilePicture) {
          profilePictureName = `${userInfo.profilePicture}`;
        } else {
          profilePictureName = `${v4()}`;
        }

        await s3
          .upload({
            Bucket: Constants.AWS.bucketName,
            Key: `ua/${agencyId}/${profilePictureName}`,
            Body: profilePicture,
            ContentType: profilePicture.type,
          })
          .promise();
        profileLocation = profilePictureName;
      }

      for (let role of rolesAndPermissions) {
        rolePermissionIds[role.id] = [];
        for (let [key, value] of Object.entries(role.permissions)) {
          console.log("value", value);
          value.forEach((permission) => {
            rolePermissionIds[role.id].push(permission.id);
          });
        }
      }

      for (let feature of entityFeatures) {
        entityFeatureIds.push(feature.id);
      }
      console.log("logo", logolocation);
      console.log("profile", profileLocation);
      const params = {
        entityInfo: logolocation
          ? { ...entityInfo, logo: logolocation }
          : { ...entityInfo },
        userInfo: profileLocation
          ? {
              ...userInfo,
              profilePicture: profileLocation,
            }
          : { ...userInfo },
        canCreateAudit: createAudit,
        prevCanCreateAudit,
        canCreateSurvey: createSurvey,
        entityFeatures: entityFeatureIds,
        rolePermissions: rolePermissionIds,
      };
      console.log("Params ", params);
      const response = await callApi("CREATE", "UPDATE_ENTITY_DETAILS", params);

      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        props.history.push("/app/manageaccounts");
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error", err);
      setIsApiLoading(false);
    }
  };

  return (
    <>
      {entityInfo.name ? (
        <>
          <Dialog
            open={givePopup}
            onClose={handleClosePopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Role Disable Warning!"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                All the users of this role will be disabled too !<br />
                Are you sure ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary">
                Cancel
              </Button>
            </DialogActions>
            <DialogActions>
              <Button onClick={ConfirmDelete} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Breadcrumb breadcrumbElements={breadcrumb} />
          <Paper elevation={0}>
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
                        <Typography className={classes.sectionHeading}>
                          Agency Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Agency Name"
                              value={entityInfo.name ? entityInfo.name : ""}
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  name: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Phone Number"
                              type="number"
                              value={
                                entityInfo.contactNumber
                                  ? entityInfo.contactNumber
                                  : ""
                              }
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  contactNumber: event.target.value,
                                });
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Business Email"
                              type="email"
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  contactEmail: event.target.value,
                                });
                              }}
                              value={
                                entityInfo.contactEmail
                                  ? entityInfo.contactEmail
                                  : ""
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label="Website"
                              value={
                                entityInfo.website ? entityInfo.website : ""
                              }
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  website: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Fax Number"
                              type="number"
                              value={
                                entityInfo.faxNumber ? entityInfo.faxNumber : ""
                              }
                              onChange={(event) => {
                                if (event.target.value < 999999) {
                                  setEntityInfo({
                                    ...entityInfo,
                                    faxNumber: event.target.value,
                                  });
                                }
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Footer Title "
                              value={
                                entityInfo.footerTitle
                                  ? entityInfo.footerTitle
                                  : ""
                              }
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  footerTitle: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Status</InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                value={
                                  entityInfo.status ? entityInfo.status : ""
                                }
                                onChange={(event) => {
                                  setEntityInfo({
                                    ...entityInfo,
                                    status: event.target.value,
                                  });
                                }}
                                label="Status"
                                fullWidth
                              >
                                <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                                <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            md={7}
                            xs={12}
                            style={{ marginBottom: "15px" }}
                          >
                            <input
                              accept="image/*"
                              type="file"
                              id="select-image"
                              onChange={handleCapture}
                              style={{ display: "none" }}
                            />
                            <FormLabel htmlFor="select-image">
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                component="span"
                              >
                                Upload Logo
                              </Button>
                            </FormLabel>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <Grid container>
                              <Grid
                                item
                                md={6}
                                xs={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <FormControl
                                  required
                                  error={error}
                                  component="fieldset"
                                  sx={{ m: 3 }}
                                  variant="standard"
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={isAuditAssigned}
                                        checked={createAudit}
                                        onChange={CanCreateAuditChanges}
                                        name="gilad"
                                        color="primary"
                                      />
                                    }
                                    label="Agency can create audit"
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                xs={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={createSurvey}
                                      onChange={(event) => {
                                        setCreateSurvey(event.target.checked);
                                      }}
                                      name="gilad"
                                      color="primary"
                                    />
                                  }
                                  label="Agency can create survey"
                                />
                              </Grid>
                              <Grid
                                item
                                md={6}
                                xs={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <FormHelperText error={error}>
                                  {"Atleast one must be selected !"}
                                </FormHelperText>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider />
                        <Typography className={classes.sectionHeading}>
                          Agency Primary Contact
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="First Name"
                              value={
                                userInfo.firstName ? userInfo.firstName : ""
                              }
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  firstName: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Middle Name"
                              required
                              value={
                                userInfo.middleName ? userInfo.middleName : ""
                              }
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  middleName: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Last Name"
                              required
                              value={userInfo.lastName ? userInfo.lastName : ""}
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  lastName: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Phone Number"
                              type="number"
                              value={userInfo.mobile ? userInfo.mobile : ""}
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  mobile: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Email"
                              type="email"
                              value={userInfo.email ? userInfo.email : ""}
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  email: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small">
                              <InputLabel>Status</InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                value={userInfo.status ? userInfo.status : ""}
                                onChange={(event) => {
                                  setUserInfo({
                                    ...userInfo,
                                    status: event.target.value,
                                  });
                                }}
                                label="Fax Number"
                                fullWidth
                              >
                                <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                                <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <input
                              accept="image/*"
                              type="file"
                              id="select-profile"
                              onChange={handleProfileChange}
                              style={{ display: "none" }}
                            />
                            <FormLabel htmlFor="select-profile">
                              <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                component="span"
                              >
                                Upload Profile
                              </Button>
                            </FormLabel>
                            <Box
                              sx={{ mb: 2 }}
                              className={classes.stepperButton}
                            >
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
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small">
                              <InputLabel>Select Country</InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                value={
                                  entityInfo.countryId
                                    ? entityInfo.countryId
                                    : ""
                                }
                                labelId="country"
                                id="country"
                                label="Country"
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                onChange={handleCountryChange}
                                fullWidth
                              >
                                {countries.map((p) => (
                                  <MenuItem key={p.name} value={p.isoCode}>
                                    {p.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small">
                              <InputLabel>Select State</InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                labelId="state"
                                id="state"
                                value={
                                  entityInfo.stateId ? entityInfo.stateId : ""
                                }
                                label="State"
                                onChange={handleStateChange}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                fullWidth
                              >
                                {selectedCountryState.map((p) => (
                                  <MenuItem key={p.name} value={p.isoCode}>
                                    {p.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small">
                              <InputLabel>
                                <span>Select City</span>
                              </InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                labelId="city"
                                id="city"
                                value={
                                  entityInfo.cityId ? entityInfo.cityId : ""
                                }
                                label="city"
                                onChange={handleCityChange}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                              >
                                {selectedStateCity.map((p) => (
                                  <MenuItem key={p.name} value={p.name}>
                                    {p.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              required
                              fullWidth
                              size="small"
                              label="Location"
                              value={
                                entityInfo.location ? entityInfo.location : ""
                              }
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  location: event.target.value,
                                });
                                setUserInfo({
                                  ...userInfo,
                                  location: event.target.value,
                                });
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small">
                              <InputLabel>Location Type</InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                label="Location Type"
                                fullWidth
                                value={
                                  entityInfo.locationType
                                    ? entityInfo.locationType
                                    : ""
                                }
                                onChange={(event) => {
                                  setEntityInfo({
                                    ...entityInfo,
                                    locationType: event.target.value,
                                  });
                                  setUserInfo({
                                    ...userInfo,
                                    locationType: event.target.value,
                                  });
                                }}
                              >
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="business">Business</MenuItem>
                                <MenuItem value="mailing">Mailing</MenuItem>
                                <MenuItem value="office">Office</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              required
                              fullWidth
                              size="small"
                              label="Address"
                              value={
                                entityInfo.address ? entityInfo.address : ""
                              }
                              onChange={(event) => {
                                setEntityInfo({
                                  ...entityInfo,
                                  address: event.target.value,
                                });
                                setUserInfo({
                                  ...userInfo,
                                  address: event.target.value,
                                });
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Zip"
                              onChange={(event) => {
                                if (event.target.value < 999999) {
                                  setUserInfo({
                                    ...userInfo,
                                    pincode: event.target.value,
                                  });
                                  setEntityInfo({
                                    ...entityInfo,
                                    pincode: event.target.value,
                                  });
                                }
                              }}
                              value={
                                entityInfo.pincode ? entityInfo.pincode : ""
                              }
                            />
                            <Box
                              sx={{ mb: 2 }}
                              className={classes.stepperButton}
                            >
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
                                {index === steps.length - 1
                                  ? "Finish"
                                  : "Save & Continue"}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </ValidatorForm>
                    )}
                    {activeStep === 2 && (
                      <ValidatorForm onSubmit={handleNext}>
                        <MultiSelect
                          options={
                            createAudit ? allFeatures : featuresWithoutAudit
                          }
                          value={entityFeatures}
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
                                  <Chip label={`${selected.length - 3}+`} />
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
                                  <Chip key={value.id} label={value.name} />
                                ))}
                              </Box>
                            );
                          }}
                          onChange={setEntityFeatures}
                          labelledBy="Select"
                        />

                        {entityFeatures.length > 0
                          ? rolesAndPermissions.map((role, index) => {
                              return (
                                <>
                                  <Box
                                    key={index}
                                    className={classes.featureBox}
                                    onClick={() => {
                                      TogglePermissions(index);
                                    }}
                                  >
                                    {`${role.name} permissions`}
                                    <ArrowDropDownIcon />
                                  </Box>
                                  {selectedRole[index] && (
                                    <Grid container spacing={2}>
                                      {entityFeatures &&
                                        entityFeatures.map((feature, index) => (
                                          <Grid
                                            key={index}
                                            item
                                            md={12}
                                            xs={12}
                                          >
                                            <span
                                              className={classes.permissionBox}
                                            >
                                              {feature.label}
                                            </span>
                                            <MultiSelect
                                              options={feature.permissions}
                                              value={
                                                role.permissions[feature.name]
                                                  ? role.permissions[
                                                      feature.name
                                                    ]
                                                  : []
                                              }
                                              valueRenderer={(selected) => {
                                                if (selected.length === 0) {
                                                  return <span>Select</span>;
                                                } else if (
                                                  selected.length > 3
                                                ) {
                                                  return (
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "5px",
                                                      }}
                                                    >
                                                      <Chip
                                                        label={
                                                          selected[0].label
                                                        }
                                                      />
                                                      <Chip
                                                        label={
                                                          selected[1].label
                                                        }
                                                      />
                                                      <Chip
                                                        label={
                                                          selected[2].label
                                                        }
                                                      />
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
                                                    {selected.map(
                                                      (value, index) => (
                                                        <Chip
                                                          key={index}
                                                          label={value.label}
                                                        />
                                                      )
                                                    )}
                                                  </Box>
                                                );
                                              }}
                                              onChange={(value) => {
                                                handlePermissionChange(
                                                  value,
                                                  feature,
                                                  role.id
                                                );
                                              }}
                                              labelledBy="Select"
                                            />
                                          </Grid>
                                        ))}
                                    </Grid>
                                  )}
                                </>
                              );
                            })
                          : null}
                        <Box sx={{ mb: 2 }} className={classes.formButton}>
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
                            {index === steps.length - 1
                              ? "Finish"
                              : "Save & Continue"}
                          </Button>
                        </Box>
                      </ValidatorForm>
                    )}
                    {activeStep === 3 && (
                      <ValidatorForm onSubmit={handleNext}>
                        <>
                          <MUIDataTable
                            data={roleList}
                            columns={roleColumns}
                            options={{
                              elevation: 0,
                              download: false,
                              print: false,
                              selectableRows: false,
                              filter: false,
                              viewColumns: false,
                              rowsPerPage: 5,
                              rowsPerPageOptions: [5, 10, 15],
                              jumpToPage: true,
                              textLabels: {
                                pagination: {
                                  next: "Next >",
                                  previous: "< Previous",
                                  rowsPerPage: "Total items Per Page",
                                  displayRows: "OF",
                                },
                              },
                            }}
                          />
                        </>
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
                            {index === steps.length - 1
                              ? "Finish"
                              : "Save & Continue"}
                          </Button>
                        </Box>
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
                  varient="contained"
                  disabled={isApiLoading}
                  size="small"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Box className={classes.formButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isApiLoading}
                    size="small"
                    onClick={updateDetails}
                    style={{
                      marginRight: "8px",
                    }}
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
                      props.history.push("/app/manageaccounts");
                    }}
                    variant="contained"
                    disabled={isApiLoading}
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
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
