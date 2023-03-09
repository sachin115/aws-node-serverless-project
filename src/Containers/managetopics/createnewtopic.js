import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import useStyle from "../styles";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";

import Breadcrumb from "../../Components/Breadcrumbs";

import { ValidatorForm } from "react-material-ui-form-validator";

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const CreateNewTopic = (props) => {
  const classes = useStyle();

  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const { dispatch, setUserDetails } = useUserDispatch();
  const [topicStatus, setTopicStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const history = useHistory();
  const { userDetails } = useUserState();

  const { entityDetails } = userDetails;

  const steps = ["Topic Details"];

  //Api calls
  const GetAllEntityQuestions = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_QUESTIONS",
        entityDetails.id
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setQuestions([...response.data]);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const GetAllEntityCategories = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_CATEGORIES",
        entityDetails.id
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setCategories([...response.data]);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getAllCategoryAndQuestions = async () => {
    await GetAllEntityCategories();
    await GetAllEntityQuestions();
    setIsLoading(false);
  };

  //call functions end here

  //CreateTopicFunction

  const CreateTopic = async (e) => {
    e.preventDefault();
    try {
      setIsApiLoading(true);
      const params = {
        name,
        status: topicStatus,
        mappedCategory: selectedCategory,
        entityId: entityDetails.id,
      };
      const response = await callApi("CREATE", "CREATE_NEW_TOPIC", params);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Data", response.data);
        history.push("/app/managetopics");
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error Inside Create Topic", err);
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    getAllCategoryAndQuestions();
  }, []);

  const handleNext = (event) => {
    event.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Breadcrumb
        breadcrumbElements={[
          { label: "Topic", path: "/app/managetopics" },
          { label: "Add" },
        ]}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
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
                  optional={
                    index === 2 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step}
                </StepLabel>
                <StepContent>
                  <ValidatorForm onSubmit={handleNext}>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={7}
                        xs={12}
                        className={classes.fieldContainer}
                      >
                        <TextField
                          fullWidth
                          required
                          size="small"
                          label="Name"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value);
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
                          <InputLabel>Status</InputLabel>
                          <Select
                            className={classes.selectClass}
                            MenuProps={{
                              PaperProps: {
                                style: { marginTop: 45 },
                              },
                            }}
                            required
                            value={topicStatus}
                            onChange={(event) => {
                              setTopicStatus(event.target.value);
                            }}
                            label="Select Status"
                            fullWidth
                          >
                            <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                            <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
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
                          <InputLabel>Category</InputLabel>
                          <Select
                            className={classes.selectClass}
                            MenuProps={{
                              PaperProps: {
                                style: { marginTop: 45 },
                              },
                            }}
                            required
                            value={selectedCategory}
                            onChange={(event) => {
                              setSelectedCategory(event.target.value);
                            }}
                            label="Select Status"
                            fullWidth
                          >
                            {categories.map((category) => (
                              <MenuItem value={category.id} key={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Divider variant="middle" style={{ width: "98%" }} />

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
                  </ValidatorForm>
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
                size="small"
                disabled={isApiLoading}
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
                  onClick={CreateTopic}
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
      )}
    </>
  );
};

export default CreateNewTopic;
