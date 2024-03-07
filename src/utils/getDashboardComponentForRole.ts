import React from "react";
import { DashboardAdminView } from "../views/Layout/DashboardView";
import { PurchaseAuthorizationView } from "../views/Purchase/PurchaseAuthorizationView";
import { PurchaseRequestView } from "../views/Purchase/PurchaseRequestView";

export const getDashboardComponentForRole = (roles: string[]): React.FC => {
  if (roles.includes("DIRECTORCOMPRAS")) {
    return PurchaseAuthorizationView;
  } else if (roles.includes("ABASTECIMIENTO")) {
    return PurchaseRequestView;
  }
  return DashboardAdminView;
};
