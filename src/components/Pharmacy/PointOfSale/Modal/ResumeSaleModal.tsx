import {
  Box,
  Button,
  Card,
  Divider,
  //Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IArticlePOS } from '../../../../types/types';
import { usePosOrderArticlesStore } from '../../../../store/pharmacy/pointOfSale/posOrderArticles';
//import { CreditCard, Payments, SwapHoriz } from '@mui/icons-material';
//import AnimateButton from '../../../@extended/AnimateButton';
//import { neutral, primary } from '../../../../theme/colors';
import { neutral } from '../../../../theme/colors';
import { usePosArticlesPaginationStore } from '../../../../store/pharmacy/pointOfSale/posArticlesPagination';
import { toast } from 'react-toastify';
import { registerSale } from '../../../../services/pharmacy/pointOfSaleService';
import { useEffect, useRef, useState } from 'react';

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
/*
const paymentMethods = [
  { id: '1', method: 'Efectivo', value: 1 },
  { id: '2', method: 'Débito', value: 2 },
  { id: '3', method: 'Crédito', value: 3 },
  { id: '4', method: 'Transferencia', value: 4 },
];
const iconPaymentMethod = (value: number, isSelected: boolean) => {
  const colorIcon = isSelected ? 'white' : null;
  switch (value) {
    case 1:
      return <Payments sx={{ color: colorIcon }} />;
    case 2:
      return <CreditCard sx={{ color: colorIcon }} />;
    case 3:
      return <CreditCard sx={{ color: colorIcon }} />;
    case 4:
      return <SwapHoriz sx={{ color: colorIcon }} />;
  }
};*/
interface ResumeSaleModalProps {
  setOpen: Function;
}
export const ResumeSaleModal = (props: ResumeSaleModalProps) => {
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  const setPaymentMethod = usePosOrderArticlesStore((state) => state.setPaymentMethod);
  const refetch = usePosArticlesPaginationStore((state) => state.fetchData);
  const clearData = usePosOrderArticlesStore((state) => state.clearData);
  const total = usePosOrderArticlesStore((state) => state.total);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const subTotal = usePosOrderArticlesStore((state) => state.subTotal);
  const iva = usePosOrderArticlesStore((state) => state.iva);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Crear una nueva conexión WebSocket
    ws.current = new WebSocket('ws://localhost:2001');

    // Definir el evento de apertura de la conexión
    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    // Definir el evento de cierre de la conexión
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    // if (!amountRef.current || amountRef.current.value === '') return toast.error('Ingresa el monto pagado!');
    // if (!isValidFloat(amountRef.current.value)) return toast.error('Ingresa una cantidad de monto valida!');
    let articlesFormatted: any = [];
    console.log({ articlesOnBasket });
    articlesOnBasket.forEach((article) => {
      articlesFormatted.push({
        id_Articulo: article.id_Articulo,
        cantidad: article.cantidad,
      });
    });
    /*((article) => {
      article?.lote?.map((articleNested) => {
        return {
          id: articleNested.id_ArticuloExistente,
          cantidad: articleNested.cantidad,
          precioUnitario: article.precioVenta,
        };
      });
    });*/
    const saleObject = {
      articulos: articlesFormatted,
    };

    try {
      const response = await registerSale(saleObject);
      console.log('response:', response);
      const objWS = {
        Folio: response.folio,
        SubTotal: subTotal,
        IVA: iva,
        TotalVenta: total,
        UsuarioVenta: response.usuarioVenta,
        Articulos: response.articulos?.map((artF: any) => ({
          Nombre: articlesOnBasket.find((aob) => aob.id_Articulo === artF.id_Articulo)?.nombre,
          Precio: artF.precioUnitario,
          Cantidad: artF.cantidad,
        })),
      };
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(objWS));
        toast.success('Ticket generado con éxito!');
        clearData();
      } /* else {
        toast.error('Error al conectar con el WebSocket!');
      }*/
      props.setOpen(false);
      toast.success('Compra realizada con éxito!');
    } catch (error) {
      console.log(error);
      toast.error('Error al realizar la compra!');
    } finally {
      refetch();
      clearData();
      setLoadingSubmit(false);
    }
  };

  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Resumen de la venta" />
      <Stack sx={{ bgcolor: 'background.paper', overflowY: 'auto', ...scrollBarStyle }}>
        <Stack sx={{ maxHeight: 700, px: 6, py: 3 }}>
          {/* <Stack sx={{ mb: 2 }}>
            <Typography variant="h5">Ingresa el monto pagado:</Typography>
            <TextField inputRef={amountRef} placeholder="Monto pagado..." sx={{ maxWidth: 200 }} />
          </Stack> */}
          {
            //<PaymentMethods />
          }
          <TableResume />
          <AmountResume />
        </Stack>
      </Stack>
      <Box sx={{ p: 2, display: 'flex', flex: 1, justifyContent: 'space-between', bgcolor: 'background.paper' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setPaymentMethod(0);
            props.setOpen(false);
          }}
        >
          Cancelar
        </Button>
        <Button variant="contained" disabled={loadingSubmit} onClick={() => handleSubmit()}>
          Aceptar
        </Button>
      </Box>
    </Box>
  );
};

