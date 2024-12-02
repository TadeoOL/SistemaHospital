import { useState } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Tooltip } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Assignment as AssignmentIcon,
  DoneAll as DoneAllIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ProviderNameChip } from '../../../ProviderNameChip';
import { ArticlesTable } from './ArticlesTable';
import { StatusPurchaseOrder } from '@/types/types';

interface ActionButtonsProps {
  order: any;
  onModalOpen: (modalType: 'quote' | 'articlesEntry' | 'updateOrder', order: any) => void;
  onPdfFetch: (orderId: string) => void;
  onRemoveOrder: (orderId: string) => void;
}

const ActionButtons = ({ order, onModalOpen, onPdfFetch, onRemoveOrder }: ActionButtonsProps) => {
  if (order.estatus === 0) {
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
      {!order.fueAutorizada && order.estatus === 1 && (
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
        <Tooltip title="Artículos dados de alta en almacen">
          <IconButton>
            <DoneAllIcon sx={{ color: 'green' }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

interface PurchaseOrderRowProps {
  order: any;
  onModalOpen: (modalType: 'quote' | 'articlesEntry' | 'updateOrder', order: any) => void;
  onPdfFetch: (orderId: string) => void;
  onRemoveOrder: (orderId: string) => void;
}

export const PurchaseOrderRow = ({ order, onModalOpen, onPdfFetch, onRemoveOrder }: PurchaseOrderRowProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          {order.folio_Extension}
        </TableCell>
        <TableCell>{order.usuarioSolicitado}</TableCell>
        <TableCell>
          <ProviderNameChip provider={[{ id: '', name: order.proveedor }]} />
        </TableCell>
        <TableCell>{order.fechaSolicitud}</TableCell>
        <TableCell>{order.total}</TableCell>
        <TableCell>{order.estatusConcepto}</TableCell>
        <TableCell>
          <ActionButtons
            order={order}
            onModalOpen={onModalOpen}
            onPdfFetch={onPdfFetch}
            onRemoveOrder={onRemoveOrder}
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0 }}>
          <Collapse in={expanded}>
            <ArticlesTable articles={order.articulos} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
