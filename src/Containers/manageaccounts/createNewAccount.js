import {
  Box,
  Button,
  Chip,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import useStyle from "../styles";
import callApi from "../../Customutils/callApi";
import { MultiSelect } from "react-multi-select-component";
import Breadcrumb from "../../Components/Breadcrumbs";
import AWS from "aws-sdk";
import Constants from "../../Customutils/Config";
import { v4 } from "uuid";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserDispatch } from "../../Customutils/UserContext";
toast.configure();

const notify = () => toast("Session Expired...!");

const s3 = new AWS.S3({
  region: Constants.AWS.region,
  accessKeyId: Constants.AWS.accessKeyId,
  secretAccessKey: Constants.AWS.secretAccessKey,
});

const steps = [
  { label: "Agency Information" },
  { label: "Agency Location" },
  { label: "Agency Features" },
];

const CreateNewAccount = (props) => {
  const classes = useStyle();
  const [logo, setLogo] = useState({});
  const { dispatch, setUserDetails } = useUserDispatch();
  const [profilePicture, setProfilePicture] = useState({});
  const [entityInfo, setEntityInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [entityFeatures, setEntityFeatures] = useState([]);
  const [adminPermissions, setAdminPermissions] = useState({});
  const [allFeatures, setAllFeatures] = useState([]);
  const [featuresWithoutAudit, setFeaturesWithoutAudit] = useState([]);
  const [basicPermissions, setBasicPermissions] = useState({});
  const [adminPermissionsOpen, setAdminPermissionsOpen] = useState(false);
  const [isBasicPermissionOpen, setIsBasicPermissionOpen] = useState(false);
  const [createAudit, setCreateAudit] = useState(false);
  const [createSurvey, setCreateSurvey] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const countries = Country.getAllCountries();

  const [selectedCountryState, setselectedCountryState] = useState([]);
  const [selectedStateCity, setselectedStateCity] = useState([]);

  const [activeStep, setActiveStep] = useState(0);

  const error = !createAudit && !createSurvey;

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

  const getAllSalesFeatures = async () => {
    try {
      let allFeaturesResponse = await callApi("GETLIST", "GET_SALES_FEATURES");
      if (allFeaturesResponse.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      let allNewFeatures = allFeaturesResponse.data;

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
      setAllFeatures(allNewFeatures);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllSalesFeatures();
  }, []);

  const handleCapture = async (event) => {
    try {
      const imageFile = event.target.files[0];
      setLogo(imageFile);
    } catch (err) {
      console.log("Error in logo upload", err);
    }
  };

  const handleProfileChange = async (event) => {
    try {
      const imageFile = event.target.files[0];
      setProfilePicture(imageFile);
    } catch (err) {
      console.log("Error in Profile upload", err);
    }
  };

  const handleAdminPermissionChange = (value, feature) => {
    let newAdminPermissions = { ...adminPermissions };
    newAdminPermissions[feature.name] = value;
    setAdminPermissions({
      ...newAdminPermissions,
    });
  };

  const handleBasicPermissionChange = (value, feature) => {
    let newBasicPermissions = { ...basicPermissions };
    newBasicPermissions[feature.name] = value;
    setBasicPermissions({
      ...newBasicPermissions,
    });
  };

  const CreateNewEntity = async (e) => {
    try {
      e.preventDefault();
      setIsApiLoading(true);
      const basicPermissionIds = [];
      const entityFeatureIds = [];
      const adminPermissionIds = [];
      let fileName = "";
      let profilePictureName = "";
      if (logo.name) {
        fileName = `${v4()}.png`;
      }

      if (profilePicture.name) {
        profilePictureName = `${v4()}.png`;
      }

      for (let [key, value] of Object.entries(basicPermissions)) {
        console.log("Key", key);
        value.forEach((permission) => {
          basicPermissionIds.push(permission.id);
        });
      }

      for (let [key, value] of Object.entries(adminPermissions)) {
        console.log("Key", key);
        value.forEach((permission) => {
          adminPermissionIds.push(permission.id);
        });
      }

      for (let feature of entityFeatures) {
        entityFeatureIds.push(feature.id);
      }

      const CognitoUserCreateResponse = await callApi(
        "CREATE",
        "CREATE_USER_IN_COGNITO",
        {
          email: userInfo.email,
        }
      );
      if (CognitoUserCreateResponse.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }

      if (CognitoUserCreateResponse.status === 200) {
        const params = {
          entityInfo: { ...entityInfo, logo: fileName },
          userInfo: { ...userInfo, profilePicture: profilePictureName },
          entityFeatures: entityFeatureIds,
          adminPermissions: adminPermissionIds,
          canCreateAudit: createAudit,
          canCreateSurvey: createSurvey,
          basicPermissions: basicPermissionIds,
        };
        const newEntityResponse = await callApi(
          "CREATE",
          "CREATE_NEW_ENTITY",
          params
        );
        if (newEntityResponse.status === 403) {
          setUserDetails({});
          notify();
          dispatch({ type: "TOKEN_EXPIRED" });
        }
        console.log("newEntityResult", newEntityResponse);

        if (newEntityResponse.status === 200) {
          if (!!fileName) {
            await s3
              .upload({
                Bucket: Constants.AWS.bucketName,
                Key: `ua/${newEntityResponse.data.entityId}/${fileName}`,
                Body: logo,
                ContentType: logo.type,
              })
              .promise();
          }
          if (!!profilePictureName) {
            await s3
              .upload({
                Bucket: Constants.AWS.bucketName,
                Key: `ua/${newEntityResponse.data.entityId}/${profilePictureName}`,
                Body: profilePicture,
                ContentType: profilePicture.type,
              })
              .promise();
          }
          props.history.push("/app/dashboard");
        } else {
          throw new Error(newEntityResponse);
        }
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error", err);
      setIsApiLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        breadcrumbElements={[
          { label: "Agency", path: "/app/manageaccounts" },
          { label: "Add" },
        ]}
      />
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
                {step.label}
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
                          value={entityInfo.website ? entityInfo.website : ""}
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
                            entityInfo.footerTitle ? entityInfo.footerTitle : ""
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
                            value={entityInfo.status ? entityInfo.status : ""}
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

                      <Grid item md={7} xs={12}>
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
                                    checked={createAudit}
                                    onChange={(event) => {
                                      setCreateAudit(event.target.checked);
                                    }}
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
                                  required={createAudit && false}
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
                          value={userInfo.firstName ? userInfo.firstName : ""}
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
                          value={userInfo.middleName ? userInfo.middleName : ""}
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
                              entityInfo.countryId ? entityInfo.countryId : ""
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
                            value={entityInfo.stateId ? entityInfo.stateId : ""}
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
                            value={entityInfo.cityId ? entityInfo.cityId : ""}
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
                          value={entityInfo.location ? entityInfo.location : ""}
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
                          value={entityInfo.address ? entityInfo.address : ""}
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
                          value={entityInfo.pincode ? entityInfo.pincode : ""}
                        />
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
                      </Grid>
                    </Grid>
                  </ValidatorForm>
                )}
                {activeStep === 2 && (
                  <ValidatorForm onSubmit={handleNext}>
                    <MultiSelect
                      options={createAudit ? allFeatures : featuresWithoutAudit}
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
                              <Chip key={value.id} label={value.label} />
                            ))}
                          </Box>
                        );
                      }}
                      onChange={setEntityFeatures}
                      labelledBy="Select"
                    />

                    {entityFeatures.length > 0 ? (
                      <>
                        <Box
                          className={classes.featureBox}
                          onClick={() => {
                            setAdminPermissionsOpen(!adminPermissionsOpen);
                          }}
                        >
                          Admin Permissions{" "}
                          {adminPermissionsOpen ? (
                            <ArrowDropUpIcon />
                          ) : (
                            <ArrowDropDownIcon />
                          )}
                        </Box>
                        {adminPermissionsOpen && (
                          <Grid container spacing={2}>
                            {entityFeatures &&
                              entityFeatures.map((feature) => (
                                <Grid key={feature.id} item md={12} xs={12}>
                                  <span className={classes.permissionBox}>
                                    {feature.label}
                                  </span>
                                  <MultiSelect
                                    options={feature.permissions}
                                    value={
                                      adminPermissions[feature.name]
                                        ? adminPermissions[feature.name]
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
                                              label={`${selected.length - 3}+`}
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
                                      handleAdminPermissionChange(
                                        value,
                                        feature
                                      );
                                    }}
                                    labelledBy="Select"
                                  />
                                </Grid>
                              ))}
                          </Grid>
                        )}
                        <Box
                          className={classes.featureBox}
                          onClick={() => {
                            setIsBasicPermissionOpen(!isBasicPermissionOpen);
                          }}
                        >
                          Basic Permissions
                          {isBasicPermissionOpen ? (
                            <ArrowDropUpIcon />
                          ) : (
                            <ArrowDropDownIcon />
                          )}
                        </Box>
                        {isBasicPermissionOpen && (
                          <Grid container spacing={2}>
                            {entityFeatures &&
                              entityFeatures.map((feature) => (
                                <Grid key={feature.id} item md={7} xs={12}>
                                  <span className={classes.permissionBox}>
                                    {feature.label}
                                  </span>
                                  <MultiSelect
                                    options={feature.permissions}
                                    value={
                                      basicPermissions[feature.name]
                                        ? basicPermissions[feature.name]
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
                                              label={`${selected.length - 3}+`}
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
                                      handleBasicPermissionChange(
                                        value,
                                        feature
                                      );
                                    }}
                                    labelledBy="Select"
                                  />
                                </Grid>
                              ))}
                          </Grid>
                        )}
                      </>
                    ) : null}
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
                  </ValidatorForm>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Box component={"div"}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button
              color="inherit"
              variant="contained"
              size="small"
              disabled={isApiLoading}
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
                onClick={CreateNewEntity}
                style={{
                  marginRight: "8px",
                }}
              >
                Create
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
  );
};

export default CreateNewAccount;
