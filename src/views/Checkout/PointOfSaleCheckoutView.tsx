import { PointOfSaleCheckout } from '../../components/Checkout/PointOfSaleCheckout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { error, primary } from '../../theme/colors';
import { Backdrop, Box, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCheckout, openCheckout } from '../../services/checkout/checkoutService';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';

const alert = (navigate: NavigateFunction, setIsLoading: Function, setData: Function) => {
  withReactContent(Swal)
    .fire({
      title: 'Advertencia',
      html: <OpenCheckout />,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: primary.main,
      cancelButtonText: 'Rechazar',
      cancelButtonColor: error.main,
      showCancelButton: true,
      reverseButtons: true,
      preConfirm: () => {
        const input1 = document.getElementById('input1') as HTMLInputElement | null;
        return { initialAmount: input1?.value };
      },
    })
    .then(async (res) => {
      if (res.isDenied || res.dismiss) return navigate('/');
      if (res.isConfirmed) {
        try {
          const resData = await openCheckout(res.value.initialAmount);
          setData(resData);
          Swal.fire({
            icon: 'success',
            title: 'Éxito!',
            text: 'Se ha creado la caja correctamente!',
          });
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha generado un error al crear la caja!',
          }).then((res) => {
            if (res.dismiss || res.isConfirmed) return navigate('/');
          });
        }
      }
    });
};

const useGetCheckout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const setCheckoutData = useCheckoutDataStore((state) => state.setData);

  useEffect(() => {
    setIsLoading(true);
    const fetch = async () => {
      try {
        const res = await getCheckout();
        setCheckoutData(res);
        if (!res.tieneCaja || res.cerrada) {
          return alert(navigate, setIsLoading, setCheckoutData);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  return isLoading;
};

const OpenCheckout = () => {
  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', rowGap: 4 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
        Para poder acceder al punto de venta es necesario abrir una caja.
      </Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
        <strong>Nota:</strong>
        <br />
        En caso de rechazar no podrás acceder al punto de venta
      </Typography>
      <Stack spacing={1}>
        <Typography sx={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 600 }}>Dinero inicial en caja</Typography>
        <TextField placeholder="Dinero" inputProps={{ id: 'input1' }} />
      </Stack>
    </Box>
  );
};

const PointOfSaleCheckoutView = () => {
  const isLoading = useGetCheckout();
  if (isLoading) return <Backdrop open={isLoading} />;
  return <PointOfSaleCheckout />;
};

export default PointOfSaleCheckoutView;
