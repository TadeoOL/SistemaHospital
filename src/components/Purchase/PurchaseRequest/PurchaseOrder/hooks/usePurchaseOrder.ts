import { useState } from 'react';
import { usePurchaseOrderPagination } from '../../../../../store/purchaseStore/purchaseOrderPagination';
import { changeOrderStatus, getOrderRequestById } from '@/api/api.routes';
import { purchaseAlerts } from '../../../../../utils/alerts/purchaseAlerts';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { StatusPurchaseOrder } from '@/types/types';

interface PurchaseOrderState {
  search: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  status: string;
  authorization: number | null;
  sort: string;
  pageIndex: number;
  pageSize: number;
  selectedOrder: any | null;
  modals: {
    quote: boolean;
    articlesEntry: boolean;
    updateOrder: boolean;
  };
  orderSelectedId: string;
  providers: string;
  orderSelected: {
    folio: string;
    OrderId: string;
  };
  providersForEdition: string[];
  articlesForEdition: any[];
  purchaseWarehouseId: string;
  purchaseOrderId: string;
  isLoadingOrderDetails: boolean;
  refresh: boolean;
  orderStatus: StatusPurchaseOrder | null;
}

export const usePurchaseOrder = () => {
  const [state, setState] = useState<PurchaseOrderState>({
    search: '',
    dates: {
      startDate: '',
      endDate: '',
    },
    status: '',
    authorization: null,
    sort: '',
    pageIndex: 0,
    pageSize: 10,
    selectedOrder: null,
    modals: {
      quote: false,
      articlesEntry: false,
      updateOrder: false,
    },
    orderSelectedId: '',
    providers: '',
    orderSelected: {
      folio: '',
      OrderId: '',
    },
    providersForEdition: [],
    articlesForEdition: [],
    purchaseWarehouseId: '',
    purchaseOrderId: '',
    isLoadingOrderDetails: false,
    refresh: false,
    orderStatus: null,
  });

  const handlers = {
    handlePaginationChange: (page: number, pageSize: number) => {
      setState((prev) => ({ ...prev, pageIndex: page, pageSize }));
    },

    handleSearchChange: (value: string) => {
      setState((prev) => ({ ...prev, search: value }));
    },

    handleDateChange: (type: 'startDate' | 'endDate', value: string) => {
      setState((prev) => ({
        ...prev,
        dates: { ...prev.dates, [type]: value },
      }));
    },

    handleStatusChange: (value: string) => {
      setState((prev) => ({ ...prev, status: value }));
    },

    handleAuthorizationChange: (value: number) => {
      setState((prev) => ({ ...prev, authorization: value }));
    },

    handleSortChange: (value: string) => {
      setState((prev) => ({ ...prev, sort: value }));
    },

    handleModalOpen: async (modalType: 'quote' | 'articlesEntry' | 'updateOrder', order: any) => {
      setState((prev) => ({
        ...prev,
        isLoadingOrderDetails: modalType === 'updateOrder',
        modals: { ...prev.modals, [modalType]: true },
      }));
      if (modalType === 'updateOrder') {
        try {
          const orderDetails = await getOrderRequestById(order.id_OrdenCompra);

          const { setPaymentMethod } = useDirectlyPurchaseRequestOrderStore.getState();
          setPaymentMethod(orderDetails.conceptoPago);

          setState((prev) => ({
            ...prev,
            isLoadingOrderDetails: false,
            selectedOrder: orderDetails,
            orderSelected: {
              folio: orderDetails.folio_Extension,
              OrderId: orderDetails.id_OrdenCompra,
            },
            providers: orderDetails.proveedor,
            orderSelectedId: orderDetails.id_OrdenCompra,
            providersForEdition: [orderDetails.id_Proveedor],
            articlesForEdition: orderDetails.ordenCompraArticulo?.map((article: any) => ({
              id: article.id_Articulo,
              name: article.nombre,
              amount: article.cantidad,
              stock: article.unidadesPorCaja,
              price: article.precioProveedor,
            })),
            purchaseWarehouseId: orderDetails.id_Almacen,
            purchaseOrderId: orderDetails.id_OrdenCompra,
          }));
        } catch (error) {
          console.error('Error al obtener los detalles de la orden:', error);
          setState((prev) => ({
            ...prev,
            isLoadingOrderDetails: false,
            modals: { ...prev.modals, [modalType]: false },
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          selectedOrder: order,
          orderSelected: {
            folio: order.folio_Extension,
            OrderId: order.id_OrdenCompra,
          },
          providers: order.proveedor,
          orderSelectedId: order.id_OrdenCompra,
          providersForEdition: [order.id_Proveedor],
          articlesForEdition: order.ordenCompraArticulo?.map((article: any) => ({
            id: article.id_Articulo,
            name: article.nombre,
            amount: article.cantidad,
            stock: article.unidadesPorCaja,
            price: article.precioProveedor,
          })),
          purchaseWarehouseId: order.id_Almacen,
          purchaseOrderId: order.id_OrdenCompra,
          orderStatus: order.estatus,
        }));
      }
    },

    handleModalClose: (modalType: 'quote' | 'articlesEntry' | 'updateOrder') => {
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, [modalType]: false },
        selectedOrder: null,
        orderSelected: { folio: '', OrderId: '' },
        providers: '',
        orderSelectedId: '',
        providersForEdition: [],
        articlesForEdition: [],
        purchaseWarehouseId: '',
        purchaseOrderId: '',
        orderStatus: null,
      }));
    },

    handlePdfFetch: async (orderId: string) => {
      console.log({ orderId });
    },

    handleRemoveOrder: async (orderId: string) => {
      const result = await purchaseAlerts.confirmCancelOrder();
      if (result.isConfirmed) {
        try {
          await changeOrderStatus(orderId, 0, 'Cancelada');
          usePurchaseOrderPagination.getState().fetch();
          await purchaseAlerts.orderCancelled();
        } catch (error) {
          console.error(error);
          await purchaseAlerts.orderCancelError();
        }
      }
    },

    handleClearFilters: () => {
      setState((prev) => ({
        ...prev,
        search: '',
        dates: { startDate: '', endDate: '' },
        status: '',
        authorization: null,
        sort: '',
      }));
      usePurchaseOrderPagination.getState().clearFilters();
    },

    handleRefetchAndClearStates: () => {
      setState((prev) => ({
        ...prev,
        purchaseOrderId: '',
        purchaseWarehouseId: '',
        articlesForEdition: [],
      }));
    },

    handleRefresh: () => {
      setState((prev) => ({ ...prev, refresh: !prev.refresh }));
    },
  };

  return {
    state: {
      ...state,
      ...usePurchaseOrderPagination((state) => ({
        data: state.data,
        isLoading: state.isLoading,
        pagination: {
          count: state.count,
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
        },
      })),
    },
    handlers,
  };
};
