import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  headerContainer: {
    width: "100%",
    height: "50px",
    padding: "7px",
    fontSize: "18px",
    alignItems: "center",
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
  },

  headerText: {
    position: "absolute",
    left: "10px",
    fontSize: "20px",
  },

  tableStyle: {
    backgroundColor: "darkGray",
  },

  fieldHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10px",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  createButton: {
    position: "absolute",
    right: "2%",
    float: "right",
  },
  formButton: {
    position: "relative",
    display: "flex",
    margin: "10px",
    justifyContent: "flex-end",
  },
  featureBox: {
    display: "flex",
    textAlign: "left",
    cursor: "pointer",
    justifyContent: "flex-start",
    marginBottom: "10px",
    marginTop: "20px",
    marginLeft: "10px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  permissionBox: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: "10px",
    marginTop: "5px",
    fontSize: "11px",
  },
  detailsDisplay: {
    display: "flex",
    alignItems: "center",
    margin: "3px",
  },
  cardHeader: {
    fontSize: "20px",
  },
  list: {
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  listButton: {
    margin: theme.spacing(0.5, 0),
  },
  stepLabel: {
    textAlign: "left",
    backgroundColor: "whitesmoke",
    fontWeight: "bold",
    fontSize: "18px",
  },
  selectClass: { textAlign: "left" },
  inactiveStep: {
    textAlign: "left",
    padding: "20px",
    margin: "-26px 0px -26px -20px",
  },
  activeStep: {
    textAlign: "left",
    background: "#dbe9fe",
    padding: "20px",
    marginLeft: "-20px",
  },
  sectionHeading: {
    textAlign: "left",
    fontWeight: "bold",
  },
  stepperButton: {
    marginTop: "10px",
    float: "right",
    marginRight: "-13px",
  },
  tableCell: {
    borderBottom: "none !important",
    padding: "4px !important",
    fontSize: "12px !important",
  },
  cardClass: {
    margin: "20px 0 20px 0",
    textAlign: "left",
  },
  typographyClass: {
    fontSize: "14px",
  },
  instructions: {
    margin: "10px 0px 1px 0px",
  },
  root: {
    width: "100%",
    padding: "3px",
  },
  paperPadding: {
    padding: "25px",
  },
}));
