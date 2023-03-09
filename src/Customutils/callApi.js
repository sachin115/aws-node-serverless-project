import axios from "axios";
import ApiConfig from "./ApiConfig";
import cookie from "react-cookies";

const getTokens = () => {
  if (document.cookie) {
    const DSSIdToken = cookie.load("DSSIdToken");
    return DSSIdToken;
  } else {
    return false;
  }
};

const ApiResources = (type, resource, data) => {
  const DSSIdToken = getTokens();

  switch (type) {
    case "UPDATE":
      return {
        method: "patch",
        url: ApiConfig[resource],
        headers: {
          Accept: "application/json",
          Authorization: DSSIdToken,
        },
        data,
      };

    case "CREATE":
      return {
        method: "post",
        url: ApiConfig[resource],
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: DSSIdToken,
        },
        data,
      };

    case "POST":
      return {
        method: "post",
        url: ApiConfig[resource],
        headers: {
          Accept: "application/json",
        },
        data,
      };

    case "DELETE":
      return {
        method: "delete",
        url: ApiConfig[resource] + `/${data}`,
        headers: {
          Accept: "application/json",
          Authorization: DSSIdToken,
        },
      };

    case "GET":
      return {
        method: "get",
        url: ApiConfig[resource] + `/${data}`,
        headers: {
          Accept: "application/json",
          Authorization: DSSIdToken,
        },
      };

    case "GETLIST":
      return {
        method: "get",
        url: ApiConfig[resource],
        headers: {
          Accept: "application/json",
          Authorization: DSSIdToken,
        },
        data,
      };
    default:
      console.log("Default");
  }
};

const callApi = async (type, resource, data) => {
  try {
    // const dispatch = useUserDispatch();
    const payload = ApiResources(type, resource, data);
    const response = await axios(payload);
    console.log("Response", response);
    if (
      (response.data.message &&
        response.data.message === "MISSING AUTHORIZATION TOKEN !") ||
      response.data.message === "SESSION_EXPIRED !"
    ) {
      cookie.remove("DSSIdToken");
      cookie.remove("DSSAccessToken");
      cookie.remove("DSSRefreshToken");
      return {
        status: 403,
        data: response.data.message,
      };
    } else {
      return {
        status: 200,
        data: response.data,
      };
    }
  } catch (err) {
    console.log("Error", err.message);

    return {
      status: 400,
      message: err.message,
    };
  }
};

export default callApi;
