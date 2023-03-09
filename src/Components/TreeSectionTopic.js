// import {
//   Box,
//   CircularProgress,
//   Divider,
//   Modal,
//   Typography,
//   IconButton,
//   makeStyles,
//   Grid,
//   TextField,
//   Button,
//   Link,
//   Card,
//   Breadcrumbs,
//   FormControl,
//   InputLabel,
//   TextareaAutosize,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   MenuItem,
//   Select,
// } from "@material-ui/core";
// import CloseIcon from "@material-ui/icons/Close";
// import { useEffect, useState } from "react";
// import callApi from "../../Customutils/callApi";
// import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
// //import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
// import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
// import Dialog from "@material-ui/core/Dialog";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
// import MuiDialogContent from "@material-ui/core/DialogContent";
// import MuiDialogActions from "@material-ui/core/DialogActions";
// import { withStyles } from "@material-ui/core/styles";
// import { ValidatorForm } from "react-material-ui-form-validator";
// import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
// import { useHistory } from "react-router-dom";
// import { toast } from "react-toastify";
// import { padding } from "@mui/system";
// import { v4 } from "uuid";

// toast.configure();
// const notify = () => toast("Session Expired...!");

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "70%",
//   height: "85%",
//   bgcolor: "background.paper",
//   // border: "2px solid #000",
//   boxShadow: 24,
//   borderRadius: 10,
//   p: 2.9,
//   pt: 1.8,
//   //overflowY:"auto"
// };

// const outerStyle = {
//   position: "absolute",
//   // display: "flex",
//   // justifyContent: "center",
//   // top: "0",
//   // left: "0",
//   // width: "100%",
//   // height: "100%",
//   //backgroundColor: "rgba(0,0,0, .8)",
//   //zIndex: "1000",
//   overflowY: "auto",
// };

// const useStyles = makeStyles((theme) => ({
//   // paper: {
//   //   overflowY: "auto",
//   //   width:"100%",
//   //   height:"100%"
//   // },
//   customizedButton: {
//     position: "absolute",
//     left: "91.5%",
//     top: "4.5%",
//     backgroundColor: "#ffffff",
//     border: "1px solid #000",
//     padding: "1px",
//   },
//   customizedBackButton: {
//     position: "absolute",
//     right: "94.5%",
//     top: "3.5%",
//     backgroundColor: "#ffffff",
//   },
//   closeButton: {
//     position: "absolute",
//     right: theme.spacing(1),
//     top: theme.spacing(1),
//     color: theme.palette.grey[500],
//   },

//   dialogBorder: {
//     "& .MuiPaper-rounded": {
//       borderRadius: "50%",
//     },
//   },
// }));

// const DialogTitle = withStyles(style)((props) => {
//   const { children, classes, onClose, ...other } = props;
//   return (
//     <MuiDialogTitle disableTypography style={{ padding: "0%" }} {...other}>
//       <Typography variant="h6">{children}</Typography>
//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           style={{
//             position: "absolute",
//             top: "4%",
//             left: "87%",
//             paddingBottom: "2%",
//           }}
//           className={classes.closeButton}
//           onClick={onClose}
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </MuiDialogTitle>
//   );
// });

// const DialogContent = withStyles((theme) => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }))(MuiDialogContent);

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//     justifyContent: "center",
//   },
// }))(MuiDialogActions);

// const CreateTemplateSectionTopicQuestion = (props) => {
//   const { onOpen, onClose, templateId, template } = props;
//   console.log("Props", props);
//   const classes = useStyles();
//   const [isLoading, setIsLoading] = useState(false);
//   const [onDialogOpen, setOnDialogOpen] = useState(false);
//   const [dialogTitle, setDialogTitle] = useState("");
//   const [modalTitle, setModalTitle] = useState("Categories");
//   const [confirmDialog, setConfirmDialog] = useState(false);
//   const [insertedTemplate, setInsertedTemplate] = useState({});
//   const [templateData, setTemplateData] = useState({});
//   console.log("templateData", templateData);
//   const [templateValue, setTemplateValue] = useState("");
//   const [categoryValue, setCategoryValue] = useState("");
//   const [topicValue, setTopicValue] = useState("");
//   // const [questionValue, setQuestionValue] = useState("");
//   const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
//   const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [categoriesNumber, setCategoriesNumber] = useState(0);
//   console.log("cate", categoriesNumber);
//   const [topicNumber, setTopicNumber] = useState(0);
//   const [questionsNumber, setQuestionsNumber] = useState(0);
//   const { dispatch, setUserDetails } = useUserDispatch();
//   const { userDetails } = useUserState();
//   const { entityDetails, activeUserDetails } = userDetails;
//   const history = useHistory();
//   const [isApiLoading, setIsApiLoading] = useState(false);

//   /*Question*/

//   const [question, setQuestion] = useState("");
//   const [questionType, setQuestionType] = useState("");
//   const [hasAttachment, setHasAttachment] = useState(true);
//   const [hasComment, setHasComment] = useState(true);
//   const [weightage, setWeightage] = useState("");

//   const [optionNumber, setOptionNumber] = useState("");
//   const questionNumber = [2, 3, 4, 5, 6, 7, 8, 9, 10];
//   const [optionValues, setOptionValues] = useState([]);
//   const [questionDescription, setQuestionDescription] = useState("");
//   let [count, setCount] = useState(0);
//   const [yesVal, setYesVal] = useState(0);
//   const [noVal, setNoVal] = useState(0);