const TableResume = () => {
  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>Artículos seleccionados</Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHeaderResume />
            <TableBodyResume />
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

const TableHeaderResume = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Nombre</TableCell>
        <TableCell>Código de barras</TableCell>
        <TableCell>Cantidad</TableCell>
        <TableCell>Precio unitario</TableCell>
        <TableCell>IVA</TableCell>
        <TableCell>Precio total articulo</TableCell>
      </TableRow>
    </TableHead>
  );
};

const TableBodyResume = () => {
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  return (
    <TableBody>
      {articlesOnBasket.map((article) => (
        <TableRowArticleResume article={article} key={article.id_Articulo} />
      ))}
    </TableBody>
  );
};
interface TableRowArticleResumeProps {
  article: IArticlePOS;
}
const TableRowArticleResume = (props: TableRowArticleResumeProps) => {
  const { article } = props;
  const totalPriceArticle = (
    (article.cantidad || 0) *
    (article.iva
      ? Number(article.precioVenta) + Number(article.precioVenta) * (article.iva * 0.01)
      : Number(article.precioVenta))
  ).toFixed(2);
  return (
    <TableRow>
      <TableCell>{article.nombre}</TableCell>
      <TableCell>{article.codigoBarras}</TableCell>
      <TableCell>{article.cantidad}</TableCell>
      <TableCell>{article.precioVenta}</TableCell>
      <TableCell>{article.iva ? (Number(totalPriceArticle) * 0.16).toFixed(2) : 0}</TableCell>
      <TableCell>{totalPriceArticle}</TableCell>
    </TableRow>
  );
};
/*
const PaymentMethods = () => {
  const paymentMethodSelected = usePosOrderArticlesStore((state) => state.paymentMethod);
  const setPaymentMethod = usePosOrderArticlesStore((state) => state.setPaymentMethod);

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>Selecciona un método de pago:</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {paymentMethods.map((paymentMethod) => {
          const isSelected = paymentMethodSelected === paymentMethod.value;
          return (
            <Grid item xs={6} lg={2} key={paymentMethod.id}>
              <Box
                sx={{
                  bgcolor: isSelected ? primary.main : null,
                  '&:hover': {
                    cursor: 'pointer',
                    transform: 'scale(1.04)',
                    transition: ' 0.3s ease-in-out',
                    backgroundColor: isSelected ? alpha(primary.main, 0.9) : neutral[50],
                  },
                  borderRadius: 10,
                }}
                onClick={() => setPaymentMethod(paymentMethod.value)}
              >
                <AnimateButton>
                  <Stack sx={{ display: 'flex', flex: 1, p: 1, alignItems: 'center' }}>
                    <Typography sx={{ color: isSelected ? 'white' : null }}>{paymentMethod.method}</Typography>
                    {iconPaymentMethod(paymentMethod.value, isSelected)}
                  </Stack>
                </AnimateButton>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};*/

const AmountResume = () => {
  const subTotal = usePosOrderArticlesStore((state) => state.subTotal);
  const iva = usePosOrderArticlesStore((state) => state.iva);
  const total = usePosOrderArticlesStore((state) => state.total);
  return (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', mt: 2 }}>
      <Stack sx={{ display: 'flex', width: '50%', bgcolor: alpha(neutral[50], 0.3), borderRadius: 4, p: 3 }}>
        <Stack sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, md: 15 } }}>Sub Total:</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 13 }}>${subTotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, md: 15 } }}>IVA:</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 13 }}>${iva.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ mt: 1 }} />
        </Stack>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, md: 15 } }}>Total:</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 13 }}>${total.toFixed(2)}</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
