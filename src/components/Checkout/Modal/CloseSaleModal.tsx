import { Box, Button, Divider, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { hashPaymentsToNumber } from '../../../utils/checkoutUtils';
import { useCheckoutDataStore } from '../../../store/checkout/checkoutData';
import { useCheckoutPaginationStore } from '../../../store/checkout/checkoutPagination';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { isValidFloat } from '../../../utils/functions/dataUtils';
import { changePrincipalSellStatus } from '../../../services/checkout/checkoutService';
import { useConnectionSocket } from '../../../store/checkout/connectionSocket';
import { ICheckoutSell } from '../../../types/types';
import Swal from 'sweetalert2';

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
  maxHeight: { xs: 600, xl: 900 },
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
interface CloseSaleModalProps {
  setOpen: Function;
  sellData: ICheckoutSell;
}
export const CloseSaleModal = (props: CloseSaleModalProps) => {
  const { sellData } = props;
  const checkoutId = useCheckoutDataStore((state) => state.id);
  const refetch = useCheckoutPaginationStore((state) => state.fetchData);
  const handleClose = () => props.setOpen(false);
  const [paymentSelected, setPaymentSelected] = useState('');
  const [paymentSelected2, setPaymentSelected2] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentAmount2, setPaymentAmount2] = useState('');
  const [paymentAmountRefError, setPaymentAmountRefError] = useState(false);
  const [paymentAmountRefError2, setPaymentAmountRefError2] = useState(false);
  const [paymentSelectedError, setPaymentSelectedError] = useState(false);
  const [paymentSelectedError2, setPaymentSelectedError2] = useState(false);
  const conn = useConnectionSocket((state) => state.conn);
  const [hasAnotherPaymentMethod, setHasAnotherPaymentMethod] = useState(false);
  // const numberInvoiceRef = useRef<HTMLTextAreaElement | null>(null);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async () => {
    if (paymentSelected === '') {
      return setPaymentSelectedError(true);
    }

    if ((paymentSelected === 'Efectivo' && paymentAmount === '') || !isValidFloat(paymentAmount)) {
      return setPaymentAmountRefError(true);
    }

    if ((hasAnotherPaymentMethod && paymentAmount2 === '') || !isValidFloat(paymentAmount2)) {
      return setPaymentAmountRefError2(true);
    }

    if (hasAnotherPaymentMethod && paymentSelected2 === '') {
      return setPaymentSelectedError2(true);
    }

    const totalPayment = parseFloat(paymentAmount) + parseFloat(paymentAmount2);

    if (totalPayment !== sellData.totalVenta) {
      setPaymentAmountRefError(true);
      if (hasAnotherPaymentMethod) setPaymentAmountRefError2(true);
      toast.error('El monto de pago tiene que ser igual a la venta');
      return;
    }

    try {
      const payment = [
        {
          tipoPago: hashPaymentsToNumber[paymentSelected],
          montoPago: paymentSelected !== 'Efectivo' ? sellData.totalVenta : parseFloat(paymentAmount),
        },
      ];

      if (hasAnotherPaymentMethod) {
        payment.push({
          tipoPago: hashPaymentsToNumber[paymentSelected2],
          montoPago: parseFloat(paymentAmount2),
        });
      }
      const sellChange = {
        id_VentaCaja: sellData.id_VentaPrincipal,
        estatus: 2,
        id_CajaUsuario: checkoutId as string,
        notas: noteRef?.current?.value,
        pago: payment,
      };
      await changePrincipalSellStatus(sellChange);
      conn?.invoke('UpdateSell', sellChange);
      refetch();
      toast.success('Venta realizada con éxito!');
      props.setOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Correcto',
        text: `Su cambio es de: ${change}`,
        showConfirmButton: true,
        timer: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al realizar la venta!');
    }
  };

  const change = useMemo(() => {
    let totalPayment = 0;
    if (hasAnotherPaymentMethod) {
      totalPayment = parseFloat(paymentAmount) + parseFloat(paymentAmount2);
    } else {
      if (paymentSelected === 'Efectivo') {
        totalPayment = parseFloat(paymentAmount);
      } else {
        totalPayment = sellData.totalVenta;
      }
    }
    if (!Number(totalPayment)) return 0;
    return totalPayment - sellData.totalVenta <= 0 ? 0 : totalPayment - sellData.totalVenta;
  }, [paymentAmount, paymentAmount2, paymentSelected, hasAnotherPaymentMethod, sellData.totalVenta]);

  useEffect(() => {
    if (!hasAnotherPaymentMethod) {
      setPaymentSelected2('');
      setPaymentAmount2('');
      setPaymentSelectedError2(false);
      setPaymentAmountRefError2(false);
    }
  }, [hasAnotherPaymentMethod]);

  useEffect(() => {
    if (paymentSelected !== 'Efectivo') {
      console.log('sellData.totalVenta:', sellData.totalVenta);
      setPaymentAmount(Number(sellData.totalVenta).toString());
    }

    if (!hasAnotherPaymentMethod) {
      setPaymentAmount2('0');
    }

    if (hasAnotherPaymentMethod) {
      const remaining = (Number(sellData.totalVenta) * 10 - Number(paymentAmount) * 10) / 10;
      setPaymentAmount2(remaining >= 0 ? remaining.toString() : '0');
    }
  }, [paymentSelected, paymentAmount, paymentSelected2, paymentAmount2]);

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Cobrar Venta" />
      <Box sx={{ display: 'flex', bgcolor: 'background.paper', p: 4, overflowY: 'auto', ...scrollBarStyle }}>
        <Stack sx={{ display: 'flex', flex: 1 }} spacing={2}>
          <Box sx={{ display: 'flex', columnGap: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Total a pagar:</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>${sellData.totalVenta}</Typography>
          </Box>
          <Stack>
            <Typography>Tipo Pago</Typography>
            <TextField
              placeholder="Método de pago"
              select
              value={paymentSelected}
              error={paymentSelectedError}
              helperText={paymentSelectedError && 'Seleccione un tipo de pago'}
              onChange={(e) => {
                setPaymentSelected(e.target.value);
                setPaymentAmount('');
              }}
            >
              {Object.keys(hashPaymentsToNumber).map((key) => (
                <MenuItem key={key} value={key} disabled={key === paymentSelected2}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {(hasAnotherPaymentMethod || paymentSelected === 'Efectivo') && (
            <Stack>
              <Typography>Monto Pago</Typography>
              <TextField
                placeholder="Monto pago..."
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="end">$</InputAdornment>,
                }}
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]' }}
                error={paymentAmountRefError}
                value={paymentAmount}
                helperText={paymentAmountRefError && 'Escribe un monto de pago valido...'}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  setPaymentAmountRefError(false);
                }}
              />
            </Stack>
          )}
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setHasAnotherPaymentMethod(!hasAnotherPaymentMethod)}>
              {hasAnotherPaymentMethod ? 'Cancelar Division Pago' : 'Dividir pago'}
            </Button>
          </Box>
          {hasAnotherPaymentMethod && (
            <>
              <Stack>
                <Typography>Tipo Pago</Typography>
                <TextField
                  placeholder="Método de pago"
                  select
                  value={paymentSelected2}
                  error={paymentSelectedError2}
                  helperText={paymentSelectedError2 && 'Seleccione un tipo de pago'}
                  onChange={(e) => setPaymentSelected2(e.target.value)}
                >
                  {Object.keys(hashPaymentsToNumber).map((key) => (
                    <MenuItem key={key} value={key} disabled={key === paymentSelected}>
                      {key}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack>
                <Typography>Monto Pago</Typography>
                <TextField
                  placeholder="Monto pago..."
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="end">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]' }}
                  value={paymentAmount2}
                  disabled
                  error={paymentAmountRefError2}
                  helperText={paymentAmountRefError2 && 'Escribe un monto de pago valido...'}
                  onChange={(e) => {
                    setPaymentAmount2(e.target.value);
                    setPaymentAmountRefError2(false);
                  }}
                />
              </Stack>
            </>
          )}

          <Stack>
            <Typography>Notas</Typography>
            <TextField placeholder="Notas" multiline inputRef={noteRef} />
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Stack sx={{ display: 'flex', flex: 1 }}>
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
          Cobrar Venta{' '}
        </Button>
      </Box>
    </Box>
  );
};
