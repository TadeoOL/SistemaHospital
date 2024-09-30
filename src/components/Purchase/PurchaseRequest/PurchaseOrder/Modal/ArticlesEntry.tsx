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
import { Add, CheckCircle, DeleteSweep, Edit, RestorePage } from '@mui/icons-material';
import { addArticlesToWarehouse, getOrderRequestById } from '../../../../../api/api.routes';
import { IPurchaseOrder, IPurchaseOrderArticle, ISubWarehouse } from '../../../../../types/types';
import { toast } from 'react-toastify';
import { AddArticleExpireDate } from './AddArticleExpireDate';
import { usePurchaseOrderPagination } from '../../../../../store/purchaseStore/purchaseOrderPagination';
import { ReturnArticle } from './ReturnArticle';

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
  cantidad?: string;
  unidadesTotal: number;
}
interface PurchaseOrder extends IPurchaseOrder {
  notas: string;
  instruccionEntrega: string;
  almacen: ISubWarehouse;
}
type ArticlesToBox = {
  id: string;
  amount: string;
  unidadesTotal: number;
};
interface ArticlesEntryProps {
  orderId: string;
  setOpen: Function;
}

type ReturnArticle = {
  Id_OrdenCompraArticulo: string;
  Motivo: string;
  CantidadDevuelta: string;
};

