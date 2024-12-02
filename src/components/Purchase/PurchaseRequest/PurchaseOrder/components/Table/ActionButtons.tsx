import { IconButton, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Assignment as AssignmentIcon,
  DoneAll as DoneAllIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { StatusPurchaseOrder } from '@/types/types';
import { IPurchaseOrderPagination } from '@/types/purchase/purchaseTypes';

interface ActionButtonsProps {
  order: IPurchaseOrderPagination;
  onModalOpen: (modalType: 'quote' | 'articlesEntry' | 'updateOrder', order: IPurchaseOrderPagination) => void;
  onPdfFetch: (orderId: string) => void;
  onRemoveOrder: (orderId: string) => void;
}

export const ActionButtons = ({ order, onModalOpen, onPdfFetch, onRemoveOrder }: ActionButtonsProps) => {
  if (order.estatus === StatusPurchaseOrder.OrdenCancelada) {
    return (
      <Tooltip title="Orden Cancelada">
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      {!order.fueAutorizada && order.estatus === StatusPurchaseOrder.RequiereAutorizacion && (
        <Tooltip title="Editar">
          <IconButton onClick={() => onModalOpen('updateOrder', order)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}

      {order.estatus === StatusPurchaseOrder.RequiereAutorizacion && (
        <>
          <Tooltip title="PDF de Orden de Compra">
            <IconButton onClick={() => onPdfFetch(order.id_OrdenCompra)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Subir Factura">
            <IconButton onClick={() => onModalOpen('quote', order)}>
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancelar">
            <IconButton onClick={() => onRemoveOrder(order.id_OrdenCompra)}>
              <CloseIcon sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip>
        </>
      )}

      {order.estatus === StatusPurchaseOrder.RequiereFactura && (
        <>
          <Tooltip title="Subir Factura">
            <IconButton onClick={() => onModalOpen('quote', order)}>
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      {order.estatus === StatusPurchaseOrder.RequiereIngreso && (
        <>
          <Tooltip title="Entrada de artículos">
            <IconButton onClick={() => onModalOpen('articlesEntry', order)}>
              <AssignmentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver Factura">
            <IconButton onClick={() => onModalOpen('quote', order)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      {order.estatus === StatusPurchaseOrder.EntradaCompletada && (
        <>
          <Tooltip title="Artículos dados de alta en almacen">
            <IconButton>
              <DoneAllIcon sx={{ color: 'green' }} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </>
  );
};