//   const RandomFields = () => {
//     let optionFields = [];
//     count = 0;
//     optionValues.map((value, index) => {
//       count += parseInt(value.optionWeight ? value.optionWeight : 0);
//       optionFields.push(
//         <Grid container spacing={2}>
//           <Grid
//             item
//             md={8}
//             xs={9}
//             style={{ marginTop: "3%" }}
//             key={`optionval${index}`}
//           >
//             <TextField
//               fullWidth
//               required
//               size="small"
//               label={`Option ${index + 1}`}
//               type="text"
//               onChange={(event) => {
//                 let newArr = [...optionValues];
//                 //newArr[index].optionValue = event.target.value;
//                 if (newArr[index]) newArr[index].optionVal = event.target.value;
//                 else newArr[index] = { optionVal: event.target.value };
//                 setOptionValues(newArr);
//               }}
//               value={value.optionVal}
//             />
//           </Grid>
//           <Grid
//             item
//             md={4}
//             xs={3}
//             style={{ marginTop: "3%" }}
//             key={`optionweight${index}`}
//           >
//             <TextField
//               fullWidth
//               required
//               size="small"
//               label={`WeightAge of Option ${index + 1}`}
//               type="number"
//               onChange={(event) => {
//                 let newArr = [...optionValues];
//                 if (newArr[index])
//                   newArr[index].optionWeight = event.target.value;
//                 else newArr[index] = { optionWeight: event.target.value };
//                 setOptionValues(newArr);
//               }}
//               value={value.optionWeight}
//             />
//           </Grid>
//         </Grid>
//       );
//     });

//     console.log("count======>>>>>", count);

//     return (
//       <FormControl fullWidth size="small" required>
//         {optionFields}
//       </FormControl>
//     );
//   };

//   const validationMsg = () => {
//     return (
//       <Grid container spacing={2}>
//         <Grid item md={12} xs={12} style={{ marginTop: "3%" }}>
//           <Typography variant="h6" color="error">
//             Summation of all option's weightage should not be greater than or
//             less than of question weightage
//           </Typography>
//         </Grid>
//       </Grid>
//     );
//   };

//   /*End Question Code*/

//   const handleClose = () => {
//     setOnDialogOpen(false);
//   };

//   const handleOpen = (title) => {
//     console.log("title", title);
//     setOnDialogOpen(true);
//     if (title === "Section") {
//       setCategoriesNumber(0);
//     } else if (title === "Topic") {
//       setTopicNumber(0);
//     } else if (title === "Question") {
//       setQuestionsNumber(0);
//     }
//     setDialogTitle(title);
//   };

//   const createCategories = () => {
//     let categories = { ...templateData };
//     if (categories.categories) {
//       let categoriesArray = new Array(categoriesNumber).fill("");
//       categoriesArray.map((val, ind) => {
//         categories.categories.push({ catId: v4() });
//       });
//     } else {
//       categories = {
//         categories: new Array(categoriesNumber)
//           .fill("")
//           .map((_) => ({ catId: v4() })),
//         //categoryCount: categoriesNumber,
//       };
//     }
//     setTemplateData({ ...categories });
//     setOnDialogOpen(false);
//     setModalTitle("Categories");
//   };

//   const createTopic = () => {
//     let topic = { ...templateData };
//     if (topic.categories[selectedCategoryIndex].catId) {
//       let topicArray = new Array(topicNumber).fill("");
//       topic.categories[selectedCategoryIndex].topicAndQuestion = [];
//       topicArray.map((val, ind) => {
//         topic.categories[selectedCategoryIndex].topicAndQuestion.push({
//           topicId: v4(),
//         });
//       });
//     }
//     // else {
//     //   topic.categories[selectedCategoryIndex] = {
//     //     topicAndQuestion: new Array(topicNumber).fill("").map((_) => ({topicId:v4()})),
//     //     //topicCount: topicNumber,
//     //   };
//     // }
//     setTemplateData({ ...topic });
//     setOnDialogOpen(false);
//     setModalTitle("Topic");
//   };

//   const createQuestion = () => {
//     let topic = { ...templateData };
//     if (
//       topic.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].topicId
//     ) {
//       topic.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns = [];
//       let questionArray = new Array(questionsNumber).fill("");
//       questionArray.map((_) => {
//         topic.categories[selectedCategoryIndex].topicAndQuestion[
//           selectedTopicIndex
//         ].queAndAns.push({ queId: v4() });
//       });
//     }
//     // else {
//     //   topic.categories[selectedCategoryIndex].topicAndQuestion[
//     //     selectedTopicIndex
//     //   ] = {
//     //     queAndAns: new Array(questionsNumber).fill("").map((_) => ({queId:v4()})),
//     //     //questionCount: questionsNumber,
//     //   };
//     // }
//     setTemplateData({ ...topic });
//     setOnDialogOpen(false);
//     setModalTitle("Question");
//   };

//   const saveData = (sectionName) => {
//     const sectionData = { ...templateData };
//     if (sectionName === "Categories") {
//       sectionData.categories[selectedCategoryIndex].categoryName =
//         categoryValue;
//     } else if (sectionName === "Topic") {
//       sectionData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].topicName = topicValue;
//     }
//     setModalTitle(sectionName);
//     setTemplateData({ ...sectionData });
//   };

//   const onClickCategory = (catIndex) => {
//     setSelectedCategoryIndex(catIndex);
//     setCategoryValue(
//       templateData.categories[catIndex].categoryName
//         ? templateData.categories[catIndex].categoryName
//         : ""
//     );
//     setModalTitle("Topic");
//   };

//   const onClickTopic = (topicIndex) => {
//     setSelectedTopicIndex(topicIndex);
//     setTopicValue(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         topicIndex
//       ].topicName
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             topicIndex
//           ].topicName
//         : ""
//     );
//     setModalTitle("Question");
//   };

//   const onClickQuestion = (questionIndex) => {
//     setSelectedQuestionIndex(questionIndex);

//     setQuestion(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].question
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].question
//         : ""
//     );

//     setQuestionType(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].questionType
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].questionType
//         : ""
//     );

//     setHasAttachment(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].hasAttachment !== undefined
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].hasAttachment
//         : true
//     );

//     setHasComment(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].hasComment !== undefined
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].hasComment
//         : true
//     );

//     setWeightage(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].weightage
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].weightage
//         : ""
//     );

//     setOptionNumber(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].optionNumber
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].optionNumber
//         : ""
//     );

//     setOptionValues(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].optionValues
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].optionValues
//         : []
//     );

