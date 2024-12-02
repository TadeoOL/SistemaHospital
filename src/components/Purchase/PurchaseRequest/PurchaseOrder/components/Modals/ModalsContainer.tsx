import { Modal } from '@mui/material';
import { QuoteModal } from '../../Modal/QuoteModal';
import { ArticlesEntry } from '../../Modal/ArticlesEntry';
import { UpdateDirectlyPurchaseOrder } from '../../../Modal/DirectlyPurchaseOrderPackage';
import { FullscreenLoader } from '@/common/components';
import { StatusPurchaseOrder } from '@/types/types';

interface ModalsContainerProps {
  modals: {
    quote: boolean;
    articlesEntry: boolean;
    updateOrder: boolean;
  };
  onModalClose: (modalType: 'quote' | 'articlesEntry' | 'updateOrder') => void;
  orderSelected: {
    folio: string;
    OrderId: string;
  };
  providers: string;
  orderSelectedId: string;
  initialProvidersFromOrder: string[];
  initialArticles: any[];
  purcharseOrderWarehouseId: string;
  purcharseOrderId: string;
  handleRefetchAndClearStates: () => void;
  handleRefresh: () => void;
  isLoadingOrderDetails: boolean;
  status: StatusPurchaseOrder;
}

export const ModalsContainer = ({
  modals,
  onModalClose,
  orderSelected,
  providers,
  orderSelectedId,
  initialProvidersFromOrder,
  initialArticles,
  purcharseOrderWarehouseId,
  purcharseOrderId,
  isLoadingOrderDetails,
  handleRefetchAndClearStates,
  handleRefresh,
  status,
}: ModalsContainerProps) => {
  return (
    <>
      <Modal open={modals.quote} onClose={() => onModalClose('quote')}>
        <>
          <QuoteModal
            idFolio={orderSelected}
            providers={providers}
            open={() => onModalClose('quote')}
            handleRefresh={handleRefresh}
            status={status}
          />
        </>
      </Modal>

      <Modal open={modals.articlesEntry} onClose={() => onModalClose('articlesEntry')}>
        <>
          <ArticlesEntry
            orderId={orderSelectedId}
            setOpen={() => onModalClose('articlesEntry')}
            handleRefresh={handleRefresh}
          />
        </>
      </Modal>

      <Modal open={modals.updateOrder} onClose={() => onModalClose('updateOrder')}>
        <>
          {isLoadingOrderDetails ? (
            <FullscreenLoader />
          ) : (
            <UpdateDirectlyPurchaseOrder
              initialProvidersFromOrder={initialProvidersFromOrder}
              initialArticles={initialArticles}
              purcharseOrderWarehouseId={purcharseOrderWarehouseId}
              purcharseOrderId={purcharseOrderId}
              setOpen={() => onModalClose('updateOrder')}
              clearData={handleRefetchAndClearStates}
              handleRefresh={handleRefresh}
            />
          )}
        </>
      </Modal>
    </>
  );
};
