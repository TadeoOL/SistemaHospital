import { Box, Button, Modal, Stack, Typography, CircularProgress } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { ICheckoutSell } from '../../../types/types';
import { Note } from '../../Purchase/PurchaseRequest/Modal/Note';
import { useState } from 'react';
import { ViewBase64Doc } from '../../Commons/ViewBase64Doc';
import { changeSellNote } from '../../../services/checkout/checkoutService';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 450 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 800 },
};

interface CheckoutDetailsModalProps {
  setOpen: Function;
  sellData: ICheckoutSell;
  refetch: Function;
  enableEditNote: boolean;
}
export const CheckoutDetailsModal = (props: CheckoutDetailsModalProps) => {
  const { sellData } = props;
  const [note, setNote] = useState(sellData.notas);
  const [open, setOpen] = useState(false);
  const [savingData, setSavingData] = useState(false);

  const handleSubmit = async () => {
    try {
      setSavingData(true);
      await changeSellNote({ id_VentaPrincipal: props.sellData.id_VentaPrincipal, Notas: note as string });
      props.refetch();
      toast.success('Notas actualizadas correctamente!');
      setOpen(false);
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al modificar la nota');
    } finally {
      setSavingData(false);
    }
  };

  return (
    <>
      <Box sx={style}>
        <HeaderModal title="Detalles de la venta" setOpen={props.setOpen} />
        <Box
          sx={{ display: 'flex', flex: 1, flexDirection: 'column', bgcolor: 'background.paper', p: 3, minHeight: 350 }}
        >
          <Stack spacing={4} sx={{ display: 'flex', flex: 1 }}>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>PDF - {sellData.folio}</Typography>
              <Button variant="contained" disabled={!sellData.pdfCadena} onClick={() => setOpen(true)}>
                Ver PDF
              </Button>
            </Stack>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Notas:</Typography>
              <Note note={note ? note : ''} disabled={!props.enableEditNote} setNote={setNote} />
            </Box>
          </Stack>
        </Box>
        {props.enableEditNote ? (
          <Box sx={{ p: 1, bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={() => props.setOpen(false)}>
              Cerrar
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
              disabled={savingData}
            >
              {savingData ? <CircularProgress size={12} /> : 'Guardar'}
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 1, bgcolor: 'background.paper', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => props.setOpen(false)}>
              Cerrar
            </Button>
          </Box>
        )}
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <ViewBase64Doc pdf={sellData.pdfCadena as string} setViewPdf={setOpen} />
        </>
      </Modal>
    </>
  );
};