//     setQuestionDescription(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].questionDescription
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].questionDescription
//         : ""
//     );

//     setYesVal(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].yesVal
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].yesVal
//         : 0
//     );

//     setNoVal(
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[questionIndex].noVal
//         ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//             selectedTopicIndex
//           ].queAndAns[questionIndex].noVal
//         : 0
//     );

//     // setQuestionValue(
//     //   templateData.categories[selectedCategoryIndex].topicAndQuestion[
//     //     selectedTopicIndex
//     //   ].queAndAns[questionIndex].questionName
//     //     ? templateData.categories[selectedCategoryIndex].topicAndQuestion[
//     //         selectedTopicIndex
//     //       ].queAndAns[questionIndex].questionName
//     //     : ""
//     // );

//     setModalTitle("QuestionDetails");
//   };

//   const saveQuestionDetails = () => {
//     const allCategories = { ...templateData };
//     let questions =
//       allCategories.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns[selectedQuestionIndex];
//     if (questions.queId) {
//       // questions.questionName = questionValue;
//       questions.question = question;
//       questions.questionDescription = questionDescription;
//       questions.optionNumber = optionNumber;
//       questions.optionValues = optionValues;
//       questions.yesVal = yesVal;
//       questions.noVal = noVal;
//       questions.hasAttachment = hasAttachment;
//       questions.hasComment = hasComment;
//       questions.questionType = questionType;
//       questions.weightage = weightage;
//     } else {
//       questions = {
//         // questionName: questionValue,
//         question: question,
//         questionDescription: questionDescription,
//         optionNumber: optionNumber,
//         optionValues: optionValues,
//         yesVal: yesVal,
//         noVal: noVal,
//         hasAttachment: hasAttachment,
//         hasComment: hasComment,
//         questionType: questionType,
//         weightage: weightage,
//       };
//     }

//     allCategories.categories[selectedCategoryIndex].topicAndQuestion[
//       selectedTopicIndex
//     ].queAndAns[selectedQuestionIndex] = questions;

//     setTemplateData({ ...allCategories });
//     setModalTitle("Question");
//     resetQuestionData();
//   };

//   const dialog = () => {
//     if (dialogTitle === "Section") {
//       return (
//         <Dialog
//           onClose={handleClose}
//           aria-labelledby="customized-dialog-title"
//           open={onDialogOpen}
//           style={{ borderRadius: "8%" }}
//         >
//           <ValidatorForm onSubmit={() => createCategories()}>
//             <DialogContent>
//               <IconButton
//                 aria-label="close"
//                 className={classes.customizedButton}
//                 onClick={handleClose}
//               >
//                 <CloseIcon fontSize="small" />
//               </IconButton>
//               <Typography
//                 style={{ margin: "10px 0px", fontSize: "15px" }}
//               >{`How many ${dialogTitle} do you want to create?`}</Typography>
//               <TextField
//                 variant="outlined"
//                 placeholder="Enter Here"
//                 fullWidth
//                 size="small"
//                 required
//                 type={"number"}
//                 value={categoriesNumber === 0 ? "" : categoriesNumber}
//                 onChange={(e) =>
//                   setCategoriesNumber(
//                     parseInt(e.target.value === "" ? 0 : e.target.value)
//                   )
//                 }
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 type="submit"
//                 color="primary"
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Save
//               </Button>
//             </DialogActions>
//           </ValidatorForm>
//         </Dialog>
//       );
//     } else if (dialogTitle === "Topic") {
//       return (
//         <Dialog
//           onClose={handleClose}
//           aria-labelledby="customized-dialog-title"
//           open={onDialogOpen}
//           style={{ borderRadius: "8%" }}
//         >
//           <ValidatorForm onSubmit={() => createTopic()}>
//             <DialogContent>
//               <IconButton
//                 aria-label="close"
//                 className={classes.customizedButton}
//                 onClick={handleClose}
//               >
//                 <CloseIcon fontSize="small" />
//               </IconButton>
//               <Typography
//                 style={{ margin: "10px 0px", fontSize: "15px" }}
//               >{`How many ${dialogTitle} do you want to create?`}</Typography>
//               <TextField
//                 variant="outlined"
//                 placeholder="Enter Here"
//                 fullWidth
//                 required
//                 size="small"
//                 type={"number"}
//                 value={topicNumber === 0 ? "" : topicNumber}
//                 onChange={(e) =>
//                   setTopicNumber(
//                     parseInt(e.target.value === "" ? 0 : e.target.value)
//                   )
//                 }
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 type="submit"
//                 color="primary"
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Save
//               </Button>
//             </DialogActions>
//           </ValidatorForm>
//         </Dialog>
//       );
//     } else if (dialogTitle === "Question") {
//       return (
//         <Dialog
//           onClose={handleClose}
//           aria-labelledby="customized-dialog-title"
//           open={onDialogOpen}
//           style={{ borderRadius: "8%" }}
//         >
//           <ValidatorForm onSubmit={() => createQuestion()}>
//             <DialogContent>
//               <IconButton
//                 aria-label="close"
//                 className={classes.customizedButton}
//                 onClick={handleClose}
//               >
//                 <CloseIcon fontSize="small" />
//               </IconButton>
//               <Typography
//                 style={{ margin: "10px 0px", fontSize: "15px" }}
//               >{`How many ${dialogTitle} do you want to create?`}</Typography>
//               <TextField
//                 variant="outlined"
//                 placeholder="Enter Here"
//                 fullWidth
//                 required
//                 size="small"
//                 type={"number"}
//                 value={questionsNumber === 0 ? "" : questionsNumber}
//                 onChange={(e) =>
//                   setQuestionsNumber(
//                     parseInt(e.target.value === "" ? 0 : e.target.value)
//                   )
//                 }
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 type="submit"
//                 color="primary"
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Save
//               </Button>
//             </DialogActions>
//           </ValidatorForm>
//         </Dialog>
//       );
//     }
//   };

