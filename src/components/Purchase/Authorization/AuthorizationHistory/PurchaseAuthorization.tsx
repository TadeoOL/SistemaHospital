import { Box, Divider, Tooltip } from '@mui/material';
import PurchaseHistoryFilters from './components/Filters';
import usePurchaseAuthorizationHistory from './hooks/usePurchaseAuthorizationHistory';
import { TablePaginated } from '@/common/components';
import { useRef } from 'react';
import { NestedTable, TablePaginatedColumn } from '@/types/tableComponentTypes';
import { IPurchaseAuthorizationHistory } from '@/types/purchase/purchaseTypes';
import { getPurchaseAuthorizationHistory } from '@/services/purchase/purchaseAuthorizationHistoryService';
import { Visibility } from '@mui/icons-material';
import IconButton from '@/components/@extended/IconButton';
import ModalsContainer from './components/Modals';

export const PurchaseHistoryAuthorization = () => {
  const tableRef = useRef<any>();
  const { state, handlers } = usePurchaseAuthorizationHistory();
  const columns: TablePaginatedColumn<IPurchaseAuthorizationHistory>[] = [
    { header: 'Orden de Compra', value: 'folio', sort: true },
    { header: 'Creado por', value: (row) => `${row.usuarioSolicito}` || 'N/A', sort: true },
    { header: 'Proveedor', value: 'nombreProveedor' },
    { header: 'Estatus', value: 'estatusConcepto' },
    {
      header: 'Cotización',
      value: (row) => (
        <Tooltip title="Ver Cotización">
          <IconButton onClick={() => handlers.handleViewQuotation(row.id_OrdenCompra)}>
            <Visibility />
          </IconButton>
        </Tooltip>
      ),
    },
    { header: 'Total', value: 'precioTotalOrden' },
  ];
  const params = {
    search: state.search,
    fechaInicio: state.dates.startDate,
    fechaFin: state.dates.endDate,
    estatus: state.statusPurchaseOrder === '-1' ? '' : state.statusPurchaseOrder,
  };

  const nestedTable: NestedTable<IPurchaseAuthorizationHistory> = {
    ordenCompraArticulo: {
      title: 'Artículos',
      columns: [
        { header: 'Artículo', value: 'nombre' },
        { header: 'Cantidad', value: 'cantidad' },
      ],
    },
  };

  return (
    <Box sx={{ pt: 2 }}>
      <PurchaseHistoryFilters state={state} handlers={handlers} />
      <Divider sx={{ my: 1 }} />
      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={getPurchaseAuthorizationHistory}
        params={params}
        nestedTable={nestedTable}
      />
      <ModalsContainer state={state} handlers={handlers} />
    </Box>
  );
};
