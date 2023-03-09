import { Box } from "@material-ui/core";
import useStyles from "./Styles";
import { useUserState } from "../Customutils/UserContext";

export default function Footer() {
  const classes = useStyles();
  const { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  return (
    <Box className={classes.footerBar}>
      {entityDetails && (
        <span>{`©${new Date().getFullYear()} - ${
          entityDetails.footerTitle
        }`}</span>
      )}
    </Box>
  );
}