//   const confirmDialogBox = () => {
//     return (
//       <Dialog
//         disableBackdropClick
//         onClose={() => setConfirmDialog(false)}
//         aria-labelledby="customized-dialog-title"
//         open={confirmDialog}
//       >
//         {modalTitle === "Categories" && (
//           <>
//             <DialogContent>
//               If you click on "Confirm" then your all Categories,Topics And
//               Questions will be delete.Are You Sure ?
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 color="primary"
//                 onClick={createCategories}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Confirm
//               </Button>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 color="primary"
//                 onClick={() => setConfirmDialog(false)}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Cancle
//               </Button>
//             </DialogActions>
//           </>
//         )}
//         {modalTitle === "Topic" && (
//           <>
//             <DialogContent>
//               If you click on "Confirm" then your all Topics And Questions will
//               be delete.Are You Sure ?
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 color="primary"
//                 onClick={createTopic}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Confirm
//               </Button>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 color="primary"
//                 onClick={() => setConfirmDialog(false)}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Cancle
//               </Button>
//             </DialogActions>
//           </>
//         )}
//         {modalTitle === "Question" && (
//           <>
//             <DialogContent>
//               If you click on "Confirm" then your all Questions will be
//               delete.Are You Sure ?
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 color="primary"
//                 onClick={createQuestion}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Confirm
//               </Button>
//               <Button
//                 size="small"
//                 variant="contained"
//                 autoFocus
//                 color="primary"
//                 onClick={() => setConfirmDialog(false)}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 Cancle
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>
//     );
//   };

//   const onClickBreadCrumb = (breadcrumb) => {
//     if (breadcrumb === "modalClose") {
//       onClose();
//     } else {
//       setModalTitle(breadcrumb);
//     }
//   };

//   const onDeleteCard = (index, e) => {
//     e.stopPropagation();
//     if (modalTitle === "Categories") {
//       templateData.categories.splice(index, 1);
//     } else if (modalTitle === "Topic") {
//       templateData.categories[selectedCategoryIndex].topicAndQuestion.splice(
//         index,
//         1
//       );
//     } else if (modalTitle === "Question") {
//       templateData.categories[selectedCategoryIndex].topicAndQuestion[
//         selectedTopicIndex
//       ].queAndAns.splice(index, 1);
//     }
//     setTemplateData({ ...templateData });
//   };
//   const breadcrumb = (props) => {
//     return (
//       <Breadcrumbs
//         separator="›"
//         aria-label="breadcrumb"
//         style={{ marginTop: "-10px", fontSize: "15px" }}
//       >
//         {props.breadcrumbElements &&
//           props.breadcrumbElements.map((breadcrumb) =>
//             breadcrumb.path ? (
//               <Link
//                 style={{ cursor: "pointer", textDecoration: "none" }}
//                 color="primary"
//                 key={breadcrumb}
//                 onClick={() => onClickBreadCrumb(breadcrumb.path)}
//               >
//                 {breadcrumb.label}
//               </Link>
//             ) : (
//               <Link
//                 color="inherit"
//                 style={{ textDecoration: "none" }}
//                 key={breadcrumb}
//               >
//                 {breadcrumb.label}
//               </Link>
//             )
//           )}
//       </Breadcrumbs>
//     );
//   };

//   const resetQuestionData = () => {
//     setQuestion("");
//     setQuestionType("");
//     setHasAttachment(true);
//     setHasComment(true);
//     setWeightage("");
//     setOptionNumber("");
//     setOptionValues([]);
//     setQuestionDescription("");
//     setYesVal(0);
//     setNoVal(0);
//   };

//   const saveTemplate = async () => {
//     try {
//       setIsApiLoading(true);
//       if (
//         history.location.pathname === "/app/manageaudits/add" ||
//         history.location.pathname ===
//           `/app/manageaudits/editaudit/${props.auditId}`
//       ) {
//         onClose(templateData);
//       } else {
//         let params = {};
//         if (templateId !== "") {
//           params = {
//             entityId: entityDetails.id,
//             userId: activeUserDetails.id,
//             name: templateValue,
//             template: templateData,
//             templateId: templateId,
//           };
//         } else {
//           params = {
//             entityId: entityDetails.id,
//             userId: activeUserDetails.id,
//             name: templateValue,
//             template: templateData,
//           };
//         }

//         const response = await callApi(
//           "CREATE",
//           "CREATE_AND_UPDATE_GENERIC_TEMPLATE",
//           params
//         );
//         if (response.status === 403) {
//           setUserDetails({});
//           notify();
//           dispatch({ type: "TOKEN_EXPIRED" });
//         }
//         if (response.status === 200) {
//           onClose();
//         }
//       }
//       setIsApiLoading(false);
//     } catch (error) {
//       console.log("Template Error", error);
//     }
//   };

//   const getTemplateDataById = async (templateID) => {
//     try {
//       const response = await callApi(
//         "GET",
//         "GET_TEMPLATE_DATA_BY_ID",
//         templateID
//       );
//       if (response.status === 403) {
//         setUserDetails({});
//         notify();
//         dispatch({ type: "TOKEN_EXPIRED" });
//       }
//       if (response.status === 200) {
//         const { Items } = response.data.data;
//         const categories = Items[0].template;
//         setTemplateData({ ...categories });
//         setTemplateValue(Items[0].name);
//         setInsertedTemplate({ ...Items[0] });
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.log("Template Data", error);
//     }
//   };

//   const onBackClick = () => {
//     if (modalTitle === "Categories") {
//       onClose();
//     } else if (modalTitle === "Topic") {
//       setModalTitle("Categories");
//     } else if (modalTitle === "Question") {
//       setModalTitle("Topic");
//     } else {
//       setModalTitle("Question");
//     }
//   };

//   useEffect(() => {
//     if (templateId !== "" && !template) {
//       setIsLoading(true);
//       getTemplateDataById(templateId);
//     } else {
//       setTemplateData(template);
//     }
//   }, []);

//   console.log("TemplateData====>>>", templateData);

