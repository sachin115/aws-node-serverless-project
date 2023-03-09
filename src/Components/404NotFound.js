import React from "react";
import useStyles from "./Styles";

const NotFound = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.centerText}>404:Page Not Found</div>
    </>
  );
};

export default NotFound;
