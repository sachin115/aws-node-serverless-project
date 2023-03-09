import { Card, Grid, Paper, Typography } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
// import { useHistory } from "react-router-dom";
// import { useUserState } from "../../Customutils/UserContext";

export const ReviewerDashboardScreen = () => {
  //   const { userDetails } = useUserState();
  //   const history = useHistory();
  //   const { roleDetails } = userDetails;
  return (
    <Paper elevation={0}>
      <Grid container spacing={2}>
        <Grid item md={3} xs={6}>
          <Card
            onClick={() => {
              console.log("Inside Submitted Audits");
            }}
          >
            <Grid container>
              <Grid item md={3} xs={3}>
                <DescriptionIcon
                  color="primary"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Grid>
              <Grid item md={9} xs={9}>
                <Typography>Submitted Audits</Typography>
                <span>status</span>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={3} xs={6}>
          <Card
            onClick={() => {
              console.log("Inside Under Review Audits");
            }}
          >
            <Grid container>
              <Grid item md={3} xs={3}>
                <DescriptionIcon
                  color="primary"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Grid>
              <Grid item md={9} xs={9}>
                <Typography>Under Review Audits</Typography>
                <span>status</span>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};
