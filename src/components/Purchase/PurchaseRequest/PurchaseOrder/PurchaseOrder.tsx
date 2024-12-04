import { MainCard, TablePaginated } from '@/common/components';
import { TableTop } from '@/common/components/TableTop';
import { useRef } from 'react';
import { Filters } from './components/Filters';
import { ActionButtons } from './components/Table/ActionButtons';
import { usePurchaseOrder } from './hooks/usePurchaseOrder';
import { IPurchaseOrderPagination } from '@/types/purchase/purchaseTypes';
import { ModalsContainer } from './components/Modals/ModalsContainer';
import { getPurchaseOrder } from '@/services/purchase/purchaseService';
import { StatusPurchaseOrder } from '@/types/types';
import { NestedTable, TablePaginatedColumn } from '@/types/tableComponentTypes';

export const PurchaseOrder = () => {
  const { state, handlers } = usePurchaseOrder();
  const tableRef = useRef<IPurchaseOrderPagination>();
  const nestedTable: NestedTable<IPurchaseOrderPagination> = {
    articulos: {
      title: 'Artículos de la Orden',
      columns: [
        {
          header: 'Nombre',
          value: 'nombre',
        },
        {
          header: 'Cantidad',
          value: 'cantidad',
        },
        {
          header: 'Precio',
          value: 'precioProveedor',
        },
      ],
    },
  };

  const columns: TablePaginatedColumn<IPurchaseOrderPagination>[] = [
    {
      header: 'Orden de Compra',
      value: 'folio_Extension',
      sort: true,
    },
    {
      header: 'Creado por',
      value: (row: IPurchaseOrderPagination) => row.usuarioSolicitado ?? 'N/A',
      sort: true,
    },
    {
      header: 'Proveedor',
      value: 'proveedor',
      sort: true,
    },
    {
      header: 'Fecha de Solicitud',
      value: 'fechaSolicitud',
      sort: true,
    },
    {
      header: 'Total',
      value: 'total',
      sort: true,
    },
    {
      header: 'Estatus',
      value: 'estatusConcepto',
      sort: true,
    },
    {
      header: 'Acciones',
      value: (row: IPurchaseOrderPagination) => (
        <ActionButtons
          order={row}
          onModalOpen={handlers.handleModalOpen}
          onPdfFetch={handlers.handlePdfFetch}
          onRemoveOrder={handlers.handleRemoveOrder}
        />
      ),
    },
  ];

  return (
    <MainCard content={false}>
      <TableTop>
        <Filters
          search={state.search}
          dates={state.dates}
          status={state.status}
          authorization={state.authorization}
          onSearchChange={handlers.handleSearchChange}
          onDateChange={handlers.handleDateChange}
          onStatusChange={handlers.handleStatusChange}
          onAuthorizationChange={handlers.handleAuthorizationChange}
          onClearFilters={handlers.handleClearFilters}
        />
      </TableTop>

      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={getPurchaseOrder}
        params={{
          search: state.search,
          fechaInicio: state.dates.startDate,
          fechaFin: state.dates.endDate,
          estatus: state.status === '-1' ? '' : state.status,
          fueAutorizada: state.authorization,
          refresh: state.refresh,
        }}
        nestedTable={nestedTable}
      />

      <ModalsContainer
        modals={state.modals}
        onModalClose={handlers.handleModalClose}
        orderSelected={state.orderSelected}
        providers={state.providers}
        orderSelectedId={state.orderSelectedId}
        initialProvidersFromOrder={state.providersForEdition}
        initialArticles={state.articlesForEdition}
        purcharseOrderWarehouseId={state.purchaseWarehouseId}
        purcharseOrderId={state.purchaseOrderId}
        handleRefetchAndClearStates={handlers.handleRefetchAndClearStates}
        isLoadingOrderDetails={state.isLoadingOrderDetails}
        handleRefresh={handlers.handleRefresh}
        status={state.orderStatus || StatusPurchaseOrder.RequiereAutorizacion}
      />
    </MainCard>
  );
};
