import { createTheme } from "@material-ui/core";

// const currentWidth = window.innerWidth;
// console.log(currentWidth);

const Themes = {
  overrides: {
    MuiPaper: {
      root: {
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingBottom: "10px",
        paddingTop: "10px",
      },
    },
    MuiDivider: {
      root: {
        marginTop: "10px",
        marginBottom: "10px",
      },
    },
    MuiCircularProgress: {
      root: { position: "absolute", top: 200 },
    },
    MuiAppBar: {
      root: { backgroundColor: "#FFF", height: 75 },
    },
    MUIDataTableBodyCell: {
      root: {
        cursor: "pointer",
      },
    },
    MuiInputLabel: {
      root: { position: "absolute", left: "15px", top: "-10px" },
    },
    MuiCard: {
      root: {
        cursor: "pointer",
      },
    },
  },
};

export default createTheme({ ...Themes });
