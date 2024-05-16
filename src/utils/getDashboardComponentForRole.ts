import React from 'react';
import { DashboardAdminView } from '../views/Layout/DashboardView';
import { CloseCheckoutHistoryView, PointOfSaleCheckoutView, PurchaseRequest, ReceiptEmitterView } from './LazyRoutes';

export const getDashboardComponentForRole = (roles: string[]): React.FC => {
  if (roles.includes('ABASTECIMIENTO') || roles.includes('DIRECTORCOMPRAS')) {
    return PurchaseRequest;
  }
  if (roles.includes('ADMINISTRADORCAJA')) {
    return CloseCheckoutHistoryView;
  }
  if (roles.includes('PASECAJA')) {
    return ReceiptEmitterView;
  }
  if (roles.includes('CAJA')) {
    return PointOfSaleCheckoutView;
  }
  return DashboardAdminView;
};