//   return (
//     <div>
//       <Modal
//         //style={outerStyle}
//         disableBackdropClick
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         closeAfterTransition={false}
//         open={onOpen}
//         onClose={onClose}
//         //style={{maxHeight:"50%"}}
//       >
//         {isLoading ? (
//           <CircularProgress
//             style={{ position: "absolute", top: "50%", left: "50%" }}
//           />
//         ) : (
//           <>
//             <Box sx={style}>
//               {modalTitle === "Categories" ? (
//                 <>
//                   <Box style={{ width: "100%" }}>
//                     <Link
//                       style={{
//                         fontSize: "15px",
//                         textDecoration: "none",
//                         cursor: "pointer",
//                         display: "flex",
//                       }}
//                       onClick={() => onBackClick()}
//                     >
//                       <ChevronLeftOutlinedIcon
//                         fontSize="medium"
//                         style={{ marginTop: "-1px" }}
//                       />
//                       {`Back`}
//                     </Link>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: "2%",
//                       }}
//                     >
//                       <div>
//                         {breadcrumb({
//                           breadcrumbElements: [
//                             { label: "Template", path: "modalClose" },
//                             {
//                               label: insertedTemplate.name
//                                 ? insertedTemplate.name
//                                 : "Create Template",
//                             },
//                           ],
//                         })}
//                       </div>
//                     </div>
//                   </Box>
//                   <ValidatorForm onSubmit={() => saveTemplate()}>
//                     <Box
//                       style={
//                         templateData &&
//                         templateData.categories &&
//                         templateData.categories.length > 0
//                           ? {
//                               position: "absolute",
//                               height: "80%",
//                               width: "95.5%",
//                               overflowY: "auto",
//                               overflowX: "hidden",
//                             }
//                           : {}
//                       }
//                     >
//                       {history.location.pathname === "/app/manageaudits/add" ||
//                       history.location.pathname ===
//                         `/app/manageaudits/editaudit/${props.auditId}` ? null : (
//                         <>
//                           <Grid
//                             container
//                             spacing={2}
//                             style={{ marginTop: "2%" }}
//                           >
//                             <Grid item xs={12} md={12}>
//                               <TextField
//                                 variant="outlined"
//                                 label="Template Name"
//                                 type={"text"}
//                                 size="small"
//                                 required
//                                 fullWidth
//                                 style={{ font: "small-caption" }}
//                                 value={templateValue}
//                                 onChange={(e) =>
//                                   setTemplateValue(e.target.value)
//                                 }
//                               />
//                             </Grid>
//                           </Grid>
//                         </>
//                       )}
//                       <Divider style={{ marginTop: "2%" }} />
//                       <Box>
//                         <Grid
//                           container
//                           spacing={2}
//                           style={{
//                             marginTop: "1%",
//                             marginBottom: "1%",
//                             maxHeight: "350",
//                             overflow: "auto",
//                           }}
//                         >
//                           {templateData &&
//                             templateData.categories &&
//                             templateData.categories.map(
//                               (category, categoryIndex) => (
//                                 <Grid item xs={12} md={12}>
//                                   <Card
//                                     elevation={2}
//                                     onClick={() =>
//                                       onClickCategory(categoryIndex)
//                                     }
//                                     style={{
//                                       display: "flex",
//                                       justifyContent: "space-between",
//                                     }}
//                                   >
//                                     <Typography style={{ fontSize: "13px" }}>
//                                       {category.categoryName
//                                         ? category.categoryName
//                                         : `Section ${categoryIndex + 1}`}
//                                     </Typography>
//                                     <DeleteTwoToneIcon
//                                       onClick={(e) =>
//                                         onDeleteCard(categoryIndex, e)
//                                       }
//                                       fontSize="small"
//                                     />
//                                   </Card>
//                                 </Grid>
//                               )
//                             )}
//                         </Grid>
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => handleOpen("Section")}
//                           style={{
//                             textTransform: "capitalize",
//                             backgroundColor: "lightgrey",
//                           }}
//                           disabled={isApiLoading}
//                         >
//                           Add Section
//                         </Button>
//                       </Box>
//                     </Box>
//                     <Grid
//                       container
//                       style={{
//                         position: "fixed",
//                         bottom: "2%",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Grid>
//                         {isApiLoading && (
//                           <Box>
//                             <CircularProgress />
//                           </Box>
//                         )}
//                         <Button
//                           color="primary"
//                           size="small"
//                           variant="contained"
//                           type="submit"
//                           disabled={isApiLoading}
//                           style={{ textTransform: "capitalize" }}
//                         >
//                           Save Changes
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </ValidatorForm>
//                 </>
//               ) : modalTitle === "Topic" ? (
//                 <>
//                   <Box style={{ width: "100%" }}>
//                     <Link
//                       style={{
//                         fontSize: "15px",
//                         textDecoration: "none",
//                         cursor: "pointer",
//                         display: "flex",
//                       }}
//                       onClick={() => onBackClick()}
//                     >
//                       <ChevronLeftOutlinedIcon
//                         fontSize="medium"
//                         style={{ marginTop: "-1px" }}
//                       />
//                       {`Back`}
//                     </Link>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: "2%",
//                       }}
//                     >
//                       <div>
//                         {breadcrumb({
//                           breadcrumbElements: [
//                             { label: "Template", path: "modalClose" },
//                             {
//                               label: insertedTemplate.name
//                                 ? insertedTemplate.name
//                                 : "Create Template",
//                               path: "Categories",
//                             },
//                             {
//                               label: templateData.categories[
//                                 selectedCategoryIndex
//                               ].categoryName
//                                 ? templateData.categories[selectedCategoryIndex]
//                                     .categoryName
//                                 : `Section ${selectedCategoryIndex + 1}`,
//                             },
//                           ],
//                         })}
//                       </div>
//                     </div>
//                   </Box>
//                   <ValidatorForm onSubmit={() => saveData("Categories")}>
//                     <Box
//                       style={
//                         templateData.categories[selectedCategoryIndex]
//                           .topicAndQuestion &&
//                         templateData.categories[selectedCategoryIndex]
//                           .topicAndQuestion.length > 0
//                           ? {
//                               position: "absolute",
//                               height: "80%",
//                               width: "95.5%",
//                               overflowY: "auto",
//                               overflowX: "hidden",
//                             }
//                           : {}
//                       }
//                     >
//                       <Grid container spacing={2} style={{ marginTop: "2%" }}>
//                         <Grid item xs={12} md={12}>
//                           <TextField
//                             variant="outlined"
//                             required
//                             label="Section Name"
//                             type={"text"}
//                             size="small"
//                             value={categoryValue}
//                             onChange={(e) => setCategoryValue(e.target.value)}
//                             fullWidth
//                           />
//                         </Grid>
//                       </Grid>
//                       <Divider style={{ marginTop: "2%" }} />
//                       <Grid
//                         container
//                         spacing={2}
//                         style={{ marginTop: "1%", marginBottom: "1%" }}
//                       >
//                         {templateData.categories[selectedCategoryIndex]
//                           .topicAndQuestion &&
//                           templateData.categories[
//                             selectedCategoryIndex
//                           ].topicAndQuestion.map((topic, topicIndex) => (
//                             <Grid item xs={12} md={12}>
//                               <Card
//                                 elevation={2}
//                                 onClick={() => onClickTopic(topicIndex)}
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                 }}
//                               >
//                                 <Typography style={{ fontSize: "13px" }}>
//                                   {topic.topicName
//                                     ? topic.topicName
//                                     : `Topic ${topicIndex + 1}`}
//                                 </Typography>
//                                 <DeleteTwoToneIcon
//                                   onClick={(e) => onDeleteCard(topicIndex, e)}
//                                   fontSize="small"
//                                 />
//                               </Card>
//                             </Grid>
//                           ))}
//                       </Grid>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="primary"
//                         onClick={() => handleOpen("Topic")}
//                         style={{
//                           textTransform: "capitalize",
//                           backgroundColor: "lightgrey",
//                         }}
//                       >
//                         add topic
//                       </Button>
//                     </Box>
//                     <Grid
//                       container
//                       style={{
//                         position: "fixed",
//                         bottom: "2%",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Grid>
//                         <Button
//                           color="primary"
//                           size="small"
//                           variant="contained"
//                           type="submit"
//                           style={{ textTransform: "capitalize" }}
//                         >
//                           Save Changes
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </ValidatorForm>
//                 </>
//               ) : modalTitle === "Question" ? (
//                 <>
//                   <Box style={{ width: "100%" }}>
//                     <Link
//                       style={{
//                         fontSize: "15px",
//                         textDecoration: "none",
//                         cursor: "pointer",
//                         display: "flex",
//                       }}
//                       onClick={() => onBackClick()}
//                     >
//                       <ChevronLeftOutlinedIcon
//                         fontSize="medium"
//                         style={{ marginTop: "-1px" }}
//                       />
//                       {`Back`}
//                     </Link>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: "2%",
//                       }}
//                     >
//                       <div>
//                         {breadcrumb({
//                           breadcrumbElements: [
//                             { label: "Template", path: "modalClose" },
//                             {
//                               label: insertedTemplate.name
//                                 ? insertedTemplate.name
//                                 : "Create Template",
//                               path: "Categories",
//                             },
//                             {
//                               label: templateData.categories[
//                                 selectedCategoryIndex
//                               ].categoryName
//                                 ? templateData.categories[selectedCategoryIndex]
//                                     .categoryName
//                                 : `Section ${selectedCategoryIndex + 1}`,
//                               path: "Topic",
//                             },
//                             {
//                               label: templateData.categories[
//                                 selectedCategoryIndex
//                               ].topicAndQuestion[selectedTopicIndex].topicName
//                                 ? templateData.categories[selectedCategoryIndex]
//                                     .topicAndQuestion[selectedTopicIndex]
//                                     .topicName
//                                 : `Topic ${selectedTopicIndex + 1}`,
//                             },
//                           ],
//                         })}
//                       </div>
//                     </div>
//                   </Box>
//                   <ValidatorForm onSubmit={() => saveData("Topic")}>
//                     <Box
//                       style={
//                         templateData.categories[selectedCategoryIndex]
//                           .topicAndQuestion[selectedTopicIndex].queAndAns &&
//                         templateData.categories[selectedCategoryIndex]
//                           .topicAndQuestion[selectedTopicIndex].queAndAns
//                           .length > 0
//                           ? {
//                               position: "absolute",
//                               height: "80%",
//                               width: "95.5%",
//                               overflowY: "auto",
//                               overflowX: "hidden",
//                             }
//                           : {}
//                       }
//                     >
//                       <Grid container spacing={2} style={{ marginTop: "3%" }}>
//                         <Grid item xs={12} md={12}>
//                           <TextField
//                             variant="outlined"
//                             label="Topic Name"
//                             size="small"
//                             required
//                             type={"text"}
//                             value={topicValue}
//                             onChange={(e) => setTopicValue(e.target.value)}
//                             fullWidth
//                           />
//                         </Grid>
//                       </Grid>
//                       <Divider style={{ marginTop: "2%" }} />
//                       <Grid
//                         container
//                         spacing={2}
//                         style={{
//                           marginTop: "1%",
//                           marginBottom: "1%",
//                           overflowY: "auto",
//                         }}
//                       >
//                         {templateData.categories[selectedCategoryIndex]
//                           .topicAndQuestion[selectedTopicIndex].queAndAns &&
//                           templateData.categories[
//                             selectedCategoryIndex
//                           ].topicAndQuestion[selectedTopicIndex].queAndAns.map(
//                             (question, questionIndex) => (
//                               <Grid item xs={12} md={12}>
//                                 <Card
//                                   elevation={2}
//                                   onClick={() => onClickQuestion(questionIndex)}
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                   }}
//                                 >
//                                   <Typography style={{ fontSize: "13px" }}>
//                                     {question.question
//                                       ? question.question
//                                       : `Question ${questionIndex + 1}`}
//                                   </Typography>
//                                   <DeleteTwoToneIcon
//                                     onClick={(e) =>
//                                       onDeleteCard(questionIndex, e)
//                                     }
//                                     fontSize="small"
//                                   />
//                                 </Card>
//                               </Grid>
//                             )
//                           )}
//                       </Grid>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="primary"
//                         onClick={() => handleOpen("Question")}
//                         style={{
//                           textTransform: "capitalize",
//                           backgroundColor: "lightgrey",
//                         }}
//                       >
//                         Add Question
//                       </Button>
//                     </Box>
//                     <Grid
//                       container
//                       style={{
//                         position: "fixed",
//                         bottom: "2%",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Grid>
//                         <Button
//                           color="primary"
//                           size="small"
//                           variant="contained"
//                           type="submit"
//                           style={{ textTransform: "capitalize" }}
//                         >
//                           Save Changes
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </ValidatorForm>
//                 </>
//               ) : modalTitle === "QuestionDetails" ? (
//                 <>
//                   <Link
//                     style={{
//                       fontSize: "15px",
//                       textDecoration: "none",
//                       cursor: "pointer",
//                       display: "flex",
//                     }}
//                     onClick={() => onBackClick()}
//                   >
//                     <ChevronLeftOutlinedIcon
//                       fontSize="medium"
//                       style={{ marginTop: "-1px" }}
//                     />
//                     {`Back`}
//                   </Link>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginTop: "2%",
//                     }}
//                   >
//                     <div>
//                       {breadcrumb({
//                         breadcrumbElements: [
//                           { label: "Template", path: "modalClose" },
//                           {
//                             label: insertedTemplate.name
//                               ? insertedTemplate.name
//                               : "Create Template",
//                             path: "Categories",
//                           },
//                           {
//                             label: templateData.categories[
//                               selectedCategoryIndex
//                             ].categoryName
//                               ? templateData.categories[selectedCategoryIndex]
//                                   .categoryName
//                               : `Section ${selectedCategoryIndex + 1}`,
//                             path: "Topic",
//                           },
//                           {
//                             label: templateData.categories[
//                               selectedCategoryIndex
//                             ].topicAndQuestion[selectedTopicIndex].topicName
//                               ? templateData.categories[selectedCategoryIndex]
//                                   .topicAndQuestion[selectedTopicIndex]
//                                   .topicName
//                               : `Topic ${selectedTopicIndex + 1}`,
//                             path: "Question",
//                           },
//                           {
//                             label: templateData.categories[
//                               selectedCategoryIndex
//                             ].topicAndQuestion[selectedTopicIndex].queAndAns[
//                               selectedQuestionIndex
//                             ].question
//                               ? templateData.categories[selectedCategoryIndex]
//                                   .topicAndQuestion[selectedTopicIndex]
//                                   .queAndAns[selectedQuestionIndex].question
//                               : `Question ${selectedQuestionIndex + 1}`,
//                           },
//                         ],
//                       })}
//                     </div>
//                   </div>
//                   <ValidatorForm onSubmit={() => saveQuestionDetails()}>
//                     <Box
//                       style={{
//                         position: "absolute",
//                         height: "80%",
//                         width: "95.5%",
//                         overflowY: "auto",
//                         overflowX: "hidden",
//                       }}
//                     >
//                       {/* <Grid container spacing={2} style={{ marginTop: "3%" }}>
//                         <Grid item xs={12} md={12}>
//                           <TextField
//                             variant="outlined"
//                             label="Question Name"
//                             size="small"
//                             type={"text"}
//                             required
//                             value={questionValue}
//                             onChange={(e) => setQuestionValue(e.target.value)}
//                             fullWidth
//                           />
//                         </Grid>
//                       </Grid> */}
//                       <Divider style={{ marginTop: "2%" }} />
//                       <Grid container style={{ width: "100%" }}>
//                         <Grid item md={12} xs={12} style={{ marginTop: "2%" }}>
//                           <TextField
//                             fullWidth
//                             required
//                             size="small"
//                             label="Question"
//                             value={question}
//                             onChange={(event) => {
//                               setQuestion(event.target.value);
//                             }}
//                           />
//                         </Grid>

