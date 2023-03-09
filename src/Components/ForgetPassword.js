import { Button, Grid, Paper } from "@material-ui/core";
import { useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import callApi from "../Customutils/callApi";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const SubmitMailId = async () => {
    try {
      const response = await callApi("POST", "FORGOT_PASSWORD", {
        userName: email,
      });
      if (response.status === 200) {
        history.push("/confirm-forget-password");
      }
    } catch (err) {
      console.log("Error inside forgot password ", err);
    }
  };

  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper style={{ width: "20%", borderRadius: "10px " }} elevation={10}>
        <ValidatorForm style={{ margin: "7px" }} onSubmit={SubmitMailId}>
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
                required
                label="Username"
                type="email"
                size="small"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
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
                Submit
              </Button>
            </Grid>
          </Grid>
        </ValidatorForm>
      </Paper>
    </div>
  );
};

export default ForgetPassword;
