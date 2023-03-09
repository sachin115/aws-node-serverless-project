import {
  Box,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Divider,
  Checkbox,
  FormGroup,
  Card,
  FormControl,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageIcon from "@material-ui/icons/Image";
import DescriptionIcon from "@material-ui/icons/Description";
import { useParams, useHistory } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import { v4 } from "uuid";
import useStyle from "../styles";
import { Rating } from "@material-ui/lab";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import AWS from "aws-sdk";
import Tab from "@material-ui/core/Tab";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Constants from "../../Customutils/Config";
import Breadcrumb from "../../Components/Breadcrumbs";
import { ValidatorForm } from "react-material-ui-form-validator";
toast.configure();
const notify = () => toast("Session Expired...!");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const AnswerQuestionOfTopic = () => {
  const classes = useStyle();
  const { dispatch, setUserDetails } = useUserDispatch();
  const params = useParams();
  const history = useHistory();
  const { userDetails } = useUserState();
  const { roleDetails } = userDetails;
  const { id, auditeeId } = params;
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionRequired, setActionRequired] = useState(false);
  const [currentStateAnswers, setCurrentStateAnswers] = useState([]);
  const [actionRequirdForButton, setActionRequirdForButton] = useState([]);
  const [checkbox, setCheckBox] = useState([]);
  const [currentStepAttachment, setCurrentStepAttachment] = useState([]);
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const [attemptedQuestion, setAttemptedQuestion] = useState(0);
  const [allQuestions, setAllQuestion] = useState(0);
  const [value, setValue] = useState(0);
  const [mappedCategories, setMappedCategories] = useState([]);
  const [auditStartDate, setAuditStartDate] = useState(
    new Date().toUTCString()
  );
  const [auditCompleteOnDate, setAuditCompleteOnDate] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const s3 = new AWS.S3({
    region: Constants.AWS.region,
    accessKeyId: Constants.AWS.accessKeyId,
    secretAccessKey: Constants.AWS.secretAccessKey,
  });

  const GetCategoriesOfAudit = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_TOPIC_AND_QUESTION",
        `${id}/${auditeeId}`
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        const { auditsDetailsResponse } = response.data;
        const { Items } = auditsDetailsResponse.topicAndQuestion;
        if (Items.length > 0) {
          setAuditCompleteOnDate(
            new Date() >
              new Date(auditsDetailsResponse.auditData.auditCompleteOnDate)
          );
          setMappedCategories(Items[0].categories);
          let activeCategoryIndex = Items[0].categories.findIndex(
            (e) => e.catId === Items[0].activeCategory
          );
          //let activeCategoryIndex = Items[0].activeCategory;
          const activeCategory = Items[0].categories[activeCategoryIndex];
          const activeCategoryQuestion =
            activeCategory.topicAndQuestion[Items[0].activeStep].queAndAns;

          setCurrentStateAnswers([...activeCategoryQuestion]);
          setValue(activeCategoryIndex > -1 ? activeCategoryIndex : 0);
          setActionRequired(Items[0].actionRequired);
          setActiveStep(Items[0].activeStep);
          setAuditStartDate(
            new Date(auditsDetailsResponse.auditStartDate).toLocaleDateString()
          );

          let actionRequiredArray = [],
            attemptedQues = 0,
            allQues = 0,
            checkBox = [];
          if (Items[0].categories.length > 0) {
            Items[0].categories.map((cat, index1) => {
              if (cat.topicAndQuestion && cat.topicAndQuestion.length > 0) {
                cat.topicAndQuestion.map((topic) => {
                  if (topic.queAndAns && topic.queAndAns.length > 0) {
                    topic.queAndAns.map((que, ind) => {
                      if (que.actionRequired) {
                        actionRequiredArray.push(que.actionRequired);
                      }
                      if (que.answer) {
                        attemptedQues += 1;
                      }
                      allQues += 1;
                      if (
                        cat.catId === activeCategory.catId &&
                        que.questionType === "multiple"
                      ) {
                        checkBox[ind] = que.answer
                          ? que.answer
                          : new Array(que.optionValues.length)
                              .fill("")
                              .map((_) => "");
                      }
                    });
                  }
                });
                setCheckBox([...checkBox]);
              }
            });
            setActionRequirdForButton([...actionRequiredArray]);
            setAttemptedQuestion(attemptedQues);
            setAllQuestion(allQues);
          }
          setIsLoading(false);
          console.log("Complete On date", auditCompleteOnDate);
        }
      }
    } catch (error) {
      console.log("Error==>", error);
    }
  };

  const handleNext = (i, data, step) => {
    const res = mappedCategories.map((el) => {
      if (el.topicAndQuestion[i] && el.topicAndQuestion[i].queAndAns) {
        const result =
          el.topicAndQuestion[i].queAndAns &&
          el.topicAndQuestion[i].queAndAns.map((ele, indx) => {
            if (data[indx] && data[indx].queId === ele.queId) {
              return {
                ...ele,
                answer: currentStateAnswers[indx].answer,
                auditorComment: currentStateAnswers[indx].comment,
                actionRequired: currentStateAnswers[indx].actionRequired,
                auditorCommentAndAttachmentHistory: [
                  {
                    comment: currentStateAnswers[indx].comment,
                    attachment:
                      currentStepAttachment.find(
                        (attachElement) =>
                          attachElement.queId === ele.questionId
                      ) &&
                      currentStepAttachment.find(
                        (attachElement) =>
                          attachElement.queId === ele.questionId
                      ).attachment,
                    createdDate: new Date().toUTCString(),
                    createdBy:
                      userDetails.activeUserDetails.firstName +
                      " " +
                      userDetails.activeUserDetails.lastName,
                  },
                ],
              };
            } else {
              return ele;
            }
          });
        let arr = { ...el };
        arr.topicAndQuestion[i].queAndAns = result;
        return { ...arr };
      } else {
        return el;
      }
    });

    setMappedCategories([...res]);
    let temp = {};
    let tempArray = [],
      checkBoxValue = [];
    let newCurrentStepAttachment = [];
    let Categories = mappedCategories[value].topicAndQuestion;
    let topic = Categories[step !== Categories.length - 1 ? step + 1 : step];
    topic.queAndAns.forEach((item, ind) => {
      if (item.answer || item.auditorComment) {
        temp = {
          answer: item.answer,
          comment: item.auditorComment,
          actionRequired: item.actionRequired,
        };
        if (item.questionType === "multiple") {
          checkBoxValue[ind] = item.answer
            ? item.answer
            : new Array(item.optionValues.length).fill("").map((_) => "");
        }
        tempArray.push(temp);
        setCurrentStateAnswers([...tempArray]);
        if (
          item.auditorCommentAndAttachmentHistory &&
          item.auditorCommentAndAttachmentHistory.length > 0 &&
          item.auditorCommentAndAttachmentHistory[0].attachment
        ) {
          newCurrentStepAttachment = [
            ...newCurrentStepAttachment,
            {
              queId: item.questionId,
              attachment: item.auditorCommentAndAttachmentHistory[0].attachment,
            },
          ];
        }
      } else {
        setCurrentStateAnswers([]);
      }
    });
    setCheckBox([...checkBoxValue]);
    setCurrentStepAttachment([...newCurrentStepAttachment]);

    let actionRequiredArray = [],
      actionCompletedCheck = [],
      attemptedQues = 0,
      allQues = 0;
    res.map((cat) => {
      if (cat.topicAndQuestion && cat.topicAndQuestion.length > 0) {
        cat.topicAndQuestion.map((topic) => {
          if (topic.queAndAns && topic.queAndAns.length > 0) {
            topic.queAndAns.map((que) => {
              if (que.actionRequired) {
                actionRequiredArray.push(que.actionRequired);
              }
              if (que.answer) {
                attemptedQues += 1;
              }
              allQues += 1;
            });
          }
        });
      }
    });
    setActionRequirdForButton([...actionRequiredArray]);
    setAttemptedQuestion(attemptedQues);
    setAllQuestion(allQues);
    if (!auditCompleteOnDate) {
      setIsApiLoading(true);
      saveQueAns(res, step).then((result) => {
        setActiveStep((prevActiveStep) =>
          prevActiveStep === mappedCategories[value].topicAndQuestion
            ? 0
            : prevActiveStep + 1
        );
      });
    } else {
      if (
        step === mappedCategories[value].topicAndQuestion.length - 1 &&
        value !== mappedCategories.length - 1
      ) {
        setValue((preValue) => preValue + 1);
      }

      setActiveStep((prevActiveStep) =>
        prevActiveStep === mappedCategories[value].topicAndQuestion
          ? 0
          : prevActiveStep + 1
      );
    }
  };

  const handleBack = (i, step) => {
    let d = [];
    let temp = {};

    let Categories = mappedCategories[value].topicAndQuestion;
    let topic = Categories[step - 1];
    let newCurrentStepAttachment = [],
      checkBoxValue = [];

    topic.queAndAns.forEach((item, ind) => {
      if (item.questionType === "multiple" && item.answer) {
        checkBoxValue[ind] = item.answer
          ? item.answer
          : new Array(item.optionValues.length).fill("").map((_) => "");
      }
      temp = {
        answer: item.answer,
        comment: item.auditorComment,
        actionRequired: item.actionRequired,
      };
      d.push(temp);
      setCurrentStateAnswers([...d]);
      if (
        item.auditorCommentAndAttachmentHistory &&
        item.auditorCommentAndAttachmentHistory.length > 0 &&
        item.auditorCommentAndAttachmentHistory[0].attachment
      ) {
        newCurrentStepAttachment = [
          ...newCurrentStepAttachment,
          {
            queId: item.questionId,
            attachment: item.auditorCommentAndAttachmentHistory[0].attachment,
          },
        ];
      }
    });
    console.log("NewCurrentStepAttachment", newCurrentStepAttachment);
    setCurrentStepAttachment([...newCurrentStepAttachment]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCheckBox([...checkBoxValue]);
  };

  const onChangeRadio = (event, index) => {
    let allQuestionsAnswers = [...currentStateAnswers];
    if (allQuestionsAnswers[index])
      allQuestionsAnswers[index].answer = event.target.value;
    else allQuestionsAnswers[index] = { answer: event.target.value };
    setCurrentStateAnswers([...allQuestionsAnswers]);
  };

  const onChangeCheckBox = (event, index, ind) => {
    let checkBoxValue = [...checkbox];
    let allCheckBoxValue = [...checkbox[ind]];

    let allQuestionsAnswers = [...currentStateAnswers];
    if (allCheckBoxValue[index] && allCheckBoxValue[index] !== "") {
      allCheckBoxValue[index] = "";
    } else if (allCheckBoxValue[index] && allCheckBoxValue[index] === "") {
      allCheckBoxValue[index] = event.target.value;
    } else {
      allCheckBoxValue[index] = event.target.value;
    }
    checkBoxValue[ind] = allCheckBoxValue;
    setCheckBox([...checkBoxValue]);

    if (allQuestionsAnswers[ind])
      allQuestionsAnswers[ind].answer = [...allCheckBoxValue];
    else allQuestionsAnswers[ind] = { answer: [...allCheckBoxValue] };
    setCurrentStateAnswers([...allQuestionsAnswers]);
  };

  const onChangeComment = (event, index) => {
    let allQuestionsComment = [...currentStateAnswers];
    if (allQuestionsComment[index])
      allQuestionsComment[index].comment = event.target.value;
    else allQuestionsComment[index] = { comment: event.target.value };
    setCurrentStateAnswers([...allQuestionsComment]);
  };

  const onChangeActionRequired = (event, index) => {
    let allQuestionActionRequired = [...currentStateAnswers];
    if (allQuestionActionRequired[index]) {
      allQuestionActionRequired[index].actionRequired = event.target.checked;
    } else {
      allQuestionActionRequired[index] = {
        actionRequired: event.target.checked,
      };
    }
    setCurrentStateAnswers([...allQuestionActionRequired]);
  };

  const onChangeRating = (event, value, index) => {
    let allQuestionsAnswers = [...currentStateAnswers];
    if (allQuestionsAnswers[index]) allQuestionsAnswers[index].answer = value;
    else allQuestionsAnswers[index] = { answer: value };
    setCurrentStateAnswers([...allQuestionsAnswers]);
  };

  const handleCapture = async (event, questionId) => {
    try {
      setIsUploadLoading(true);
      const imageFile = event.target.files;
      let replaceFiles = [];
      for (let [key, value] of Object.entries(imageFile)) {
        let ext = value.name.split(".");
        let docId = v4();
        let name = `${docId}.${ext[ext.length - 1]}`;
        replaceFiles.push({
          docName: value.name,
          docId,
          docType: value.type,
          extension: ext[ext.length - 1],
        });

        await s3
          .upload({
            Bucket: Constants.AWS.bucketName,
            Key: `temp/${name}`,
            Body: value,
            ContentType: value.type,
          })
          .promise();
      }
      let updatedAttachment = currentStepAttachment;
      const findQuestion = updatedAttachment.findIndex(
        (ele) => ele.queId === questionId
      );
      if (findQuestion >= 0) {
        updatedAttachment[findQuestion].attachment = [...replaceFiles];
      } else {
        updatedAttachment.push({ queId: questionId, attachment: replaceFiles });
      }
      console.log("updatedAttachment", updatedAttachment);
      setCurrentStepAttachment([...updatedAttachment]);
      setIsUploadLoading(false);
    } catch (err) {
      console.log("Error in logo upload", err);
      setIsUploadLoading(false);
    }
  };

  const DeleteDoc = async (attachment, queId) => {
    try {
      const indexOfCurrentQuestion = currentStepAttachment.findIndex(
        (ele) => ele.queId === queId
      );
      const newCurrentQuestionAttachment = [
        ...currentStepAttachment[indexOfCurrentQuestion].attachment,
      ];

      const indexOfCurrentAttachment = newCurrentQuestionAttachment.findIndex(
        (ele) => ele.docId === attachment.docId
      );
      newCurrentQuestionAttachment.splice(indexOfCurrentAttachment, 1);

      const newCurrentStepAttachment = [...currentStepAttachment];
      newCurrentStepAttachment[indexOfCurrentQuestion].attachment =
        newCurrentQuestionAttachment;
      setCurrentStepAttachment([...newCurrentStepAttachment]);
      var deleteParams = {
        Bucket: Constants.AWS.bucketName,
        Key: `audit-doc/${userDetails.entityDetails.id}/${id}/${attachment.docId}.${attachment.extension}`,
      };
      await s3
        .deleteObject(deleteParams, function (err, data) {
          if (err) console.log(err);
          else console.log(data);
        })
        .promise();
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleClick = (event, index) => {
    document.getElementById(`fileUpload${index}`).click();
  };

  const onInvalidMessageChange = (event) => {
    event.target.setCustomValidity(
      "Please select at least one option to proceed"
    );
  };

  const option = (question, indx) => {
    if (question.questionType === "single") {
      return (
        <RadioGroup
          required
          row
          value={
            currentStateAnswers[indx] ? currentStateAnswers[indx].answer : ""
          }
          onChange={(event) => {
            onChangeRadio(event, indx);
          }}
        >
          {}{" "}
          {question.optionValues !== "" &&
            question.optionValues.map((val, ind) => (
              <FormControlLabel
                value={val.optionVal}
                control={<Radio color="primary" required={true} />}
                label={`${val.optionVal} (${val.optionWeight})`}
              />
            ))}
        </RadioGroup>
      );
    } else if (question.questionType === "multiple") {
      return (
        <>
          <FormControl required component="fieldset">
            <FormGroup row>
              {question.optionValues !== "" &&
                question.optionValues.map((val, ind) => (
                  <FormControlLabel
                    value={val.optionVal}
                    control={
                      <Checkbox
                        onInvalid={onInvalidMessageChange}
                        color="primary"
                        required={
                          checkbox[indx]
                            ? checkbox[indx].filter(
                                (valueOfCheckBox) =>
                                  valueOfCheckBox === "" ||
                                  valueOfCheckBox === null
                              ).length === checkbox[indx].length
                              ? true
                              : false
                            : true
                        }
                        checked={
                          currentStateAnswers[indx] &&
                          currentStateAnswers[indx].answer &&
                          currentStateAnswers[indx].answer[ind] ===
                            val.optionVal
                            ? true
                            : false
                        }
                        onChange={(event) => {
                          onChangeCheckBox(event, ind, indx);
                        }}
                      />
                    }
                    label={`${val.optionVal} (${val.optionWeight})`}
                  />
                ))}
            </FormGroup>
            {checkbox[indx] ? (
              checkbox[indx].filter(
                (valueOfCheckBox) =>
                  valueOfCheckBox === "" || valueOfCheckBox === null
              ).length === checkbox[indx].length ? (
                <FormHelperText style={{ color: "red" }}>
                  Choose at least 1 option
                </FormHelperText>
              ) : null
            ) : (
              <FormHelperText style={{ color: "red" }}>
                Choose at least 1 option
              </FormHelperText>
            )}
          </FormControl>
        </>
      );
    } else if (question.questionType === "yes/no") {
      return (
        <RadioGroup
          required={true}
          row
          value={
            currentStateAnswers[indx] ? currentStateAnswers[indx].answer : ""
          }
          onChange={(event) => {
            onChangeRadio(event, indx);
          }}
        >
          <FormControlLabel
            required
            value={"yes"}
            control={<Radio color="primary" required={true} />}
            label={`Yes (${question.yesVal === "" ? 0 : question.yesVal})`}
          />
          <FormControlLabel
            value={"no"}
            control={<Radio color="primary" required={true} />}
            label={`No (${question.noVal === "" ? 0 : question.noVal})`}
          />
        </RadioGroup>
      );
    } else {
      return (
        <Rating
          aria-required={true}
          defaultValue={0}
          max={10}
          value={
            currentStateAnswers[indx] ? currentStateAnswers[indx].answer : 0
          }
          name={question.id}
          onChange={(event, value) => {
            onChangeRating(event, value, indx);
          }}
        />
      );
    }
  };

  const saveQueAns = async (allData, stepVal) => {
    try {
      let activeStep =
        stepVal === mappedCategories[value].topicAndQuestion.length - 1
          ? 0
          : stepVal + 1;
      let activeCategoryId =
        stepVal === mappedCategories[value].topicAndQuestion.length - 1 &&
        value !== mappedCategories.length - 1
          ? mappedCategories[value + 1].catId
          : stepVal === mappedCategories[value].topicAndQuestion.length - 1 &&
            value === mappedCategories.length - 1
          ? mappedCategories[mappedCategories.length > 1 ? 0 : value].catId
          : mappedCategories[value].catId;

      const params = {
        auditId: id,
        auditeeId: auditeeId,
        category: allData[value],
        activeStep: activeStep,
        activeCategory: activeCategoryId,
      };

      let response = await callApi("CREATE", "SAVE_ANSWERS", params);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        for (let question of currentStepAttachment) {
          for (let attachment of question.attachment) {
            await s3
              .copyObject({
                Bucket: Constants.AWS.bucketName,
                CopySource: `${Constants.AWS.bucketName}/temp/${attachment.docId}.${attachment.extension}`,
                Key: `audit-doc/${userDetails.entityDetails.id}/${id}/${attachment.docId}.${attachment.extension}`,
              })
              .promise();
          }
        }
        if (
          stepVal === mappedCategories[value].topicAndQuestion.length - 1 &&
          value !== mappedCategories.length - 1
        ) {
          setValue((preValue) => preValue + 1);
          GetCategoriesOfAudit();
        } else if (
          value === mappedCategories.length - 1 &&
          stepVal === mappedCategories[value].topicAndQuestion.length - 1
        ) {
          if (!auditCompleteOnDate) submitAudit();
        }
      }
      setIsApiLoading(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const submitAudit = async () => {
    try {
      const params = {
        auditeeId: auditeeId,
        auditId: id,
        isActionRequired:
          actionRequired && actionRequirdForButton.length > 0 ? true : false,
        role: roleDetails.name,
      };

      let response = await callApi("CREATE", "SUBMIT_AUDIT", params);
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Submit Audit", response.data);
        history.push("/app/inprogress-audits");
      }
    } catch (error) {
      console.log("Submit Audit Error =>", error);
    }
  };

  const handlePreviousCategories = () => {
    setValue((prevCatValue) => prevCatValue - 1);
    let previousCategoriesData = [],
      checkBoxValue = [];
    let temp = {};
    let newCurrentStepAttachment = [];

    let Categories = mappedCategories[value - 1].topicAndQuestion;
    let topic = Categories[0];

    topic.queAndAns.forEach((item, ind) => {
      console.log("item", item);
      if (roleDetails.name === "auditee") {
        temp = {
          comment: item.auditeeComment,
          actionRequired: item.actionRequired,
        };
      } else {
        temp = {
          answer: item.answer,
          comment: item.auditorComment,
          actionRequired: item.actionRequired,
          actionCompleted: item.actionCompleted,
        };
        if (item.questionType === "multiple") {
          checkBoxValue[ind] = item.answer;
        }
      }
      previousCategoriesData.push(temp);
      if (
        item.auditorCommentAndAttachmentHistory &&
        item.auditorCommentAndAttachmentHistory.length > 0 &&
        item.auditorCommentAndAttachmentHistory[0].attachment
      ) {
        newCurrentStepAttachment = [
          ...newCurrentStepAttachment,
          {
            queId: item.questionId,
            attachment: item.auditorCommentAndAttachmentHistory[0].attachment,
          },
        ];
      }
    });
    console.log("NewCurrentStateAttachment", newCurrentStepAttachment);
    setCurrentStepAttachment([...newCurrentStepAttachment]);
    setCurrentStateAnswers([...previousCategoriesData]);
    setCheckBox([...checkBoxValue]);
    setActiveStep(0);
  };

  useEffect(() => {
    GetCategoriesOfAudit();
  }, []);
  console.log("ActionRequired", actionRequired);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Breadcrumb
            breadcrumbElements={[
              {
                label: "Audits",
                path: "/app/dashboard",
              },
              {
                label: "Inprogress Audits",
                path: "/app/manageinprogressaudits/inprogressaudits",
              },
              { label: "Questions" },
            ]}
          />
          <Card className={classes.cardClass}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <Typography className={classes.typographyClass}>
                  Start Date
                </Typography>
                <Typography className={classes.typographyClass}>
                  {new Date(auditStartDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography className={classes.typographyClass}>
                  Unanswered Questions
                </Typography>
                <Typography className={classes.typographyClass}>
                  {allQuestions - attemptedQuestion}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography className={classes.typographyClass}>
                  Attempted Questions
                </Typography>
                <Typography className={classes.typographyClass}>
                  {attemptedQuestion}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography className={classes.typographyClass}>
                  Total Questions
                </Typography>
                <Typography className={classes.typographyClass}>
                  {allQuestions}
                </Typography>
              </Grid>
            </Grid>
          </Card>
          <Card
            position="static"
            style={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              padding: "2px",
            }}
            //color="primary"
          >
            <Tabs
              value={value}
              aria-label="simple tabs example"
              indicatorColor="none"
            >
              {mappedCategories.map((value) => (
                <Tab label={value.categoryName} />
              ))}
            </Tabs>
          </Card>
          {mappedCategories.map((val, ind) => (
            <TabPanel value={value} index={ind} key={`${ind}`}>
              <Stepper
                activeStep={activeStep}
                style={{ margin: "-15px" }}
                orientation="vertical"
              >
                {val.topicAndQuestion &&
                  val.topicAndQuestion.map((step, i) => (
                    <Step key={`${i}`}>
                      <StepLabel
                        className={
                          activeStep === i
                            ? classes.activeStep
                            : classes.inactiveStep
                        }
                      >
                        {step.topicName}
                      </StepLabel>

                      <StepContent>
                        {activeStep === i && (
                          <ValidatorForm
                            onSubmit={(e) =>
                              handleNext(i, step.queAndAns, activeStep)
                            }
                          >
                            <Grid container>
                              {console.log(
                                "step.mappedQuestions",
                                step.queAndAns
                              )}
                              {step.queAndAns &&
                                step.queAndAns.map((question, index) => {
                                  console.log("Question", question);
                                  return (
                                    <Grid
                                      key={`${index}`}
                                      item
                                      md={12}
                                      xs={12}
                                      style={{ display: "grid" }}
                                    >
                                      <Grid container>
                                        <Grid
                                          item
                                          xs={12}
                                          md={9}
                                          style={{ display: "grid" }}
                                        >
                                          <Typography
                                            style={{
                                              display: "flex",
                                              textAlign: "left",
                                              justifyContent: "flex-start",
                                            }}
                                          >
                                            {" "}
                                            {`Q.${index + 1} `}
                                            {question.question}
                                          </Typography>
                                          {roleDetails.name === "auditor" &&
                                            option(question, index)}
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          md={3}
                                          style={{ display: "grid" }}
                                        >
                                          <Typography
                                            style={{
                                              display: "flex",
                                              textAlign: "right",
                                              justifyContent: "flex-end",
                                            }}
                                          >
                                            Weightage: {question.weightage}
                                          </Typography>
                                        </Grid>
                                        {question.hasComment ? (
                                          <Grid container spacing={2}>
                                            <Grid item xs={12} md={9}>
                                              <Typography
                                                style={{
                                                  display: "flex",
                                                  textAlign: "left",
                                                  justifyContent: "flex-start",
                                                }}
                                              >
                                                Add Note:
                                              </Typography>
                                              <TextField
                                                multiline
                                                variant="standard"
                                                required={true}
                                                value={
                                                  currentStateAnswers[index]
                                                    ? currentStateAnswers[index]
                                                        .comment
                                                    : ""
                                                }
                                                onChange={(event) => {
                                                  onChangeComment(event, index);
                                                }}
                                                //aria-label="minimum height"
                                                style={{
                                                  display: "flex",
                                                  textAlign: "left",
                                                  justifyContent: "flex-start",
                                                }}
                                              />
                                            </Grid>
                                            {actionRequired ? (
                                              <Grid item xs={12} md={3}>
                                                <FormControlLabel
                                                  style={{
                                                    display: "flex",
                                                    // alignContent: "right",
                                                    // alignItems: "right",
                                                    // textAlign: "right",
                                                    justifyContent: "flex-end",
                                                    margin: "50px 0 0 0",
                                                  }}
                                                  control={
                                                    <Checkbox
                                                      checked={
                                                        currentStateAnswers[
                                                          index
                                                        ]
                                                          ? currentStateAnswers[
                                                              index
                                                            ].actionRequired
                                                          : ""
                                                      }
                                                      onChange={(event) => {
                                                        onChangeActionRequired(
                                                          event,
                                                          index
                                                        );
                                                      }}
                                                      name="gilad"
                                                      color="primary"
                                                    />
                                                  }
                                                  label="Action Required"
                                                />
                                              </Grid>
                                            ) : null}
                                          </Grid>
                                        ) : (
                                          ""
                                        )}
                                        <Grid
                                          container
                                          style={{
                                            marginTop: "4px",
                                          }}
                                        >
                                          <Typography
                                            variant="h6"
                                            noWrap
                                            component="div"
                                          >
                                            {currentStepAttachment.length > 0 &&
                                              currentStepAttachment.find(
                                                (queAttachment) =>
                                                  queAttachment.queId ===
                                                  question.questionId
                                              ) &&
                                              currentStepAttachment
                                                .find(
                                                  (queAttachment) =>
                                                    queAttachment.queId ===
                                                    question.questionId
                                                )
                                                .attachment.map((attach) => {
                                                  console.log("Attach", attach);
                                                  return (
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        alignItem: "flex-start",
                                                        justifyContent:
                                                          "flex-start",
                                                        marginTop: "10px",
                                                      }}
                                                    >
                                                      {attach.docType ===
                                                        "image/png" ||
                                                      attach.docType ===
                                                        "image/jpeg" ? (
                                                        <ImageIcon
                                                          color="secondary"
                                                          style={{
                                                            marginRight: "8px",
                                                          }}
                                                        />
                                                      ) : (
                                                        <DescriptionIcon
                                                          color="secondary"
                                                          style={{
                                                            marginRight: "8px",
                                                          }}
                                                        />
                                                      )}
                                                      <Typography>
                                                        {attach.docName}
                                                      </Typography>

                                                      <DeleteIcon
                                                        onClick={() => {
                                                          DeleteDoc(
                                                            attach,
                                                            question.queId
                                                          );
                                                        }}
                                                        color="primary"
                                                        style={{
                                                          marginLeft: "5px",
                                                          cursor: "pointer",
                                                        }}
                                                      />
                                                    </div>
                                                  );
                                                })}
                                          </Typography>
                                          {question.hasAttachment && (
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              style={{
                                                position: "relative",
                                              }}
                                            >
                                              {isUploadLoading && (
                                                <CircularProgress
                                                  style={{
                                                    position: "absolute",
                                                    top: "-5px",
                                                    left: "6%",
                                                  }}
                                                />
                                              )}

                                              <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                disabled={isUploadLoading}
                                                onClick={(event) => {
                                                  handleClick(event, index);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  textAlign: "left",
                                                  justifyContent: "flex-start",
                                                  marginRight: "10px",
                                                }}
                                              >
                                                Attachment
                                                <input
                                                  type={"file"}
                                                  id={`fileUpload${index}`}
                                                  accept=".png/*,.xlsx/*,.pdf/*"
                                                  multiple
                                                  hidden
                                                  onChange={(event) => {
                                                    handleCapture(
                                                      event,
                                                      question.questionId
                                                    );
                                                  }}
                                                />
                                              </Button>
                                            </Grid>
                                          )}
                                          {<Grid item md={12} xs={12}></Grid>}
                                        </Grid>
                                      </Grid>
                                      <Divider
                                        variant="middle"
                                        style={{ width: "98%" }}
                                      />
                                    </Grid>
                                  );
                                })}
                              {isApiLoading && (
                                <CircularProgress
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "50%",
                                  }}
                                />
                              )}
                              {activeStep === 0 &&
                              activeStep === val.topicAndQuestion.length - 1 ? (
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.fieldContainer}
                                >
                                  <Box
                                    style={{
                                      float: "right",
                                      marginRight: "-13px",
                                    }}
                                  >
                                    {mappedCategories.length > 1 &&
                                      ind !== 0 && (
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handlePreviousCategories()
                                          }
                                        >
                                          Previous Categories
                                        </Button>
                                      )}
                                    {auditCompleteOnDate ? (
                                      <>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          disabled={isApiLoading}
                                          type="submit"
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          // onClick={(event) =>
                                          //   handleNext(
                                          //     i,
                                          //     step.queAndAns,
                                          //     activeStep
                                          //   )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        disabled={isApiLoading}
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        size="small"
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        // onClick={(event) =>
                                        //   handleNext(i, step.queAndAns, activeStep)
                                        // }
                                      >
                                        {activeStep ===
                                          val.topicAndQuestion.length - 1 &&
                                        actionRequired &&
                                        actionRequirdForButton.length === 0
                                          ? "Next"
                                          : activeStep ===
                                              val.topicAndQuestion.length - 1 &&
                                            actionRequired &&
                                            actionRequirdForButton.length > 0
                                          ? "Action Required"
                                          : "Save & Continue"}
                                      </Button>
                                    )}
                                  </Box>
                                </Grid>
                              ) : activeStep === 0 ? (
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.fieldContainer}
                                >
                                  <Box
                                    style={{
                                      float: "right",
                                      marginRight: "-13px",
                                    }}
                                  >
                                    {mappedCategories.length > 1 &&
                                      ind !== 0 && (
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handlePreviousCategories()
                                          }
                                        >
                                          Previous Categories
                                        </Button>
                                      )}
                                    {auditCompleteOnDate ? (
                                      <>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          type="submit"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          // onClick={(event) =>
                                          //   handleNext(
                                          //     i,
                                          //     step.queAndAns,
                                          //     activeStep
                                          //   )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        type="submit"
                                        disabled={isApiLoading}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        // onClick={(event) =>
                                        //   handleNext(i, step.queAndAns, activeStep)
                                        // }
                                      >
                                        Save & Continue
                                      </Button>
                                    )}
                                  </Box>
                                </Grid>
                              ) : activeStep !==
                                val.topicAndQuestion.length - 1 ? (
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.fieldContainer}
                                >
                                  <Box
                                    style={{
                                      float: "right",
                                      marginRight: "-13px",
                                    }}
                                  >
                                    {mappedCategories.length > 1 &&
                                      ind !== 0 && (
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handlePreviousCategories()
                                          }
                                        >
                                          Previous Categories
                                        </Button>
                                      )}{" "}
                                    {auditCompleteOnDate ? (
                                      <>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          type="submit"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          // onClick={(event) =>
                                          //   handleNext(
                                          //     i,
                                          //     step.queAndAns,
                                          //     activeStep
                                          //   )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          disabled={isApiLoading}
                                          type="submit"
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          // onClick={(event) =>
                                          //   handleNext(
                                          //     i,
                                          //     step.queAndAns,
                                          //     activeStep
                                          //   )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    )}
                                    ) : (
                                    <>
                                      <Button
                                        disabled={isApiLoading}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        style={{
                                          marginRight: "5px",
                                        }}
                                        onClick={(event) =>
                                          handleBack(i, activeStep)
                                        }
                                      >
                                        Previous
                                      </Button>
                                      <Button
                                        disabled={isApiLoading}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        // onClick={(event) =>
                                        //   handleNext(i, step.queAndAns, activeStep)
                                        // }
                                      >
                                        Save & Continue
                                      </Button>
                                    </>
                                    )
                                  </Box>
                                </Grid>
                              ) : activeStep ===
                                  val.topicAndQuestion.length - 1 &&
                                ind === mappedCategories.length - 1 ? (
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.fieldContainer}
                                >
                                  <Box
                                    style={{
                                      float: "right",
                                      marginRight: "-13px",
                                    }}
                                  >
                                    {mappedCategories.length > 1 &&
                                      ind !== 0 && (
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handlePreviousCategories()
                                          }
                                        >
                                          Previous Categories
                                        </Button>
                                      )}
                                    {auditCompleteOnDate ? (
                                      <>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          type="submit"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          // onClick={(event) =>
                                          //   handleNext(
                                          //     i,
                                          //     step.queAndAns,
                                          //     activeStep
                                          //   )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          disabled={isApiLoading}
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          type="submit"
                                          style={{
                                            marginRight: "8px",
                                          }}
                                          // onClick={(e) =>
                                          //   // handleNext(
                                          //   //   i,
                                          //   //   step.queAndAns,
                                          //   //   activeStep
                                          //   // )
                                          // }
                                        >
                                          {actionRequired &&
                                          actionRequirdForButton.length > 0
                                            ? "Action Required"
                                            : "Submit Audit"}
                                        </Button>
                                      </>
                                    )}
                                  </Box>
                                </Grid>
                              ) : (
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.fieldContainer}
                                >
                                  <Box
                                    style={{
                                      float: "right",
                                      marginRight: "-13px",
                                    }}
                                  >
                                    {mappedCategories.length > 1 &&
                                      ind !== 0 && (
                                        <>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            style={{
                                              marginRight: "5px",
                                            }}
                                            onClick={(event) =>
                                              handlePreviousCategories()
                                            }
                                          >
                                            Previous Categories
                                          </Button>
                                        </>
                                      )}
                                    {auditCompleteOnDate ? (
                                      <>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          type="submit"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          // onClick={(event) =>
                                          //   handleNext(
                                          //     i,
                                          //     step.queAndAns,
                                          //     activeStep
                                          //   )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          style={{
                                            marginRight: "5px",
                                          }}
                                          onClick={(event) =>
                                            handleBack(i, activeStep)
                                          }
                                        >
                                          Previous
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          type="submit"
                                          style={{
                                            marginRight: "8px",
                                          }}
                                          // onClick={(e) =>
                                          //   // handleNext(
                                          //   //   i,
                                          //   //   step.queAndAns,
                                          //   //   activeStep
                                          //   // )
                                          // }
                                        >
                                          Next
                                        </Button>
                                      </>
                                    )}
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </ValidatorForm>
                        )}
                      </StepContent>
                    </Step>
                  ))}
              </Stepper>
            </TabPanel>
          ))}
        </>
      )}
    </>
  );
};

export default AnswerQuestionOfTopic;
