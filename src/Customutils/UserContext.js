import React, { useEffect, useState } from "react";
import callApi from "./callApi";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const userStateContext = React.createContext();
const userDispatchContext = React.createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return true;
    case "SIGN_OUT":
      return false;

    case "LOGIN_FAILURE":
      return false;

    case "TOKEN_EXPIRED":
      return false;

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});

  const getTokens = () => {
    if (document.cookie.length) {
      const DSSIdToken = cookie.load("DSSIdToken");
      return DSSIdToken;
    } else {
      return false;
    }
  };

  var [isUserAuthenticated, dispatch] = React.useReducer(
    userReducer,
    !!getTokens()
  );
  const notify = () => toast("Session Expired...!");

  async function getUserDetails() {
    try {
      const response = await callApi("GETLIST", "GET_USER_DETAILS");
      if (response.status === 200) {
        setUserDetails(response.data);
      } else if (response.status === 403) {
        notify();
        setUserDetails({});
        dispatch({ type: "TOKEN_EXPIRED" });
      } else {
        console.log("Response ", response);
      }
    } catch (err) {
      console.log("Error", err);
    }
  }
  useEffect(() => {
    if (isUserAuthenticated) {
      getUserDetails();
    }
  }, [isUserAuthenticated]);

  return (
    <userStateContext.Provider value={{ isUserAuthenticated, userDetails }}>
      <userDispatchContext.Provider value={{ dispatch, setUserDetails }}>
        {children}
      </userDispatchContext.Provider>
    </userStateContext.Provider>
  );
};

const useUserState = () => {
  const context = React.useContext(userStateContext);

  return context;
};
const useUserDispatch = () => {
  const context = React.useContext(userDispatchContext);
  return context;
};

export { UserProvider, useUserState, useUserDispatch };
