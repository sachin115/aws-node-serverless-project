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
  IconButton,
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
import DeleteIcon from "@material-ui/icons/Delete";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useHistory, useParams } from "react-router-dom";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const EditTopic = (props) => {
  const classes = useStyle();
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [topicStatus, setTopicStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mappedQuestions, setMappedQuestions] = useState([]);
  const history = useHistory();
  const { userDetails } = useUserState();
  const { dispatch, setUserDetails } = useUserDispatch();
  const { entityDetails } = userDetails;
  const [activeStep, setActiveStep] = useState(0);

  //Map questions to topic

  //Remove mapped question from topic
  const deleteQuestion = (questionId) => {
    const indexOfQuestion = mappedQuestions.findIndex(
      (ele) => ele.id === questionId
    );
    const selectedQuestion = mappedQuestions[indexOfQuestion];
    const newQuestions = [...mappedQuestions];
    newQuestions.splice(indexOfQuestion, 1);
    setQuestions([...questions, selectedQuestion]);
    setMappedQuestions([...newQuestions]);
  };

  // Questions tables Columns

  const mappedQuestionColumns = [
    {
      name: "Sr No",
      label: "SrNo",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = Number(tableMeta.rowIndex) + 1;
          return <span>{rowIndex}</span>;
        },
      },
    },
    {
      name: "question",
      label: "Question",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "weightage",
      label: "Weightage",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "questionType",
      label: "Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <IconButton
              size="small"
              onClick={function () {
                deleteQuestion(tableMeta.rowData[4]);
              }}
            >
              <DeleteIcon />
            </IconButton>
          );
        },
      },
    },
  ];
  //Columns end here

  //Api calls

  const GetTopicDetails = async () => {
    try {
      const response = await callApi("GET", "GET_TOPIC_DETAILS", id);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setName(response.data.topicDetails.name);
        setTopicStatus(response.data.topicDetails.status);
        setSelectedCategory(response.data.mappedCategory.id);
        setMappedQuestions(response.data.mappedQuestions);
        const allQuestionsResponse = await callApi(
          "GET",
          "GET_ALL_ENTITY_QUESTIONS",
          entityDetails.id
        );
        if (allQuestionsResponse.status === 403) {
          setUserDetails({});
          notify();
          dispatch({ type: "TOKEN_EXPIRED" });
        }
        if (allQuestionsResponse.status === 200) {
          let newAllQuestions = [];
          allQuestionsResponse.data.forEach((question) => {
            const isThere = response.data.mappedQuestions.findIndex(
              (ele) => ele.id === question.id
            );
            if (isThere < 0) {
              newAllQuestions.push(question);
            }
          });
          setQuestions([...newAllQuestions]);
        }
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

  const getAllTopicCategoryAndQuestions = async () => {
    await GetAllEntityCategories();
    await GetTopicDetails();
    setIsLoading(false);
  };

  //call functions end here

  //UpdateTopicFunction

  const UpdateTopic = async (e) => {
    e.preventDefault();
    try {
      setIsApiLoading(true);
      const params = {
        name,
        status: topicStatus,
        mappedCategory: selectedCategory,
        mappedQuestions: mappedQuestions.map((question) => question.id),
        id,
      };
      const response = await callApi("CREATE", "UPDATE_TOPIC_DETAILS", params);
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
    getAllTopicCategoryAndQuestions();
  }, []);

  const steps = ["Topic Details", "Topics"];

  const handleNext = (event) => {
    event.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //return
  return (
    <>
      {!isLoading ? (
        <>
          <Breadcrumb
            breadcrumbElements={[
              { label: "Topic", path: "/app/managetopics" },
              { label: name },
              { label: "Edit" },
            ]}
          />

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
                                required
                                value={topicStatus}
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
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
                                required
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 45 },
                                  },
                                }}
                                value={selectedCategory}
                                onChange={(event) => {
                                  setSelectedCategory(event.target.value);
                                }}
                                label="Select Status"
                                fullWidth
                              >
                                {categories.map((category) => (
                                  <MenuItem
                                    value={category.id}
                                    key={category.id}
                                  >
                                    {category.name}
                                  </MenuItem>
                                ))}
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
                      </ValidatorForm>
                    )}
                    {activeStep === 1 && (
                      <ValidatorForm onSubmit={handleNext}>
                        <Grid item md={12} xs={12}>
                          <MaterialUiTable
                            title="Selected Questions"
                            data={mappedQuestions}
                            columns={mappedQuestionColumns}
                          />
                        </Grid>
                        <Divider variant="middle" style={{ width: "98%" }} />

                        <Grid item md={12} xs={12}>
                          <Box sx={{ mb: 2 }} className={classes.stepperButton}>
                            <Button
                              onClick={handleBack}
                              size="small"
                              variant="outlined"
                              style={{
                                marginRight: "8px",
                              }}
                            >
                              Previous
                            </Button>
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
                              {/* {">"} */}
                              {index === steps.length - 1
                                ? "Finish"
                                : "Save & Continue"}
                            </Button>
                          </Box>
                        </Grid>
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
                    disabled={isApiLoading}
                    size="small"
                    style={{
                      marginRight: "8px",
                    }}
                    onClick={UpdateTopic}
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

export default EditTopic;
