import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Add, CheckCircle, Edit, RestorePage } from '@mui/icons-material';
import { getOrderRequestById } from '../../../../../api/api.routes';
import { IPurchaseOrder, IPurchaseOrderArticle, ISubWarehouse } from '../../../../../types/types';
import { toast } from 'react-toastify';
import { AddArticleExpireDate } from './AddArticleExpireDate';

const style = {
  width: { xs: 380, sm: 750, md: 1000, lg: 1200 },
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  overflowY: 'auto',
};
const styleBar = {
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

interface ArticleSelected {
  id: string;
  nombre: string;
  codigoBarras?: string;
  fechaCaducidad: string | null;
}
interface PurchaseOrder extends IPurchaseOrder {
  notas: string;
  instruccionEntrega: string;
  almacen: ISubWarehouse;
}

interface ArticlesEntryProps {
  orderId: string;
  setOpen: Function;
}

const useGetArticleEntryData = (orderId: string) => {
  const [isLoadingArticleEntryData, setIsLoadingArticleEntryData] = useState(true);
  const [articleEntryData, setArticleEntryData] = useState<PurchaseOrder | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingArticleEntryData(true);
      try {
        const data = await getOrderRequestById(orderId);
        setArticleEntryData(data);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setIsLoadingArticleEntryData(false);
      }
    };
    fetch();
  }, []);
  return { isLoadingArticleEntryData, articleEntryData, error };
};

export const ArticlesEntry = (props: ArticlesEntryProps) => {
  const { isLoadingArticleEntryData, articleEntryData, error } = useGetArticleEntryData(props.orderId);
  const [openModal, setOpenModal] = useState(false);
  const [articleSelected, setArticleSelected] = useState<ArticleSelected>();
  const [articles, setArticles] = useState<IPurchaseOrderArticle[]>();

  useEffect(() => {
    if (!articleEntryData) return;
    setArticles(structuredClone(articleEntryData.ordenCompraArticulo));
  }, [articleEntryData]);

  const missingSomeEntryData = useMemo(() => {
    return articles?.some((article) => {
      if (!article.fechaCaducidad || !article.codigoBarras) return true;
      return false;
    });
  }, [articles]);

  const articleMissingEntryData = useCallback(
    (articleId: string) => {
      const article = articles?.find((a) => a.id_Articulo === articleId);
      if (!article) return true;
      if (
        !article.codigoBarras ||
        article.codigoBarras === '' ||
        !article.fechaCaducidad ||
        article.fechaCaducidad === ''
      )
        return true;
      return false;
    },
    [articles]
  );

  const handleSubmit = () => {
    if (!articleEntryData || !articles) return;
    const articlesEntryObject = {
      idAlmacen: articleEntryData.almacen.id,
      articulos: articles,
      idOrdenCompra: props.orderId,
    };
    console.log({ articlesEntryObject });
  };

  if (isLoadingArticleEntryData && !articles)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  if (error) {
    props.setOpen(false);
    return toast.error('Error al dar entrada de artículos!');
  }
  return (
    <>
      <Box sx={style}>
        <HeaderModal
          setOpen={() => {
            props.setOpen();
          }}
          title="Entrada de artículos"
        />
        <Stack spacing={2} sx={{ bgcolor: 'background.paper', p: 3, overflowY: 'auto', ...styleBar }}>
          <Box sx={{ maxHeight: 450 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Nombre del proveedor:</Typography>
                <Typography variant="body1">{articleEntryData?.proveedor.nombre}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Almacén dirigido:</Typography>
                <Typography variant="body1">{articleEntryData?.almacen.nombre}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Instrucciones de entrega:</Typography>
                <Typography>
                  {articleEntryData?.instruccionEntrega
                    ? articleEntryData?.instruccionEntrega
                    : 'No hay instrucciones de entrega'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Notas:</Typography>
                <Typography>{articleEntryData?.notas ? articleEntryData?.notas : 'No hay notas'}</Typography>
              </Grid>
            </Grid>
            <Card sx={{ mt: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Articulo</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio de compra</TableCell>
                      <TableCell>Precio de venta</TableCell>
                      <TableCell>Factor aplicado</TableCell>
                      <TableCell>Fecha caducidad</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {articles?.map((a) => {
                      return (
                        <TableRow key={a.id_Articulo}>
                          <TableCell>{a.nombre}</TableCell>
                          <TableCell>{a.cantidad}</TableCell>
                          <TableCell>{a.precioProveedor}</TableCell>
                          <TableCell>{a.precioVenta}</TableCell>
                          <TableCell>{a.factorAplicado}</TableCell>
                          <TableCell>{a.fechaCaducidad ? a.fechaCaducidad : 'No tiene aun'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flex: 1 }}>
                              <Tooltip title={articleMissingEntryData(a.id_Articulo) ? 'Entrada' : 'Editar entrada'}>
                                <IconButton
                                  onClick={() => {
                                    setArticleSelected({
                                      id: a.id_Articulo,
                                      nombre: a.nombre,
                                      codigoBarras: a.codigoBarras,
                                      fechaCaducidad: a.fechaCaducidad ? a.fechaCaducidad : null,
                                    });
                                    setOpenModal(true);
                                  }}
                                >
                                  {articleMissingEntryData(a.id_Articulo) ? <Add /> : <Edit />}
                                </IconButton>
                              </Tooltip>
                              {articleMissingEntryData(a.id_Articulo) ? (
                                <Tooltip title="Devolución">
                                  <IconButton onClick={() => {}}>
                                    <RestorePage />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Completado">
                                  <IconButton onClick={() => {}}>
                                    <CheckCircle sx={{ color: 'green' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            bgcolor: 'background.paper',
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 12,
            p: 1,
          }}
        >
          <Button variant="contained" disabled={missingSomeEntryData} onClick={() => handleSubmit()}>
            Siguiente
          </Button>
        </Box>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <>
          <AddArticleExpireDate
            setOpen={setOpenModal}
            articleData={articleSelected as ArticleSelected}
            setArticlesInOrder={setArticles}
            articlesInOrder={articles as IPurchaseOrderArticle[]}
          />
        </>
      </Modal>
    </>
  );
};
