import {
  Box,
  Button,
  CircularProgress,
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
import { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumbs";
import useStyle from "../styles";
import { useUserDispatch } from "../../Customutils/UserContext";
import { ValidatorForm } from "react-material-ui-form-validator";
import callApi from "../../Customutils/callApi";
import { useParams } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const notify = () => toast("Session Expired...!");

const steps = ["User Details", "Address Information", "Role and Status"];

const CreateAgencyUser = (props) => {
  const classes = useStyle();
  const { dispatch, setUserDetails } = useUserDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [userStatus, setUserStatus] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [entityInfo, setEntityInfo] = useState({});
  const [selectedCountryState, setselectedCountryState] = useState([]);
  const [selectedStateCity, setselectedStateCity] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  // const { userDetails } = useUserState();
  const countries = Country.getAllCountries();
  const [role, setRole] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const { id } = useParams();

  const handleCountryChange = (event) => {
    setUserInfo({
      ...userInfo,
      countryId: event.target.value,
    });
    setselectedCountryState(State.getStatesOfCountry(event.target.value));
  };

  const handleStateChange = (event) => {
    setUserInfo({
      ...userInfo,
      stateId: event.target.value,
    });
    setselectedStateCity(
      City.getCitiesOfState(userInfo.countryId, event.target.value)
    );
  };

  const handleCityChange = (event) => {
    setUserInfo({
      ...userInfo,
      cityId: event.target.value,
    });
  };

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

  const getRoles = async () => {
    const response = await callApi("GET", "GET_ENTITY_ROLES", id);
    if (response.status === 403) {
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
      setUserDetails({});
    }
    if (response.status === 200) {
      setRolesList([...response.data]);
    }
  };

  const getAgencyDetails = async (agencyId) => {
    try {
      const response = await callApi("GET", "GET_ENTITY_DETAILS_BY_ID", id);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      console.log("Response");
      if (response.status === 200) {
        const { entityDetails } = response.data;
        setEntityInfo(entityDetails);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getRoles();
    getAgencyDetails();
  }, []);
  useEffect(() => {
    if (entityInfo.name && entityInfo.id) {
      setBreadcrumb([
        { label: "Agency", path: "/app/manageaccounts" },
        {
          label: `${entityInfo.name}`,
          path: `/app/manageaccounts/${entityInfo.id}/users`,
        },
        {
          label: "Add Agency User",
        },
      ]);
    }
  }, [entityInfo]);

  const createUser = async (event) => {
    try {
      event.preventDefault();
      setIsApiLoading(true);
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
        const userCreateResponse = await callApi(
          "CREATE",
          "CREATE_USER_BY_ENTITY",
          {
            userInfo,
            roleId: role,
            entityId: id,
          }
        );
        if (userCreateResponse.status === 403) {
          setUserDetails({});
          notify();
          dispatch({ type: "TOKEN_EXPIRED" });
        }
        if (userCreateResponse.status === 200) {
          props.history.push("/app/dashboard");
        } else {
          throw new Error(userCreateResponse);
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
      {entityInfo.name ? (
        <>
          <Breadcrumb breadcrumbElements={breadcrumb} />
          <Paper elevation={0}>
            <Typography mt={2} className={classes.headerContainer}>
              <span className={classes.headerText}>Create User</span>
            </Typography>
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
                              label="Middle Name"
                              value={userInfo.middleName}
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  middleName: event.target.value,
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
                              label="Last Name"
                              value={userInfo.lastName ? userInfo.lastName : ""}
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  lastName: event.target.value,
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
                              label="Email"
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
                            <TextField
                              fullWidth
                              required
                              size="small"
                              type="number"
                              label="Phone Number"
                              value={userInfo.mobile ? userInfo.mobile : ""}
                              onChange={(event) => {
                                setUserInfo({
                                  ...userInfo,
                                  mobile: event.target.value,
                                });
                              }}
                            />
                            <Box sx={{ mb: 2 }} className={classes.formButton}>
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
                                  userInfo.countryId ? userInfo.countryId : ""
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
                                value={userInfo.stateId ? userInfo.stateId : ""}
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
                                value={userInfo.cityId ? userInfo.cityId : ""}
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
                              value={userInfo.location ? userInfo.location : ""}
                              onChange={(event) => {
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
                                  userInfo.locationType
                                    ? userInfo.locationType
                                    : ""
                                }
                                onChange={(event) => {
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
                              value={userInfo.address ? userInfo.address : ""}
                              onChange={(event) => {
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
                                }
                              }}
                              value={userInfo.pincode ? userInfo.pincode : ""}
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
                        <Grid container spacing={2}>
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
                                value={userStatus}
                                onChange={(event) => {
                                  setUserStatus(event.target.value);
                                  setUserInfo({
                                    ...userInfo,
                                    status: event.target.value,
                                  });
                                }}
                                label="Select Status"
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
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small" required>
                              <InputLabel>Role</InputLabel>
                              <Select
                                required
                                className={classes.selectClass}
                                value={role}
                                onChange={(event) => {
                                  setRole(event.target.value);
                                }}
                                label="Select Role"
                                fullWidth
                              >
                                {rolesList.map((ele) => (
                                  <MenuItem value={ele.id}>{ele.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Box sx={{ mb: 2 }} className={classes.formButton}>
                              <Button
                                onClick={handleBack}
                                color="inherit"
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
                  variant="contained"
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
                    size="small"
                    disabled={isApiLoading}
                    onClick={createUser}
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
                      props.history.push("/app/manageusers");
                    }}
                    variant="contained"
                    color="secondary"
                    disabled={isApiLoading}
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
};

export default CreateAgencyUser;