//                         <Grid item md={12} xs={12} style={{ marginTop: "2%" }}>
//                           <TextField
//                             fullWidth
//                             required
//                             size="small"
//                             label="Weightage"
//                             type="number"
//                             InputProps={{
//                               inputProps: {
//                                 max: 10,
//                                 min: 1,
//                               },
//                             }}
//                             value={weightage}
//                             onChange={(event) => {
//                               setWeightage(event.target.value);
//                             }}
//                           />
//                         </Grid>
//                         <Grid
//                           item
//                           md={12}
//                           xs={12}
//                           lg={12}
//                           className={classes.fieldContainer}
//                           style={{ marginTop: "2%" }}
//                         >
//                           <FormControl fullWidth size="small" required>
//                             <TextField
//                               multiline
//                               minRows={2}
//                               style={{
//                                 display: "flex",
//                                 textAlign: "left",
//                                 justifyContent: "flex-start",
//                               }}
//                               required
//                               label={"Question Description"}
//                               value={questionDescription}
//                               onChange={(e) => {
//                                 setQuestionDescription(e.target.value);
//                               }}
//                             />
//                           </FormControl>
//                         </Grid>

//                         <Grid
//                           item
//                           md={12}
//                           xs={12}
//                           lg={12}
//                           style={{ marginTop: "2%" }}
//                         >
//                           <FormControl component="fieldset">
//                             <FormLabel component="legend">
//                               Has Attachment
//                             </FormLabel>
//                             <RadioGroup
//                               row
//                               value={hasAttachment}
//                               onChange={() => {
//                                 setHasAttachment(!hasAttachment);
//                               }}
//                             >
//                               <FormControlLabel
//                                 value={true}
//                                 control={<Radio color="primary" />}
//                                 label="Yes"
//                               />
//                               <FormControlLabel
//                                 value={false}
//                                 control={<Radio color="primary" />}
//                                 label="No"
//                               />
//                             </RadioGroup>
//                           </FormControl>
//                         </Grid>
//                         <Grid
//                           item
//                           md={12}
//                           xs={12}
//                           lg={12}
//                           style={{ marginTop: "2%" }}
//                         >
//                           <FormControl component="fieldset">
//                             <FormLabel component="legend">
//                               Has Comment
//                             </FormLabel>
//                             <RadioGroup
//                               row
//                               value={hasComment}
//                               onChange={() => {
//                                 setHasComment(!hasComment);
//                               }}
//                             >
//                               <FormControlLabel
//                                 value={true}
//                                 control={<Radio color="primary" />}
//                                 label="Yes"
//                               />
//                               <FormControlLabel
//                                 value={false}
//                                 control={<Radio color="primary" />}
//                                 label="No"
//                               />
//                             </RadioGroup>
//                           </FormControl>
//                         </Grid>

