import { ViewPdf } from '@/components/Inputs/ViewPdf';
import { Modal } from '@mui/material';
import usePurchaseAuthorization from '../../hooks/usePurchaseAuthorization';

interface ModalsContainerProps {
  state: ReturnType<typeof usePurchaseAuthorization>['state'];
  handlers: ReturnType<typeof usePurchaseAuthorization>['handlers'];
}
const ModalsContainer = ({ state, handlers }: ModalsContainerProps) => {
  return (
    <>
      <Modal
        open={state.modals.viewPdf}
        onClose={() => handlers.handleModalClose('viewPdf')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <ViewPdf pdf={state.pdfString} setViewPdf={() => handlers.handleModalClose('viewPdf')} />
      </Modal>
    </>
  );
};

export default ModalsContainer;
