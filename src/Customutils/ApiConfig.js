import Constants from "./Config";

const ApiConfig = {
  Login: Constants.USERS_BASE_URL + "/user/SignInUser",
  CREATE_NEW_ENTITY: Constants.USERS_BASE_URL + "/entity/CreateNewEntity",
  CREATE_USER_IN_COGNITO:
    Constants.USERS_BASE_URL + "/user/CreateUserInCognito",
  GET_USER_DETAILS: Constants.USERS_BASE_URL + "/user/GetUserDetails",
  FORCE_CHANGE_PASSWORD: Constants.USERS_BASE_URL + "/user/ForceChangePassword",
  CHANGE_PASSWORD: Constants.USERS_BASE_URL + "/user/ChangePassword",
  FORGOT_PASSWORD: Constants.USERS_BASE_URL + "/user/ForgotPassword",
  CONFIRM_FORGOT_PASSWORD:
    Constants.USERS_BASE_URL + "/user/ConfirmForgotPassword",
  UPDATE_USER_DETAILS: Constants.USERS_BASE_URL + "/user/UpdateUser",
  GET_SALES_FEATURES:
    Constants.CUSTOMS_BASE_URL + "/features/GetAllSalesClientFeatures",
  GET_INTERNAL_FEATURES:
    Constants.CUSTOMS_BASE_URL + "/features/GetAllInternalClientFeatures",
  GET_ALL_ENTITIES: Constants.USERS_BASE_URL + "/entity/GetAllEntities",
  GET_ENTITY_DETAILS_BY_ID:
    Constants.USERS_BASE_URL + "/entity/GetEntityDetailsById",
  UPDATE_ENTITY_DETAILS:
    Constants.USERS_BASE_URL + "/entity/UpdateAgencyDetails",
  GET_USERS_LISTBYENTITYID:
    Constants.USERS_BASE_URL + "/users/GetUsersListByEntityId",
  GET_ENTITY_ROLES:
    Constants.USERS_BASE_URL + "/users/GetEntityRolesByEntityId",
  CREATE_USER_BY_ENTITY: Constants.USERS_BASE_URL + "/users/CreateUserByEntity",
  GET_USERDETAILS_BY_ID:
    Constants.USERS_BASE_URL + "/users/GetUsersDetailsById",
  UPDATE_USER_DETAILS_BY_ROLEID:
    Constants.USERS_BASE_URL + "/users/UpdateUserDetails",
  UPLOAD_FILE_TO_S3: Constants.USERS_BASE_URL + "/files/UploadFilesToS3",
  CREATE_NEW_ROLE: Constants.USERS_BASE_URL + "/entityrole/CreateNewRole",
  GET_ALL_ENTITY_ROLES:
    Constants.USERS_BASE_URL + "/entityrole/GetAllEntityRoles",
  GET_ROLE_DETAILS: Constants.CUSTOMS_BASE_URL + "/roles/GetRolesDetailsById",
  UPDATE_ROLE_DETAILS: Constants.CUSTOMS_BASE_URL + "/roles/UpdateRoleDetails",
  CREATE_NEW_CATEGORY:
    Constants.CATEGORY_BASE_URL + "/category/CreateNewCategory",
  GET_ALL_ENTITY_CATEGORIES:
    Constants.CATEGORY_BASE_URL + "/category/GetAllEntityCategories",
  GET_CATEGORY_DETAILS:
    Constants.CATEGORY_BASE_URL + "/category/GetCategoryDetails",
  UPDATE_CATEGORY_DETAILS:
    Constants.CATEGORY_BASE_URL + "/category/UpdateCategoryDetails",
  CREATE_NEW_QUESTION:
    Constants.QUESTION_BASE_URL + "/question/CreateNewQuestion",
  GET_ALL_ENTITY_QUESTIONS:
    Constants.QUESTION_BASE_URL + "/question/GetAllEntityQuestions",
  GET_QUESTION_DETAILS:
    Constants.QUESTION_BASE_URL + "/question/GetQuestionDetails",
  UPDATE_QUESTION_DETAILS:
    Constants.QUESTION_BASE_URL + "/question/UpdateQuestionDetails",
  CREATE_NEW_TOPIC: Constants.TOPIC_BASE_URL + "/topic/CreateNewTopic",
  GET_ALL_ENTITY_TOPICS: Constants.TOPIC_BASE_URL + "/topic/GetAllEntityTopics",
  GET_TOPIC_DETAILS: Constants.TOPIC_BASE_URL + "/topic/GetTopicDetails",
  UPDATE_TOPIC_DETAILS: Constants.TOPIC_BASE_URL + "/topic/UpdateTopic",
  GET_ALL_QUESTIONS_CATEGORIES:
    Constants.TOPIC_BASE_URL +
    "/topic/GetAllMappedTopicsAndQuestionsOfCategory",
  DELETE_ROLE: Constants.USERS_BASE_URL + "/entityrole/DeleteRole",
  GET_ALL_PARENT_CATEGORIES:
    Constants.CATEGORY_BASE_URL + "/category/GetAllParentCategories",
  CREATE_OR_UPDATE_AUDIT:
    Constants.AUDIT_BASE_URL + "/audit/createorupdateaudit",
  GET_ALL_ENTITY_AUDITS: Constants.AUDIT_BASE_URL + "/audit/getallentityaudits",
  GET_ALL_TOPICS_AND_QUESTIONS:
    Constants.AUDIT_BASE_URL + "/audit/GetAllCategoriesTopicsQuestionsOfAudits",
  GET_ALL_ASIGNED_AUDITS:
    Constants.AUDIT_BASE_URL + "/audit/getallauditsbasedonstatusanduser",
  GET_ALL_AUDIT_CATEGORIES:
    Constants.AUDIT_BASE_URL + "/audit/GetAllCategoriesOfTheAudit",
  START_AUDIT: Constants.AUDIT_BASE_URL + "/audit/startaudit",
  UPDATE_AUDIT: Constants.AUDIT_BASE_URL + "/audit/UpdateAudit",
  GET_AUDIT_DETAILS: Constants.AUDIT_BASE_URL + "/audit/getauditdetails",
  SAVE_ANSWERS: Constants.AUDIT_BASE_URL + "/audit/saveanswers",
  GET_ALL_TOPIC_AND_QUESTION:
    Constants.AUDIT_BASE_URL + "/audit/getinprogressauditdata",
  SUBMIT_AUDIT: Constants.AUDIT_BASE_URL + "/audit/submitorreviewaudit",
  GET_ACTION_REQUIRED_QUESTION_FOR_AUDITOR_AUDITEE:
    Constants.AUDIT_BASE_URL +
    "/audit/getactionrequiredquestionsforauditeeandauditor",
  SAVE_AUDITEE_RESPONSE:
    Constants.AUDIT_BASE_URL + "/audit/saveauditeeresponse",
  IS_ROLE_ASSIGNED: Constants.USERS_BASE_URL + "/entityrole/CheckRolesAssigned",
  DISABLE_ENTITY_ROLE: Constants.USERS_BASE_URL + "/entityrole/DisableRoleById",
  GET_USERDETAILS_BEFORE_LOGIN:
    Constants.USERS_BASE_URL + "/users/GetUserDetailsBeforeLogin",
  CREATE_NEW_DEALER:
    Constants.DEALER_BASE_URL + "/entitydealer/CreateNewDealer",
  GET_DEALER_LIST: Constants.DEALER_BASE_URL + "/entitydealer/GetDealersList",
  GET_DEALER_DETAILS:
    Constants.DEALER_BASE_URL + "/entitydealer/GetDealersDetailsById",
  // GET_ALL_USERLIST_BY_ROLEID:
  //   Constants.USERS_BASE_URL + "/users/GetAllUsersListByRoleId",
  GET_ALL_USERLIST_OF_AUDITOR_AUDITEE:
    Constants.USERS_BASE_URL + "/users/GetAllUsersListOfAuditorAndAuditee",
  GET_AUDIT_COUNTS: Constants.AUDIT_BASE_URL + "/audit/allauditcounts",
  CREATE_AND_UPDATE_GENERIC_TEMPLATE:
    Constants.TEMPLATE_BASE_URL + "/template/createorupdategenerictemplate",
  GET_ALL_ENTITY_TEMPLATES:
    Constants.TEMPLATE_BASE_URL + "/template/getallentitytemplate",
  GET_TEMPLATE_DATA_BY_ID:
    Constants.TEMPLATE_BASE_URL + "/template/gettemplatedatabyids",
  GET_TEMPLATE_SAVE_AS_DRAFT:
    Constants.TEMPLATE_BASE_URL + "/template/gettemplatesavedasdraft",
  DISCARD_TEMPLATE_DATA_BY_ID:
    Constants.TEMPLATE_BASE_URL + "/template/discarddraft",
  GET_AUDIT_SAVED_AS_DRAFT:
    Constants.AUDIT_BASE_URL + "/audit/getauditsavedasdraft",
};

export default ApiConfig;