//                         <Grid
//                           item
//                           md={12}
//                           xs={12}
//                           lg={12}
//                           className={classes.fieldContainer}
//                           style={{ marginTop: "2%" }}
//                         >
//                           <FormControl fullWidth size="small" required>
//                             <InputLabel>Question Type</InputLabel>
//                             <Select
//                               className={classes.selectClass}
//                               required
//                               MenuProps={{
//                                 PaperProps: {
//                                   style: { marginTop: 45 },
//                                 },
//                               }}
//                               value={questionType}
//                               onChange={(event) => {
//                                 setQuestionType(event.target.value);
//                               }}
//                               label="Select Question Type"
//                               fullWidth
//                             >
//                               <MenuItem value={"yes/no"}>Yes / No</MenuItem>
//                               <MenuItem value={"rating"}>Rating </MenuItem>
//                               <MenuItem value={"single"}>
//                                 Single Selection
//                               </MenuItem>
//                               <MenuItem value={"multiple"}>
//                                 Multiple Selection
//                               </MenuItem>
//                             </Select>
//                           </FormControl>

//                           {questionType === "single" ||
//                           questionType === "multiple" ? (
//                             <Grid
//                               item
//                               md={12}
//                               xs={12}
//                               lg={12}
//                               style={{ marginTop: "3%" }}
//                             >
//                               <FormControl fullWidth size="small" required>
//                                 <InputLabel>Select Option Number</InputLabel>
//                                 <Select
//                                   className={classes.selectClass}
//                                   required
//                                   MenuProps={{
//                                     PaperProps: {
//                                       style: { marginTop: 45 },
//                                     },
//                                   }}
//                                   value={optionNumber}
//                                   onChange={(event) => {
//                                     setOptionNumber(event.target.value);
//                                     let arr = new Array(event.target.value);
//                                     arr.fill("");
//                                     setOptionValues(arr);
//                                   }}
//                                   label="Select Option Number"
//                                   fullWidth
//                                 >
//                                   {questionNumber.map((ques) => (
//                                     <MenuItem value={ques} key={ques}>
//                                       {ques}
//                                     </MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </Grid>
//                           ) : questionType === "yes/no" ? (
//                             <Grid>
//                               <Grid
//                                 container
//                                 spacing={2}
//                                 style={{ marginTop: "3%" }}
//                               >
//                                 <Grid
//                                   item
//                                   md={6}
//                                   xs={6}
//                                   style={{ marginTop: "4%" }}
//                                 >
//                                   <Typography>Yes</Typography>
//                                 </Grid>
//                                 <Grid item md={6} xs={6}>
//                                   <TextField
//                                     required
//                                     type={"number"}
//                                     label={"Weightage of option Yes"}
//                                     value={yesVal}
//                                     onChange={(event) => {
//                                       setYesVal(parseInt(event.target.value));
//                                     }}
//                                   />
//                                 </Grid>
//                               </Grid>
//                               <Grid
//                                 container
//                                 spacing={2}
//                                 style={{ marginTop: "3%" }}
//                               >
//                                 <Grid item md={6} xs={6}>
//                                   <Typography>No</Typography>
//                                 </Grid>
//                                 <Grid item md={6} xs={6}>
//                                   <TextField
//                                     required
//                                     type={"number"}
//                                     value={noVal}
//                                     label={"Weightage of option No"}
//                                     onChange={(event) => {
//                                       setNoVal(parseInt(event.target.value));
//                                     }}
//                                   />
//                                 </Grid>
//                               </Grid>
//                             </Grid>
//                           ) : null}
//                           {questionType === "single" ||
//                           questionType === "multiple"
//                             ? RandomFields()
//                             : null}
//                         </Grid>
//                         {questionType === "single" ||
//                         questionType === "multiple"
//                           ? count !== parseInt(weightage) && count !== 0
//                             ? validationMsg()
//                             : null
//                           : questionType === "yes/no"
//                           ? yesVal + noVal !== parseInt(weightage)
//                             ? validationMsg()
//                             : null
//                           : null}
//                       </Grid>
//                     </Box>
//                     <Grid
//                       container
//                       style={{
//                         position: "fixed",
//                         bottom: "2%",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Grid>
//                         <Button
//                           color="primary"
//                           size="small"
//                           variant="contained"
//                           type="submit"
//                           style={{ textTransform: "capitalize" }}
//                           disabled={
//                             questionType === "single" ||
//                             questionType === "multiple"
//                               ? (questionType !== "single" &&
//                                   questionType !== "multiple") ||
//                                 count === parseInt(weightage)
//                                 ? false
//                                 : true
//                               : questionType === "yes/no"
//                               ? yesVal + noVal === parseInt(weightage)
//                                 ? false
//                                 : true
//                               : false
//                           }
//                         >
//                           Save Changes
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </ValidatorForm>
//                 </>
//               ) : null}

//               {onDialogOpen && dialog()}
//               {confirmDialog && confirmDialogBox()}
//             </Box>
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default CreateTemplateSectionTopicQuestion;
