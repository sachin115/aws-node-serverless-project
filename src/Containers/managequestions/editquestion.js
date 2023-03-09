import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  TextareaAutosize,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import useStyle from "../styles";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import Breadcrumb from "../../Components/Breadcrumbs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");

const EditQuestion = (props) => {
  const classes = useStyle();
  const [question, setQuestion] = useState("");
  const { id } = useParams();
  const [questionType, setQuestionType] = useState("");
  const { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const [hasAttachment, setHasAttachment] = useState(true);

  const [hasComment, setHasComment] = useState(true);
  const [weightage, setWeightage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [previousMappedTopic, setPreviousMappedTopic] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const { dispatch, setUserDetails } = useUserDispatch();

  const [optionNumber, setOptionNumber] = useState("");
  const questionNumber = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [optionValues, setOptionValues] = useState([]);
  const [questionDescription, setQuestionDescription] = useState("");
  const [checkValue, setCheckValue] = useState(0);
  const [originalTopic, setOriginalTopic] = useState("");
  let [count, setCount] = useState(0);
  const [yesVal, setYesVal] = useState(0);
  const [noVal, setNoVal] = useState(0);

  const UpdateQuestion = async (event) => {
    event.preventDefault();
    try {
      setIsApiLoading(true);
      const params = {
        questionType,
        weightage,
        question,
        optionNumber,
        optionValues,
        questionDescription,
        hasAttachment,
        yesVal,
        noVal,
        hasComment,
        topicId: selectedTopic,
        previousTopicId: previousMappedTopic,
        questionId: id,
      };
      console.log("Params", params);

      const response = await callApi(
        "CREATE",
        "UPDATE_QUESTION_DETAILS",
        params
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Update Question", response.data);
        props.history.push("/app/managequestions");
      }
      setIsApiLoading(false);
    } catch (err) {
      console.log("Error Inside Create Question", err);
      setIsApiLoading(false);
    }
  };

  const getQuestionDetails = async () => {
    try {
      const response = await callApi("GET", "GET_QUESTION_DETAILS", id);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("response ", response.data);
        setQuestionType(response.data.questionType);
        setOriginalTopic(response.data.questionType);
        setSelectedTopic(response.data.topicId);
        setQuestion(response.data.question);
        setWeightage(response.data.weightage);
        setHasAttachment(response.data.hasAttachment);
        setHasComment(response.data.hasComment);
        setPreviousMappedTopic(response.data.topicId);
        setOptionNumber(response.data.optionNumber);
        setYesVal(response.data.yesVal);
        setNoVal(response.data.noVal);
        let arr = new Array(response.data.optionNumber);
        arr.fill({});
        setOptionValues(arr);
        setOptionValues(JSON.parse(response.data.optionValues));
        setCheckValue(1);
        setQuestionDescription(response.data.questionDescription);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error Inside Get Questions Details ", err);
    }
  };

  const GetAllEntityTopics = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_TOPICS",
        entityDetails.id
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Topics ", response.data);

        setTopics([...response.data]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const RandomFields = () => {
    let optionFields = [];
    count = 0;
    optionValues.map((value, index) => {
      count += parseInt(value.optionWeight ? value.optionWeight : 0);
      optionFields.push(
        <Grid container spacing={2}>
          <Grid item md={8} xs={19} style={{ marginTop: "3%" }}>
            <TextField
              fullWidth
              required
              size="small"
              label={`Option ${index + 1}`}
              type="text"
              onChange={(event) => {
                let newArr = [...optionValues];
                if (newArr[index]) newArr[index].optionVal = event.target.value;
                else newArr[index] = { optionVal: event.target.value };
                setOptionValues(newArr);
              }}
              value={value.optionVal}
            />
          </Grid>
          <Grid
            item
            md={4}
            xs={3}
            style={{ marginTop: "3%" }}
            key={`optionweight${index}`}
          >
            <TextField
              fullWidth
              required
              size="small"
              label={`WeightAge of Option ${index + 1}`}
              type="number"
              onChange={(event) => {
                let newArr = [...optionValues];
                if (newArr[index])
                  newArr[index].optionWeight = event.target.value;
                else newArr[index] = { optionWeight: event.target.value };
                setOptionValues(newArr);
              }}
              value={value.optionWeight}
            />
          </Grid>
        </Grid>
      );
    });
    return (
      <FormControl fullWidth size="small" required>
        {optionFields}
      </FormControl>
    );
  };

  const validationMsg = () => {
    return (
      <Grid container spacing={2}>
        <Grid item md={12} xs={12} style={{ marginTop: "3%" }}>
          <Typography variant="h6" color="error">
            Summation of all option's weightage should not be greater than or
            less than of question weightage
          </Typography>
        </Grid>
      </Grid>
    );
  };

  useEffect(() => {
    getQuestionDetails();
    GetAllEntityTopics();
  }, []);

  const steps = ["Question Details", "Question Type"];

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

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Breadcrumb
            breadcrumbElements={[
              { label: "Question", path: "/app/managequestions" },
              { label: questionType },
              { label: "edit" },
            ]}
          />
          <Paper elevation={0}>
            {/* <Typography mt={2} className={classes.headerContainer}>
              <span className={classes.headerText}>Edit Question</span>
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
                              label="Question"
                              value={question}
                              onChange={(event) => {
                                setQuestion(event.target.value);
                              }}
                            />
                          </Grid>

                          <Grid item md={7} xs={12}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              type="number"
                              label="Weightage"
                              value={weightage}
                              InputProps={{
                                inputProps: {
                                  max: 10,
                                  min: 1,
                                },
                              }}
                              onChange={(event) => {
                                setWeightage(event.target.value);
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
                              <InputLabel
                                style={{
                                  position: "absolute",
                                  // top: "-10px",
                                }}
                              >
                                Topic
                              </InputLabel>
                              <Select
                                className={classes.selectClass}
                                required
                                MenuProps={{
                                  PaperProps: {
                                    style: { marginTop: 82 },
                                  },
                                }}
                                value={selectedTopic}
                                onChange={(event) => {
                                  setSelectedTopic(event.target.value);
                                }}
                                label="Select Status"
                                fullWidth
                              >
                                {topics.map((topic) => (
                                  <MenuItem value={topic.id} key={topic.id}>
                                    {topic.name}
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
                              <InputLabel style={{ marginTop: "-2%" }}>
                                Question Description
                              </InputLabel>
                              <TextareaAutosize
                                minRows={4}
                                style={{
                                  display: "flex",
                                  textAlign: "left",
                                  justifyContent: "flex-start",
                                  marginTop: "5%",
                                }}
                                required
                                value={questionDescription}
                                onChange={(e) => {
                                  setQuestionDescription(e.target.value);
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid
                            container
                            spacing={2}
                            className={classes.inactiveStep}
                          >
                            <Grid item md={4} xs={6}>
                              <FormControl component="fieldset">
                                <FormLabel component="legend">
                                  Has Attachment
                                </FormLabel>
                                <RadioGroup
                                  row
                                  value={hasAttachment}
                                  onChange={() => {
                                    setHasAttachment(!hasAttachment);
                                  }}
                                >
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio color="primary" />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio color="primary" />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid item md={4} xs={6}>
                              <FormControl component="fieldset">
                                <FormLabel component="legend">
                                  Has Comment
                                </FormLabel>
                                <RadioGroup
                                  row
                                  value={hasComment}
                                  onChange={() => {
                                    setHasComment(!hasComment);
                                  }}
                                >
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio color="primary" />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio color="primary" />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
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
                        <Grid
                          item
                          md={7}
                          xs={12}
                          className={classes.fieldContainer}
                        >
                          <FormControl fullWidth size="small" required>
                            <InputLabel
                              style={{
                                position: "absolute",
                                // top: "-10px",
                              }}
                            >
                              Question Type
                            </InputLabel>
                            <Select
                              className={classes.selectClass}
                              required
                              MenuProps={{
                                PaperProps: {
                                  style: { marginTop: 82 },
                                },
                              }}
                              value={questionType}
                              onChange={(event) => {
                                count = 0;
                                setQuestionType(event.target.value);
                              }}
                              label="Select Status"
                              fullWidth
                            >
                              <MenuItem value={"yes/no"}>Yes / No</MenuItem>
                              <MenuItem value={"rating"}>Rating </MenuItem>
                              <MenuItem value={"single"}>
                                Single Selection
                              </MenuItem>
                              <MenuItem value={"multiple"}>
                                Multiple Selection
                              </MenuItem>
                              {/* <MenuItem value={"condition statement"}>
                                  Condition Statement
                                </MenuItem> */}
                            </Select>
                          </FormControl>

                          {questionType === "single" ||
                          questionType === "multiple" ? (
                            <Grid
                              item
                              md={12}
                              xs={12}
                              style={{ marginTop: "3%" }}
                            >
                              <FormControl fullWidth size="small" required>
                                <InputLabel>Select Option Number</InputLabel>
                                <Select
                                  className={classes.selectClass}
                                  required
                                  MenuProps={{
                                    PaperProps: {
                                      style: { marginTop: 45 },
                                    },
                                  }}
                                  value={optionNumber}
                                  onChange={(event) => {
                                    setOptionNumber(event.target.value);
                                    let array = [];
                                    if (
                                      checkValue === 1 &&
                                      originalTopic !== "yes/no" &&
                                      originalTopic !== "rating"
                                    ) {
                                      array = [...optionValues];
                                      if (event.target.value > optionNumber) {
                                        let arr = new Array(
                                          event.target.value - optionNumber
                                        ).fill("");
                                        arr.map((val) => array.push(""));
                                      } else {
                                        let a = new Array(
                                          optionNumber - event.target.value
                                        );
                                        a.fill("");
                                        a.map((val) => array.pop());
                                      }
                                      setOptionValues(array);
                                    } else {
                                      let arr = new Array(event.target.value);
                                      arr.fill("");
                                      setOptionValues(arr);
                                    }
                                  }}
                                  label="Select Option Number"
                                  fullWidth
                                >
                                  {questionNumber.map((ques) => (
                                    <MenuItem value={ques} key={ques}>
                                      {ques}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          ) : questionType === "yes/no" ? (
                            <Grid>
                              <Grid
                                container
                                spacing={2}
                                style={{ marginTop: "3%" }}
                              >
                                <Grid
                                  item
                                  md={6}
                                  xs={6}
                                  style={{ marginTop: "4%" }}
                                >
                                  <Typography>Yes</Typography>
                                </Grid>
                                <Grid item md={6} xs={6}>
                                  <TextField
                                    required
                                    value={yesVal}
                                    type={"number"}
                                    label={"Weightage of option Yes"}
                                    onChange={(event) => {
                                      setYesVal(parseInt(event.target.value));
                                    }}
                                  />
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                spacing={2}
                                style={{ marginTop: "3%" }}
                              >
                                <Grid
                                  item
                                  md={6}
                                  xs={6}
                                  style={{ marginTop: "4%" }}
                                >
                                  <Typography>No</Typography>
                                </Grid>
                                <Grid item md={6} xs={6}>
                                  <TextField
                                    required
                                    value={noVal}
                                    type={"number"}
                                    label={"Weightage of option No"}
                                    onChange={(event) => {
                                      setNoVal(parseInt(event.target.value));
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          ) : null}

                          {questionType === "single" ||
                          questionType === "multiple"
                            ? RandomFields()
                            : null}
                          {questionType === "single" ||
                          questionType === "multiple"
                            ? count !== parseInt(weightage) && count !== 0
                              ? validationMsg()
                              : null
                            : questionType === "yes/no"
                            ? yesVal + noVal !== parseInt(weightage)
                              ? validationMsg()
                              : null
                            : null}
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
                              disabled={
                                questionType === "single" ||
                                questionType === "multiple"
                                  ? (questionType !== "single" &&
                                      questionType !== "multiple") ||
                                    count === parseInt(weightage)
                                    ? false
                                    : true
                                  : questionType === "yes/no"
                                  ? yesVal + noVal === parseInt(weightage)
                                    ? false
                                    : true
                                  : false
                              }
                            >
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
                  varient="contained"
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
                    onClick={UpdateQuestion}
                    style={{
                      marginRight: "8px",
                    }}
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
                      props.history.push("/app/managequestions");
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
      )}
    </>
  );
};

export default EditQuestion;
