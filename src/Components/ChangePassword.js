import { Button, Grid, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import callApi from "../Customutils/callApi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import useStyles from "./Styles";

import "react-toastify/dist/ReactToastify.css";
import { useUserDispatch } from "../Customutils/UserContext";
toast.configure();

const ChangePassword = () => {
  const history = useHistory();
  const classes = useStyles();
  const { dispatch, setUserDetails } = useUserDispatch();
  const [previousPassword, setPreviousPassword] = useState("");
  const [proposedPassword, setProposedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const notify = () => toast("Session Expired...!");
  const notifySuccess = () => toast("Password Changed...!");
  const notifyError = () => toast.error("Unable to change password ...!");

  const ChangePassword = async () => {
    try {
      const AccessToken = cookie.load("DSSAccessToken");
      const payload = {
        AccessToken,
        PreviousPassword: previousPassword,
        ProposedPassword: proposedPassword,
      };
      const response = await callApi("CREATE", "CHANGE_PASSWORD", payload);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      console.log("response", response);
      if (response.status === 200) {
        setUserDetails({});
        notifySuccess();
        history.push("/");
      } else {
        notifyError();
        history.push("/");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== proposedPassword) {
        return false;
      }
      return true;
    });
  }, [proposedPassword]);
  return (
    <Paper className={classes.centerDisplay} elevation={10}>
      <ValidatorForm onSubmit={ChangePassword}>
        <Grid container spacing={2}>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            <h3>Set New Password</h3>
          </Grid>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Enter Old Password"
              type="password"
              size="small"
              value={previousPassword}
              onChange={(event) => {
                setPreviousPassword(event.target.value);
              }}
              validators={["required"]}
              errormessages={["this field is required"]}
            />
          </Grid>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            <TextValidator
              fullWidth
              label="New Password"
              type="password"
              value={proposedPassword}
              size="small"
              onChange={(event) => {
                setProposedPassword(event.target.value);
              }}
              validators={["required"]}
              errormessages={["this field is required"]}
            />
          </Grid>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              size="small"
              validators={["required", "isPasswordMatch"]}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              errorMessages={["this field is required", "password mismatch"]}
            />
          </Grid>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              type="submit"
              size="small"
            >
              Save Password
            </Button>
          </Grid>
        </Grid>
      </ValidatorForm>
    </Paper>
  );
};

export default ChangePassword;
