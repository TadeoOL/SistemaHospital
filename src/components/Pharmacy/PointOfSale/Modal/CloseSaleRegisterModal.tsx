import { Backdrop, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useEffect } from 'react';
import { SellsTable } from '../ArticlesSoldHistory';
import { useGetSellsHistory } from '../../../../hooks/useGetSellsHistory';
import { usePosSellsHistoryDataStore } from '../../../../store/pharmacy/pointOfSale/posSellsHistoryData';
import { toast } from 'react-toastify';
import { usePosOrderArticlesStore } from '../../../../store/pharmacy/pointOfSale/posOrderArticles';
import { closeCheckout } from '../../../../services/pharmacy/pointOfSaleService';

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

interface CloseSaleRegisterModalProps {
  setOpen: Function;
}

export const CloseSaleRegisterModal = (props: CloseSaleRegisterModalProps) => {
  const clearData = usePosSellsHistoryDataStore((state) => state.clearData);
  const checkoutId = usePosOrderArticlesStore((state) => state.userSalesRegisterData).id;
  const sellsStates = [2];
  const { isLoading, sellsHistory } = useGetSellsHistory(sellsStates);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, []);

  const handleCloseCheckout = async () => {
    try {
      await closeCheckout(checkoutId);
      window.location.reload();
    } catch (error) {
      console.log('error');
      toast.error('Error al cerrar la caja!');
    }
  };

  if (isLoading && sellsHistory.length === 0)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal title="Cierre de caja" setOpen={props.setOpen} />
      <Stack sx={{ bgcolor: 'background.paper', p: 4 }}>
        <Typography variant="h4">Resumen de articulos vendidos</Typography>
        <SellsTable sells={sellsHistory} />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          px: 4,
          py: 2,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={() => handleCloseCheckout()}>
          Aceptar y cerrar caja
        </Button>
      </Box>
    </Box>
  );
};