const useGetArticleEntryData = (orderId: string) => {
  const [isLoadingArticleEntryData, setIsLoadingArticleEntryData] = useState(true);
  const [articleEntryData, setArticleEntryData] = useState<PurchaseOrder | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingArticleEntryData(true);
      try {
        const data = await getOrderRequestById(orderId);
        data.ordenCompraArticulo = data.ordenCompraArticulo.map((art: any) => {
          art.unidadesTotal = art.cantidad * (art?.unidadesPorCaja || 1);
          return art;
        });
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
  const [articles, setArticles] = useState<IPurchaseOrderArticle[]>([]);
  const [openReturnArticle, setOpenReturnArticle] = useState(false);
  const [returnArticlesArray, setReturnArticlesArray] = useState<ReturnArticle[]>([]);
  const [articlesToBox, setArticlesToBox] = useState<ArticlesToBox[]>([]);

  useEffect(() => {
    if (!articleEntryData) return;
    setArticles(structuredClone(articleEntryData.ordenCompraArticulo));
  }, [articleEntryData]);

  const missingSomeEntryData = useMemo(() => {
    return articles?.some((article) => {
      if ((!article.fechaCaducidad || !article.codigoBarras) && article.cantidad !== 0) return true;
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

  const handleSubmit = async () => {
    if (!articleEntryData || !articles) return;

    const articlesFormatted = articles
      .map((article) => {
        return {
          id_articulo: article.id_Articulo,
          cantidad: article?.unidadesTotal || article.cantidad,
          codigoBarras: article.codigoBarras as string,
          fechaCaducidad: article.fechaCaducidad as string,
        };
      })
      .filter((a) => a.cantidad !== 0);
    const articlesEntryObject = {
      id_almacen: articleEntryData.id_Almacen,
      articulos: articlesFormatted,
      id_ordenCompra: props.orderId,
      devolucionCompras: returnArticlesArray,
    };
    try {
      await addArticlesToWarehouse(articlesEntryObject);
      toast.success('Artículos agregados correctamente!');
      usePurchaseOrderPagination.getState().fetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar los artículos!');
    }
  };

  function hasExpireDate(date: string) {
    return date === '4000-01-01' ? 'Sin vencimiento' : date;
  }

  function findReturnArticlesArray(articleId: string) {
    return returnArticlesArray.find((a) => a.Id_OrdenCompraArticulo === articleId);
  }

  // function isInArticlesToBox(articleId: string) {
  //   return articlesToBox.some((a) => a.id === articleId);
  // }

  function findArticleInArticleToBox(articleId: string) {
    return articlesToBox.find((a) => a.id === articleId);
  }

  function findOriginalArticle(articleId: string) {
    if (!articleEntryData) return;
    const article = articleEntryData.ordenCompraArticulo.find((a) => a.id_Articulo === articleId);
    return article as IPurchaseOrderArticle;
  }

  function handleDeleteArticleFromReturnArray(orderArticleId: string, articleId: string) {
    const articleInBox = articlesToBox.find((a) => a.id === articleId);
    const originalArticle = articleEntryData?.ordenCompraArticulo.find(
      (a) => a.id_OrdenCompraArticulo === orderArticleId
    );
    const findIndex = articles.findIndex((a) => a.id_OrdenCompraArticulo === orderArticleId);
    if (findIndex !== -1 && originalArticle) {
      const updatedArrayArticles = [...articles];
      updatedArrayArticles[findIndex].cantidad = articleInBox
        ? parseInt(articleInBox.amount) * originalArticle.cantidad
        : originalArticle.cantidad;
      setArticles(updatedArrayArticles);
    }
    return setReturnArticlesArray(returnArticlesArray.filter((a) => a.Id_OrdenCompraArticulo !== orderArticleId));
  }

  function dataCompleted(article: IPurchaseOrderArticle) {
    if (article.codigoBarras && article.fechaCaducidad) return true;
    return false;
  }

  console.log({ articleEntryData });

  if (isLoadingArticleEntryData)
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
        <HeaderModal setOpen={props.setOpen} title="Entrada de artículos" />
        <Stack spacing={2} sx={{ bgcolor: 'background.paper', p: 3, overflowY: 'auto', ...styleBar }}>
          <Box sx={{ maxHeight: 450 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Nombre del proveedor:</Typography>
                {/* <Typography variant="body1">{articleEntryData?.proveedor.nombre}</Typography> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Almacén dirigido:</Typography>
                {/* <Typography variant="body1">{articleEntryData?.almacen.nombre}</Typography> */}
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
                      <TableCell>Presentación/Unidad</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Cantidad Total</TableCell>
                      <TableCell>Precio de Compra</TableCell>
                      <TableCell>Precio de Venta</TableCell>
                      <TableCell>Factor Aplicado</TableCell>
                      <TableCell>Fecha Caducidad</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {articles?.map((a) => {
                      return (
                        <TableRow key={a.id_Articulo}>
                          <TableCell>{a.nombre}</TableCell>
                          <TableCell align={'center'}>{a.unidadesPorCaja}</TableCell>
                          <TableCell>{a.cantidad}</TableCell>
                          <TableCell>
                            {findReturnArticlesArray(a.id_OrdenCompraArticulo) ? (
                              <Box sx={{ display: 'flex', flex: 1, columnGap: 1 }}>
                                <Typography className="textoTachado">
                                  {!findArticleInArticleToBox(a.id_Articulo)
                                    ? (a?.unidadesTotal || a.cantidad) -
                                      (findOriginalArticle(a.id_Articulo)?.unidadesTotal as number)
                                    : findOriginalArticle(a.id_Articulo)?.unidadesTotal}
                                </Typography>
                                <Typography>{a.unidadesTotal}</Typography>
                              </Box>
                            ) : (
                              a.unidadesTotal
                            )}
                          </TableCell>
                          <TableCell>{a.precioProveedor}</TableCell>
                          <TableCell>{a.precioVenta}</TableCell>
                          <TableCell>{a.fechaCaducidad ? hasExpireDate(a.fechaCaducidad) : 'No tiene aun'}</TableCell>
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
                                      unidadesTotal: a.unidadesTotal || a.cantidad,
                                    });
                                    setOpenModal(true);
                                  }}
                                >
                                  {articleMissingEntryData(a.id_Articulo) ? <Add /> : <Edit />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Devolución">
                                <IconButton
                                  onClick={() => {
                                    const originalArticle = articleEntryData?.ordenCompraArticulo.find(
                                      (art) => art.id_Articulo === a.id_Articulo
                                    );
                                    setArticleSelected({
                                      id: originalArticle?.id_OrdenCompraArticulo,
                                      nombre: originalArticle?.nombre,
                                      codigoBarras: originalArticle?.codigoBarras,
                                      fechaCaducidad: originalArticle?.fechaCaducidad,
                                      cantidad: (
                                        (originalArticle?.cantidad || 1) * (originalArticle?.unidadesPorCaja || 1)
                                      ).toString(),
                                    } as ArticleSelected);
                                    setOpenReturnArticle(true);
                                  }}
                                >
                                  <RestorePage />
                                </IconButton>
                              </Tooltip>
                              {dataCompleted(a) && (
                                <Tooltip title="Completado">
                                  <IconButton onClick={() => {}}>
                                    <CheckCircle sx={{ color: 'green' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {findReturnArticlesArray(a.id_OrdenCompraArticulo) && (
                                <Tooltip title="Eliminar devolución">
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteArticleFromReturnArray(a.id_OrdenCompraArticulo, a.id_Articulo);
                                    }}
                                  >
                                    <DeleteSweep sx={{ color: 'red' }} />
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
            Aceptar
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
            articlesToBox={articlesToBox}
            setArticlesToBox={setArticlesToBox}
            originalArticles={articleEntryData?.ordenCompraArticulo as IPurchaseOrderArticle[]}
            returnArticlesArray={returnArticlesArray}
            setReturnArticlesArray={setReturnArticlesArray}
          />
        </>
      </Modal>
      <Modal open={openReturnArticle} onClose={() => setOpenReturnArticle(false)}>
        <>
          <ReturnArticle
            setOpen={setOpenReturnArticle}
            article={articleSelected as ArticleSelected}
            returnArticlesArray={returnArticlesArray}
            setReturnArticlesArray={setReturnArticlesArray}
            articles={articles}
            setArticles={setArticles}
            articlesToBox={articlesToBox}
            originalArticlesArray={articleEntryData?.ordenCompraArticulo as IPurchaseOrderArticle[]}
          />
        </>
      </Modal>
    </>
  );
};
