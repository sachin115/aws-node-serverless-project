import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const Breadcrumb = (props) => {
  const history = useHistory();

  return (
    <Breadcrumbs
      separator="›"
      aria-label="breadcrumb"
      style={{ marginTop: "10px" }}
    >
      {props.breadcrumbElements &&
        props.breadcrumbElements.map((breadcrumb) =>
          breadcrumb.path ? (
            <Link
              style={{ cursor: "pointer" }}
              color="primary"
              key={breadcrumb}
              onClick={() => {
                history.push(breadcrumb.path);
              }}
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <Link color="inherit" key={breadcrumb}>
              {breadcrumb.label}
            </Link>
          )
        )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
