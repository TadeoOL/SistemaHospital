import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { error, primary } from '../../../theme/colors';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckoutResume,
  SaleResume,
  closePrincipalCheckout,
  getCheckoutResume,
} from '../../../services/checkout/checkoutService';
import { useCheckoutDataStore } from '../../../store/checkout/checkoutData';
import { hashPaymentsToNumber, leaveConcepts } from '../../../utils/checkoutUtils';
import { CollapseTablesPayment } from './CollapseTablesPayment';
import { isValidFloat } from '../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 800 },
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

interface CheckoutCloseModalProps {
  setOpen: Function;
}

const useFormatData = (data: SaleResume[] | undefined): any => {
  const [filteredData, setFilteredData] = useState<SaleResume[]>([]);
  const leaveConceptSelected = useCheckoutDataStore((state) => state.conceptoSalidaSeleccionado);

  useEffect(() => {
    if (data && leaveConceptSelected !== 'Todos') {
      const newData = data.filter((sale) => sale.moduloProveniente === leaveConceptSelected);
      setFilteredData(newData);
    } else {
      setFilteredData(data || []);
    }
  }, [data, leaveConceptSelected]);

  const groupedSales = filteredData.reduce(
    (acc, sale) => {
      switch (sale.tipoPago) {
        case hashPaymentsToNumber['Efectivo']:
          acc.efectivo.push(sale);
          break;
        case hashPaymentsToNumber['Transferencia']:
          acc.transferencia.push(sale);
          break;
        case hashPaymentsToNumber['Crédito']:
          acc.credito.push(sale);
          break;
        case hashPaymentsToNumber['Débito']:
          acc.debito.push(sale);
          break;
        default:
          break;
      }
      return acc;
    },
    {
      efectivo: [] as SaleResume[],
      transferencia: [] as SaleResume[],
      credito: [] as SaleResume[],
      debito: [] as SaleResume[],
    }
  );

  return groupedSales;
};

const useGetCheckoutResume = () => {
  const checkoutId = useCheckoutDataStore((state) => state.id);
  const [data, setData] = useState<CheckoutResume>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetch = async () => {
      try {
        const res = await getCheckoutResume(checkoutId as string);
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);
  return { data, isLoading };
};

export const CheckoutCloseModal = (props: CheckoutCloseModalProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCheckoutResume();
  const dataFormatted = useFormatData(data?.resumenVenta);
  const leaveConceptSelected = useCheckoutDataStore((state) => state.conceptoSalidaSeleccionado);
  const setLeaveConceptSelected = useCheckoutDataStore((state) => state.setConceptoSalidaSeleccionado);
  const date = new Date();
  const hour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const day = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const totalAmount = useMemo(() => {
    if (!data) return 0;
    return data?.efectivo + data?.transferencia + data?.credito + data.debito;
  }, [data]);
  const cashRef = useRef<HTMLTextAreaElement | null>();
  const [cashError, setCashError] = useState(false);
  const [isLoadingClose, setIsLoadingClose] = useState(false);

  const handleCloseCheckout = () => {
    if (!data) return;
    if (!cashRef.current) return;
    if (cashRef.current.value.trim() === '' || !isValidFloat(cashRef.current.value.trim())) {
      setCashError(true);
      toast.warning('Por favor llena todos los datos antes de realizar el corte de caja.');
      return;
    }
    withReactContent(Swal)
      .fire({
        icon: 'warning',
        title: 'Advertencia',
        html: `El corte se realizara a las <strong>${hour}</strong> <br> del dia <strong>${day}</strong>.`,
        showCancelButton: true,
        confirmButtonColor: primary.main,
        cancelButtonColor: error.main,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setIsLoadingClose(true);
          try {
            const obj = {
              debito: data.debito,
              credito: data.credito,
              efectivo: data.efectivo,
              transferencia: data.transferencia,
              ventaTotal: totalAmount,
              dineroAlCorte: parseFloat(cashRef.current?.value as string),
            };
            await closePrincipalCheckout(obj);
            props.setOpen(false);
            navigate('/');
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: 'La caja se ha cerrado correctamente.',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            });
          } catch (error) {
            console.log(error);
            toast.error('Error al cerrar la caja.');
          }
        }
      });
  };

  if (isLoading)
    return (
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Cerrar caja" />
      <Box sx={{ backgroundColor: 'background.paper', p: 3, overflowY: 'auto', ...scrollBarStyle }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, flex: 1 }}>Resumen de las ventas</Typography>
          <TextField
            select
            label="Conceptos de salida"
            fullWidth
            sx={{ flex: 1 }}
            value={leaveConceptSelected}
            onChange={(e) => setLeaveConceptSelected(e.target.value)}
          >
            <MenuItem value="Todos" key={''}>
              Todos
            </MenuItem>
            {leaveConcepts.map((lc) => (
              <MenuItem key={lc} value={lc}>
                {lc}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={0.5}>
          <CollapseTablesPayment paymentType="Efectivo" data={dataFormatted.efectivo} />
          <CollapseTablesPayment paymentType="Transferencia" data={dataFormatted.transferencia} />
          <CollapseTablesPayment paymentType="Crédito" data={dataFormatted.credito} />
          <CollapseTablesPayment paymentType="Débito" data={dataFormatted.debito} />
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', columnGap: 4, backgroundColor: '#F9F9F9', p: 2, borderRadius: 4 }}>
          <Stack sx={{ flex: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Efectivo</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>${data?.efectivo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Débito</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>${data?.debito}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Crédito</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>${data?.credito}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Transferencia</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>${data?.transferencia}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Total</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>${totalAmount}</Typography>
            </Box>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Dinero en caja al corte</Typography>
            <TextField
              placeholder="Dinero en caja..."
              inputRef={cashRef}
              error={cashError}
              helperText={cashError && 'Escribe una cantidad valida'}
              onChange={() => setCashError(false)}
              sx={{ bgcolor: 'white' }}
            />
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          bgcolor: 'background.paper',
          p: 1,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Button variant="contained" onClick={handleCloseCheckout} disabled={isLoadingClose}>
          {isLoadingClose ? <CircularProgress size={12} /> : 'Realizar corte'}
        </Button>
      </Box>
    </Box>
  );
};
