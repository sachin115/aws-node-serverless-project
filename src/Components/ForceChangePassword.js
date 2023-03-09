import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import PublicRouteHeader from "./PublicRouteHeader";
import cookie from "react-cookies";
import callApi from "../Customutils/callApi";
import { useUserDispatch } from "../Customutils/UserContext";
import { toast } from "react-toastify";
import useStyles from "./Styles";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ForceChangePassword = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  const dispatch = useUserDispatch();
  const classes = useStyles();

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== newPassword) {
        return false;
      }
      return true;
    });
  }, [newPassword]);

  const notify = () => toast("Password Changed...!");
  const SubmitForm = async () => {
    const Session = cookie.load("ForceChangePasswordSession");
    const email = cookie.load("ForceChangePasswordEmail");
    const payload = {
      challangeData: {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session,
      },
      password: newPassword,
      email,
    };
    const response = await callApi("POST", "FORCE_CHANGE_PASSWORD", payload);
    if (response.status === 200) {
      const {
        data: { AuthenticationResult },
      } = response.data;
      const { AccessToken, RefreshToken, IdToken } = AuthenticationResult;
      cookie.remove("ForceChangePasswordSession");
      cookie.remove("ForceChangePasswordEmail");
      cookie.save("DSSIdToken", IdToken);
      cookie.save("DSSAccessToken", AccessToken);
      cookie.save("DSSRefreshToken", RefreshToken);
      notify();
      dispatch({ type: "LOGIN_SUCCESS" });
      history.push("/app/dashboard");
    }
  };
  return (
    <>
      <PublicRouteHeader></PublicRouteHeader>
      <Paper className={classes.centerDisplay} elevation={10}>
        <ValidatorForm onSubmit={SubmitForm}>
          <Grid container spacing={2}>
            <Grid item lg={12} sm={12} md={12} xs={12}>
              <img
                src="https://www.sumasoft.com/wp-content/uploads/2021/02/suma-soft-logo-1-75x40.png"
                alt="Logo"
              />
            </Grid>
            <Grid item lg={12} sm={12} md={12} xs={12}>
              <TextValidator
                fullWidth
                label="New Password"
                type="password"
                size="small"
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
                value={newPassword}
                validators={["required"]}
                errormessages={["this field is required"]}
              />
            </Grid>
            <Grid item lg={12} sm={12} md={12} xs={12}>
              <TextValidator
                fullWidth
                label="Confirm New Password"
                type="password"
                size="small"
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
                value={confirmPassword}
                validators={["required", "isPasswordMatch"]}
                errormessages={["this field is required", "password mismatch"]}
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
    </>
  );
};

export default ForceChangePassword;
