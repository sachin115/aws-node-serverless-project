import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Card } from "@material-ui/core";
import AnswerQuestionOfTopic from "./answerquestionoftopic";
import Breadcrumb from "../../Components/Breadcrumbs";
import { useParams } from "react-router-dom";
import callApi from "../../Customutils/callApi";
import { useUserState } from "../../Customutils/UserContext";

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
        <Box p={3}>
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));




export default function ManageAuditDetails({nextId}) {
  // const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const params = useParams();
  let { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const { id } = params;
  const [mappedCategories,setMappedCategories] = useState([]);

  const handleChange = (event, newValue) => {
    console.log("new===", newValue);
    setValue(newValue);
  };

  const GetCategoriesOfAudit = async () => {
    try {
      // const response = await callApi(
      //   "GET",
      //   "GET_AUDIT_DETAILS",
      //   `${id}/${entityDetails.id}`
      // );

      const response = await callApi("GET","GET_ALL_AUDIT_CATEGORIES",id);
      if (response.status === 200) {
        const { categories } = response.data.getAllActiveAuditsResponse;
        console.log("Mapped categories==>>",categories)
        setMappedCategories(categories);
      }
    } catch (error) {
        console.log("Error==>",error)
    }
  }

  useEffect(()=>{
  debugger;
    console.log("Next Id=====>>>>>>",nextId)
    if(nextId){
      setValue(nextId)
    } else {
      GetCategoriesOfAudit();
    }
  },[])

  return (
    // <div className={classes.root}>
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
          { label: "Users of Questions And Answers" },
        ]}
      />
      {/* <Card
        position="static"
        style={{ backgroundColor: "#1722eb", color: "#fff", marginTop: "10px" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="none"
        >
          { mappedCategories.map((value)=> (
              <Tab label={value.name}  />
            ))
          }
        </Tabs>
      </Card> */}
          {
            mappedCategories.map((val,ind)=>(
              <TabPanel value={value} index={ind}>
                {/* <AnswerQuestionOfTopic catId={val.id} nextId={ind === mappedCategories.length -1 ? "" : mappedCategories[ind + 1].id} /> */}


              </TabPanel>
            ))
          }
    </>
    // </div>
  );
}

// import {
  //   Card,
  //   CircularProgress,
//   Grid,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   Typography,
//   Tabs,
//   AppBar,
//   Tab,
// } from "@material-ui/core";
// import { useEffect, useState } from "react";
// import { useHistory, useParams } from "react-router-dom";
// import callApi from "../../Customutils/callApi";
// import Breadcrumb from "../../Components/Breadcrumbs";
// import useStyle from "../styles";
// import AnswerQuestionOfTopic from "./answerquestionoftopic";

// const ManageAuditDetails = () => {
//   const params = useParams();
//   const history = useHistory();
//   const classes = useStyle();
//   const { id } = params;
//   console.log("id", id);
//   const [categoriesOfAudit, setCategoriesOfAudit] = useState([]);
//   console.log("cat", categoriesOfAudit);
//   const [isLoading, setIsLoading] = useState(true);
//   const [values, setValues] = useState("");
//   const [isShown, setIsShown] = useState(false);

//   const GetAllCategoriesOfAudit = async (id) => {
//     try {
//       const response = await callApi("GET", "GET_ALL_AUDIT_CATEGORIES", id);
//       setCategoriesOfAudit(response.data.getAllActiveAuditsResponse.categories);

//       setIsLoading(false);
//     } catch (err) {
//       console.log("err", err);
//     }
//   };

//   const onTabChange = (id) => {
//     setValues(id);
//     console.log("deid", id);
//   };

//   useEffect(() => {
//     GetAllCategoriesOfAudit(id);
//   }, []);
//   return (
//     <>
//       <Breadcrumb
//         breadcrumbElements={[
//           {
//             label: "Audits",
//             path: "/app/dashboard",
//           },
//           {
//             label: "Inprogress Audits",
//             path: "/app/manageinprogressaudits/inprogressaudits",
//           },
//           { label: "Users" },
//         ]}
//       />
//       <Card className={classes.cardClass}>
//         <Grid container spacing={2}>
//           <Grid item md={3} xs={12}>
//             <Typography className={classes.typographyClass}>
//               Start Date
//             </Typography>
//             <Typography className={classes.typographyClass}>
//               11/13/2022
//             </Typography>
//           </Grid>
//           <Grid item md={3} xs={12}>
//             <Typography className={classes.typographyClass}>
//               Unanswered
//             </Typography>
//             <Typography className={classes.typographyClass}>10</Typography>
//           </Grid>
//           <Grid item md={3} xs={12}>
//             <Typography className={classes.typographyClass}>
//               Attempted Qs
//             </Typography>
//             <Typography className={classes.typographyClass}>22</Typography>
//           </Grid>
//           <Grid item md={3} xs={12}>
//             <Typography className={classes.typographyClass}>
//               Total Score
//             </Typography>
//             <Typography className={classes.typographyClass}>32</Typography>
//           </Grid>
//         </Grid>
//       </Card>
//       {isLoading ? (
//         <CircularProgress />
//       ) : (
//         <>
//           <Grid container spacing={2} className={classes.cardClass}>
//             <Card position="static" style={{ width: "99%" }}>
//               {categoriesOfAudit.map((category) => (
//                 <Tabs
//                   aria-label="scrollable auto tabs example"
//                   indicatorColor="primary"
//                   textColor="primary"
//                   scrollButtons="auto"
//                 >
//                   <Tab
//                     label={category.name}
//                     wrapped
//                     value={category.id}
//                     onChange={(event) => onTabChange(category.id)}
//                   >
//                     {category.name}
//                   </Tab>
//                 </Tabs>
//               ))}
//             </Card>
//           </Grid>
//           <AnswerQuestionOfTopic id={values} />
//         </>
//       )}
//     </>
//   );

//   /* <Grid container spacing={2}>
//             {categoriesOfAudit.map((category) => (
//               <Grid item md={4} xs={12}>
//                 <Card
//                   elevation={9}
//                   onClick={() => {
//                     onCardClick(category.id);
//                   }}
//                 >
//                   <Grid container>
//                     <Grid item md={3} xs={12}>
//                       <AssignmentIndOutlinedIcon
//                         color="primary"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                         }}
//                       />
//                     </Grid>

//                     <Grid item md={9}>
//                       <Table>
//                         <TableBody>
//                           <TableRow>
//                             <TableCell className={classes.tableCell}>
//                               Category Name
//                             </TableCell>
//                             <TableCell className={classes.tableCell}>
//                               : {category.name}
//                             </TableCell>
//                           </TableRow>
//                           <TableRow>
//                             <TableCell className={classes.tableCell}>
//                               Weightage
//                             </TableCell>
//                             <TableCell className={classes.tableCell}>
//                               : 85
//                             </TableCell>
//                           </TableRow>
//                           <TableRow>
//                             <TableCell className={classes.tableCell}>
//                               Total Score
//                             </TableCell>
//                             <TableCell className={classes.tableCell}>
//                               : 78
//                             </TableCell>
//                           </TableRow>
//                           <TableRow>
//                             <TableCell className={classes.tableCell}>
//                               Unanswered Qs
//                             </TableCell>
//                             <TableCell className={classes.tableCell}>
//                               : 11
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>
//                     </Grid>
//                   </Grid>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>  */
// };

// export default ManageAuditDetails;
