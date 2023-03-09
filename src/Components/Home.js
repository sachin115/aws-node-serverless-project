import { Box } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import callApi from "../Customutils/callApi";
import { useUserState } from "../Customutils/UserContext";
import useStyle from "./Styles";
import { AuditorAndAuditeeDashboardScreen } from "../Containers/manageauditsmanagement/index";

const Home = (props) => {
  const classes = useStyle();
  let { userDetails } = useUserState();
  const [activeUserDetails, setActiveUserDetails] = useState({});
  const [clientDetails, setClientDetails] = useState({});
  const [roleDetails, setRoleDetails] = useState({});

  useEffect(() => {
    if (userDetails) {
      setActiveUserDetails({ ...userDetails.activeUserDetails });
      setClientDetails({ ...userDetails.clientDetails });
      setRoleDetails({ ...userDetails.roleDetails });
    }
  }, [userDetails]);

  return roleDetails.name === "auditor" || roleDetails.name === "auditee" ? (
    <AuditorAndAuditeeDashboardScreen />
  ) : (
    <Box>
      <span className={classes.headerText}>
        {`${clientDetails.name ? clientDetails.name : ""} ${
          roleDetails.name ? roleDetails.name : ""
        } Dashboard`}
      </span>
    </Box>
  );
};
export default Home;
