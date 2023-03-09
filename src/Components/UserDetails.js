import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
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
import React, { useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import useStyle from "./Styles";
import { useUserState, useUserDispatch } from "../Customutils/UserContext";
import callApi from "../Customutils/callApi";
import { Circles } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "./Breadcrumbs";
import AWS from "aws-sdk";
import Constants from "../Customutils/Config";
import { v4 } from "uuid";

const s3 = new AWS.S3({
  region: Constants.AWS.region,
  accessKeyId: Constants.AWS.accessKeyId,
  secretAccessKey: Constants.AWS.secretAccessKey,
});
toast.configure();

const AccountDetails = (props) => {
  const classes = useStyle();
  let { userDetails, states, cities } = useUserState();
  let { activeUserDetails, entityDetails } = userDetails;

  const agencyId = entityDetails.id;

  const [stateId, setStateId] = useState(activeUserDetails.stateId);
  const [profilePicture, setProfilePicture] = useState({});
  const [cityId, setCityId] = useState(activeUserDetails.cityId);
  const [pincode, setPincode] = useState(activeUserDetails.pincode);
  const [firstName, setFirstName] = useState(activeUserDetails.firstName);
  const [middleName, setMiddleName] = useState(activeUserDetails.middleName);
  const [lastName, setLastName] = useState(activeUserDetails.lastName);
  const [mobile, setMobile] = useState(activeUserDetails.mobile);
  const [address, setAddress] = useState(activeUserDetails.address);
  const [email, setEmail] = useState(activeUserDetails.email);
  const [activeStep, setActiveStep] = useState(0);
  const { dispatch, setUserDetails } = useUserDispatch();

  const notify = () => toast("Session Expired...!");
  const notifySuccess = () => toast("Profile Updated...!");
  const notifyError = () => toast.error("Unable to update Profile ...!");

  const handleProfileChange = async (event) => {
    try {
      const imageFile = event.target.files[0];
      setProfilePicture(imageFile);
    } catch (err) {
      console.log("Error in Profile upload", err);
    }
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    let profileLocation = activeUserDetails.profilePicture;
    if (profilePicture.name) {
      // const profileSplitName = profilePicture.name.split(".");
      // const profileExtention = profileSplitName[profileSplitName.length - 1];
      let profilePictureName = "";
      if (activeUserDetails.profilePicture) {
        // const extensionStart =
        //   activeUserDetails.profilePicture.lastIndexOf(".");
        // let proPicName = activeUserDetails.profilePicture.slice(
        //   0,
        //   extensionStart
        // );
        // profilePictureName = `${proPicName}.${profileExtention}`;
        profilePictureName = `${activeUserDetails.profilePicture}`;
      } else {
        profilePictureName = `${v4()}.png`;
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
    const params = {
      firstName: firstName ? firstName : activeUserDetails.firstName,
      middleName: middleName ? middleName : activeUserDetails.middleName,
      lastName: lastName ? lastName : activeUserDetails.lastName,
      address: address ? address : activeUserDetails.address,
      pincode: pincode ? pincode : activeUserDetails.pincode,
      cityId: cityId ? cityId : activeUserDetails.cityId,
      stateId: stateId ? stateId : activeUserDetails.stateId,
      mobile: mobile ? mobile : activeUserDetails.mobile,
      email: activeUserDetails ? activeUserDetails.email : "",
      id: activeUserDetails ? activeUserDetails.id : "",
      profilePicture: profileLocation,
    };

    const response = await callApi("CREATE", "UPDATE_USER_DETAILS", params);
    if (response.status === 403) {
      setUserDetails({});
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
    }
    if (response.status === 200) {
      notifySuccess();
      props.history.push("/");
      window.location.reload();
    } else {
      notifyError();
      props.history.push("/");
      window.location.reload();
    }
  };

  const steps = [{ label: "User Details" }, { label: "address information" }];

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
      <Breadcrumb />
      {activeUserDetails ? (
        <Paper>
          {/* <Typography mt={2} className={classes.headerContainer}>
              <span className={classes.headerText}>User Details</span>
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
                  {step.label}
                </StepLabel>

                <StepContent>
                  {activeStep === 0 && (
                    <ValidatorForm onSubmit={handleNext}>
                      <Grid container spacing={2}>
                        <Grid item md={7} xs={12}>
                          <TextField
                            required
                            fullWidth
                            onChange={(event) => {
                              setFirstName(event.target.value);
                            }}
                            value={firstName}
                            size="small"
                            label="First Name"
                          />
                        </Grid>
                        <Grid item md={7} xs={12}>
                          <TextField
                            fullWidth
                            required
                            size="small"
                            label="Middle Name"
                            onChange={(event) => {
                              setMiddleName(event.target.value);
                            }}
                            value={middleName}
                          />
                        </Grid>
                        <Grid item md={7} xs={12}>
                          <TextField
                            required
                            fullWidth
                            size="small"
                            label="Last Name"
                            onChange={(event) => {
                              setLastName(event.target.value);
                            }}
                            value={lastName}
                          />
                        </Grid>
                        <Grid item md={7} xs={12}>
                          <TextField
                            required
                            fullWidth
                            size="small"
                            label="Email"
                            type="email"
                            validators={["required"]}
                            errormessages={["this field is required"]}
                            onChange={(event) => {
                              setEmail(event.target.value);
                            }}
                            value={email}
                            disabled
                          />
                        </Grid>
                        <Grid item md={7} xs={12}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            size="small"
                            onChange={(event) => {
                              setMobile(event.target.value);
                            }}
                            value={mobile}
                            label="Mobile"
                          />
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
                            onChange={handleProfileChange}
                            style={{ display: "none" }}
                          />
                          <FormLabel htmlFor="select-image">
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              component="span"
                            >
                              Upload Profile
                            </Button>
                          </FormLabel>
                          <Box className={classes.stepperButton}>
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
                          <TextField
                            fullWidth
                            size="small"
                            required
                            label="Address"
                            onChange={(event) => {
                              setAddress(event.target.value);
                            }}
                            value={address}
                          />
                        </Grid>
                        <Grid
                          item
                          md={7}
                          xs={12}
                          className={classes.fieldContainer}
                        >
                          <FormControl fullWidth size="small">
                            <InputLabel>Select City</InputLabel>
                            <Select
                              value={activeUserDetails.cityId}
                              className={classes.selectClass}
                              MenuProps={{
                                PaperProps: {
                                  style: { marginTop: 45 },
                                },
                              }}
                              onChange={(event) => {
                                setCityId(event.target.value);
                              }}
                              label="Select Entity"
                              fullWidth
                            >
                              {cities &&
                                cities.map((city) => (
                                  <MenuItem value={city.id} key={city.name}>
                                    {city.name}
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
                          <FormControl required fullWidth size="small">
                            <InputLabel>
                              <span>Select State </span>
                            </InputLabel>
                            <Select
                              labelId="select-state-label"
                              className={classes.selectClass}
                              MenuProps={{
                                PaperProps: {
                                  style: { marginTop: 45 },
                                },
                              }}
                              value={activeUserDetails.stateId}
                              onChange={(event) => {
                                setStateId(event.target.value);
                              }}
                              fullWidth
                              label="Select Entity"
                              anchororigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                            >
                              {states &&
                                states.map((state) => (
                                  <MenuItem value={state.id} key={state.name}>
                                    {state.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={7} xs={12}>
                          <TextField
                            required
                            fullWidth
                            value={pincode}
                            onChange={(event) => {
                              setPincode(event.target.value);
                            }}
                            size="small"
                            label="Pincode"
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
                  onClick={SubmitData}
                  style={{
                    marginRight: "8px",
                  }}
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    props.history.push("/app/user/changePassword");
                  }}
                  style={{
                    marginRight: "11px",
                  }}
                >
                  Change Password
                </Button>
                <Button
                  onClick={() => {
                    props.history.push("/");
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
              </Box>
            </Box>
          )}
          <Divider variant="middle" style={{ width: "98%" }} />
        </Paper>
      ) : (
        <Circles color="#00BFFF" height={80} width={80} />
      )}
    </>
  );
};

export default AccountDetails;
