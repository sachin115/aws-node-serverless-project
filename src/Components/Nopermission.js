import React from "react";
import useStyles from "./Styles";

const NoPermission = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.centerText}>User Don't Have Permission !</div>
    </>
  );
};

export default NoPermission;
