import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import useStyle from "../styles";
import callApi from "../../Customutils/callApi";
import Breadcrumb from "../../Components/Breadcrumbs";
import { useParams } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const EditCategory = (props) => {
  const classes = useStyle();
  const [categoryName, setCategoryName] = useState("");
  const [parent, setParent] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const { userDetails } = useUserState();
  const { dispatch, setUserDetails } = useUserDispatch();
  const { entityDetails } = userDetails;
  const [activeStep, setActiveStep] = useState(0);

  const params = useParams();
  const { id } = params;

  const GetAllParentCategories = async () => {
    const response = await callApi(
      "GET",
      "GET_ALL_PARENT_CATEGORIES",
      entityDetails.id
    );
    if (response.status === 403) {
      setUserDetails({});
      notify();
      dispatch({ type: "TOKEN_EXPIRED" });
    }
    if (response.status === 200) {
      setParentCategories([...response.data.allParentCategories]);
      setIsLoading(false);
    }
  };
  const GetCategoryDetails = async (event) => {
    try {
      const response = await callApi("GET", "GET_CATEGORY_DETAILS", id);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setCategoryName(response.data.name);
        setCategoryStatus(response.data.status);
        setParent(response.data.parent);
        setBreadcrumb([
          { label: "Category", path: "/app/managecategories " },
          { label: response.data.name },
          { label: "edit" },
        ]);
      }
    } catch (err) {
      console.log("Error inside GetCategoryDetails", err);
    }
  };
  const UpdateCategory = async (event) => {
    try {
      event.preventDefault();
      setIsApiLoading(true);
      console.log("parent", parent);
      const params = {
        categoryName,
        parent,
        status: categoryStatus,
        categoryId: id,
      };
      console.log("params ", params);
      const response = await callApi(
        "CREATE",
        "UPDATE_CATEGORY_DETAILS",
        params
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Update category", response.data);
        props.history.push("/app/managecategories");
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error", err);
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    GetAllParentCategories();
    GetCategoryDetails();
  }, []);

  const steps = ["Category Details"];

  const handleNext = (event) => {
    event.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Breadcrumb breadcrumbElements={breadcrumb} />
          <Paper elevation={0}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    className={
                      activeStep === index
                        ? classes.activeStep
                        : classes.inactiveStep
                    }
                  >
                    {step}
                  </StepLabel>
                  <StepContent>
                    {activeStep === 0 && (
                      <ValidatorForm onSubmit={handleNext}>
                        <Grid container spacing={2}>
                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Category Name"
                              value={categoryName}
                              onChange={(event) => {
                                setCategoryName(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small" required>
                              <InputLabel>Select Parent</InputLabel>
                              <Select
                                className={classes.selectClass}
                                value={parent}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                onChange={(event) => {
                                  setParent(event.target.value);
                                }}
                                label="Select Parent"
                                fullWidth
                              >
                                <MenuItem value={0}>None</MenuItem>
                                {parentCategories.length > 0 &&
                                  parentCategories.map((parent) => (
                                    <MenuItem value={parent.id} key={parent}>
                                      {parent.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            xs={12}
                            className={classes.fieldContainer}
                          >
                            <FormControl fullWidth size="small" required>
                              <InputLabel>Status</InputLabel>
                              <Select
                                className={classes.selectClass}
                                required
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                value={categoryStatus}
                                onChange={(event) => {
                                  setCategoryStatus(event.target.value);
                                }}
                                label="Select Status"
                                fullWidth
                              >
                                <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                                <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={7} xs={12}>
                            <Box
                              sx={{ mb: 2 }}
                              className={classes.stepperButton}
                            >
                              <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                color="primary"
                                style={{
                                  marginRight: "11px",
                                }}
                                sx={{ mt: 1, mr: 1 }}
                              >
                                {index === steps.length - 1
                                  ? "Finish"
                                  : "Save & Continue"}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                        <Divider variant="middle" style={{ width: "98%" }} />
                        {/* <Box className={classes.formButton}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            type="submit"
                            style={{
                              marginRight: "8px",
                            }}
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => {
                              props.history.push("/app/managecategories");
                            }}
                            variant="contained"
                            color="secondary"
                            size="small"
                            style={{
                              marginRight: "11px",
                            }}
                          >
                            CANCEL
                          </Button>
                        </Box> */}
                      </ValidatorForm>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Box component={"div"}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={isApiLoading}
                  size="small"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Box className={classes.formButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={isApiLoading}
                    style={{
                      marginRight: "8px",
                    }}
                    onClick={UpdateCategory}
                  >
                    Update
                  </Button>
                  {isApiLoading && (
                    <CircularProgress
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "6%",
                      }}
                    />
                  )}
                  <Button
                    onClick={() => {
                      props.history.push("/app/dashboard");
                    }}
                    disabled={isApiLoading}
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{
                      marginRight: "11px",
                    }}
                  >
                    CANCEL
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default EditCategory;
