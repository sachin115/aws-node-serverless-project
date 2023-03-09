import {
  Box,
  Button,
  Grid,
  Paper,
  Link,
  CircularProgress,
} from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { TextValidator } from "react-material-ui-form-validator";

import ApiConfig from "../Customutils/ApiConfig";
import axios from "axios";
import { Switch, Route } from "react-router-dom";
import { useState } from "react";
import { useUserDispatch } from "../Customutils/UserContext";
import cookie from "react-cookies";
import ForgetPassword from "./ForgetPassword";
import useStyles from "./Styles";
import ConfirmForgetPassword from "./ConfirmForgotPassword";
import { toast } from "react-toastify";
toast.configure();

const Login = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={LoginComponent} />
      <Route exact path="/forgot-password" component={ForgetPassword} />
      <Route
        exact
        path="/confirm-forget-password"
        component={ConfirmForgetPassword}
      />
    </Switch>
  );
};
const LoginComponent = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useUserDispatch();
  const classes = useStyles();
  const notifyStatus = () => toast("User Is Not Active!");

  async function onSubmit() {
    try {
      setIsLoading(true);
      const getUserDetailsBeforeLogin = await axios({
        method: "post",
        url: ApiConfig.GET_USERDETAILS_BEFORE_LOGIN,
        data: {
          email,
        },
      });
      console.log("Get users details before login", getUserDetailsBeforeLogin);
      if (
        getUserDetailsBeforeLogin.status === 200 &&
        getUserDetailsBeforeLogin.data.success === 1
      ) {
        const { userStatus } = getUserDetailsBeforeLogin.data.response;
        if (userStatus === "ACTIVE") {
          const response = await axios({
            method: "post",
            url: ApiConfig.Login,
            data: {
              email,
              password,
            },
          });

          var { signInDetails } = response.data;

          if (signInDetails.ChallengeName === "NEW_PASSWORD_REQUIRED") {
            cookie.save("ForceChangePasswordSession", signInDetails.Session);
            cookie.save("ForceChangePasswordEmail", email);
            props.history.push("/force-change-password");
          } else {
            let { IdToken, AccessToken, RefreshToken } =
              signInDetails.AuthenticationResult;
            cookie.save("DSSIdToken", IdToken);
            cookie.save("DSSAccessToken", AccessToken);
            cookie.save("DSSRefreshToken", RefreshToken);
            dispatch({ type: "LOGIN_SUCCESS" });
          }
        } else {
          notifyStatus();
        }
      }
      setIsLoading(false);
    } catch (err) {
      toast(err.response.data.message);
      setIsLoading(false);
      dispatch({ type: "LOGIN_FAILURE" });
    }
  }

  return (
    <Paper className={classes.centerDisplay} elevation={10}>
      <ValidatorForm onSubmit={onSubmit}>
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
              label="Username"
              type="email"
              size="small"
              disabled={isLoading}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            <TextValidator
              fullWidth
              label="Password"
              type="password"
              disabled={isLoading}
              size="small"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </Grid>

          <Grid item lg={12} sm={12} md={12} xs={12}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              style={{
                position: "relative",
              }}
              disabled={isLoading}
              type="submit"
              size="small"
            >
              LOGIN
              {isLoading && (
                <CircularProgress className={classes.circularProgress} />
              )}
            </Button>
          </Grid>
          <Grid item lg={12} sm={12} md={12} xs={12}>
            {!isLoading && (
              <Link
                onClick={() => {
                  props.history.push("/forgot-password");
                }}
              >
                Forgot Password ?
              </Link>
            )}
          </Grid>
        </Grid>
      </ValidatorForm>
    </Paper>
  );
};
export default Login;
