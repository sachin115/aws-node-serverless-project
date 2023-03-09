import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import useStyles from "./Styles";
import Footer from "./Footer";

import NotFound from "./404NotFound";
import { Box, CircularProgress } from "@material-ui/core";
import { useUserState } from "../Customutils/UserContext";
import { RotatingSquare } from "react-loader-spinner";
import NoPermission from "./Nopermission";
import CustomDrawer from "./Drawer";
import routes from "../Customutils/route";
import { Suspense } from "react";

function Routing(props) {
  const classes = useStyles();
  let { userDetails } = useUserState();
  let { permissions } = userDetails;

  const checkPermission = (permissionArray) => {
    for (let permission of permissionArray) {
      const isPermission = !!permissions.find((ele) => ele === permission);
      if (isPermission) {
        return true;
      }
    }
  };

  return (
    <>
      {userDetails.activeUserDetails ? (
        <>
          <CustomDrawer />
          <Box className={classes.formData}>
            <Suspense fallback={<CircularProgress />}>
              <Switch>
                <Route exact path="/app" component={Home} />
                {routes.map((route) => {
                  console.log("Route", route);
                  return (
                    <Route
                      exact
                      path={route.path}
                      component={
                        checkPermission(route.meta.permission)
                          ? route.component
                          : NoPermission
                      }
                    />
                  );
                })}
                {/* 

              <Route
                exact
                path="/app/audit-details/:id/:auditeeId"
                component={AnswerQuestionOfTopic}
              />

              <Route
                exact
                path="/app/categorydetails/answerquestionoftopic/:id/:auditid"
                component={AnswerQuestionOfTopic}
              />

              <Route
                exact
                path="/app/under-review-audit-details/:id/:auditeeId"
                component={AnswerQuestionOfUnderreviewAudits}
              />

              {/* <Route
                exact
                path="/app/managetemplate"
                component={ManageTemplates}
              /> */}

                <Route exact path="/app/*" component={NotFound} />
              </Switch>
            </Suspense>
          </Box>

          <Footer />
        </>
      ) : (
        <Box className={classes.spinner}>
          <RotatingSquare
            height="100"
            width="100"
            color="grey"
            ariaLabel="loading"
          />
        </Box>
      )}
    </>
  );
}

export default Routing;
