import {
  CircularProgress,
  Paper,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumbs";
import useStyle from "../styles";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const UserDetails = () => {
  const classes = useStyle();
  const { search } = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const { dispatch, setUserDetails } = useUserDispatch();
  const [entityInfo, setEntityInfo] = useState({});
  const [role, setRoleName] = useState("");
  const [states, setStates] = useState([]);
  const { id } = useParams();
  const { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const history = useHistory();
  const countries = Country.getAllCountries();

  const fromAgencyBreadcrumb = [
    { label: "Agency", path: "/app/agencies" },
    {
      label: `${entityInfo.name}`,
      path: `/app/app/agency-users/${entityInfo.id}`,
    },
    { label: `${userInfo.firstName}` },
    { label: `View` },
  ];
  const fromUserBreadcrumb = [
    { label: "Users", path: "/app/users" },
    { label: `${userInfo.firstName}` },
    { label: "View" },
  ];

  const getUserDetailsById = async () => {
    const response = await callApi("GET", "GET_USERDETAILS_BY_ID", id);
    if (response.status === 403) {
      setUserDetails({});
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
    }
    if (response.status === 200) {
      console.log("data", response.data);
      setUserInfo({ ...userInfo, ...response.data.userDetails });
      setEntityInfo(response.data.entityDetails);
      setRoleName(response.data.usersRole.name);
      setStates(State.getStatesOfCountry(response.data.userDetails.countryId));
    }
  };

  useEffect(() => {
    getUserDetailsById();
  }, []);

  return entityInfo.name && userInfo.firstName ? (
    <Grid container spacing={1}>
      <Grid item md={11} xs={12}>
        {search === "?agency"
          ? entityInfo.name && (
              <Breadcrumb breadcrumbElements={fromAgencyBreadcrumb} />
            )
          : userInfo.firstName && (
              <Breadcrumb breadcrumbElements={fromUserBreadcrumb} />
            )}
      </Grid>
      <Grid item md={1} xs={12}>
        <Button
          fullWidth
          color="primary"
          size="small"
          variant="contained"
          component="span"
          onClick={() => {
            if (search === "?agency") {
              history.push({
                pathname: `/app/add-agency-user/${entityInfo.id}/${userInfo.id}`,
                search: "agency",
              });
            } else {
              history.push({
                pathname: `/app/edit-user/${id}/${entityDetails.id}`,
              });
            }
          }}
        >
          Edit
        </Button>
      </Grid>

      <Grid item md={7} xs={12}>
        <Paper elevation={5}>
          <Typography mt={2} className={classes.headerContainer}>
            <span className={classes.headerText}>User Details</span>
          </Typography>
          <Grid container spacing={2}>
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
                {countries.find((ele) => ele.isoCode === userInfo.countryId) &&
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
            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>Agency</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>
                {entityInfo.name}
              </Typography>
            </Grid>
            <Grid item md={3} xs={6}>
              <Typography className={classes.detailsDisplay}>Role</Typography>
            </Grid>
            <Grid item md={9} xs={6}>
              <Typography className={classes.detailsDisplay}>{role}</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <img
                src={`https://dss-serverless-data.s3.amazonaws.com/ua/${entityInfo.id}/${userInfo.profilePicture}`}
                height={70}
                width={80}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  ) : (
    <CircularProgress />
  );
};

export default UserDetails;
