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
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import Breadcrumb from "../../Components/Breadcrumbs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const CreateNewCategory = (props) => {
  const classes = useStyle();
  const [categoryName, setCategoryName] = useState("");
  const [parent, setParent] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const { userDetails } = useUserState();
  const { dispatch, setUserDetails } = useUserDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const { entityDetails } = userDetails;
  const [activeStep, setActiveStep] = useState(0);

  const CreateCategory = async (event) => {
    try {
      event.preventDefault();
      setIsApiLoading(true);
      const params = {
        categoryName,
        parent,
        status: categoryStatus,
        entityId: entityDetails.id,
      };
      const response = await callApi("CREATE", "CREATE_NEW_CATEGORY", params);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Create category", response.data);
        props.history.push("/app/managecategories");
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error", err);
      setIsApiLoading(false);
    }
  };
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
      console.log("Categories ", response.data);
      setParentCategories([...response.data.allParentCategories]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetAllParentCategories();
  }, []);

  const steps = ["Category Details"];

  const handleNext = (event) => {
    event.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return !isLoading ? (
    <>
      <Breadcrumb
        breadcrumbElements={[
          { label: "Category", path: "/app/managecategories " },
          { label: "Add" },
        ]}
      />
      <Paper elevation={0}>
        {/* <Typography mt={2} className={classes.headerContainer}>
          <span className={classes.headerText}>
            Create Category / Sub-Category
          </span>
        </Typography> */}
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
                        <Box sx={{ mb: 2 }} className={classes.stepperButton}>
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
                  </ValidatorForm>
                )}
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
              Create
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
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Box component={"div"}>
            <Typography>All steps completed - you&apos;re finished</Typography>
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
                disabled={isApiLoading}
                size="small"
                style={{
                  marginRight: "8px",
                }}
                onClick={CreateCategory}
              >
                Create
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
                variant="contained"
                disabled={isApiLoading}
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
  );
};

export default CreateNewCategory;
