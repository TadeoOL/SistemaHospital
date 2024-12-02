import { Check, Close, Visibility } from '@mui/icons-material';
import usePurchaseAuthorization from '../hooks/usePurchaseAuthorization';
import { Action, ActionButtons } from '@/common/components/ActionButtons';

interface AuthorizationActionsProps {
  purchaseOrderId: string;
  canAuthorize?: boolean;
  handlers: ReturnType<typeof usePurchaseAuthorization>['handlers'];
}

export const AuthorizationActions = ({ purchaseOrderId, canAuthorize = true, handlers }: AuthorizationActionsProps) => {
  const actions: Action[] = [
    {
      icon: Visibility,
      title: 'Ver Cotización',
      onClick: () => handlers.handleViewQuotation(purchaseOrderId),
      show: true,
    },
    {
      icon: Check,
      title: 'Aceptar',
      onClick: () => handlers.handleAcceptAuthorization(purchaseOrderId),
      show: canAuthorize,
      color: 'success.main',
    },
    {
      icon: Close,
      title: 'Rechazar',
      onClick: () => handlers.handleRejectAuthorization(purchaseOrderId),
      show: canAuthorize,
      color: 'error.main',
    },
  ];

  return <ActionButtons actions={actions} />;
};
