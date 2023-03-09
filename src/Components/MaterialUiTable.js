import MUIDataTable from "mui-datatables";
import useStyle from "./Styles";

const MaterialUiTable = (props) => {
  const classes = useStyle();
  return (
    <>
      <MUIDataTable
        data={props.data}
        title={<span className={classes.headerText}>{props.title}</span>}
        columns={props.columns}
        options={
          props.options
            ? props.options
            : {
                elevation: 0,
                download: false,
                onRowClick: props.onRowClick && props.onRowClick,
                print: false,
                selectableRows: false,
                filter: false,
                viewColumns: false,
                rowsPerPage: 5,
                rowsPerPageOptions: [5, 10, 15],
                textLabels: {
                  pagination: {
                    next: "Next >",
                    previous: "< Previous",
                    rowsPerPage: "Total items Per Page",
                    displayRows: "OF",
                  },
                },
              }
        }
      />
    </>
  );
};

export default MaterialUiTable;
