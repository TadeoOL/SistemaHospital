import { Backdrop, Box, Button, CircularProgress, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useRef, useState } from 'react';
import { registerSell } from '../../../services/checkout/checkoutService';
import { useConnectionSocket } from '../../../store/checkout/connectionSocket';
import { useGetCheckoutConfig } from '../../../hooks/useGetCheckoutConfig';
import { useAuthStore } from '../../../store/auth';
import { useCheckoutUserEmitterPaginationStore } from '../../../store/checkout/checkoutUserEmitterPagination';
import { Note } from '../../Purchase/PurchaseRequest/Modal/Note';
import { UploadFile } from '../../Commons/UploadFile';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900, sm:500 },
};

const scrollBarStyle = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

interface GenerateReceiptModalProps {
  setOpen: Function;
}
export const GenerateReceiptModal = (props: GenerateReceiptModalProps) => {
  const profile = useAuthStore((state) => state.profile);
  const { config, loadingConfig } = useGetCheckoutConfig();
  const [conceptSelected, setConceptSelected] = useState('');
  const personNameRef = useRef<HTMLTextAreaElement | null>();
  const totalAmountRef = useRef<HTMLTextAreaElement | null>();
  const [personNameError, setPersonNameError] = useState(false);
  const [totalAmountError, setTotalAmountError] = useState(false);
  const [conceptError, setConceptError] = useState(false);
  const conn = useConnectionSocket((state) => state.conn);
  const concepts = getConcepts(config, profile?.id as string);
  const refetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);
  const [note, setNote] = useState('');
  const [pdf, setPdf] = useState('');

  function getConcepts(configData: typeof config, userId: string) {
    const configFound = configData.find((c) => c.id_Usuario === userId);
    if (configFound) {
      return configFound.departamento;
    }
    return [];
  }

  const handleSubmit = async () => {
    if (!conn) return;
    if (!personNameRef.current || !totalAmountRef.current) return;
    if (personNameRef.current.value.trim() === '') return setPersonNameError(true);
    if (totalAmountRef.current.value.trim() === '') return setTotalAmountError(true);
    if (conceptSelected === '') return setConceptError(true);

    try {
      const object = {
        paciente: personNameRef.current.value,
        totalVenta: parseFloat(totalAmountRef.current.value),
        moduloProveniente: conceptSelected,
        notas: note.trim() === '' ? undefined : note,
        pdfCadena: pdf.trim() === '' ? undefined : pdf,
      };
      const res = await registerSell(object);
      const resObj = {
        estatus: res.estadoVenta,
        folio: res.folio,
        id_VentaPrincipal: res.id,
        moduloProveniente: res.moduloProveniente,
        paciente: res.paciente,
        totalVenta: res.totalVenta,
        tipoPago: res.tipoPago,
        id_UsuarioPase: res.id_UsuarioPase,
      };
      conn.invoke('SendSell', resObj);
      refetch();
      toast.success('');
      props.setOpen(false);
      setTotalAmountError(false);
      personNameRef.current.value = '';
      totalAmountRef.current.value = '';
    } catch (error: any) {
      console.log(error);
    }
  };

  if (loadingConfig)
    return (
      <Backdrop open={loadingConfig}>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Generar Pase a Caja" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          p: 2,
          overflowY: 'auto',
          ...scrollBarStyle,
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={4}>
            <Typography>Concepto de salida:</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Conceptos"
              fullWidth
              error={conceptError}
              helperText={conceptError && 'Selecciona un concepto...'}
              sx={{ maxWidth: 175 }}
              onChange={(e: any) => {
                setConceptSelected(e.target.value);
                setConceptError(false);
              }}
              select
              value={conceptSelected}
            >
              {concepts.map((concept) => (
                <MenuItem key={concept} value={concept}>
                  {concept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <Typography>Nombre del paciente:</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              placeholder="Nombre"
              inputRef={personNameRef}
              error={personNameError}
              onChange={() => setPersonNameError(false)}
              helperText={personNameError && 'Escribe un nombre...'}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography>Total:</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              placeholder="Total"
              inputRef={totalAmountRef}
              error={totalAmountError}
              onChange={() => setTotalAmountError(false)}
              helperText={totalAmountError && 'Escribe una cantidad...'}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Notas:</Typography>
            <Note note={note} setNote={setNote} />
          </Grid>
          <Grid item xs={12}>
            <UploadFile pdf={pdf} setPdf={setPdf} title="Visualizar PDF" />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          p: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Button variant="contained" onClick={() => handleSubmit()}>
          Generar Pase a Caja
        </Button>
      </Box>
    </Box>
  );
};
