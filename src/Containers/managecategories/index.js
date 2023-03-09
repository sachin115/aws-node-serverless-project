import useStyle from "../styles";
import { Box, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import callApi from "../../Customutils/callApi";
import { useHistory } from "react-router-dom";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import MaterialUiTable from "../../Components/MaterialUiTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
const notify = () => toast("Session Expired...!");
export default function ManageCategories() {
  const classes = useStyle();
  let { userDetails } = useUserState();
  const { entityDetails } = userDetails;
  const history = useHistory();
  const { dispatch, setUserDetails } = useUserDispatch();
  const [permissions, setPermissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const GetAllEntityCategories = async () => {
    try {
      const response = await callApi(
        "GET",
        "GET_ALL_ENTITY_CATEGORIES",
        entityDetails.id
      );
      if (response.status === 403) {
        setUserDetails({});
        notify();
        dispatch({ type: "TOKEN_EXPIRED" });
      }
      if (response.status === 200) {
        console.log("Categories ", response.data);
        const newCategories = response.data.map((ele) => {
          return { ...ele, type: ele.parent ? "child" : "parent" };
        });
        setCategories([...newCategories]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    if (userDetails.activeUserDetails) {
      setPermissions([...userDetails.permissions]);
    }
  }, [userDetails]);

  useEffect(() => {
    GetAllEntityCategories();
  }, []);

  const columns = [
    {
      name: "name",
      label: "Category Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "type",
      label: "Category Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
  ];

  const onRowClick = (rowData) => {
    history.push({
      pathname: `/app/managecategories/editcategory/${rowData[3]}`,
    });
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        {permissions.find((ele) => ele === "ADD_AGENCY_CATEGORY") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/app/managecategories/add");
            }}
            className={classes.createButton}
          >
            + CREATE CATEGORY
          </Button>
        )}
      </Box>

      {!isLoading ? (
        <>
          <MaterialUiTable
            title="Categories / Sub-Categories"
            data={categories}
            columns={columns}
            onRowClick={onRowClick}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
