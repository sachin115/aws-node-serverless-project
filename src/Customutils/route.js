import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
import PeopleIcon from "@material-ui/icons/People";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import StyleIcon from "@material-ui/icons/Style";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { lazy } from "react";

const routes = [
  {
    name: "AgencyList",
    path: "/app/agencies",
    component: lazy(() => import("../Containers/manageaccounts")),
    meta: {
      menuItem: {
        icon: EmojiTransportationIcon,
        text: "Agencies",
        includedNonMenuRoutes: [
          "agencies",
          "add-agency",
          "edit-agency",
          "agency-details",
          "agency-users",
          "agency-user-detail",
          "add-agency-user",
          "edit-agency-user",
          "add-agency-role",
        ],
      },
      permission: ["VIEW_PROVISION_AGENCY_LIST"],
    },
  },
  {
    name: "AddAgency",
    path: "/app/add-agency",
    component: lazy(() =>
      import("../Containers/manageaccounts/createNewAccount")
    ),
    meta: {
      permission: ["EDIT_PROVISION_AGENCY"],
    },
  },
  {
    name: "EditAgency",
    path: "/app/edit-agency/:id",
    component: lazy(() => import("../Containers/manageaccounts/editAgency")),
    meta: {
      permission: ["EDIT_PROVISION_AGENCY"],
    },
  },
  {
    name: "AgencyDetails",
    path: "/app/agency-details/:id",
    component: lazy(() =>
      import("../Containers/manageaccounts/viewagencydetails")
    ),
    meta: {
      permission: ["VIEW_PROVISION_AGENCY_DETAILS"],
    },
  },
  {
    name: "AddAgencyRole",
    path: "/app/add-agency-role/:id",
    component: lazy(() => import("../Containers/manageroles/createrole")),
    meta: {
      permission: ["ADD_PROVISION_AGENCY_ROLE"],
    },
  },
  {
    name: "AgencyUsersList",
    path: "/app/agency-users/:id",
    component: lazy(() =>
      import("../Containers/manageaccounts/usersListByEntity")
    ),
    meta: {
      permission: ["VIEW_PROVISION_AGENCY_USER_LIST"],
    },
  },
  {
    name: "AgencyUserDetails",
    path: "/app/agency-user-detail/:entityId/:id",
    component: lazy(() => import("../Containers/manageusers/userdetails")),
    meta: {
      permission: ["VIEW_PROVISION_AGENY_USER_DETAILS"],
    },
  },
  {
    name: "AddAgencyUser",
    path: "/app/add-agency-user/:id",
    component: lazy(() =>
      import("../Containers/manageaccounts/createAgencyUser")
    ),
    meta: {
      permission: ["ADD_PROVISION_AGENCY_USER"],
    },
  },
  {
    name: "EditAgencyUser",
    path: "/app/add-agency-user/:entityId/:id",
    component: lazy(() => import("../Containers/manageusers/editUser")),
    meta: {
      permission: ["EDIT_PROVISION_AGENCY_USER"],
    },
  },
  {
    name: "UserList",
    path: "/app/users",
    component: lazy(() => import("../Containers/manageusers")),
    meta: {
      menuItem: {
        icon: PeopleIcon,
        text: "Users",
        includedNonMenuRoutes: [
          "users",
          "add-user",
          "user-details",
          "edit-user",
        ],
      },
      permission: ["VIEW_AGENCY_USER_LIST", "VIEW_PROVISION_USER_LIST"],
    },
  },
  {
    name: "UserDetails",
    path: "/app/user-details/:id",
    component: lazy(() => import("../Containers/manageusers/userdetails")),
    meta: {
      permission: ["ADD_AGENCY_USERS", "ADD_PROVISION_USER"],
    },
  },
  {
    name: "AddUser",
    path: "/app/add-user",
    component: lazy(() => import("../Containers/manageusers/createNewUser")),
    meta: {
      permission: ["ADD_AGENCY_USERS", "ADD_PROVISION_USER"],
    },
  },
  {
    name: "EditUser",
    path: "/app/edit-user/:id/:entityId",
    component: lazy(() => import("../Containers/manageusers/editUser")),
    meta: {
      permission: ["EDIT_AGENCY_USERS", "EDIT_PROVISION_USER"],
    },
  },
  {
    name: "RoleList",
    path: "/app/roles",
    component: lazy(() => import("../Containers/manageroles")),
    meta: {
      menuItem: {
        icon: EmojiPeopleIcon,
        text: "Roles",
        includedNonMenuRoutes: ["add-role", "edit-role"],
      },
      permission: ["VIEW_AGENCY_ROLE_LIST", "VIEW_PROVISION_AGENCY_ROLE_LIST"],
    },
  },
  {
    name: "AddRole",
    path: "/app/add-role",
    component: lazy(() => import("../Containers/manageroles/createrole")),
    meta: {
      permission: ["ADD_AGENCY_ROLE", "ADD_PROVISION_AGENCY_ROLE"],
    },
  },
  {
    name: "EditRole",
    path: "/app/edit-role/:id",
    component: lazy(() => import("../Containers/manageroles/editrole")),
    meta: {
      permission: ["EDIT_AGENCY_ROLE", "EDIT_PROVISION_AGENCY_ROLE"],
    },
  },
  {
    name: "TemplateList",
    path: "/app/templates",
    component: lazy(() => import("../Containers/managetemplates")),
    meta: {
      menuItem: {
        icon: LiveHelpIcon,
        text: "Template",
        includedNonMenuRoutes: ["templates", "add-template", "edit-template"],
      },
      permission: ["VIEW_TEMPLATE_LIST"],
    },
  },
  {
    name: "AddTemplate",
    path: "/app/add-template",
    component: lazy(() =>
      import("../Containers/managetemplates/createtemaplate")
    ),
    meta: {
      permission: ["ADD_TEMPLATE"],
    },
  },
  {
    name: "EditTemplate",
    path: "/app/edit-template/:id",
    component: lazy(() =>
      import("../Containers/managetemplates/createtemaplate")
    ),
    meta: {
      permission: ["EDIT_TEMPLATE"],
    },
  },
  {
    name: "AuditList",
    path: "/app/audits",
    component: lazy(() => import("../Containers/manageaudits")),
    meta: {
      menuItem: {
        icon: StyleIcon,
        text: "Audits",
        includedNonMenuRoutes: ["audits", "add-audit", "edit-audit"],
      },
      permission: ["VIEW_AUDIT_LIST"],
    },
  },
  {
    name: "AddAudit",
    path: "/app/add-audit",
    component: lazy(() => import("../Containers/manageaudits/createnewaudit")),
    meta: {
      permission: ["ADD_AUDIT"],
    },
  },
  {
    name: "EditAudit",
    path: "/app/edit-audit/:id",
    component: lazy(() => import("../Containers/manageaudits/createnewaudit")),
    meta: {
      permission: ["EDIT_AUDIT"],
    },
  },
  {
    name: "InprogressAudits",
    path: "/app/inprogress-audits",
    component: lazy(() =>
      import("../Containers/manageauditsmanagement/mangeinprogressaudits")
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },

  {
    name: "AssignedAudits",
    path: "/app/assigned-audits",
    component: lazy(() =>
      import("../Containers/manageauditsmanagement/assignedaudits")
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
  {
    name: "SubmitedAudits",
    path: "/app/submited-audits",
    component: lazy(() =>
      import("../Containers/manageauditsmanagement/submitedaudits")
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
  {
    name: "UnderReviewAudits",
    path: "/app/under-review-audits",
    component: lazy(() =>
      import("../Containers/manageauditsmanagement/underreviewaudits")
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
  {
    name: "UnderReviewAuditDetails",
    path: "/app/under-review-audit-details/:id/:auditeeId",
    component: lazy(() =>
      import(
        "../Containers/manageauditsmanagement/answerandquestionunderreview"
      )
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
  {
    name: "UnderReviewAuditDetails",
    path: "/app/under-review-audit-details/:id/:auditeeId",
    component: lazy(() =>
      import(
        "../Containers/manageauditsmanagement/answerandquestionunderreview"
      )
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
  {
    name: "AuditDetails",
    path: "/app/audit-details/:id/:auditeeId",
    component: lazy(() =>
      import("../Containers/manageauditsmanagement/answerquestionoftopic")
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
  {
    name: "AnswerQuestions",
    path: "/app/answer-question/:id/:auditeeId",
    component: lazy(() =>
      import("../Containers/manageauditsmanagement/answerquestionoftopic")
    ),
    meta: {
      permission: ["VIEW_DASHBOARD_AUDIT_LIST"],
    },
  },
];
export default routes;
