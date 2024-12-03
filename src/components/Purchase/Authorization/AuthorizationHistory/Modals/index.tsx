import { Modal } from '@mui/material';
import usePurchaseAuthorizationHistory from '../hooks/usePurchaseAuthorizationHistory';
import { ViewPdf } from '@/components/Inputs/ViewPdf';

interface ModalsContainerProps {
  state: ReturnType<typeof usePurchaseAuthorizationHistory>['state'];
  handlers: ReturnType<typeof usePurchaseAuthorizationHistory>['handlers'];
}
const ModalsContainer = ({ state, handlers }: ModalsContainerProps) => {
  return (
    <>
      <Modal open={state.modals.viewQuotation} onClose={() => handlers.handleCloseModal('viewQuotation')}>
        <ViewPdf pdf={state.pdfString} setViewPdf={() => handlers.handleCloseModal('viewQuotation')} />
      </Modal>
    </>
  );
};

export default ModalsContainer;
