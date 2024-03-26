import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { usePurchaseOrderRequestModals } from '../../../../../../store/purchaseStore/purchaseOrderRequestModals';
import { IProvider, IRegisterOrderPurchase } from '../../../../../../types/types';
import { KeyboardReturn, Save } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { addPurchaseOrder } from '../../../../../../api/api.routes';
import { usePurchaseOrderRequestPagination } from '../../../../../../store/purchaseStore/purchaseOrderRequestPagination';
import { toast } from 'react-toastify';

const useGetSummary = () => {
  const { registerOrderPurchase, provider, step, setStep } = usePurchaseOrderRequestModals((state) => ({
    registerOrderPurchase: state.registerOrderPurchase,
    provider: state.provider,
    step: state.step,
    setStep: state.setStep,
  }));
  return {
    registerOrderPurchase: registerOrderPurchase as IRegisterOrderPurchase,
    providerData: provider as IProvider,
    step,
    setStep,
  };
};

interface OrderSummaryModalProps {
  setOpen: Function;
}

export const OrderSummaryModal = (props: OrderSummaryModalProps) => {
  4;
  const { setOpen } = props;
  const { providerData, registerOrderPurchase, step, setStep } = useGetSummary();
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmountOrder, setTotalAmountOrder] = useState(0);

  useMemo(() => {
    const orders = registerOrderPurchase.OrdenCompra.flatMap((o) => o.OrdenCompraArticulo).map((art) => art);
    let totalAmount = 0;
    for (const articles of orders) {
      if (!articles.precioProveedor) return;
      totalAmount = totalAmount + articles.Cantidad * articles.precioProveedor;
    }
    setTotalAmountOrder(totalAmount);
  }, [registerOrderPurchase]);

  const handleSubmit = async () => {
    try {
      await addPurchaseOrder(registerOrderPurchase);
      toast.success('Orden de compra creada con éxito!');
      usePurchaseOrderRequestPagination.getState().fetch();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al crear la orden de compra!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography>Resumen del pedido</Typography>
      <Grid container>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Información del proveedor</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Compañía: {providerData?.nombreCompania}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Nombre contacto: {providerData?.nombreContacto}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Dirección: {providerData?.direccion}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Teléfono: {providerData?.telefono}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Correo electrónico: {providerData?.correoElectronico}</Typography>
        </Grid>
      </Grid>
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
              {registerOrderPurchase.OrdenCompra.flatMap((i) =>
                i.OrdenCompraArticulo.map((order) => (
                  <TableRow key={order.Id_Articulo}>
                    <TableCell>{order.nombre}</TableCell>
                    <TableCell>{order.Cantidad}</TableCell>
                    <TableCell>{order.precioProveedor}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          columnGap: 1,
        }}
      >
        <Typography variant="subtitle1">Precio total de solicitud:</Typography>
        <Typography variant="body1">${totalAmountOrder}</Typography>
      </Box>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          padding: '10px',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            startIcon={<KeyboardReturn />}
            variant="contained"
            onClick={() => {
              setStep(step - 1);
            }}
          >
            Regresar
          </Button>
          <Button
            startIcon={<Save />}
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
          >
            {isLoading ? <CircularProgress size={14} /> : 'Generar'}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
