import { Box, Button, Checkbox, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { hashPaymentsToNumber } from '../../../utils/checkoutUtils';
import { useCheckoutDataStore } from '../../../store/checkout/checkoutData';
import { useCheckoutPaginationStore } from '../../../store/checkout/checkoutPagination';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { isValidFloat } from '../../../utils/functions/dataUtils';
import { changePrincipalSellStatus } from '../../../services/checkout/checkoutService';
import { useConnectionSocket } from '../../../store/checkout/connectionSocket';
import { ICheckoutSell } from '../../../types/types';

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
  maxHeight: { xs: 900 },
};

// const scrollBarStyle = {
//   '&::-webkit-scrollbar': {
//     width: '0.4em',
//   },
//   '&::-webkit-scrollbar-track': {
//     boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
//     webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: 'rgba(0,0,0,.1)',
//     outline: '1px solid slategrey',
//   },
// };
interface CloseSaleModalProps {
  setOpen: Function;
  sellData: ICheckoutSell;
}
export const CloseSaleModal = (props: CloseSaleModalProps) => {
  const { sellData } = props;
  const checkoutId = useCheckoutDataStore((state) => state.id);
  const refetch = useCheckoutPaginationStore((state) => state.fetchData);
  const handleClose = () => props.setOpen(false);
  const [hasIva, setHasIva] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentAmountRefError, setPaymentAmountRefError] = useState(false);
  const [paymentSelectedError, setPaymentSelectedError] = useState(false);
  const conn = useConnectionSocket((state) => state.conn);

  const handleSubmit = async () => {
    if (parseFloat(paymentAmount) < sellData.totalVenta) {
      toast.error('El monto de pago no puede ser menor al total de la venta');
      setPaymentAmountRefError(true);
      return;
    }
    if (paymentAmount === '' || !isValidFloat(paymentAmount)) return setPaymentAmountRefError(true);
    if (paymentSelected === '') return setPaymentSelectedError(true);
    try {
      const sellChange = {
        id_VentaPrincipal: sellData.id_VentaPrincipal,
        estatus: 2,
        id_CajaPrincipal: checkoutId as string,
        tieneIva: hasIva,
        tipoPago: hashPaymentsToNumber[paymentSelected],
        montoPago: parseFloat(paymentAmount),
        id_UsuarioPase: sellData.id_UsuarioPase,
        folio: sellData.folio,
        moduloProveniente: sellData.moduloProveniente,
        paciente: sellData.paciente,
        totalVenta: sellData.totalVenta,
      };
      await changePrincipalSellStatus(sellChange);
      conn?.invoke('UpdateSell', sellChange);
      refetch();
      toast.success('Venta realizada con éxito!');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al realizar la venta!');
    }
  };

  const change = useMemo(() => {
    if (paymentAmount === '') return 0;
    return parseFloat(paymentAmount) - sellData.totalVenta;
  }, [paymentAmount]);

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Generar venta" />
      <Box sx={{ display: 'flex', bgcolor: 'background.paper', p: 4 }}>
        <Stack sx={{ display: 'flex', flex: 1 }} spacing={4}>
          <Stack>
            <Typography>Monto Pago</Typography>
            <TextField
              placeholder="Monto pago..."
              error={paymentAmountRefError}
              helperText={paymentAmountRefError && 'Escribe un monto de pago valido...'}
              onBlur={(e) => {
                setPaymentAmount(e.target.value);
                setPaymentAmountRefError(false);
              }}
            />
          </Stack>
          <Stack>
            <Typography>Tipo Pago</Typography>
            <TextField
              placeholder="Método de pago"
              select
              value={paymentSelected}
              error={paymentSelectedError}
              helperText={paymentSelectedError && 'Seleccione un tipo de pago'}
              onChange={(e) => setPaymentSelected(e.target.value)}
            >
              {Object.keys(hashPaymentsToNumber).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Stack sx={{ display: 'flex', flex: 2, alignItems: 'flex-start' }}>
              <Typography>Tiene IVA</Typography>
              <Checkbox checked={hasIva} onChange={(e) => setHasIva(e.target.checked)} />
            </Stack>
            <Stack sx={{ display: 'flex', flex: 3 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Cambio</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>${change}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper' }}>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Generar venta
        </Button>
      </Box>
    </Box>
  );
};
