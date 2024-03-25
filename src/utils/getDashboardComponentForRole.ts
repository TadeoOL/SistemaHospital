import React from 'react';
import { DashboardAdminView } from '../views/Layout/DashboardView';
import PurchaseRequestView from '../views/Purchase/PurchaseRequestView';

export const getDashboardComponentForRole = (roles: string[]): React.FC => {
  if (roles.includes('ABASTECIMIENTO') || roles.includes('DIRECTORCOMPRAS')) {
    return PurchaseRequestView;
  }
  return DashboardAdminView;
};
