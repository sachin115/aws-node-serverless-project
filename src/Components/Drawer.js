import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
} from "@material-ui/core";
import { useUserState, useUserDispatch } from "../Customutils/UserContext";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "./Styles";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "../Customutils/route";

toast.configure();

const CustomDrawer = () => {
  let { userDetails } = useUserState();
  const params = useParams();
  let { entityDetails, permissions, activeUserDetails, roleDetails } =
    userDetails;
  const checkPermission = (permissionArray) => {
    for (let permission of permissionArray) {
      const isPermission = !!permissions.find((ele) => ele === permission);
      if (isPermission) {
        return true;
      }
    }
  };

  const checkParent = (includedNonMenuRoutes) => {
    const checkName = location.pathname.split("/")[2];
    console.log("CheckName", checkName);
    const pathNameIsAvailable = !!includedNonMenuRoutes.find(
      (ele) => ele === checkName
    );
    console.log("pathNameIsAvailable", pathNameIsAvailable);
    return pathNameIsAvailable;
  };

  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const notify = () => toast("Signed out Successfully!");

  const { dispatch, setUserDetails } = useUserDispatch();

  const LogOut = () => {
    cookie.remove("DSSIdToken");
    cookie.remove("DSSAccessToken");
    cookie.remove("DSSRefreshToken");
    setUserDetails({});
    history.push("/");
    dispatch({ type: "SIGN_OUT" });
    notify();
  };

  return (
    <Paper className={classes.drawerOpen} elevation={15}>
      <List style={{ position: "relative" }}>
        <ListItem>
          <img
            src={`https://dss-serverless-data.s3.amazonaws.com/ua/${entityDetails.id}/${entityDetails.logo}`}
            alt="Logo"
            style={{ marginBottom: "30px" }}
            width={90}
            height={50}
          />
        </ListItem>
        <ListItem
          style={{
            backgroundColor: location.pathname === "/app" ? "#daebe8" : "white",
          }}
          button
          onClick={() => {
            history.push("/app");
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Dashboard"} />
        </ListItem>
        {routes.map(
          (route) =>
            route.meta.menuItem &&
            checkPermission(route.meta.permission) && (
              <ListItem
                style={{
                  backgroundColor: checkParent(
                    route.meta.menuItem.includedNonMenuRoutes
                  )
                    ? "#daebe8"
                    : "white",
                }}
                button
                onClick={() => {
                  history.push(route.path);
                }}
              >
                <ListItemIcon>
                  <route.meta.menuItem.icon />
                </ListItemIcon>
                <ListItemText primary={route.meta.menuItem.text} />
              </ListItem>
            )
        )}

        {/* {permissions.find((ele) => ele === "VIEW_PROVISION_AGENCY_LIST") && (
          <ListItem
            style={{
              backgroundColor: !!location.pathname.includes("/app/agencies")
                ? "#daebe8"
                : "white",
            }}
            button
            onClick={() => {
              history.push("/app/agencies");
            }}
          >
            <ListItemIcon>
              <EmojiTransportationIcon />
            </ListItemIcon>
            <ListItemText primary={"Agencies"} />
          </ListItem>
        )}
        {permissions.find(
          (ele) =>
            ele === "VIEW_AGENCY_USER_LIST" ||
            ele === "VIEW_PROVISION_USER_LIST"
        ) && (
          <ListItem
            button
            style={{
              backgroundColor: !!location.pathname.includes("/app/manageusers")
                ? "#daebe8"
                : "white",
            }}
            onClick={() => {
              history.push("/app/users");
            }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Users"} />
          </ListItem>
        )}

        {permissions.find(
          (ele) =>
            ele === "VIEW_AGENCY_ROLE_LIST" ||
            ele === "VIEW_PROVISION_AGENCY_ROLE_LIST"
        ) && (
          <ListItem
            button
            style={{
              backgroundColor: !!location.pathname.includes("/app/roles")
                ? "#daebe8"
                : "white",
            }}
            onClick={() => {
              history.push("/app/roles");
            }}
          >
            <ListItemIcon>
              <EmojiPeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Roles"} />
          </ListItem>
        )}

        {permissions.find((ele) => ele === "VIEW_AUDIT_LIST") && (
          <ListItem
            // selected={!!location.pathname.includes("/app/manageaudits")}
            style={{
              backgroundColor: !!location.pathname.includes("/app/manageaudits")
                ? "#daebe8"
                : "white",
            }}
            button
            onClick={() => {
              history.push("/app/audits");
            }}
          >
            <ListItemIcon>
              <StyleIcon />
            </ListItemIcon>
            <ListItemText primary={"Audits"} />
          </ListItem>
        )}

        {permissions.find((ele) => ele === "VIEW_TEMPLATE_LIST") && (
          <ListItem
            style={{
              backgroundColor: !!location.pathname.includes(
                "/app/managetemplate"
              )
                ? "#daebe8"
                : "white",
            }}
            button
            onClick={() => {
              history.push("/app/templates");
            }}
          >
            <ListItemIcon>
              <LiveHelpIcon />
            </ListItemIcon>
            <ListItemText primary={"Template"} />
          </ListItem>
        )} */}
      </List>

      <Accordion
        style={{
          padding: "2px",
          border: "2px #daebe8 solid ",
          borderRadius: "5px",
          boxShadow: "none",
          position: "absolute",
          backgroundColor: "#daebe8",
          bottom: "10px",
          width: "90%",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <div>
              {activeUserDetails.profilePicture ? (
                <Avatar mx="auto">
                  <img
                    src={`https://dss-serverless-data.s3.amazonaws.com/ua/${entityDetails.id}/${activeUserDetails.profilePicture}`}
                    width={50}
                    height={40}
                  />
                </Avatar>
              ) : (
                <Avatar mx="auto">{`${
                  activeUserDetails.firstName
                    ? activeUserDetails.firstName[0]
                    : " "
                }${
                  activeUserDetails.lastName
                    ? activeUserDetails.lastName[0]
                    : " "
                }`}</Avatar>
              )}
            </div>
            <div style={{ alignItems: "center", marginLeft: "5px" }}>
              <Typography
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  fontWeight: "bolder",
                }}
              >
                {`${
                  activeUserDetails.firstName
                    ? activeUserDetails.firstName
                    : " "
                } ${
                  activeUserDetails.lastName ? activeUserDetails.lastName : " "
                }`}
              </Typography>
              <Typography
                style={{ fontSize: "10px", textTransform: "capitalize" }}
              >
                {roleDetails.name ? `${roleDetails.name}` : ""}
              </Typography>
            </div>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List style={{ width: "100%" }}>
            <ListItem button onClick={LogOut}>
              Log Out
            </ListItem>
            <ListItem
              button
              onClick={() => {
                history.push(`/app/user/accountdetails`);
              }}
            >
              Account Details
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default CustomDrawer;
