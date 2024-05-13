import { Backdrop, Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { error, primary } from '../../../theme/colors';
import { useEffect, useState } from 'react';
import { CheckoutResume, SaleResume, getCheckoutResume } from '../../../services/checkout/checkoutService';
import { useCheckoutDataStore } from '../../../store/checkout/checkoutData';
import { hashPaymentsToNumber } from '../../../utils/checkoutUtils';

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

interface CheckoutCloseModalProps {
  setOpen: Function;
}

const useFormatData = (data: SaleResume[] | undefined) => {
  if (!data) {
    return {
      efectivo: [],
      transferencia: [],
      credito: [],
      debito: [],
    };
  }

  const groupedSales = data.reduce(
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
  const { data, isLoading } = useGetCheckoutResume();
  const dataFormatted = useFormatData(data?.resumenVenta);

  console.log({ dataFormatted });

  const date = new Date();
  const hour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const day = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const handleCloseCheckout = () => {
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
      .then((result) => {});
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
      <Box sx={{ backgroundColor: 'background.paper', p: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Resumen de las ventas</Typography>
        <Divider sx={{ my: 1 }} />
        <Stack>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500 }}>Efectivo</Typography>
            <Typography>100</Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500 }}>Tarjeta</Typography>
            <Typography>100</Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500 }}>Transferencia</Typography>
            <Typography>100</Typography>
          </Box>
        </Stack>
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
        <Button variant="contained" onClick={handleCloseCheckout}>
          Realizar corte
        </Button>
      </Box>
    </Box>
  );
};
