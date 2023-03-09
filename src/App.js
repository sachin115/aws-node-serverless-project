import "./App.css";
import Routing from "./Components/Routing";
import { Redirect, Switch, Route } from "react-router-dom";
import Login from "./Components/Login";
import React from "react";
import { useUserState } from "./Customutils/UserContext";
import ForceChangePassword from "./Components/ForceChangePassword";
import cookie from "react-cookies";

function App(props) {
  var isUserAuthenticated = useUserState().isUserAuthenticated;

  return (
    <div className="App">
      <Switch>
        <Route
          path="/force-change-password"
          render={() =>
            !!cookie.load("ForceChangePasswordSession") ? (
              React.createElement(ForceChangePassword, props)
            ) : isUserAuthenticated ? (
              <Redirect to="/app" />
            ) : (
              <Redirect to="/" />
            )
          }
        ></Route>
        <PrivateRoute path="/app" component={Routing} />
        <PublicRoute path="/" component={Login} />
      </Switch>
    </div>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={() =>
          isUserAuthenticated ? (
            React.createElement(component, props)
          ) : !!cookie.load("ForceChangePasswordSession") ? (
            <Redirect to="/force-change-password" />
          ) : (
            <Redirect to="/" />
          )
        }
      ></Route>
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={() =>
          isUserAuthenticated ? (
            <Redirect to="/app" />
          ) : !!cookie.load("ForceChangePasswordSession") ? (
            <Redirect to="/force-change-password" />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}

export default App;
