import {
  Box,
  CircularProgress,
  Divider,
  Modal,
  Typography,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: "unset",
  },
  customizedButton: {
    position: "absolute",
    left: "100%",
    top: "-5%",
    backgroundColor: "#ffffff",
  },
}));

const TopicsQuestionsByAuditId = (props) => {
  const { auditId, onOpen, onClose } = props;
  const classes = useStyles();
  const [allTopicsAndQuestions, setAllTopicsAndQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTopicsAndQuestionsByAuditID = async (auditId) => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_TOPICS_AND_QUESTIONS",
        auditId
      );
      if (response.status === 200) {
        let data = response.data.getAllActiveAuditsResponse.categories;
        // console.log("data==>", data);
        // let temp = [];
        // data.forEach((ele) => {
        //   ele.topicAndQuestion.forEach((el) => {
        //     temp.push({ ...el });
        //   });
        // });
        // console.log("after", temp);
        setAllTopicsAndQuestions(data);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getTopicsAndQuestionsByAuditID(auditId);
  }, [auditId]);

  return (
    <>
      <Modal
        classes={{ paper: classes.paper }}
        disableScrollLock="true"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={onOpen}
        onClose={onClose}
        closeAfterTransition
      >
        {isLoading ? (
          <CircularProgress
            style={{ position: "absolute", top: "50%", left: "50%" }}
          />
        ) : (
          <Box sx={style}>
            <Box>
              <IconButton
                onClick={onClose}
                className={classes.customizedButton}
              >
                <CloseIcon style={{ position: "absolute" }} />
              </IconButton>
            </Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Topics AND Questions
            </Typography>
            <Divider />
            {allTopicsAndQuestions.map((topicsAndQuestions, index) => (
              <>
                <dl>
                  <dt style={{ fontWeight: "bold" }}>
                    # {topicsAndQuestions.categoryName}
                  </dt>
                  {topicsAndQuestions.topicAndQuestion.map(
                    (topicAndAns, index) => (
                      <>
                        <dt style={{ margin: "0 0 0 2%", fontWeight: "bold" }}>
                          {index + 1} {topicAndAns.topicName}
                        </dt>
                        {topicAndAns.queAndAns.map((ques, index) => (
                          <dd>
                            {`Q${index + 1}`} {ques.question}
                          </dd>
                        ))}
                      </>
                    )
                  )}
                </dl>
              </>
            ))}
            {/* <Button
              onClick={onClose}
              className={classes.createButton}
              color="primary"
            >
              back
            </Button> */}
          </Box>
        )}
      </Modal>
    </>
  );
};

export default TopicsQuestionsByAuditId;
