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
  Modal,
  IconButton,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { useState } from "react";
import ImageIcon from "@material-ui/icons/Image";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import callApi from "../../Customutils/callApi";
import useStyle from "../styles";
import { Rating } from "@material-ui/lab";
import PropTypes from "prop-types";
import { useUserState, useUserDispatch } from "../../Customutils/UserContext";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AWS from "aws-sdk";
import { v4 } from "uuid";
import DescriptionIcon from "@material-ui/icons/Description";
import Constants from "../../Customutils/Config";
import { toast } from "react-toastify";
import { TextField, Chip } from "@mui/material";
import Breadcrumb from "../../Components/Breadcrumbs";
import DoneIcon from "@material-ui/icons/Done";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};

const AnswerQuestionOfUnderreviewAudits = () => {
  const s3 = new AWS.S3({
    region: Constants.AWS.region,
    accessKeyId: Constants.AWS.accessKeyId,
    secretAccessKey: Constants.AWS.secretAccessKey,
  });

  const classes = useStyle();
  const params = useParams();
  const history = useHistory();
  const { userDetails } = useUserState();
  const { roleDetails } = userDetails;
  const { dispatch, setUserDetails } = useUserDispatch();
  const { id, auditeeId } = params;
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionRequired, setActionRequired] = useState(false);
  const [currentStateAnswers, setCurrentStateAnswers] = useState([]);
  const [actionRequirdForButton, setActionRequirdForButton] = useState([]);
  const [checkbox, setCheckBox] = useState([]);
  const [allActionCompleted, setAllActionCompleted] = useState([]);
  const [currentStepAttachment, setCurrentStepAttachment] = useState([]);
  const [currentStepComment, setCurrentStepComment] = useState([]);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [mappedCategories, setMappedCategories] = useState([]);
  const [auditCompleteOnDate, setAuditCompleteOnDate] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [onOpen, setOnOpen] = useState(false);
  const [onClose, onSetClose] = useState(false);
  const [isPngLoading, setIsPngLoading] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [extension, setExtension] = useState("");

  const GetCategoriesOfAudit = async () => {
    try {
      const responseAllQuesAndAns = await callApi(
        "GET",
        "GET_ALL_TOPIC_AND_QUESTION",
        `${id}/${auditeeId}`
      );
      const response = responseAllQuesAndAns.data;
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }

      if (response.status === 200) {
        const { auditsDetailsResponse } = response;

        const auditData = auditsDetailsResponse.topicAndQuestion;
        if (roleDetails.name === "auditor") {
          const auditDataAuditor =
            auditsDetailsResponse.topicAndQuestion.Items[0];
          console.log("auditDataAuditor", auditDataAuditor);
          setMappedCategories(auditDataAuditor.categories);
          setAuditCompleteOnDate(
            new Date() >
              new Date(auditsDetailsResponse.auditData.auditCompleteOnDate)
          );

          let activeCategoryIndex = auditDataAuditor.categories.findIndex(
            (ele) => ele.catId === auditDataAuditor.activeCategory
          );

          const activeCategory =
            auditDataAuditor.categories[activeCategoryIndex];

          const activeCategoryQuestion =
            activeCategory.topicAndQuestion[
              activeCategory.topicAndQuestion.length === 1
                ? 0
                : auditDataAuditor.activeStep
            ].queAndAns;

          setCurrentStateAnswers([...activeCategoryQuestion]);
          setValue(activeCategoryIndex > -1 ? activeCategoryIndex : 0);
          setActionRequired(auditDataAuditor.actionRequired);
          setActiveStep(
            activeCategory.topicAndQuestion.length === 1
              ? 0
              : auditDataAuditor.activeStep
          );
          let actionRequiredArray = [],
            actionCompletedCheck = [];

          auditDataAuditor.categories.map((cat) => {
            if (cat.topicAndQuestion.length > 0) {
              cat.topicAndQuestion.map((topic) => {
                if (topic.queAndAns.length > 0) {
                  topic.queAndAns.map((que) => {
                    if (que.actionRequired) {
                      actionRequiredArray.push(que.actionRequired);
                    }
                    if (que.actionCompleted) {
                      actionCompletedCheck.push(que.actionCompleted);
                    }
                  });
                }
              });
            }
          });

          setActionRequirdForButton([...actionRequiredArray]);
          setAllActionCompleted([...actionCompletedCheck]);
        } else if (auditData.categories.length > 0) {
          setMappedCategories(auditData.categories);
          let activeCategoryIndex = auditData.categories.findIndex(
            (e) => e.catId === auditData.activeCategory
          );
          const activeCategory =
            auditData.categories[
              activeCategoryIndex === -1 ? 0 : activeCategoryIndex
            ];
          const activeCategoryQuestion =
            activeCategory.topicAndQuestion[
              activeCategory.topicAndQuestion.length === 1
                ? 0
                : auditData.activeStep
            ].queAndAns;
          setCurrentStateAnswers([...activeCategoryQuestion]);
          setValue(activeCategoryIndex > -1 ? activeCategoryIndex : 0);
          setActionRequired(auditData.actionRequired);
          setActiveStep(
            activeCategory.topicAndQuestion.length === 1
              ? 0
              : auditData.activeStep
          );
          setActiveStep(
            activeCategory.topicAndQuestion.length === 1
              ? 0
              : auditData.activeStep
          );
          let actionRequiredArray = [],
            actionCompletedCheck = [],
            checkBox = [];

          auditData.categories.map((cat) => {
            if (cat.topicAndQuestion.length > 0) {
              cat.topicAndQuestion.map((topic) => {
                if (topic.queAndAns.length > 0) {
                  topic.queAndAns.map((que, ind) => {
                    if (que.actionRequired) {
                      actionRequiredArray.push(que.actionRequired);
                    }
                    if (que.actionCompleted) {
                      actionCompletedCheck.push(que.actionCompleted);
                    }
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
          setAllActionCompleted([...actionCompletedCheck]);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error==>", error);
    }
  };

  const handleNext = (i, data, step) => {
    const res = mappedCategories.map((el) => {
      if (el.topicAndQuestion[i] && el.topicAndQuestion[i].queAndAns) {
        const result =
          el.topicAndQuestion[i] &&
          el.topicAndQuestion[i].queAndAns.map((ele, indx) => {
            if (data[indx] && data[indx].queId === ele.queId) {
              if (roleDetails.name === "auditee") {
                return {
                  ...ele,
                  actionRequired: currentStateAnswers[indx].actionRequired,
                  auditeeCommentAndAttachmentHistory:
                    ele.auditeeCommentAndAttachmentHistory &&
                    ele.auditeeCommentAndAttachmentHistory.length > 0
                      ? new Date(
                          ele.auditeeCommentAndAttachmentHistory[
                            ele.auditeeCommentAndAttachmentHistory.length - 1
                          ].createdDate
                        ) <
                        new Date(
                          ele.auditorCommentAndAttachmentHistory[
                            ele.auditorCommentAndAttachmentHistory.length - 1
                          ].createdDate
                        )
                        ? [
                            ...ele.auditeeCommentAndAttachmentHistory,
                            {
                              comment: currentStepComment[indx].auditeeComment,
                              attachment: currentStepAttachment.find(
                                (attachElement) =>
                                  attachElement.queId === ele.queId
                              ).attachment,
                              createdDate: new Date().toUTCString(),
                              createdBy:
                                userDetails.activeUserDetails.firstName +
                                " " +
                                userDetails.activeUserDetails.lastName,
                            },
                          ]
                        : ele.auditeeCommentAndAttachmentHistory.map(
                            (element, index) => {
                              if (
                                index ===
                                ele.auditeeCommentAndAttachmentHistory.length -
                                  1
                              ) {
                                return {
                                  comment:
                                    currentStepComment[indx].auditeeComment,
                                  attachment:
                                    currentStepAttachment.find(
                                      (attachElement) =>
                                        attachElement.queId === ele.queId
                                    ) &&
                                    currentStepAttachment.find(
                                      (attachElement) =>
                                        attachElement.queId === ele.queId
                                    ).attachment,
                                  createdDate: new Date().toUTCString(),
                                  createdBy:
                                    userDetails.activeUserDetails.firstName +
                                    " " +
                                    userDetails.activeUserDetails.lastName,
                                };
                              } else {
                                return { ...element };
                              }
                            }
                          )
                      : [
                          {
                            comment: currentStepComment[indx].auditeeComment,
                            attachment:
                              currentStepAttachment.find(
                                (attachElement) =>
                                  attachElement.queId === ele.queId
                              ) &&
                              currentStepAttachment.find(
                                (attachElement) =>
                                  attachElement.queId === ele.queId
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
                return {
                  ...ele,
                  answer: currentStateAnswers[indx].answer,
                  actionRequired: currentStateAnswers[indx].actionRequired,
                  actionCompleted: currentStateAnswers[indx].actionCompleted,
                  auditorCommentAndAttachmentHistory:
                    ele.auditorCommentAndAttachmentHistory &&
                    ele.auditeeCommentAndAttachmentHistory &&
                    ele.auditeeCommentAndAttachmentHistory.length > 0 &&
                    ele.auditorCommentAndAttachmentHistory.length > 0
                      ? new Date(
                          ele.auditeeCommentAndAttachmentHistory[
                            ele.auditeeCommentAndAttachmentHistory.length - 1
                          ].createdDate
                        ) >
                        new Date(
                          ele.auditorCommentAndAttachmentHistory[
                            ele.auditorCommentAndAttachmentHistory.length - 1
                          ].createdDate
                        )
                        ? [
                            ...ele.auditorCommentAndAttachmentHistory,
                            {
                              comment: currentStepComment[indx].auditorComment,
                              attachment:
                                currentStepAttachment.find(
                                  (attachElement) =>
                                    attachElement.queId === ele.queId
                                ) &&
                                currentStepAttachment.find(
                                  (attachElement) =>
                                    attachElement.queId === ele.queId
                                ).attachment,
                              createdDate: new Date().toUTCString(),
                              createdBy:
                                userDetails.activeUserDetails.firstName +
                                " " +
                                userDetails.activeUserDetails.lastName,
                            },
                          ]
                        : ele.auditorCommentAndAttachmentHistory &&
                          ele.auditorCommentAndAttachmentHistory.map(
                            (element, index) => {
                              if (
                                index ===
                                ele.auditorCommentAndAttachmentHistory.length -
                                  1
                              ) {
                                return {
                                  comment:
                                    currentStepComment[indx].auditorComment,
                                  attachment:
                                    currentStepAttachment.find(
                                      (attachElement) =>
                                        attachElement.queId === ele.queId
                                    ) &&
                                    currentStepAttachment.find(
                                      (attachElement) =>
                                        attachElement.queId === ele.queId
                                    ).attachment,
                                  createdDate: new Date().toUTCString(),
                                  createdBy:
                                    userDetails.activeUserDetails.firstName +
                                    " " +
                                    userDetails.activeUserDetails.lastName,
                                };
                              } else {
                                return { ...element };
                              }
                            }
                          )
                      : [
                          {
                            comment: currentStepComment[indx].auditorComment,
                            attachment:
                              currentStepAttachment.find(
                                (attachElement) =>
                                  attachElement.queId === ele.queId
                              ) &&
                              currentStepAttachment.find(
                                (attachElement) =>
                                  attachElement.queId === ele.queId
                              ).attachment,
                            createdDate: new Date().toUTCString(),
                            createdBy:
                              userDetails.activeUserDetails.firstName +
                              " " +
                              userDetails.activeUserDetails.lastName,
                          },
                        ],
                };
              }
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

    let actionRequiredArray = [],
      actionCompletedCheck = [];

    res.map((cat) => {
      if (cat.topicAndQuestion.length > 0) {
        cat.topicAndQuestion.map((topic) => {
          if (topic.queAndAns.length > 0) {
            topic.queAndAns.map((que) => {
              if (que.actionRequired) {
                actionRequiredArray.push(que.actionRequired);
              }
              if (que.actionCompleted) {
                actionCompletedCheck.push(que.actionCompleted);
              }
            });
          }
        });
      }
    });

    setActionRequirdForButton([...actionRequiredArray]);
    setAllActionCompleted([...actionCompletedCheck]);
    setCurrentStepComment([]);
    if (!auditCompleteOnDate) {
      setIsApiLoading(true);
      saveQueAns(res, step).then((val) => {
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

    let temp = {};
    let tempArray = [],
      checkBoxValue = [];
    let Categories = res[value].topicAndQuestion;
    let newCurrentStepAttachment = [],
      currentComment = [],
      currentCommentObj = {};
    let topic = Categories[step !== Categories.length - 1 ? step + 1 : step];
    topic.queAndAns.forEach((item, ind) => {
      if (roleDetails.name === "auditee") {
        temp = {
          actionRequired: item.actionRequired,
          auditorCommentAndAttachmentHistory:
            item.auditorCommentAndAttachmentHistory,
        };
        currentCommentObj = {
          auditeeComment: item.comment,
        };
        if (
          item.auditeeCommentAndAttachmentHistory &&
          item.auditeeCommentAndAttachmentHistory.length > 0 &&
          item.auditeeCommentAndAttachmentHistory[
            item.auditeeCommentAndAttachmentHistory.length - 1
          ].attachment
        ) {
          newCurrentStepAttachment = [
            ...newCurrentStepAttachment,
            {
              queId: item.queId,
              attachment:
                item.auditeeCommentAndAttachmentHistory[
                  item.auditeeCommentAndAttachmentHistory.length - 1
                ].attachment,
            },
          ];
        }
      } else {
        temp = {
          answer: item.answer,
          actionRequired: item.actionRequired,
          actionCompleted: item.actionCompleted,
          auditorCommentAndAttachmentHistory:
            item.auditorCommentAndAttachmentHistory,
          auditeeCommentAndAttachmentHistory:
            item.auditeeCommentAndAttachmentHistory,
        };
        if (item.questionType === "multiple") {
          checkBoxValue[ind] = item.answer;
        }
        currentCommentObj = {
          auditorComment: item.auditorComment,
        };
        if (
          item.auditorCommentAndAttachmentHistory &&
          item.auditorCommentAndAttachmentHistory.length > 0 &&
          item.auditeeCommentAndAttachmentHistory &&
          item.auditeeCommentAndAttachmentHistory.length > 0 &&
          item.auditorCommentAndAttachmentHistory[
            item.auditorCommentAndAttachmentHistory.length - 1
          ].attachment
        ) {
          newCurrentStepAttachment = [
            ...newCurrentStepAttachment,
            {
              queId: item.queId,
              attachment:
                item.auditeeCommentAndAttachmentHistory[
                  item.auditeeCommentAndAttachmentHistory.length - 1
                ].attachment,
            },
          ];
        }
      }
      tempArray.push(temp);
      currentComment.push(currentCommentObj);
    });
    setCurrentStepAttachment([...newCurrentStepAttachment]);
    setCurrentStateAnswers([...tempArray]);
    setCheckBox([...checkBoxValue]);
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
        Key: `audit-doc/${userDetails.entityDetails.id}/${id}/${attachment.docName}`,
      };
      await s3
        .deleteObject(deleteParams, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else console.log(data); // successful response
        })
        .promise();
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleBack = (i, step) => {
    let d = [];
    let temp = {};
    setCurrentStepComment([]);

    let Categories = mappedCategories[value].topicAndQuestion;
    let topic = Categories[step - 1];
    let newCurrentStepAttachment = [],
      checkBoxValue = [];

    topic.queAndAns.forEach((item, ind) => {
      if (roleDetails.name === "auditee") {
        temp = {
          auditeeComment: item.auditeeComment,
          actionRequired: item.actionRequired,
          auditorCommentAndAttachmentHistory:
            item.auditorCommentAndAttachmentHistory,
          auditeeCommentAndAttachmentHistory:
            item.auditeeCommentAndAttachmentHistory,
        };
        if (
          item.auditeeCommentAndAttachmentHistory &&
          item.auditeeCommentAndAttachmentHistory.length > 0 &&
          item.auditeeCommentAndAttachmentHistory[
            item.auditeeCommentAndAttachmentHistory.length - 1
          ].attachment
        ) {
          newCurrentStepAttachment = [
            ...newCurrentStepAttachment,
            {
              queId: item.queId,
              attachment:
                item.auditeeCommentAndAttachmentHistory[
                  item.auditeeCommentAndAttachmentHistory.length - 1
                ].attachment,
            },
          ];
        }
      } else {
        temp = {
          answer: item.answer,
          auditorComment: item.auditorComment,
          actionRequired: item.actionRequired,
          actionCompleted: item.actionCompleted,
          auditorCommentAndAttachmentHistory:
            item.auditorCommentAndAttachmentHistory,
          auditeeCommentAndAttachmentHistory:
            item.auditeeCommentAndAttachmentHistory,
        };

        if (item.questionType === "multiple" && item.answer) {
          checkBoxValue[ind] = item.answer;
        }
      }
      d.push(temp);
      setCurrentStateAnswers([...d]);
      if (
        item.auditorCommentAndAttachmentHistory &&
        item.auditorCommentAndAttachmentHistory.length > 0 &&
        item.auditorCommentAndAttachmentHistory[
          item.auditorCommentAndAttachmentHistory.length - 1
        ].attachment
      ) {
        newCurrentStepAttachment = [
          ...newCurrentStepAttachment,
          {
            queId: item.queId,
            attachment:
              item.auditorCommentAndAttachmentHistory[
                item.auditorCommentAndAttachmentHistory.length - 1
              ].attachment,
          },
        ];
      }
    });
    setCurrentStepAttachment([...newCurrentStepAttachment]);
    setCheckBox([...checkBoxValue]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
    let allQuestionsComment = [...currentStepComment];
    if (allQuestionsComment[index])
      if (roleDetails.name === "auditee") {
        allQuestionsComment[index].auditeeComment = event.target.value;
      } else {
        allQuestionsComment[index].auditorComment = event.target.value;
      }
    else {
      if (roleDetails.name === "auditee") {
        allQuestionsComment[index] = { auditeeComment: event.target.value };
      } else {
        allQuestionsComment[index] = { auditorComment: event.target.value };
      }
    }
    setCurrentStepComment([...allQuestionsComment]);
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

  const onChangeActionCompleted = (event, index) => {
    let allQuestionActionCompleted = [...currentStateAnswers];
    let allActionCompletedData = [...allActionCompleted];
    if (allQuestionActionCompleted[index]) {
      allQuestionActionCompleted[index].actionCompleted = event.target.checked;
      allActionCompletedData[index] = event.target.checked;
    } else {
      allQuestionActionCompleted[index] = {
        actionCompleted: event.target.checked,
      };
      allActionCompletedData[index] = event.target.checked;
    }
    setCurrentStateAnswers([...allQuestionActionCompleted]);
    setAllActionCompleted([...allActionCompletedData]);
  };

  const onChangeRating = (event, value, index) => {
    let allQuestionsAnswers = [...currentStateAnswers];
    if (allQuestionsAnswers[index]) allQuestionsAnswers[index].answer = value;
    else allQuestionsAnswers[index] = { answer: value };
    setCurrentStateAnswers([...allQuestionsAnswers]);
  };

  const option = (question, indx) => {
    if (question.questionType === "single") {
      return (
        <RadioGroup
          row
          required
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
            <FormGroup
              value={
                currentStateAnswers[indx]
                  ? currentStateAnswers[indx].answer
                  : ""
              }
            >
              {question.optionValues !== "" &&
                question.optionValues.map((val, ind) => (
                  <FormControlLabel
                    value={val.optionVal}
                    control={
                      <Checkbox
                        color="primary"
                        onInvalid={onInvalidMessageChange}
                        checked={
                          currentStateAnswers[indx] &&
                          currentStateAnswers[indx].answer &&
                          currentStateAnswers[indx].answer[ind] ===
                            val.optionVal
                            ? true
                            : false
                        }
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
          row
          value={
            currentStateAnswers[indx] ? currentStateAnswers[indx].answer : ""
          }
          onChange={(event) => {
            onChangeRadio(event, indx);
          }}
        >
          <FormControlLabel
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
          defaultValue={0}
          aria-required={true}
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
      let requiredDataIndex = allData.findIndex(
        (ele) => ele.catId === mappedCategories[value].catId
      );
      let activeStep =
        stepVal === mappedCategories[value].topicAndQuestion.length - 1
          ? 0
          : stepVal + 1;
      let activeCategoryId =
        stepVal === mappedCategories[value].topicAndQuestion.length - 1 &&
        value !== mappedCategories.length - 1
          ? mappedCategories[value + 1].catId
          : mappedCategories[value].catId;

      const params = {
        auditId: id,
        auditeeId: auditeeId,
        queAndAns:
          allData[requiredDataIndex].topicAndQuestion[stepVal].queAndAns,
        topicId: allData[requiredDataIndex].topicAndQuestion[stepVal].topicId,
        catId: allData[requiredDataIndex].catId,
        activeStep: activeStep,
        activeCategory: activeCategoryId,
      };

      let response = await callApi("CREATE", "SAVE_AUDITEE_RESPONSE", params);

      if (response.status === 200) {
        for (let question of currentStepAttachment) {
          if (question.attachment && question.attachment.length > 0) {
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
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
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
          actionRequired &&
          actionRequirdForButton.length > 0 &&
          allActionCompleted.filter((actionVal) => actionVal === true)
            .length !== actionRequirdForButton.length
            ? true
            : false,
        role: roleDetails.name,
      };

      let response = await callApi("CREATE", "SUBMIT_AUDIT", params);

      if (response.status === 200) {
        history.push("/app/under-review-audits");
      }

      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
    } catch (error) {
      console.log("Submit Audit Error =>", error);
    }
  };

  const handleClick = (event, index) => {
    document.getElementById(`fileUpload${index}`).click();
  };

  const handleCapture = async (event, questionId, question) => {
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
      setCurrentStepAttachment([...updatedAttachment]);
      setIsUploadLoading(false);
    } catch (err) {
      console.log("Error in logo upload", err);
      setIsUploadLoading(false);
    }
  };

  const handlePreviousCategories = () => {
    setValue((prevCatValue) => prevCatValue - 1);
    setActiveStep(0);
    let previousCategoriesData = [],
      checkBoxValue = [];
    let temp = {};

    let Categories = mappedCategories[value - 1].topicAndQuestion;
    let topic = Categories[0];

    topic.queAndAns.forEach((item, ind) => {
      if (roleDetails.name === "auditee") {
        temp = {
          auditeeComment: item.auditeeComment,
          actionRequired: item.actionRequired,
          auditorCommentAndAttachmentHistory:
            item.auditorCommentAndAttachmentHistory,
          auditeeCommentAndAttachmentHistory:
            item.auditeeCommentAndAttachmentHistory,
        };
      } else {
        temp = {
          answer: item.answer,
          auditorComment: item.auditorComment,
          actionRequired: item.actionRequired,
          actionCompleted: item.actionCompleted,
          auditorCommentAndAttachmentHistory:
            item.auditorCommentAndAttachmentHistory,
          auditeeCommentAndAttachmentHistory:
            item.auditeeCommentAndAttachmentHistory,
        };
        if (item.questionType === "multiple") {
          checkBoxValue[ind] = item.answer;
        }
      }
      previousCategoriesData.push(temp);
      setCurrentStateAnswers([...previousCategoriesData]);
      setCheckBox([...checkBoxValue]);
    });
  };

  const helperText = (question) => {
    if (
      roleDetails.name === "auditee" &&
      question.auditorCommentAndAttachmentHistory &&
      question.auditorCommentAndAttachmentHistory.length > 0
    ) {
      return (
        `Created on ` +
        new Date(
          question.auditorCommentAndAttachmentHistory[
            question.auditorCommentAndAttachmentHistory.length - 1
          ].createdDate
        ).toLocaleDateString() +
        ` At ` +
        new Date(
          question.auditorCommentAndAttachmentHistory[
            question.auditorCommentAndAttachmentHistory.length - 1
          ].createdDate
        ).toLocaleTimeString()
      );
    } else if (
      roleDetails.name === "auditor" &&
      question.auditeeCommentAndAttachmentHistory &&
      question.auditeeCommentAndAttachmentHistory.length > 0
    ) {
      return (
        `Created on ` +
        `${new Date(
          question.auditeeCommentAndAttachmentHistory[
            question.auditeeCommentAndAttachmentHistory.length - 1
          ].createdDate
        ).toLocaleDateString()} At ${new Date(
          question.auditeeCommentAndAttachmentHistory[
            question.auditeeCommentAndAttachmentHistory.length - 1
          ].createdDate
        ).toLocaleTimeString()}`
      );
    }
  };

  const onModalChange = (docId, extension) => {
    setIsPngLoading(true);
    setDocumentId(docId);
    setExtension(extension);
    setOnOpen(true);
    setIsPngLoading(false);
  };

  const onInvalidMessageChange = (event) => {
    event.target.setCustomValidity(
      "Please select at least one option to proceed"
    );
  };

  useEffect(() => {
    GetCategoriesOfAudit();
  }, []);

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
                label: "Underreview Audits",
                path: "/app/manageunderreviewaudits/underreviewaudits",
              },
              { label: "Questions" },
            ]}
          />
          <Card
            position="static"
            style={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              padding: "2px",
              marginTop: "5px",
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
            <TabPanel value={value} index={ind}>
              <Stepper
                activeStep={activeStep}
                style={{ margin: "-15px" }}
                orientation="vertical"
              >
                {val.topicAndQuestion.map((step, i) => (
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
                            {step.queAndAns.map((question, index) => (
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
                                      {`Q.${index + 1} `}
                                      {question.question}
                                    </Typography>
                                    {roleDetails.name === "auditor" &&
                                      option(question, index)}
                                  </Grid>
                                  {roleDetails.name === "auditor" && (
                                    <Grid
                                      item
                                      xs={12}
                                      md={3}
                                      style={{ display: "grid" }}
                                    >
                                      {roleDetails.name === "auditor" ? (
                                        question.auditeeCommentAndAttachmentHistory &&
                                        question.actionRequired ? (
                                          <>
                                            <Chip
                                              size="small"
                                              label="Action Done By Auditee"
                                              color="success"
                                              icon={<DoneIcon />}
                                            />
                                            <br />
                                          </>
                                        ) : null
                                      ) : null}
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
                                  )}
                                </Grid>
                                <Grid container style={{ marginTop: "4px" }}>
                                  <Grid item xs={9} md={8}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={12}>
                                        <Grid container spacing={1}>
                                          <Grid item xs={12} md={12}>
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
                                              required={true}
                                              multiline
                                              variant="standard"
                                              value={
                                                currentStepComment[index]
                                                  ? roleDetails.name ===
                                                    "auditee"
                                                    ? currentStepComment[index]
                                                        .auditeeComment
                                                    : currentStepComment[index]
                                                        .auditorComment
                                                  : ""
                                              }
                                              onChange={(event) => {
                                                onChangeComment(event, index);
                                              }}
                                              style={{
                                                display: "flex",
                                                textAlign: "left",
                                                justifyContent: "flex-start",
                                              }}
                                            />
                                          </Grid>
                                          <Grid item xs={12} md={12}>
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
                                                {currentStepAttachment.length >
                                                  0 &&
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
                                                    .attachment.map(
                                                      (attach) => {
                                                        return (
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItem:
                                                                "flex-start",
                                                              justifyContent:
                                                                "flex-start",
                                                            }}
                                                          >
                                                            {attach.docType ===
                                                              "image/png" ||
                                                            attach.docType ===
                                                              "image/jpeg" ? (
                                                              <ImageIcon
                                                                color="secondary"
                                                                style={{
                                                                  marginRight:
                                                                    "8px",
                                                                }}
                                                              />
                                                            ) : (
                                                              <DescriptionIcon
                                                                color="secondary"
                                                                style={{
                                                                  marginRight:
                                                                    "8px",
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
                                                                  question.questionId
                                                                );
                                                              }}
                                                              color="primary"
                                                              style={{
                                                                marginLeft:
                                                                  "5px",
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            />
                                                          </div>
                                                        );
                                                      }
                                                    )}
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
                                                      justifyContent:
                                                        "flex-start",
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
                                                      onChange={(event) =>
                                                        handleCapture(
                                                          event,
                                                          question.questionId,
                                                          question
                                                        )
                                                      }
                                                    />
                                                  </Button>
                                                </Grid>
                                              )}
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Divider
                                        variant="middle"
                                        style={{ width: "98%" }}
                                      />
                                      <Typography
                                        style={{
                                          display: "flex",
                                          textAlign: "left",
                                          justifyContent: "flex-start",
                                          fontWeight: "bold",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {"Auditee Comment History"}
                                      </Typography>
                                      <Grid item xs={12} md={12}>
                                        <Grid container spacing={1}>
                                          {currentStateAnswers[index] &&
                                            currentStateAnswers[index]
                                              .auditeeCommentAndAttachmentHistory &&
                                            currentStateAnswers[index]
                                              .auditeeCommentAndAttachmentHistory
                                              .length > 0 &&
                                            currentStateAnswers[
                                              index
                                            ].auditeeCommentAndAttachmentHistory.map(
                                              (currentComment, keyIndex) => (
                                                <Grid
                                                  item
                                                  xs={12}
                                                  md={12}
                                                  key={keyIndex}
                                                >
                                                  <TextField
                                                    multiline
                                                    variant="standard"
                                                    disabled
                                                    value={
                                                      currentComment.comment
                                                    }
                                                    style={{
                                                      display: "flex",
                                                      textAlign: "left",
                                                      justifyContent:
                                                        "flex-start",
                                                    }}
                                                    helperText={
                                                      `Created on ` +
                                                      new Date(
                                                        currentComment.createdDate
                                                      ).toLocaleDateString() +
                                                      ` At ` +
                                                      new Date(
                                                        currentComment.createdDate
                                                      ).toLocaleTimeString()
                                                    }
                                                  />
                                                  <Typography
                                                    variant="h6"
                                                    noWrap
                                                    component="div"
                                                  >
                                                    {currentComment &&
                                                      currentComment.attachment &&
                                                      currentComment.attachment
                                                        .length > 0 &&
                                                      currentComment.attachment.map(
                                                        (attach) => {
                                                          return (
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                alignItem:
                                                                  "flex-start",
                                                                justifyContent:
                                                                  "flex-start",
                                                              }}
                                                            >
                                                              {attach.docType ===
                                                                "image/png" ||
                                                              attach.docType ===
                                                                "image/jpeg" ? (
                                                                <ImageIcon
                                                                  color="secondary"
                                                                  style={{
                                                                    marginRight:
                                                                      "8px",
                                                                  }}
                                                                />
                                                              ) : (
                                                                <DescriptionIcon
                                                                  color="secondary"
                                                                  style={{
                                                                    marginRight:
                                                                      "8px",
                                                                  }}
                                                                />
                                                              )}
                                                              {attach.docType ===
                                                                "image/png" ||
                                                              attach.docType ===
                                                                "image/jpeg" ? (
                                                                <Typography
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={() =>
                                                                    onModalChange(
                                                                      attach.docId,
                                                                      attach.extension
                                                                    )
                                                                  }
                                                                >
                                                                  {
                                                                    attach.docName
                                                                  }
                                                                </Typography>
                                                              ) : (
                                                                <Typography>
                                                                  {
                                                                    attach.docName
                                                                  }
                                                                </Typography>
                                                              )}
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                  </Typography>
                                                </Grid>
                                              )
                                            )}
                                        </Grid>
                                      </Grid>
                                      <Divider
                                        variant="middle"
                                        style={{ width: "98%" }}
                                      />
                                      <Typography
                                        style={{
                                          display: "flex",
                                          textAlign: "left",
                                          justifyContent: "flex-start",
                                          fontWeight: "bold",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {"Auditor Comment History"}
                                      </Typography>
                                      <Grid item xs={12} md={12}>
                                        <Grid container spacing={1}>
                                          {currentStateAnswers[index] &&
                                            currentStateAnswers[index]
                                              .auditorCommentAndAttachmentHistory &&
                                            currentStateAnswers[index]
                                              .auditorCommentAndAttachmentHistory
                                              .length > 0 &&
                                            currentStateAnswers[
                                              index
                                            ].auditorCommentAndAttachmentHistory.map(
                                              (currentComment) => {
                                                return (
                                                  <Grid item xs={12} md={12}>
                                                    <TextField
                                                      multiline
                                                      variant="standard"
                                                      disabled
                                                      value={
                                                        currentComment.comment &&
                                                        currentComment.comment
                                                      }
                                                      style={{
                                                        display: "flex",
                                                        textAlign: "left",
                                                        justifyContent:
                                                          "flex-start",
                                                      }}
                                                      helperText={
                                                        `Created on ` +
                                                        new Date(
                                                          currentComment.createdDate
                                                        ).toLocaleDateString() +
                                                        ` At ` +
                                                        new Date(
                                                          currentComment.createdDate
                                                        ).toLocaleTimeString()
                                                      }
                                                    />
                                                    <Typography
                                                      variant="h6"
                                                      noWrap
                                                      component="div"
                                                    >
                                                      {currentComment &&
                                                        currentComment.attachment &&
                                                        currentComment
                                                          .attachment.length >
                                                          0 &&
                                                        currentComment.attachment.map(
                                                          (attach) => {
                                                            return (
                                                              <div
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                  alignItem:
                                                                    "flex-start",
                                                                  justifyContent:
                                                                    "flex-start",
                                                                }}
                                                              >
                                                                {attach.docType ===
                                                                  "image/png" ||
                                                                attach.docType ===
                                                                  "image/jpeg" ? (
                                                                  <ImageIcon
                                                                    color="secondary"
                                                                    style={{
                                                                      marginRight:
                                                                        "8px",
                                                                    }}
                                                                  />
                                                                ) : (
                                                                  <DescriptionIcon
                                                                    color="secondary"
                                                                    style={{
                                                                      marginRight:
                                                                        "8px",
                                                                    }}
                                                                  />
                                                                )}
                                                                {attach.docType ===
                                                                  "image/png" ||
                                                                attach.docType ===
                                                                  "image/jpeg" ? (
                                                                  <Typography
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                      onModalChange(
                                                                        attach.docId,
                                                                        attach.extension
                                                                      )
                                                                    }
                                                                  >
                                                                    {
                                                                      attach.docName
                                                                    }
                                                                  </Typography>
                                                                ) : (
                                                                  <Typography>
                                                                    {
                                                                      attach.docName
                                                                    }
                                                                  </Typography>
                                                                )}
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                    </Typography>
                                                  </Grid>
                                                );
                                              }
                                            )}
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12} md={12}>
                                        {question.hasComment ? (
                                          <>
                                            <Typography
                                              style={{
                                                display: "flex",
                                                textAlign: "left",
                                                justifyContent: "flex-start",
                                              }}
                                            >
                                              {roleDetails.name === "auditee"
                                                ? "Auditor's Note:"
                                                : "Auditee's Note:"}
                                            </Typography>
                                            <TextField
                                              style={{
                                                display: "flex",
                                                textAlign: "left",
                                                justifyContent: "flex-start",
                                              }}
                                              required={true}
                                              multiline
                                              variant="standard"
                                              value={
                                                roleDetails.name === "auditee"
                                                  ? question.auditorCommentAndAttachmentHistory &&
                                                    question
                                                      .auditorCommentAndAttachmentHistory
                                                      .length > 0
                                                    ? question
                                                        .auditorCommentAndAttachmentHistory[
                                                        question
                                                          .auditorCommentAndAttachmentHistory
                                                          .length - 1
                                                      ].comment
                                                    : ""
                                                  : question.auditeeCommentAndAttachmentHistory &&
                                                    question
                                                      .auditeeCommentAndAttachmentHistory
                                                      .length > 0
                                                  ? question
                                                      .auditeeCommentAndAttachmentHistory[
                                                      question
                                                        .auditeeCommentAndAttachmentHistory
                                                        .length - 1
                                                    ].comment
                                                  : ""
                                              }
                                              helperText={helperText(question)}
                                              disabled
                                            />
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  {actionRequired &&
                                  question.actionRequired &&
                                  roleDetails.name === "auditor" ? (
                                    <>
                                      <Grid item xs={3} md={4}>
                                        <FormControlLabel
                                          style={{
                                            display: "flex",

                                            justifyContent: "flex-end",
                                            margin: "50px 0 0 0",
                                          }}
                                          control={
                                            <Checkbox
                                              checked={
                                                currentStateAnswers[index]
                                                  ? currentStateAnswers[index]
                                                      .actionRequired
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
                                              disabled={
                                                roleDetails.name ===
                                                  "auditor" &&
                                                question.actionRequired
                                                  ? true
                                                  : false
                                              }
                                            />
                                          }
                                          label="Action Required"
                                        />
                                        <br />
                                        <FormControlLabel
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            margin: "5px 0 0 0",
                                          }}
                                          control={
                                            <Checkbox
                                              checked={
                                                currentStateAnswers[index]
                                                  ? currentStateAnswers[index]
                                                      .actionCompleted
                                                  : ""
                                              }
                                              onChange={(event) => {
                                                onChangeActionCompleted(
                                                  event,
                                                  index
                                                );
                                              }}
                                              name="gilad"
                                              color="primary"
                                            />
                                          }
                                          label="Action Completed"
                                        />
                                      </Grid>
                                    </>
                                  ) : null}
                                </Grid>

                                <Divider
                                  variant="middle"
                                  style={{ width: "98%" }}
                                />
                              </Grid>
                            ))}
                            {activeStep === val.topicAndQuestion.length - 1 &&
                            ind === mappedCategories.length - 1 &&
                            activeStep !== 0 ? (
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
                                  {isApiLoading && (
                                    <CircularProgress
                                      style={{
                                        float: "right",
                                        marginRight: "-13px",
                                      }}
                                    />
                                  )}
                                  {mappedCategories.length > 1 && ind !== 0 && (
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
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        style={{
                                          marginRight: "8px",
                                        }}
                                      >
                                        {allActionCompleted.length > 0 &&
                                        allActionCompleted.filter(
                                          (actionVal) => actionVal === true
                                        ).length ===
                                          actionRequirdForButton.length
                                          ? "Submit Audit"
                                          : "Action Required"}
                                      </Button>
                                    </>
                                  )}
                                </Box>
                              </Grid>
                            ) : activeStep === 0 &&
                              activeStep === val.topicAndQuestion.length - 1 &&
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
                                  {isApiLoading && (
                                    <CircularProgress
                                      style={{
                                        float: "right",
                                        marginRight: "-13px",
                                      }}
                                    />
                                  )}
                                  {auditCompleteOnDate ? null : (
                                    <Button
                                      disabled={isApiLoading}
                                      variant="contained"
                                      color="primary"
                                      type="submit"
                                      size="small"
                                      style={{
                                        marginRight: "8px",
                                      }}
                                      onClick={(event) =>
                                        handleNext(
                                          i,
                                          step.queAndAns,
                                          activeStep
                                        )
                                      }
                                    >
                                      {allActionCompleted.length > 0 &&
                                      allActionCompleted.filter(
                                        (actionVal) => actionVal === true
                                      ).length === actionRequirdForButton.length
                                        ? "Submit Audit"
                                        : activeStep ===
                                            val.topicAndQuestion.length - 1 &&
                                          roleDetails.name === "auditor"
                                        ? "Action Required"
                                        : "Action Required"}
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
                                  {isApiLoading && (
                                    <CircularProgress
                                      style={{
                                        float: "right",
                                        marginRight: "-13px",
                                      }}
                                    />
                                  )}
                                  {mappedCategories.length > 1 && ind !== 0 && (
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
                                    <Button
                                      disabled={isApiLoading}
                                      variant="contained"
                                      color="primary"
                                      type="submit"
                                      size="small"
                                      style={{
                                        marginRight: "5px",
                                      }}
                                    >
                                      Next
                                    </Button>
                                  ) : (
                                    <Button
                                      disabled={isApiLoading}
                                      variant="contained"
                                      color="primary"
                                      type="submit"
                                      size="small"
                                      style={{
                                        marginRight: "8px",
                                      }}
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
                                  {isApiLoading && (
                                    <CircularProgress
                                      style={{
                                        float: "right",
                                        marginRight: "-13px",
                                      }}
                                    />
                                  )}
                                  {mappedCategories.length > 1 && ind !== 0 && (
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
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        style={{
                                          marginRight: "5px",
                                        }}
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
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        style={{
                                          marginRight: "8px",
                                        }}
                                      >
                                        Save & Continue
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
                                  {isApiLoading && (
                                    <CircularProgress
                                      style={{
                                        float: "right",
                                        marginRight: "-13px",
                                      }}
                                    />
                                  )}
                                  {mappedCategories.length > 1 && ind !== 0 && (
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
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        style={{
                                          marginRight: "8px",
                                        }}
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
      <Modal
        classes={{ paper: classes.paper }}
        disableScrollLock="true"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={onOpen}
        onClose={onClose}
        closeAfterTransition
      >
        {isPngLoading ? (
          <CircularProgress
            style={{ position: "absolute", top: "50%", left: "50%" }}
          />
        ) : (
          <Box sx={style}>
            <Box>
              <IconButton
                onClick={() => {
                  onSetClose(true);
                  setOnOpen(false);
                }}
                className={classes.customizedButton}
              >
                <CloseIcon style={{ position: "absolute" }} />
              </IconButton>
            </Box>
            <img
              src={`https://dss-serverless-data.s3.amazonaws.com/audit-doc/${userDetails.entityDetails.id}/${id}/${documentId}.${extension}`}
              alt="Logo"
              width="100%"
              height="100%"
            />
          </Box>
        )}
      </Modal>
    </>
  );
};

export default AnswerQuestionOfUnderreviewAudits;
