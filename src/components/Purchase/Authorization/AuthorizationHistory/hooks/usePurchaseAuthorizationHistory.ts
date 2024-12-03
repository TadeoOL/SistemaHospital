import { getPurchaseOrderQuotationById } from '@/services/purchase/purchaseService';
import { getDefaultPaginationParams, IPaginationParams } from '@/types/paginationType';
import { IPurchaseAuthorizationHistory } from '@/types/purchase/purchaseTypes';
import { useState } from 'react';
import purchaseAuthorizationAlerts from '../../Authorization/utils/alerts';
import { toast } from 'react-toastify';

interface PurchaseAuthorizationHistoryState extends Omit<IPaginationParams, 'fechaInicio' | 'fechaFin'> {
  dates: {
    startDate: string;
    endDate: string;
  };
  modals: {
    viewQuotation: boolean;
  };
  purchaseOrderId: string;
  pdfString: string;
  statusPurchaseOrder: string;
}

interface PurchaseAuthorizationHistoryActions {
  setSearch: (search: string) => void;
  onChangeDate: (date: 'startDate' | 'endDate', value: string) => void;
  clearFilters: () => void;
  handleOpenModal: (modalType: 'viewQuotation', order: IPurchaseAuthorizationHistory) => void;
  handleCloseModal: (modalType: 'viewQuotation') => void;
  handleViewQuotation: (purchaseOrderId: string) => void;
  onChangeStatusPurchaseOrder: (status: string) => void;
}

const initialState: PurchaseAuthorizationHistoryState = {
  dates: {
    startDate: '',
    endDate: '',
  },
  modals: {
    viewQuotation: false,
  },
  purchaseOrderId: '',
  pdfString: '',
  ...getDefaultPaginationParams(),
  statusPurchaseOrder: '-1',
};

const usePurchaseAuthorizationHistory = (): {
  state: PurchaseAuthorizationHistoryState;
  handlers: PurchaseAuthorizationHistoryActions;
} => {
  const [state, setState] = useState<PurchaseAuthorizationHistoryState>(initialState);

  const handlers = {
    setSearch: (search: string) => {
      setState((prev) => ({ ...prev, search }));
    },
    setPageSize: (pageSize: number) => {
      setState((prev) => ({ ...prev, pageSize }));
    },
    setPageIndex: (pageIndex: number) => {
      setState((prev) => ({ ...prev, pageIndex }));
    },
    setEnabled: (enabled: boolean) => {
      setState((prev) => ({ ...prev, habilitado: enabled }));
    },
    onChangeDate: (date: 'startDate' | 'endDate', value: string) => {
      setState((prev) => ({ ...prev, dates: { ...prev.dates, [date]: value } }));
    },
    clearFilters: () => {
      setState(initialState);
    },
    handleOpenModal: (modalType: 'viewQuotation', order: IPurchaseAuthorizationHistory) => {
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, [modalType]: true },
        purchaseOrderId: order.id_OrdenCompra,
      }));
    },
    handleCloseModal: (modalType: 'viewQuotation') => {
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, [modalType]: false, pdfString: modalType === 'viewQuotation' ? '' : prev.pdfString },
      }));
    },
    handleViewQuotation: async (purchaseOrderId: string) => {
      try {
        const quotation = await getPurchaseOrderQuotationById(purchaseOrderId);
        if (!quotation || quotation.trim() === '') {
          await purchaseAuthorizationAlerts.viewPdfEmpty();
          return;
        }
        setState((prev) => ({
          ...prev,
          pdfString: quotation,
          modals: {
            ...prev.modals,
            viewQuotation: true,
          },
        }));
      } catch (error) {
        console.error('Error al obtener la cotización:', error);
        toast.error('Error al obtener la cotización');
      }
    },
    onChangeStatusPurchaseOrder: (status: string) => {
      setState((prev) => ({ ...prev, statusPurchaseOrder: status }));
    },
  };
  return {
    state,
    handlers,
  };
};

export default usePurchaseAuthorizationHistory;
