import MaterialUiTable from "../../Components/MaterialUiTable";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import callApi from "../../Customutils/callApi";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "../../Components/Breadcrumbs";
import { CircularProgress, Tooltip } from "@material-ui/core";

toast.configure();
const notify = () => toast("Session Expired...!");

const AuditDetails = (props) => {
  const params = useParams();
  const { id } = params;
  let { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auditorData, setAuditorData] = useState(0);
  const { dispatch, setUserDetails } = useUserDispatch();

  const GetAuditDetailsById = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_AUDIT_DETAILS",
        `${id}/${entityDetails.id}`
      );
      if (response.status === 403) {
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
        setUserDetails({});
      }

      if (response.status === 200) {
        setIsLoading(false);
        const { auditDetails } = response.data.auditsDetailsResponse;
        const { auditorAndAuditeeData } = auditDetails;
        let data = [];
        auditorAndAuditeeData[auditorData].categories.forEach((el) =>
          el.topicAndQuestion.forEach((item) =>
            item.queAndAns.forEach((que) =>
              data.push({
                catName: el.categoryName,
                topicName: item.topicName,
                question: que.question,
                questionType: que.questionType,
                weightage: que.weightage,
                optionValues: que.optionValues,
                noVal: que.noVal,
                yesVal: que.yesVal,
              })
            )
          )
        );
        setCategories(data);

        setItems(auditorAndAuditeeData);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const optionData = (value, data) => {
    let questionType = data.currentTableData[data.rowIndex].data[3];
    if (questionType === "multiple" || questionType === "single") {
      return value
        .map((item) => `${item.optionVal}(${item.optionWeight}w)`)
        .join(", ");
    } else if (questionType === "yes/no") {
      return `Yes(${data.currentTableData[data.rowIndex].data[5]}W), No(${
        data.currentTableData[data.rowIndex].data[6]
      }W)`;
    } else {
      return `(${data.currentTableData[data.rowIndex].data[7]}W)`;
    }
  };

  const columns = [
    {
      name: "auditeeName",
      label: "Auditee Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "auditorName",
      label: "Auditor Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "startDate",
      label: "Start Date",
      options: {
        customBodyRender: (startDate) => (
          <div>{startDate ? new Date(startDate).toLocaleString() : ""}</div>
        ),
        filter: true,
        sort: true,
      },
    },
    {
      name: "endDate",
      label: "End Date",
      options: {
        customBodyRender: (endDate) => (
          <div>{endDate ? new Date(endDate).toLocaleString() : ""}</div>
        ),
        filter: true,
        sort: true,
      },
    },
    // {
    //   name: "categories",
    //   label: "Categories",
    //   options: {
    //     expandableRows: true,
    //     customBodyRender: (colArrayData) => colData(colArrayData),
    //   },
    // },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const col = [
    {
      name: "catName",
      label: "Category Name",
    },
    {
      name: "topicName",
      label: "Topic Name",
    },
    {
      name: "question",
      label: "Question",
      options: {
        customBodyRender: (value) => {
          console.log("value", value);
          return (
            <>
              <Tooltip style={{ fontSize: "20px" }} title={value}>
                <div
                  style={{
                    display: "block",
                    width: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {value}
                </div>
              </Tooltip>
            </>
          );
        },
      },
    },
    {
      name: "questionType",
      label: "Type",
    },
    {
      name: "optionValues",
      label: "options with Weit",
      options: {
        customBodyRender: (optionValues, tableMeta) => {
          let value = JSON.parse(optionValues);
          return (
            <>
              <Tooltip title={optionData(value, tableMeta)}>
                <div
                  style={{
                    display: "block",
                    width: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {optionData(value, tableMeta)}
                </div>
              </Tooltip>
            </>
          );
        },
      },
    },
    {
      name: "yesVal",
      options: {
        display: false,
      },
    },
    {
      name: "noVal",
      options: {
        display: false,
      },
    },
    {
      name: "weightage",
      options: {
        display: false,
      },
    },
  ];

  useEffect(() => {
    GetAuditDetailsById(id);
  }, []);

  const options = {
    selectableRows: false,
    expandableRowsHeader: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    download: false,
    filter: false,
    viewColumns: false,
    print: false,
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
    renderExpandableRow: (rowMeta) => {
      setAuditorData(rowMeta.rowIndex);
      return (
        <>
          <td />
          <td colSpan={6}>
            <MaterialUiTable
              data={categories}
              columns={col}
              options={{
                elevation: 0,
                download: false,
                print: false,
                selectableRows: false,
                filter: false,
                toolbar: false,
                viewColumns: false,
                search: false,
                rowsPerPage: 3,
                rowsPerPageOptions: [3, 6, 9],
                textLabels: {
                  pagination: {
                    next: "Next >",
                    previous: "< Previous",
                    rowsPerPage: "Total items Per Page",
                    displayRows: "OF",
                  },
                },
              }}
            />
          </td>
        </>
      );
    },
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Breadcrumb
            breadcrumbElements={[
              { label: "Audit", path: "/app/manageaudits" },
              { label: "Audit Details" },
            ]}
          />
          <MaterialUiTable
            title={"Audit Details"}
            data={items}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  );
};

export default AuditDetails;
