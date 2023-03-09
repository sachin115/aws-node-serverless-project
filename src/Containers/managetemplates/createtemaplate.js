import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SvgIcon,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { TreeItem, TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useState } from "react";
import { v4 } from "uuid";
import { ValidatorForm } from "react-material-ui-form-validator";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { CategoryTwoTone } from "@material-ui/icons";
import { faListSquares } from "@fortawesome/free-solid-svg-icons";

toast.configure();
const notify = () => toast("Session Expired...!");

const CreateTemplateTree = (props) => {
  const { id } = useParams();
  console.log("templateID", id);
  const classes = useStyles();
  const [templateData, setTemplateData] = useState({});
  console.log("templateData", templateData);
  const [templateName, setTemplateName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [showTopicField, setShowTopicField] = useState(false);
  const [showQuestionField, setShowQuestionField] = useState(false);
  const [showSectionField, setShowSectionField] = useState(false);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [weightage, setWeightage] = useState(0);
  const [questionDescription, setQuestionDescription] = useState("");
  const [hasAttachment, setHasAttachment] = useState(true);
  const [hasComment, setHasComment] = useState(true);
  const [editData, setEditData] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [expandedItemName, setExpandedItemName] = useState([]);
  const [templateDescription, setTemplateDescription] = useState("");
  const [questionType, setQuestionType] = useState();
  const [optionNumber, setOptionNumber] = useState("");
  const questionNumber = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [optionValues, setOptionValues] = useState([]);
  let [count, setCount] = useState(0);
  const [yesVal, setYesVal] = useState(0);
  const [noVal, setNoVal] = useState(0);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const { userDetails } = useUserState();
  const { entityDetails, activeUserDetails } = userDetails;
  const { dispatch, setUserDetails } = useUserDispatch();
  const [templateId, setTemplateId] = useState("");
  const history = useHistory();
  const [draftTemplateData, setDraftTemplateData] = useState({});

  function MinusSquare() {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 18, height: 18 }}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare() {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 18, height: 18 }}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }

  function CloseSquare() {
    return (
      <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 18, height: 18 }}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }

  const createSection = () => {
    const sectionData = { ...templateData };
    if (sectionData.categories) {
      sectionData.categories.push({ catId: v4(), categoryName: sectionName });
    } else {
      sectionData.categories = [];
      sectionData.categories.push({ catId: v4(), categoryName: sectionName });
    }
    setTemplateData({ ...sectionData });
    setSectionName("");
    setShowSectionField(false);
  };

  const editSectionData = () => {
    const sectionData = { ...templateData };
    sectionData.categories[selectedCategoryIndex].categoryName = sectionName;
    setTemplateData({ ...sectionData });
  };

  const createTopic = () => {
    const topicData = { ...templateData };
    if (topicData.categories[selectedCategoryIndex].topic) {
      topicData.categories[selectedCategoryIndex].topic.push({
        topicId: v4(),
        topicName: topicName,
      });
    } else {
      topicData.categories[selectedCategoryIndex].topic = [];
      topicData.categories[selectedCategoryIndex].topic.push({
        topicId: v4(),
        topicName: topicName,
      });
    }
    setExpandedItemName([
      ...expandedItemName,
      topicData.categories[selectedCategoryIndex].catId,
    ]);
    setTemplateData({ ...topicData });
    setTopicName("");
    setShowTopicField(false);
  };

  const editTopicData = () => {
    const topicData = { ...templateData };
    topicData.categories[selectedCategoryIndex].topic[
      selectedTopicIndex
    ].topicName = topicName;
    setTemplateData({ ...topicData });
  };

  const createQuestion = () => {
    const questionData = { ...templateData };
    if (
      questionData.categories[selectedCategoryIndex].topic[selectedTopicIndex]
        .question
    ) {
      questionData.categories[selectedCategoryIndex].topic[
        selectedTopicIndex
      ].question.push({
        questionId: v4(),
        questionName: questionName,
        weightage: weightage,
        questionDescription: questionDescription,
        hasAttachment: hasAttachment,
        hasComment: hasComment,
        optionNumber: optionNumber,
        optionValues: optionValues,
        yesVal: yesVal,
        noVal: noVal,
        questionType: questionType,
      });
    } else {
      questionData.categories[selectedCategoryIndex].topic[
        selectedTopicIndex
      ].question = [];
      questionData.categories[selectedCategoryIndex].topic[
        selectedTopicIndex
      ].question.push({
        questionId: v4(),
        questionName: questionName,
        weightage: weightage,
        questionDescription: questionDescription,
        hasAttachment: hasAttachment,
        hasComment: hasComment,
        optionNumber: optionNumber,
        optionValues: optionValues,
        yesVal: yesVal,
        noVal: noVal,
        questionType: questionType,
      });
    }
    setExpandedItemName([
      ...expandedItemName,
      // questionData.categories[selectedCategoryIndex].catId,
      questionData.categories[selectedCategoryIndex].topic[selectedTopicIndex]
        .topicId,
    ]);
    setTemplateData({ ...questionData });
    setQuestionName("");
    setWeightage("");
    setQuestionDescription("");
    setHasAttachment(true);
    setHasComment(true);
    setQuestionType("");
    setOptionNumber("");
    setOptionValues([]);
    setYesVal(0);
    setNoVal(0);
    setShowQuestionField(false);
  };

  const editQuestionData = () => {
    const questionData = { ...templateData };
    let question =
      questionData.categories[selectedCategoryIndex].topic[selectedTopicIndex]
        .question[selectedQuestionIndex];
    question.questionName = questionName;
    question.weightage = weightage;
    question.questionDescription = questionDescription;
    question.hasAttachment = hasAttachment;
    question.hasComment = hasComment;
    question.questionType = questionType;
    question.optionNumber = optionNumber;
    question.optionValues = optionValues;
    question.yesVal = yesVal;
    question.noVal = noVal;
    setTemplateData({ ...questionData });
    setShowQuestionField(false);
  };

  const addTopic = (e, index) => {
    e.stopPropagation();
    setSelectedCategoryIndex(index);
    setShowTopicField(true);
    setShowSectionField(false);
    setShowQuestionField(false);
    setEditData(false);
    setTopicName("");
  };

  const addQuestion = (e, categoryIndex, topicIndex) => {
    e.stopPropagation();
    setSelectedCategoryIndex(categoryIndex);
    setSelectedTopicIndex(topicIndex);
    setShowQuestionField(true);
    setShowSectionField(false);
    setEditData(false);
    setShowTopicField(false);
    setQuestionName("");
    setWeightage("");
    setQuestionDescription("");
    setHasAttachment(true);
    setHasComment(true);
    setQuestionType();
    setOptionNumber("");
    setOptionValues([]);
    setYesVal();
    setNoVal();
  };

  const showSection = () => {
    setShowSectionField(true);
    setShowTopicField(false);
    setShowQuestionField(false);
    setEditData(false);
    setSectionName("");
  };

  const onMouseHover = (section, sectionindex, topicindex, questionindex) => {
    if (section === "section") {
      document.getElementById(`spanSectionIndex${sectionindex}`).style.display =
        "block";
    } else if (section === "topic") {
      document.getElementById(
        `spanTopicIndex${sectionindex}${topicindex}`
      ).style.display = "block";
      document.getElementById(`spanSectionIndex${sectionindex}`).style.display =
        "none";
    } else if (section === "question") {
      document.getElementById(
        `spanQuestionIndex${sectionindex}${topicindex}${questionindex}`
      ).style.display = "block";
      document.getElementById(`spanSectionIndex${sectionindex}`).style.display =
        "none";
      document.getElementById(
        `spanTopicIndex${sectionindex}${topicindex}`
      ).style.display = "none";
    }
  };

  const onMouseOut = (section, sectionindex, topicindex, questionindex) => {
    if (section === "section") {
      document.getElementById(`spanSectionIndex${sectionindex}`).style.display =
        "none";
    } else if (section === "topic") {
      document.getElementById(
        `spanTopicIndex${sectionindex}${topicindex}`
      ).style.display = "none";
    } else if (section === "question") {
      document.getElementById(
        `spanQuestionIndex${sectionindex}${topicindex}${questionindex}`
      ).style.display = "none";
    }
  };

  const deleteSectionTopicQuestion = (
    e,
    title,
    sectionIndex,
    topicIndex,
    questionIndex
  ) => {
    e.stopPropagation();
    const sectionData = { ...templateData };
    if (title === "section") {
      sectionData.categories.splice(sectionIndex, 1);
      setShowSectionField(false);
    } else if (title === "topic") {
      sectionData.categories[sectionIndex].topic.splice(topicIndex, 1);
      setShowTopicField(false);
    } else if (title === "question") {
      sectionData.categories[sectionIndex].topic[topicIndex].question.splice(
        questionIndex,
        1
      );
      setShowQuestionField(false);
    }
    setTemplateData({ ...sectionData });
  };

  const editSection = (e, sectionIndex) => {
    e.stopPropagation();
    setSelectedCategoryIndex(sectionIndex);
    setEditData(true);
    setShowSectionField(true);
    setShowTopicField(false);
    setShowQuestionField(false);
    setSectionName(templateData.categories[sectionIndex].categoryName);
  };

  const editTopic = (sectionIndex, topicIndex) => {
    setSelectedCategoryIndex(sectionIndex);
    setSelectedTopicIndex(topicIndex);
    setEditData(true);
    setShowSectionField(false);
    setShowTopicField(true);
    setShowQuestionField(false);
    setTopicName(
      templateData.categories[sectionIndex].topic[topicIndex].topicName
    );
  };

  const editQuestion = (sectionIndex, topicIndex, questionIndex) => {
    let question =
      templateData.categories[sectionIndex].topic[topicIndex].question[
        questionIndex
      ];
    setSelectedCategoryIndex(sectionIndex);
    setSelectedTopicIndex(topicIndex);
    setSelectedQuestionIndex(questionIndex);
    setEditData(true);
    setShowSectionField(false);
    setShowTopicField(false);
    setShowQuestionField(true);
    setQuestionName(question.questionName);
    setWeightage(question.weightage);
    setQuestionDescription(question.questionDescription);
    setHasAttachment(question.hasAttachment);
    setHasComment(question.hasComment);
    setQuestionType(question.questionType);
    setOptionNumber(question.optionNumber);
    setOptionValues(question.optionValues);
    setYesVal(question.yesVal);
    setNoVal(question.noVal);
  };

  const finalCheack = (data) => {
    if (data.categories) {
      for (let category of data.categories) {
        if (category.topic) {
          for (let topic of category.topic) {
            if (!topic.question) {
              return false;
            }
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  };

  const saveTemplate = async () => {
    try {
      setIsApiLoading(true);
      let params = {};
      if (id) {
        params = {
          entityId: entityDetails.id,
          userId: activeUserDetails.id,
          name: templateName,
          template: templateData,
          templateId: id,
          templateDescription: templateDescription,
        };
      } else if (templateId) {
        params = {
          templateId,
          entityId: entityDetails.id,
          userId: activeUserDetails.id,
          name: templateName,
          template: templateData,
          templateDescription: templateDescription,
          final: finalCheack(templateData),
        };
      } else {
        params = {
          entityId: entityDetails.id,
          userId: activeUserDetails.id,
          name: templateName,
          template: templateData,
          templateDescription: templateDescription,
          final: finalCheack(templateData),
        };
      }

      const response = await callApi(
        "CREATE",
        "CREATE_AND_UPDATE_GENERIC_TEMPLATE",
        params
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        history.push("/app/templates");
      }
      setIsApiLoading(false);
    } catch (error) {
      console.log("Template Error", error);
    }
  };

  const RandomFields = () => {
    let optionFields = [];
    count = 0;
    optionValues.map((value, index) => {
      count += parseInt(value.optionWeight ? value.optionWeight : 0);
      optionFields.push(
        <Grid container spacing={2}>
          <Grid
            item
            md={8}
            xs={9}
            style={{ marginTop: "3%" }}
            key={`optionval${index}`}
          >
            <TextField
              fullWidth
              required
              size="small"
              label={`Option ${index + 1}`}
              type="text"
              onChange={(event) => {
                let newArr = [...optionValues];
                //newArr[index].optionValue = event.target.value;
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
              // label={`WeightAge of Option ${index + 1}`}
              label="Weightage"
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

  const getTemplateDataById = async (templateID) => {
    try {
      const response = await callApi(
        "GET",
        "GET_TEMPLATE_DATA_BY_ID",
        templateID
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        const { Items } = response.data.data;
        console.log("items", response);
        const categories = Items[0].template;
        setTemplateData({ ...categories });
        setTemplateName(Items[0].name);
        setTemplateDescription(Items[0].templateDescription);
        categories.categories &&
          categories.categories.forEach((category) => {
            expandedItemName.push(category.catId);
            category.topic &&
              category.topic.forEach((topic) => {
                expandedItemName.push(topic.topicId);
                topic.question &&
                  topic.question.forEach((question) =>
                    expandedItemName.push(question.questionId)
                  );
              });
          });
      }
      setIsApiLoading(false);
    } catch (error) {
      console.log("Template Data", error);
    }
  };

  const getTemplateDataAsDraft = async () => {
    setIsApiLoading(true);
    try {
      let params = {
        entityId: entityDetails.id,
        userId: activeUserDetails.id,
      };
      const response = await callApi(
        "CREATE",
        "GET_TEMPLATE_SAVE_AS_DRAFT",
        params
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        const { draftTemplate } = response.data;
        setDraftTemplateData(draftTemplate);
        const categories = draftTemplate.template;

        setTemplateData({ ...categories });
        setTemplateName(draftTemplate.name);
        setTemplateId(draftTemplate.id);
        setTemplateDescription(draftTemplate.templateDescription);
        categories.categories &&
          categories.categories.forEach((category) => {
            expandedItemName.push(category.catId);
            category.topic &&
              category.topic.forEach((topic) => {
                expandedItemName.push(topic.topicId);
                topic.question &&
                  topic.question.forEach((question) =>
                    expandedItemName.push(question.questionId)
                  );
              });
          });
      }
    } catch (error) {
      console.log("Template Data", error);
    }
    setIsApiLoading(false);
  };

  const discardTemplate = async (templateId) => {
    try {
      setIsApiLoading(true);

      const response = await callApi(
        "DELETE",
        "DISCARD_TEMPLATE_DATA_BY_ID",
        templateId
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        setTemplateData({});
        setTemplateName("");
        setTemplateId("");
        setTemplateDescription("");
        setDraftTemplateData({});
      }
      setIsApiLoading(false);
    } catch (error) {
      console.log("Template Error", error);
    }
  };

  useEffect(() => {
    if (id) {
      setIsApiLoading(true);
      getTemplateDataById(id);
    } else {
      getTemplateDataAsDraft();
    }
  }, []);

  return (
    <>
      {isApiLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper style={{ padding: 22 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Template Name"
                    style={{ marginTop: "2px" }}
                    value={templateName}
                    onChange={(event) => {
                      setTemplateName(event.target.value);
                    }}
                  />
                </Grid>
                {draftTemplateData && draftTemplateData.final === false ? (
                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      type="submit"
                      style={{
                        textTransform: "capitalize",
                        width: "60%",
                        marginTop: "16px",
                        float: "right",
                        color: "#ff0000",
                      }}
                      onClick={() => discardTemplate(draftTemplateData.id)}
                    >
                      Discard Template
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs={3}></Grid>
                )}
                <Grid item xs={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    type="submit"
                    style={{
                      textTransform: "capitalize",
                      width: "60%",
                      marginTop: "16px",
                    }}
                    onClick={() => saveTemplate()}
                  >
                    Save Template
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {/* <Typography style={{ textAlign: "left" }}>
                  Template Description
                </Typography> */}
                  <TextareaAutosize
                    style={{ width: "100%" }}
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Template Description"
                    width="-webkit-fill-available"
                    value={templateDescription}
                    onChange={(event) => {
                      setTemplateDescription(event.target.value);
                    }}
                  />
                  {/* <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  required
                  size="small"
                  label="Template Description"
                  style={{ marginTop: "2px" }}
                  value={templateName}
                  onChange={(event) => {
                    setTemplateName(event.target.value);
                  }}
                /> */}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              style={{ height: "100%", padding: 22, position: "relative" }}
            >
              <Button
                variant="outlined"
                color="primary"
                size="small"
                type="submit"
                style={{
                  float: "right",
                  position: "absolute",
                  right: 10,
                  top: 10,
                  textTransform: "capitalize",
                }}
                onClick={showSection}
              >
                Add Section
              </Button>
              {/* {!showSectionField && ( */}
              {/* <Tooltip title="Add Section">
              <Fab
                size="small"
                color="primary"
                aria-label="Add Section"
                style={{
                  float: "right",
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              >
                <AddIcon onClick={showSection} />
              </Fab>
            </Tooltip> */}
              {/* )} */}
              {templateData && templateData.categories ? (
                <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<MinusSquare />}
                  defaultExpandIcon={<PlusSquare />}
                  defaultEndIcon={<CloseSquare />}
                  expanded={expandedItemName}
                  onNodeSelect={(event, nodeId) => {
                    const index = expandedItemName.indexOf(nodeId);
                    const copyExpanded = [...expandedItemName];
                    if (index === -1) {
                      copyExpanded.push(nodeId);
                    } else {
                      copyExpanded.splice(index, 1);
                    }
                    setExpandedItemName(copyExpanded);
                  }}
                >
                  {templateData.categories &&
                    templateData.categories.map((section, sectionIndex) => (
                      <TreeItem
                        key={section.catId}
                        onClick={(e) => editSection(e, sectionIndex)}
                        onMouseOver={(e) =>
                          onMouseHover("section", sectionIndex)
                        }
                        onMouseOut={(e) => onMouseOut("section", sectionIndex)}
                        nodeId={section.catId}
                        label={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              padding: "5px",
                            }}
                          >
                            <Tooltip title={section.categoryName}>
                              <Typography
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  width: "300px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  fontSize: 18,
                                }}
                              >
                                {section.categoryName}
                              </Typography>
                            </Tooltip>
                            <span
                              id={`spanSectionIndex${sectionIndex}`}
                              style={{
                                display: "none",
                                alignItems: "center",
                              }}
                            >
                              <Tooltip title="Add Topic">
                                <IconButton
                                  style={{
                                    padding: "0px",
                                    marginRight: "10px",
                                  }}
                                >
                                  <AddCircleOutlineIcon
                                    onClick={(e) => addTopic(e, sectionIndex)}
                                    style={{
                                      height: 28,
                                      width: 28,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                              {/* <Tooltip title="Edit Section">
                              <IconButton style={{ padding: "0px" }}>
                                <CreateIcon />
                              </IconButton>
                            </Tooltip> */}
                              <Tooltip title="Delete Section">
                                <IconButton style={{ padding: "0px" }}>
                                  <DeleteIcon
                                    onClick={(e) =>
                                      deleteSectionTopicQuestion(
                                        e,
                                        "section",
                                        sectionIndex
                                      )
                                    }
                                    style={{
                                      height: 28,
                                      width: 28,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </span>
                          </div>
                        }
                      >
                        {section.topic &&
                          section.topic.map((topic, topicIndex) => (
                            <>
                              <TreeItem
                                onClick={() =>
                                  editTopic(sectionIndex, topicIndex)
                                }
                                onMouseOver={(e) =>
                                  onMouseHover(
                                    "topic",
                                    sectionIndex,
                                    topicIndex
                                  )
                                }
                                onMouseOut={(e) =>
                                  onMouseOut("topic", sectionIndex, topicIndex)
                                }
                                nodeId={topic.topicId}
                                key={topic.topicId}
                                label={
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                      padding: "5px",
                                    }}
                                  >
                                    <Tooltip title={topic.topicName}>
                                      <Typography
                                        style={{
                                          display: "inline-block",
                                          position: "relative",
                                          width: "300px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          fontSize: 18,
                                        }}
                                      >
                                        {topic.topicName}
                                      </Typography>
                                    </Tooltip>
                                    <span
                                      id={`spanTopicIndex${sectionIndex}${topicIndex}`}
                                      style={{
                                        display: "none",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Tooltip title="Add Question">
                                        <IconButton
                                          style={{
                                            padding: "0px",
                                            marginRight: "10px",
                                          }}
                                        >
                                          <AddCircleOutlineIcon
                                            onClick={(e) =>
                                              addQuestion(
                                                e,
                                                sectionIndex,
                                                topicIndex
                                              )
                                            }
                                            style={{
                                              height: 28,
                                              width: 28,
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      {/* <Tooltip title="Edit Topic">
                                      <IconButton style={{ padding: "0px" }}>
                                        <CreateIcon />
                                      </IconButton>
                                    </Tooltip> */}
                                      <Tooltip title="Delete Topic">
                                        <IconButton style={{ padding: "0px" }}>
                                          <DeleteIcon
                                            onClick={(e) =>
                                              deleteSectionTopicQuestion(
                                                e,
                                                "topic",
                                                sectionIndex,
                                                topicIndex
                                              )
                                            }
                                            style={{
                                              height: 28,
                                              width: 28,
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </span>
                                  </div>
                                }
                              >
                                {topic.question &&
                                  topic.question.map(
                                    (question, questionIndex) => (
                                      <TreeItem
                                        onClick={() =>
                                          editQuestion(
                                            sectionIndex,
                                            topicIndex,
                                            questionIndex
                                          )
                                        }
                                        onMouseOver={(e) =>
                                          onMouseHover(
                                            "question",
                                            sectionIndex,
                                            topicIndex,
                                            questionIndex
                                          )
                                        }
                                        onMouseOut={(e) =>
                                          onMouseOut(
                                            "question",
                                            sectionIndex,
                                            topicIndex,
                                            questionIndex
                                          )
                                        }
                                        key={question.questionId}
                                        nodeId={question.questionId}
                                        label={
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              width: "100%",
                                              padding: "5px ",
                                            }}
                                          >
                                            <Tooltip
                                              title={question.questionName}
                                            >
                                              <Typography
                                                style={{
                                                  display: "inline-block",
                                                  position: "relative",
                                                  width: "300px",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  fontSize: 18,
                                                }}
                                              >
                                                {question.questionName}
                                              </Typography>
                                            </Tooltip>
                                            <span
                                              id={`spanQuestionIndex${sectionIndex}${topicIndex}${questionIndex}`}
                                              style={{
                                                display: "none",
                                                alignItem: "center",
                                              }}
                                            >
                                              {/* <Tooltip title="Edit Question">
                                              <IconButton
                                                style={{ padding: "0px" }}
                                              >
                                                <CreateIcon />
                                              </IconButton>
                                            </Tooltip> */}
                                              <Tooltip title="Delete Question">
                                                <IconButton
                                                  style={{ padding: "0px" }}
                                                >
                                                  <DeleteIcon
                                                    onClick={(e) =>
                                                      deleteSectionTopicQuestion(
                                                        e,
                                                        "question",
                                                        sectionIndex,
                                                        topicIndex,
                                                        questionIndex
                                                      )
                                                    }
                                                    style={{
                                                      height: 28,
                                                      width: 28,
                                                    }}
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                            </span>
                                          </div>
                                        }
                                      />
                                    )
                                  )}
                              </TreeItem>
                            </>
                          ))}
                      </TreeItem>
                    ))}
                </TreeView>
              ) : (
                <Typography>No Section</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper style={{ height: "100%", padding: 22 }}>
              {showSectionField && (
                <ValidatorForm
                  onSubmit={() => {
                    editData ? editSectionData() : createSection();
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Section Name"
                        value={sectionName}
                        onChange={(event) => {
                          setSectionName(event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        type="submit"
                        style={{
                          textTransform: "capitalize",
                          width: "60%",
                        }}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </ValidatorForm>
              )}
              {showTopicField && (
                <ValidatorForm
                  onSubmit={() => {
                    editData ? editTopicData() : createTopic();
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Topic Name"
                        value={topicName}
                        onChange={(event) => {
                          setTopicName(event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        type="submit"
                        style={{
                          textTransform: "capitalize",
                          width: "60%",
                          marginTop: "9px",
                        }}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </ValidatorForm>
              )}
              {showQuestionField && (
                <ValidatorForm
                  onSubmit={() => {
                    editData ? editQuestionData() : createQuestion();
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Question Name"
                        value={questionName}
                        onChange={(event) => {
                          setQuestionName(event.target.value);
                        }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Weightage"
                        type="number"
                        InputProps={{
                          inputProps: {
                            max: 10,
                            min: 1,
                          },
                        }}
                        value={weightage}
                        onChange={(event) => {
                          setWeightage(event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        size="small"
                        minRows={2}
                        required
                        label="Question Description"
                        value={questionDescription}
                        onChange={(e) => {
                          setQuestionDescription(e.target.value);
                        }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} style={{ textAlign: "justify" }}>
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
                        <Grid item xs={6} style={{ textAlign: "justify" }}>
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
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      className={classes.fieldContainer}
                      style={{ marginTop: "2%" }}
                    >
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          required
                          style={{ textAlign: "left" }}
                          MenuProps={{
                            PaperProps: {
                              style: { marginTop: 45 },
                            },
                          }}
                          value={questionType}
                          onChange={(event) => {
                            setQuestionType(event.target.value);
                          }}
                          label="Select Question Type"
                          fullWidth
                        >
                          <MenuItem value={"yes/no"}>Yes / No</MenuItem>
                          <MenuItem value={"rating"}>Rating </MenuItem>
                          <MenuItem value={"single"}>Single Selection</MenuItem>
                          <MenuItem value={"multiple"}>
                            Multiple Selection
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {questionType === "single" ||
                      questionType === "multiple" ? (
                        <Grid
                          item
                          md={12}
                          xs={12}
                          lg={12}
                          style={{ marginTop: "3%" }}
                        >
                          <FormControl fullWidth size="small" required>
                            <InputLabel>Select Option Number</InputLabel>
                            <Select
                              style={{ textAlign: "left" }}
                              required
                              MenuProps={{
                                PaperProps: {
                                  style: { marginTop: 45 },
                                },
                              }}
                              value={optionNumber}
                              onChange={(event) => {
                                setOptionNumber(event.target.value);
                                let arr = new Array(event.target.value);
                                arr.fill("");
                                setOptionValues(arr);
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
                            <Grid item xs={3} style={{ marginTop: "4%" }}>
                              <Typography>Yes</Typography>
                            </Grid>
                            <Grid item xs={9}>
                              <TextField
                                required
                                type={"number"}
                                label={"Weightage of option Yes"}
                                value={yesVal}
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
                            <Grid item xs={3}>
                              <Typography>No</Typography>
                            </Grid>
                            <Grid item xs={9}>
                              <TextField
                                required
                                type={"number"}
                                value={noVal}
                                label={"Weightage of option No"}
                                onChange={(event) => {
                                  setNoVal(parseInt(event.target.value));
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : null}
                    </Grid>
                    <Grid item xs={12}>
                      {questionType === "single" || questionType === "multiple"
                        ? RandomFields()
                        : null}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      type="submit"
                      style={{
                        textTransform: "capitalize",
                        margin: "9px",
                        float: "right",
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                </ValidatorForm>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: "100%",
    textAlign: "left",
    overflow: "auto",
    alignItems: "center",
    marginTop: "20px",
    padding: "5px",
  },
});

export default CreateTemplateTree;
