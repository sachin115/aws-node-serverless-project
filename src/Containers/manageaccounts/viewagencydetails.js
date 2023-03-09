import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStyle from "../styles";
import { useHistory, useParams } from "react-router-dom";
import { useUserDispatch } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import Breadcrumb from "../../Components/Breadcrumbs";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const notify = () => toast("Session Expired...!");

export default function ViewAgencyDetails() {
  const classes = useStyle();
  const params = useParams();
  const agencyId = params.id;
  const history = useHistory();
  const { dispatch, setUserDetails } = useUserDispatch();

  const [entityInfo, setEntityInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const countries = Country.getAllCountries();

  const [states, setStates] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    setBreadcrumb([
      { label: "Agency", path: "/app/agencies" },
      { label: `${entityInfo.name}` },
      { label: "View" },
    ]);
  }, [entityInfo]);

  const getAgencyDetails = async (agencyId) => {
    try {
      const response = await callApi(
        "GET",
        "GET_ENTITY_DETAILS_BY_ID",
        agencyId
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      const { adminDetails, entityDetails } = response.data;
      setStates(State.getStatesOfCountry(entityDetails.countryId));

      console.log("adminDetails ", adminDetails, "entityInfo", entityDetails);
      setEntityInfo(entityDetails);
      setUserInfo(adminDetails);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getAgencyDetails(agencyId);
  }, []);

  console.log("user===", userInfo);

  return entityInfo.name && userInfo.firstName ? (
    <Grid container spacing={1}>
      <Grid item md={9} xs={12}>
        <Breadcrumb breadcrumbElements={breadcrumb} />
      </Grid>
      <Grid item md={1} xs={12}>
        <Button
          fullWidth
          color="primary"
          size="small"
          variant="contained"
          component="span"
          onClick={() => {
            history.push({
              pathname: `/app/edit-agency/${agencyId}`,
            });
          }}
        >
          Edit
        </Button>
      </Grid>
      <Grid item md={1} xs={12}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          size="small"
          component="span"
          onClick={() => {
            history.push({
              pathname: `/app/add-agency-role/${agencyId}`,
            });
          }}
        >
          +Role
        </Button>
      </Grid>
      <Grid item md={1} xs={12}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          size="small"
          onClick={function () {
            history.push({
              pathname: `/app/agency-users/${agencyId}`,
            });
          }}
        >
          Users
        </Button>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper elevation={2}>
          <Typography mt={2} className={classes.headerContainer}>
            <span className={classes.headerText}>Agency Details</span>
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Agency Name
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.name}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Contact Email
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.contactEmail}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Address
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.address}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Pincode
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.pincode}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Footer Title
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.footerTitle}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>Status</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.status}
              </Typography>
            </Grid>

            <Grid item md={12} xs={12}>
              <img
                src={`https://dss-serverless-data.s3.amazonaws.com/ua/${entityInfo.id}/${entityInfo.logo}`}
                height={70}
                width={80}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper elevation={2}>
          <Typography mt={2} className={classes.headerContainer}>
            <span className={classes.headerText}>Admin Details</span>
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                First Name
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.firstName}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Middle Name
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.middleName}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Last Name
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.lastName}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>Email</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.email}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>Mobile</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.mobile}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Address
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.address}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Pincode
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.pincode}
              </Typography>
            </Grid>
            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>
                Country
              </Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.countryId &&
                  countries.find((ele) => ele.isoCode === userInfo.countryId) &&
                  countries.find((ele) => ele.isoCode === userInfo.countryId)
                    .name}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>City</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.cityId}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>State</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {states.find((ele) => ele.isoCode === userInfo.stateId) &&
                  states.find((ele) => ele.isoCode === userInfo.stateId).name}
              </Typography>
            </Grid>

            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>Status</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {userInfo.status}
              </Typography>
            </Grid>

            <Grid item md={12} xs={12}>
              <img
                src={`https://dss-serverless-data.s3.amazonaws.com/ua/${entityInfo.id}/${userInfo.profilePicture}`}
                height={50}
                width={50}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  ) : (
    <CircularProgress />
  );
}
