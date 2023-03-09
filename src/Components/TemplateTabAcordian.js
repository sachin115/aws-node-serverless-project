import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Modal,
  Paper,
  Tab,
  Tabs,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/Remove";

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

//   TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
//   };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

export default function TemplateTabAcordian() {
  const [valueSection, setValueSection] = useState(0);
  const [valueTopic, setValueTopic] = useState(1);
  const [templateData, setTemplateData] = useState([]);
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValueSection(newValue);
  };

  const handleChangeTopic = (event, newValue) => {
    setValueTopic(newValue);
  };

  const addQuestion = () => {
    const questionData = [...templateData];
    questionData.push({});
    setTemplateData([...questionData]);
  };

  const removeQuestion = (index) => {
    const questionData = [...templateData];
    questionData.splice(index, 1);
    setTemplateData([...questionData]);
  };

  return (
    <Modal open={true}>
      <Paper
        style={{
          position: "absolute",
          left: "5%",
          top: "5%",
          width: "90%",
          height: "90%",
          overflow: "auto",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={valueSection}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            TabIndicatorProps={{ style: { backgroundColor: "#00edfff2" } }}
            textColor="primary"
            classes={{ flexContainer: classes.flex }}
            // aria-label="scrollable force tabs example"
            padding="0px"
          >
            <Tab
              label="this is the description for section 1 of template 1"
              style={{
                textTransform: "capitalize",
                // textAlign: "left",
                // width: "33.3%",
              }}
            />
            <Tab
              label="this is the description for section 2 of template 1"
              style={{
                textTransform: "capitalize",
                // textAlign: "left",
                // width: "33.3%",
              }}
            />
            <Tab
              label="this is the description for section 3 of template 1"
              style={{
                textTransform: "capitalize",
                // textAlign: "left",
                // width: "33.3%",
              }}
            />
            <Tab
              label="this is the description for section 4 of template 1"
              style={{
                textTransform: "capitalize",
                // textAlign: "left",
                // width: "33.3%",
              }}
            />
          </Tabs>
        </Box>
        <TabPanel value={valueSection} index={0}>
          <Tabs
            value={valueTopic}
            onChange={handleChangeTopic}
            variant="scrollable"
            scrollButtons="on"
            TabIndicatorProps={{ style: { backgroundColor: "#00edfff2" } }}
            textColor="primary"
            aria-label="scrollable force tabs example"
            classes={{ flexContainer: classes.flex }}
          >
            <Tab
              label="this is the description for topic 1 of section 1 of template 1"
              style={{ textTransform: "capitalize" }}
            />
            <Tab
              label="this is the description for topic 2 of section 1 of template 1"
              style={{ textTransform: "capitalize" }}
            />
            <Tab
              label="this is the description for topic 3 of section 1 of template 1"
              style={{ textTransform: "capitalize" }}
            />
            <Tab
              label="this is the description for topic 4 of section 1 of template 1"
              style={{ textTransform: "capitalize" }}
            />
          </Tabs>
          <Grid container spacing={2}>
            <Grid md={11}></Grid>
            <Grid md={1}>
              <IconButton onClick={() => addQuestion()}>
                <AddCircleIcon color="primary" />
              </IconButton>
            </Grid>
          </Grid>
          <TabPanel value={valueTopic} index={0}>
            {templateData.map((val, ind) => (
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <Accordion
                    style={{
                      padding: "0px",
                      backgroundColor: ind % 2 !== 0 ? "#e6efee" : "#b0cdcb",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <RemoveIcon
                          style={{ backgroundColor: "white", color: "red" }}
                          onClick={() => removeQuestion(ind)}
                        />
                      }
                      style={{ paddingBottom: "0px" }}
                    >
                      <Typography>
                        This is description of question {`${ind + 1}`} for topic
                        1 of section 1 of template 1
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{
                        width: "100%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Box
                          width="100%"
                          //   overflow="auto"
                          height="100%"
                          //   id="scroll"
                          bgcolor={ind % 2 !== 0 ? "#e6efee" : "#b0cdcb"}
                          //   flex={1}
                        >
                          <Grid
                            item
                            md={12}
                            xs={12}
                            style={{ marginTop: "1%" }}
                          >
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Question"
                              // value={question}
                              // onChange={(event) => {
                              //   setQuestion(event.target.value);
                              // }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={12}
                            xs={12}
                            style={{ marginTop: "1%" }}
                          >
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
                              // value={weightage}
                              // onChange={(event) => {
                              //   setWeightage(event.target.value);
                              // }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={12}
                            xs={12}
                            lg={12}
                            //   className={classes.fieldContainer}
                            style={{ marginTop: "1%" }}
                          >
                            <FormControl fullWidth size="small" required>
                              <TextField
                                multiline
                                minRows={2}
                                style={{
                                  display: "flex",
                                  textAlign: "left",
                                  justifyContent: "flex-start",
                                }}
                                required
                                label={"Question Description"}
                                //   value={questionDescription}
                                //   onChange={(e) => {
                                //     setQuestionDescription(e.target.value);
                                //   }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            md={12}
                            xs={12}
                            lg={12}
                            style={{ marginTop: "1%" }}
                          >
                            <FormControl component="fieldset">
                              <FormLabel component="legend">
                                Has Attachment
                              </FormLabel>
                              <RadioGroup
                                row
                                //   value={hasAttachment}
                                //   onChange={() => {
                                //     setHasAttachment(!hasAttachment);
                                //   }}
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
                          <Grid
                            item
                            md={12}
                            xs={12}
                            lg={12}
                            style={{ marginTop: "1%" }}
                          >
                            <FormControl component="fieldset">
                              <FormLabel component="legend">
                                Has Attachment
                              </FormLabel>
                              <RadioGroup
                                row
                                //   value={hasAttachment}
                                //   onChange={() => {
                                //     setHasAttachment(!hasAttachment);
                                //   }}
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
                        </Box>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            ))}
          </TabPanel>
          {/* <TabPanel value={valueTopic} index={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Question 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </TabPanel> */}
          <TabPanel value={valueTopic} index={1}>
            Question 4
          </TabPanel>
          <TabPanel value={valueTopic} index={1}>
            Question 5
          </TabPanel>
          <TabPanel value={valueTopic} index={1}>
            Question 6
          </TabPanel>
          <TabPanel value={valueTopic} index={2}>
            Question 7
          </TabPanel>
          <TabPanel value={valueTopic} index={2}>
            Question 8
          </TabPanel>
          <TabPanel value={valueTopic} index={2}>
            Question 9
          </TabPanel>
        </TabPanel>
        <TabPanel value={valueSection} index={1}>
          <Tabs
            value={valueTopic}
            onChange={handleChangeTopic}
            aria-label="basic tabs example"
            TabIndicatorProps={{ style: { backgroundColor: "##00edfff2" } }}
          >
            <Tab label="Topic 4 for section 2" />
            <Tab label="Topic 5 for section 2" />
          </Tabs>
          <TabPanel value={valueTopic} index={0}>
            Question 10
          </TabPanel>
          <TabPanel value={valueTopic} index={0}>
            Question 11
          </TabPanel>
          <TabPanel value={valueTopic} index={0}>
            Question 12
          </TabPanel>
          <TabPanel value={valueTopic} index={1}>
            Question 13
          </TabPanel>
          <TabPanel value={valueTopic} index={1}>
            Question 14
          </TabPanel>
          <TabPanel value={valueTopic} index={1}>
            Question 15
          </TabPanel>
        </TabPanel>
      </Paper>
    </Modal>
  );
}

export const useStyles = makeStyles(() =>
  createStyles({
    flex: {
      justifyContent: "space-between",
      padding: "0px",
      margin: "0px",
    },
  })
);
