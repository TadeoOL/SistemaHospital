import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { usePurchaseOrderRequestModals } from '../../../../../../store/purchaseStore/purchaseOrderRequestModals';
import { shallow } from 'zustand/shallow';
import { useGetProvider } from '../../../../../../hooks/useGetProvider';
import { KeyboardReturn, Save } from '@mui/icons-material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IRegisterPurchaseOrder } from '../../../../../../types/types';

const styleInput = {
  paddingTop: '0.4rem',
  paddingBottom: '0.4rem',
};

type Articles = {
  id: string;
  cantidadCompra: number;
  precioProveedor: number;
  articulo: { id_Articulo: string; nombre: string };
};

export const FillQuoteInformationModal = () => {
  const {
    step,
    setStep,
    providerSelected,
    dataOrderRequest,
    setRegisterOrderPurchase,
    setProvider,
    precios,
    setPrecios,
  } = usePurchaseOrderRequestModals(
    (state) => ({
      step: state.step,
      setStep: state.setStep,
      providerSelected: state.providerSelected,
      dataOrderRequest: state.dataOrderRequest,
      setRegisterOrderPurchase: state.setRegisterOrderPurchase,
      setProvider: state.setProvider,
      precios: state.precios,
      setPrecios: state.setPrecios,
    }),
    shallow
  );
  const { isLoading, providerData } = useGetProvider(providerSelected);
  const articles: Articles[] | [] = dataOrderRequest
    ? dataOrderRequest.solicitudProveedor[0].solicitudCompraArticulos
    : [];

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const handlePrecioChange = (articleId: string, precio: string) => {
    if (precio.trim() !== '' || precio.trim() !== '0') {
      setPrecios({
        ...precios,
        [articleId]: precio,
      });
      setErrores((prevErrores) => ({
        ...prevErrores,
        [articleId]: '',
      }));
    } else {
      const { [articleId]: _, ...restPrecios } = precios;
      setPrecios(restPrecios);
    }
  };

  const handleSubmit = async () => {
    if (!providerData) return;
    if (!dataOrderRequest) return;
    if (!articles) return;
    if (Object.values(precios).some((p) => parseFloat(p) <= 0))
      return toast.error('Error, no se pueden agregar precios menores a 0');
    const preciosCompletos = Object.keys(precios).length === articles.length;
    if (preciosCompletos) {
      setIsLoadingSubmit(true);
      let object: any[] = [];
      for (let i = 0; i < Object.keys(precios).length; i++) {
        const articleId = Object.keys(precios)[i];
        const articleRes = articles.find((a) => a.articulo.id_Articulo === Object.keys(precios)[i]);
        const value = Object.values(precios)[i];

        object.push({
          id_Articulo: articleId,
          cantidad: articleRes ? articleRes.cantidadCompra : 0,
          precioProveedor: parseFloat(value),
          nombre: articles.find((a) => a.articulo.id_Articulo === articleId)?.articulo.nombre,
        });
      }
      const registerOrderPurchaseObject: IRegisterPurchaseOrder = {
        id_Almacen: dataOrderRequest.almacen?.id ?? '',
        estatus: dataOrderRequest.estatus,
        id_Proveedor: dataOrderRequest.solicitudProveedor[0].proveedor.id_Proveedor,
        ordenCompraArticulo: object,
        cotizacionPDF: null,
        notas: dataOrderRequest.notas ?? '',
        conceptoPago: 1, //TODO: Cambiar a variable
        precioTotalOrden: dataOrderRequest.precioSolicitud,
      };
      setRegisterOrderPurchase(registerOrderPurchaseObject);
      setProvider(providerData);
      setStep(step + 1);
    } else {
      const nuevosErrores: { [key: string]: string } = {};
      articles.forEach((a) => {
        if (!precios[a.articulo.id_Articulo]) {
          nuevosErrores[a.articulo.id_Articulo] = 'Por favor ingresa un precio.';
        }
      });
      setErrores(nuevosErrores);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  if (isLoading)
    return (
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  return (
    <Stack spacing={2} sx={{ mt: 4 }}>
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
      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Productos solicitados</Typography>
      <Box sx={{ borderRadius: 2, boxShadow: 4, overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 400 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.length > 0 &&
                articles.map((a) => (
                  <TableRow key={a.articulo.id_Articulo}>
                    <TableCell>{a.articulo.nombre}</TableCell>
                    <TableCell>{a.cantidadCompra}</TableCell>
                    <TableCell>
                      <TextField
                        placeholder="Precio"
                        size="small"
                        inputProps={{
                          style: {
                            ...styleInput,
                          },
                        }}
                        onChange={(e) => handlePrecioChange(a.articulo.id_Articulo, e.target.value)}
                        error={errores[a.articulo.id_Articulo] ? true : false}
                        helperText={errores[a.articulo.id_Articulo]}
                        value={precios[a.articulo.id_Articulo] || ''}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          <Button startIcon={<KeyboardReturn />} variant="contained" onClick={() => handlePrevStep()}>
            Regresar
          </Button>
          <Button
            startIcon={<Save />}
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? <CircularProgress size={14} /> : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
