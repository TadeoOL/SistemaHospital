import { Backdrop, Box, Button, CircularProgress, Stack, Typography, Modal } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { Download } from '@mui/icons-material';
import { useState } from 'react';
import { getOrderRequestById } from '../../../../../api/api.routes';
import { ViewPdf } from '../../../../Inputs/ViewPdf';

const style = {
  width: 600,
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  overflowY: 'auto',
};

interface OrderModaProps {
  purchaseData: { folio: string; OrderId: string };
  open: Function;
}

export const OrderModal = (props: OrderModaProps) => {
  const { purchaseData, open } = props;
  const [viewPdf, setViewPdf] = useState(false);
  const [pdf, setPdf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pdfFetch = async () => {
    setIsLoading(true);
    try {
      const res = await getOrderRequestById(purchaseData.OrderId);
      setPdf(res.pdfBase64);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box sx={style}>
        <HeaderModal title={'Enviar orden de compra - Solicitud No. ' + purchaseData.folio} setOpen={open} />
        <Stack
          sx={{
            bgcolor: 'white',
            px: 8,
            py: 2,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
          spacing={4}
        >
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Seleccione los proveedores para enviarle la orden de compra
            </Typography>
            <Stack
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <Button variant="contained">Enviar por whatsapp</Button>
              <Button variant="contained">Enviar por correo</Button>
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Orden de compra</Typography>
            <Button
              variant="outlined"
              onClick={() => {
                pdfFetch();
                setViewPdf(true);
              }}
              sx={{ alignContent: 'center', display: 'flex' }}
            >
              {<Download />}
              Descargar
            </Button>
          </Stack>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', mt: 5 }}>
            <Button variant="contained">Aceptar</Button>
          </Box>
        </Stack>
      </Box>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        {!isLoading ? (
          <>
            <ViewPdf pdf={pdf} setViewPdf={setViewPdf} />
          </>
        ) : (
          <Backdrop open>
            <CircularProgress />
          </Backdrop>
        )}
      </Modal>
    </>
  );
};
