import { Box, Divider } from '@mui/material';
import { useRef } from 'react';
import { IPurchaseOrderPagination } from '@/types/purchase/purchaseTypes';
import FiltersPurchaseAuthorization from './components/Filters';
import { TablePaginated } from '@/common/components';
import { getPurchaseAuthorizationPagination } from '@/services/purchase/purchaseAuthorizationService';
import { NestedTable, TablePaginatedColumn } from '@/types/tableComponentTypes';
import usePurchaseAuthorization from './hooks/usePurchaseAuthorization';
import { AuthorizationActions } from './components/ActionButtons';
import ModalsContainer from './components/Modals/ModalsContainer';

const PurchaseAuthorization = () => {
  const { state, handlers } = usePurchaseAuthorization();
  const tableRef = useRef<IPurchaseOrderPagination>();
  const nestedTable: NestedTable<IPurchaseOrderPagination> = {
    articulos: {
      title: 'Artículos',
      columns: [
        { header: 'Artículo', value: 'nombre' },
        { header: 'Cantidad', value: 'cantidad' },
      ],
    },
  };

  const columns: TablePaginatedColumn<IPurchaseOrderPagination>[] = [
    { header: 'Folio', value: 'folio_Extension' },
    { header: 'Creado por', value: 'usuarioSolicitado' },
    { header: 'Estatus', value: 'estatus' },
    { header: 'Cotización', value: (row: any) => (row.cotizacion ? 'Sí' : 'No') },
    { header: 'Proveedor', value: 'proveedor' },
    { header: 'Total', value: 'total' },
    {
      header: 'Acciones',
      value: (row) => <AuthorizationActions purchaseOrderId={row.id_OrdenCompra} handlers={handlers} />,
    },
  ];

  return (
    <Box sx={{ pt: 2 }}>
      <FiltersPurchaseAuthorization
        dates={state.dates}
        onClearFilters={handlers.handleClearFilters}
        onDateChange={handlers.handleDateChange}
        onSearchChange={handlers.handleSearchChange}
        search={state.search}
      />
      <Divider sx={{ my: 1 }} />
      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={getPurchaseAuthorizationPagination}
        params={{
          search: state.search,
          sort: state.sort,
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
          startDate: state.dates.startDate,
          endDate: state.dates.endDate,
          refresh: state.refresh,
        }}
        nestedTable={nestedTable}
      />
      <ModalsContainer state={state} handlers={handlers} />
    </Box>
  );
};
export default PurchaseAuthorization;
