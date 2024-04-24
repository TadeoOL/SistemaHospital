import { Box, Button, Divider, Modal, Stack, Typography, alpha } from '@mui/material';
import { ResumeSaleModal } from './Modal/ResumeSaleModal';
import { usePosOrderArticlesStore } from '../../../store/pharmacy/pointOfSale/posOrderArticles';
import { useEffect, useState, useCallback } from 'react';
import { primary } from '../../../theme/colors';
import { toast } from 'react-toastify';

export const ResumeSale = () => {
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  const setPaymentMethod = usePosOrderArticlesStore((state) => state.setPaymentMethod);
  const setSubTotal = usePosOrderArticlesStore((state) => state.setSubTotal);
  const setIva = usePosOrderArticlesStore((state) => state.setIva);
  const setTotal = usePosOrderArticlesStore((state) => state.setTotal);
  const [open, setOpen] = useState(false);
  const { subTotal, iva } = articlesOnBasket.reduce(
    (acc, article) => {
      const precioConIva = article.iva > 0 ? article.iva * 0.01 * article.precio : article.precio;
      const precioTotal = article.cantidad * precioConIva;
      const ivaArticulo = article.iva > 0 ? precioTotal - article.cantidad * article.precio : 0;

      return {
        subTotal: acc.subTotal + precioTotal,
        iva: acc.iva + ivaArticulo,
      };
    },
    { subTotal: 0, iva: 0 }
  );
  const total = subTotal + iva;

  const handleOpen = useCallback(() => {
    if (articlesOnBasket.length === 0) return toast.warning('No hay artículos en la canasta');
    return setOpen(true);
  }, [articlesOnBasket]);

  useEffect(() => {
    setSubTotal(subTotal);
    setIva(iva);
    setTotal(total);
  }, [subTotal, iva, total]);

  return (
    <>
      <Stack
        sx={{
          marginTop: 'auto',
          display: 'flex',
          flex: 1,
          p: 2,
          bgcolor: alpha(primary.main, 0.7),
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Sub Total</Typography>
          <Typography sx={{ color: 'white' }}>${subTotal}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 600 }}>IVA</Typography>
          <Typography sx={{ color: 'white' }}>${iva}</Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Total</Typography>
          <Typography sx={{ color: 'white' }}>${total}</Typography>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flex: 1 }}>
          <Button
            variant="contained"
            sx={{ color: 'white', bgcolor: primary.main }}
            fullWidth
            onClick={() => handleOpen()}
          >
            Realizar compra
          </Button>
        </Box>
      </Stack>
      <Modal
        open={open}
        onClose={() => {
          setPaymentMethod(0);
          setOpen(false);
        }}
      >
        <>
          <ResumeSaleModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
