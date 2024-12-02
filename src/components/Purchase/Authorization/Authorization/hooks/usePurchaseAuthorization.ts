import { useState } from 'react';
import purchaseAuthorizationAlerts from '../utils/alerts';
import { changeOrderStatus, getPurchaseOrderQuotationById } from '@/services/purchase/purchaseService';
import { toast } from 'react-toastify';
interface IPurchaseAuthorizationState {
  search: string;
  dates: { startDate: string; endDate: string };
  sort: string;
  pageIndex: number;
  pageSize: number;
  modals: {
    viewPdf: boolean;
  };
  pdfString: string;
  refresh: boolean;
}

const initialState: IPurchaseAuthorizationState = {
  search: '',
  dates: { startDate: '', endDate: '' },
  sort: '',
  pageIndex: 1,
  pageSize: 10,
  modals: {
    viewPdf: false,
  },
  pdfString: '',
  refresh: false,
};

interface IPurchaseAuthorizationHandlers {
  handleSearchChange: (search: string) => void;
  handleDateChange: (type: 'startDate' | 'endDate', value: string) => void;
  handleSortChange: (sort: string) => void;
  handlePaginationChange: (page: number, pageSize: number) => void;
  handleClearFilters: () => void;
  handleAcceptAuthorization: (purchaseOrderId: string) => void;
  handleRejectAuthorization: (purchaseOrderId: string) => void;
  handleViewQuotation: (purchaseOrderId: string) => void;
  handleModalClose: (modalType: keyof IPurchaseAuthorizationState['modals']) => void;
  handleRefresh: () => void;
}

const usePurchaseAuthorization = (): {
  state: IPurchaseAuthorizationState;
  handlers: IPurchaseAuthorizationHandlers;
} => {
  const [state, setState] = useState<IPurchaseAuthorizationState>(initialState);

  const handlers = {
    handleSearchChange: (search: string) => {
      setState((prev) => ({ ...prev, search }));
    },
    handleDateChange: (type: 'startDate' | 'endDate', value: string) => {
      setState((prev) => ({ ...prev, dates: { ...prev.dates, [type]: value } }));
    },
    handleSortChange: (sort: string) => {
      setState((prev) => ({ ...prev, sort }));
    },
    handlePaginationChange: (page: number, pageSize: number) => {
      setState((prev) => ({ ...prev, pageIndex: page, pageSize }));
    },
    handleClearFilters: () => {
      setState(initialState);
    },
    handleAcceptAuthorization: async (purchaseOrderId: string) => {
      try {
        const result = await purchaseAuthorizationAlerts.acceptAuthorization();
        if (result.isConfirmed) {
          await changeOrderStatus(purchaseOrderId, 3, 'Autorizada');
          await purchaseAuthorizationAlerts.acceptedAuthorization();
          handlers.handleRefresh();
        }
      } catch (error) {
        console.error(error);
        purchaseAuthorizationAlerts.acceptAuthorizationError();
      }
    },
    handleRejectAuthorization: async (purchaseOrderId: string) => {
      try {
        const result = await purchaseAuthorizationAlerts.rejectAuthorization();
        if (result.isConfirmed) {
          await changeOrderStatus(purchaseOrderId, 0, 'Rechazada');
          await purchaseAuthorizationAlerts.rejectedAuthorization();
          handlers.handleRefresh();
        }
      } catch (error) {
        console.error(error);
        purchaseAuthorizationAlerts.rejectAuthorizationError();
      }
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
            viewPdf: true,
          },
        }));
      } catch (error) {
        console.error('Error al obtener la cotización:', error);
        toast.error('Error al obtener la cotización');
      }
    },
    handleModalClose: (modalType: keyof IPurchaseAuthorizationState['modals']) => {
      setState((prev) => ({
        ...prev,
        modals: {
          ...prev.modals,
          [modalType]: false,
        },
        pdfString: modalType === 'viewPdf' ? '' : prev.pdfString,
      }));
    },
    handleRefresh: () => {
      setState((prev) => ({ ...prev, refresh: !prev.refresh }));
    },
  };

  return { state, handlers };
};

export default usePurchaseAuthorization;
