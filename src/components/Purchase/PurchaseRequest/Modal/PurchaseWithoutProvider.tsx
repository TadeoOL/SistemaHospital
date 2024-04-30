import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { BuildOrder } from './DirectlyPurchaseOrder';
import { useEffect, useRef, useState } from 'react';
import { ArrowBack, Save } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-toastify';
import { createPurchaseWithoutProvider } from '../../../../services/purchase/purchaseService';
import { openBase64InNewTab } from '../../../../utils/functions/dataUtils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 800, lg: 900 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 600 },
};

const stepsArray = [
  {
    id: 1,
    title: 'Seleccionar artículos',
  },
  {
    id: 3,
    title: 'Resumen',
  },
];

const stepsView = (step: number, setOpen: Function) => {
  switch (step) {
    case 0:
      return <BuildOrder setOpen={setOpen} />;
    case 1:
      return <StepThree setOpen={setOpen} />;
    default:
      return null;
  }
};

interface PurchaseWithoutProviderProps {
  setOpen: Function;
}
export const PurchaseWithoutProvider = (props: PurchaseWithoutProviderProps) => {
  const step = useDirectlyPurchaseRequestOrderStore((state) => state.step);
  const clearData = useDirectlyPurchaseRequestOrderStore((state) => state.clearAllStates);
  const setHasProvider = useDirectlyPurchaseRequestOrderStore((state) => state.setHasProvider);

  useEffect(() => {
    setHasProvider(false);
    return () => {
      clearData();
    };
  }, []);

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Solicitud de Compra" />
      <Stack sx={{ p: 4, bgcolor: 'white', overflowY: 'auto' }}>
        <Stepper activeStep={step}>
          {stepsArray.map((s) => (
            <Step key={s.id}>
              <StepLabel>{s.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {stepsView(step, props.setOpen)}
      </Stack>
    </Box>
  );
};

const StepThree = (props: { setOpen: Function }) => {
  const { articles, step, setStep, totalAmountRequest } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      articles: state.articles,
      step: state.step,
      setStep: state.setStep,
      totalAmountRequest: state.totalAmountRequest,
      isDirectlyPurchase: state.isDirectlyPurchase,
      needAuth: state.needAuth,
      pdf: state.pdf,
    }),
    shallow
  );
  const [isLoading, setIsLoading] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    const obj = {
      articulos: articles.map((articles) => {
        return {
          id_Articulo: articles.id,
          cantidadCompra: articles.amount,
        };
      }),
      notas: noteRef.current ? noteRef.current.value : '',
    };
    try {
      const res = await createPurchaseWithoutProvider(obj);
      toast.success('Solicitud de compra creada con éxito!');
      setTimeout(() => {
        openBase64InNewTab(res);
        props.setOpen(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error('Error al crear la solicitud de compra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
        <Typography variant="h4">Resumen de la solicitud</Typography>
      </Box>
      <Stack sx={{ mt: 1 }} spacing={2}>
        <Stack>
          <Typography variant="subtitle1">Notas:</Typography>
          <TextField multiline placeholder="Escribir notas..." inputRef={noteRef} />
        </Stack>
        <Stack>
          <Typography variant="subtitle1">Artículos</Typography>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {articles.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.amount}</TableCell>
                      <TableCell>{a.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            columnGap: 1,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 13 }}>Total de la orden: </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 13 }}>${totalAmountRequest}</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          mt: 2,
          bottom: 0,
        }}
      >
        <Button variant="contained" startIcon={<ArrowBack />} onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained" startIcon={<Save />} onClick={() => handleSubmit()} disabled={isLoading}>
          {isLoading ? <CircularProgress size={18} /> : 'Generar compra'}
        </Button>
      </Box>
    </Stack>
  );
};
