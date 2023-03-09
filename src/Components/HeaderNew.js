import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Button,
  ListItem,
  List,
  ListItemText,
  Divider,
  Typography,
  Paper,
  ClickAwayListener,
  Box,
  ListItemIcon,
} from "@material-ui/core";
import { useUserDispatch, useUserState } from "../Customutils/UserContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useEffect } from "react";
import useStyles from "./Styles";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import cookie from "react-cookies";

toast.configure();

export default function Header() {
  let { userDetails } = useUserState();
  const classes = useStyles();
  const [activeUserDetails, setActiveUserDetails] = useState({});
  const [clientDetails, setClientDetails] = useState({});
  const [entityDetails, setEntityDetails] = useState({});
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const history = useHistory();
  const { dispatch, setUserDetails } = useUserDispatch();
  const notify = () => toast("Signed out Successfully!");
  const LogOut = () => {
    cookie.remove("DSSIdToken");
    cookie.remove("DSSAccessToken");
    cookie.remove("DSSRefreshToken");
    setUserDetails({});
    history.push("/");
    dispatch({ type: "SIGN_OUT" });
    notify();
  };

  useEffect(() => {
    console.log("userDetails", userDetails);
    if (userDetails.activeUserDetails) {
      setActiveUserDetails({ ...userDetails.activeUserDetails });
      setClientDetails({ ...userDetails.clientDetails });
      setEntityDetails({ ...userDetails.entityDetails });
    }
  }, [userDetails]);

  return (
    <AppBar color="inherit" style={{position:"fixed",top:"0%",width:"79%",backgroundColor:"transparent",boxShadow:"none",marginBottom:"20%"}}>
      <Toolbar>
        {/* <Typography variant="h6" noWrap component="div">
          <img
            src={`https://dss-serverless-data.s3.amazonaws.com/ua/${entityDetails.id}/${entityDetails.logo}`}
            alt="Logo"
            width={80}
            height={40}
          />
        </Typography> */}
        <div className={classes.appbarBrand}>
          {clientDetails ? clientDetails.name : ""} Portal
        </div>

        {/* <Box className={classes.avatar}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root}>
              <Button
                aria-controls="fade-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
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
              </Button>
              {open ? (
                <Paper elevation={3} className={classes.dropdown}>
                  <ListItem>
                    <Avatar mx="auto">{`${
                      activeUserDetails.firstName
                        ? activeUserDetails.firstName[0]
                        : " "
                    }${
                      activeUserDetails.lastName
                        ? activeUserDetails.lastName[0]
                        : " "
                    }`}</Avatar>
                    <ListItemText>
                      {activeUserDetails
                        ? `${activeUserDetails.firstName} ${activeUserDetails.middleName} ${activeUserDetails.lastName}`
                        : null}
                      <br />
                      <span className={classes.emailAnchor}>
                        {activeUserDetails ? activeUserDetails.email : " "}
                      </span>
                    </ListItemText>
                  </ListItem>
                  <Divider variant="middle" />
                  <List>
                    <ListItem
                      autoFocus
                      button
                      onClick={() => {
                        history.push("/app/user/accountdetails");
                        handleClickAway();
                      }}
                    >
                      <ListItemIcon>
                        <ContactMailIcon />
                      </ListItemIcon>
                      <ListItemText>Account Details</ListItemText>
                    </ListItem>
                    <ListItem autoFocus button onClick={LogOut}>
                      <ListItemIcon>
                        <VpnKeyIcon />
                      </ListItemIcon>
                      <ListItemText>Sign Out</ListItemText>
                    </ListItem>
                  </List>
                </Paper>
              ) : null}
            </div>
          </ClickAwayListener>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
}
