import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  MenuItem,
  Chip,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useDirectlyPurchaseRequestOrderStore as useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';
import { Cancel, Delete, Edit, Info, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useGetArticlesBySearch } from '../../../../hooks/useGetArticlesBySearch';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-toastify';
import { isValidFloat, isValidInteger } from '../../../../utils/functions/dataUtils';
import { getPurchaseConfig, modifyOrderPurcharse } from '../../../../api/api.routes';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AnimateButton from '../../../@extended/AnimateButton';
import { IProvider } from '../../../../types/types';
import { useGetAllProviders } from '../../../../hooks/useGetAllProviders';
import { Note } from './Note';

type Article = {
  id: string;
  nombre: string;
  precio: number;
};
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
  maxHeight: { xs: 600 },
};

const OPTIONS_LIMIT = 30;
const filterArticleOptions = createFilterOptions<Article>({
  limit: OPTIONS_LIMIT,
});
const filterProviderOptions = createFilterOptions<IProvider>({
  limit: OPTIONS_LIMIT,
});

export const UpdateDirectlyPurchaseOrder = (props: {
  setOpen: Function;
  initialProvidersFromOrder: string[];
  initialArticles: {
    id: string;
    name: string;
    amount: number;
    price?: number;
    stock?: number;
  }[];
  purcharseOrderWarehouseId: string;
  purcharseOrderId: string;
  clearData: Function;
}) => {
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const { setProvider } = useDirectlyPurchaseRequestOrderStore((state) => ({
    setProvider: state.setProvider,
  }));
  const setArticles = useDirectlyPurchaseRequestOrderStore((state) => state.setArticles);
  const articles = useDirectlyPurchaseRequestOrderStore((state) => state.articles);
  const setArticlesFetched = useDirectlyPurchaseRequestOrderStore((state) => state.setArticlesFetched);
  const articlesFetched = useDirectlyPurchaseRequestOrderStore((state) => state.articlesFetched);
  const setSearch = useDirectlyPurchaseRequestOrderStore((state) => state.setSearch);
  const [articleSelected, setArticleSelected] = useState<Article | null>(null);
  const [amountText, setAmountText] = useState('');
  const [articleError, setArticleError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const { providers } = useGetAllProviders();
  const { articlesRes, isLoadingArticles } = useGetArticlesBySearch(props.purcharseOrderWarehouseId);

  useEffect(() => {
    setArticles(props.initialArticles);
  }, []);

  useEffect(() => {
    setArticlesFetched(
      articlesRes.filter((a) => {
        return !articles.some((ar) => ar.id === a.id);
      })
    );
  }, [articlesRes]);

  useEffect(() => {
    const prov = providers.filter((p) => props.initialProvidersFromOrder.includes(p.id));
    setProvider(prov);
  }, []);

  const handleAddArticles = () => {
    if (!articleSelected) {
      setArticleError(true);
      return toast.warning('Selecciona un articulo!');
    }
    if (amountText.trim() === '') {
      setAmountError(true);
      return toast.warning('Agrega una cantidad!');
    }
    const objectArticle = {
      id: articleSelected.id,
      name: articleSelected.nombre,
      amount: parseFloat(amountText),
      price: articleSelected.precio,
    };
    const objectFiltered = articlesFetched.filter((a) => a.id !== objectArticle.id);
    setArticlesFetched(objectFiltered);
    setArticles([...articles, objectArticle]);
    setArticleSelected(null);
    setAmountText('');
  };

  if (isLoadingAlmacenes)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Editar Solicitud de Compra" />
      <Stack sx={{ p: 4, bgcolor: 'white', overflowY: 'auto' }}>
        <Stack sx={{ display: 'flex', flex: 1, mt: 2 }}>
          <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
              <b> Almacen : </b>
              {
                almacenes.find((wh) => {
                  return wh.id === props.purcharseOrderWarehouseId;
                })?.nombre
              }
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              columnGap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              rowGap: { xs: 2, sm: 0 },
            }}
          >
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar articulo</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterArticleOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setArticleSelected(val);
                  setArticleError(false);
                }}
                loading={isLoadingArticles && articlesFetched.length === 0}
                getOptionLabel={(option) => option.nombre}
                options={articlesFetched as Article[]}
                value={articleSelected}
                noOptionsText="No se encontraron artículos"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={articleError}
                    helperText={articleError && 'Selecciona un articulo'}
                    placeholder="Artículos"
                    sx={{ width: '50%' }}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                )}
              />
            </Stack>
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Ingresar cantidad</Typography>
              <TextField
                sx={{ width: '60%' }}
                size="small"
                fullWidth
                placeholder="Cantidad"
                value={amountText}
                error={amountError}
                helperText={amountError && 'Agrega una cantidad'}
                onChange={(e) => {
                  if (!isValidInteger(e.target.value)) return;
                  setAmountText(e.target.value);
                  setAmountError(false);
                }}
              />
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <AnimateButton>
              <Button
                size="medium"
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => handleAddArticles()}
              >
                Agregar
              </Button>
            </AnimateButton>
          </Box>
          <ArticlesTable
            clearData={props.clearData}
            setOpen={props.setOpen}
            purcharseOrderId={props.purcharseOrderId}
            initialProvidersFromOrder={props.initialProvidersFromOrder}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

const ArticlesTable = (props: {
  clearData: Function;
  setOpen: Function;
  initialProvidersFromOrder: string[];
  purcharseOrderId: string;
}) => {
  const {
    articles,
    articlesFetched,
    setArticlesFetched,
    setArticles,
    step,
    provider,
    note,
    setTotalAmountRequest,
    setProvider,
    setPaymentMethod,
    paymentMethod,
    setNote,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      articles: state.articles,
      articlesFetched: state.articlesFetched,
      setArticlesFetched: state.setArticlesFetched,
      setArticles: state.setArticles,
      step: state.step,
      setStep: state.setStep,
      setIsManyProviders: state.setIsManyProviders,
      setIsDirectlyPurchase: state.setIsDirectlyPurchase,
      setTotalAmountRequest: state.setTotalAmountRequest,
      setProvider: state.setProvider as any,
      provider: state.provider,
      setPaymentMethod: state.setPaymentMethod,
      paymentMethod: state.paymentMethod,
      note: state.note,
      setNote: state.setNote,
    }),
    shallow
  );
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<any>({});
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [priceErrors, setPriceErrors] = useState<string[]>([]);
  const [isChargingPrices, setIsChargingPrices] = useState(true);
  const [providerError, setProviderError] = useState(false);

  console.log({ provider });

  const updateArticlesData = () => {
    const newPrices: any = {};
    const newQuantity: any = {};
    articles.forEach((article) => {
      newPrices[article.id] = (article.price as number).toString();
      newQuantity[article.id] = article.amount.toString();
    });
    setQuantity(newQuantity);
    setPrices(newPrices);
    setIsChargingPrices(false);
  };

  useEffect(() => {
    updateArticlesData();
  }, [step, articles]);

  useEffect(() => {
    articles.forEach((article) => {
      const articleHasPrice = Object.keys(prices).some((p) => p === article.id);

      if (articleHasPrice) {
        const articleId = article.id;
        const priceValue = prices[articleId];

        if (priceValue.trim() !== '' && parseFloat(priceValue) > 0) {
          setPriceErrors((prev) => prev.filter((id) => id !== article.id));
        } else {
          if (!priceErrors.includes(article.id)) {
            setPriceErrors((prev) => [...prev, article.id]);
          }
        }
      } else {
        if (!priceErrors.includes(article.id)) {
          setPriceErrors((prev) => [...prev, article.id]);
        }
      }
    });
  }, [articles, prices]);

  function totalValue() {
    const totalPrice = articles.reduce((total: any, item: any) => {
      const quantityValue = parseFloat(quantity[item.id]) || item.amount;
      const priceValue = parseFloat(prices[item.id]) || item.price;
      const totalPriceObject = quantityValue * priceValue;
      return total + totalPriceObject;
    }, 0);
    return totalPrice;
  }

  const toggleEdit = (id: string) => {
    const newEditingIds = new Set(editingIds);
    if (newEditingIds.has(id)) {
      newEditingIds.delete(id);
    } else {
      newEditingIds.add(id);
    }
    setEditingIds(newEditingIds);
  };

  const handleDeleteArticle = (id: string) => {
    const articlesFiltered = articles.filter((a) => a.id !== id);
    const articleToAdd = articles.find((a) => a.id === id);
    const articleToAddModified = articleToAdd
      ? {
          id: articleToAdd.id,
          nombre: articleToAdd.name,
          precio: articleToAdd.price,
        }
      : null;
    if (articleToAddModified) {
      setArticlesFetched([...articlesFetched, articleToAddModified]);
    }
    setArticles(articlesFiltered);
  };

  const handleSaveQuantity = (id: string, newQuantity: string, newPrice: string) => {
    if (!newQuantity || parseFloat(newQuantity) <= 0) return;
    const updatedArticles = articles.map((article) => {
      if (article.id === id) {
        return {
          ...article,
          amount: parseFloat(newQuantity),
          price: parseFloat(newPrice),
        };
      }
      return article;
    });
    setArticles(updatedArticles);
  };

  const handlePriceChange = (id: string, value: string) => {
    if (!isValidFloat(value)) return;
    if (parseFloat(value) <= 0 || !value) {
      setPrices({ ...prices, [id]: value });
      return setPriceErrors((prev) => [...prev, id]);
    }
    if (priceErrors.some((p) => p === id)) setPriceErrors(priceErrors.filter((p) => p !== id));
    setPrices({ ...prices, [id]: value });
  };

  const handleNextStep = async () => {
    if (providerError) {
      return toast.error('Selecciona un proveedor!');
    }
    const totalPrice = totalValue();
    const articleData = articles.map((article) => ({
      id: article.id,
      name: article.name,
      amount: article.amount,
      price: parseFloat(prices[article.id]) || article.price,
    }));
    setArticles(articleData);
    setTotalAmountRequest(totalPrice);
    try {
      const { cantidadOrdenDirecta } = await getPurchaseConfig();
      if (totalPrice > cantidadOrdenDirecta) {
        return toast.error(`El total de la orden no debe superar los ${cantidadOrdenDirecta}`);
      }
      const object = {
        Id_OrdenCompra: props.purcharseOrderId,
        Id_Proveedor: (provider as IProvider[]).at(0)?.id as string,
        conceptoPago: paymentMethod,
        notas: note,
        PrecioTotalOrden: totalPrice,
        OrdenCompraArticulo: articles.map((a) => {
          return {
            id_Articulo: a.id,
            cantidad: a.amount,
            precioProveedor: a.price as number,
          };
        }),
      };
      await modifyOrderPurcharse(object);
      toast.success('Orden de compra exitosa!');
      props.clearData();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al editar la compra');
    }
  };
  const { providers, isLoadingProviders } = useGetAllProviders();
  if (isChargingPrices)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Card sx={{ mt: 4, overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 380 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre Articulo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .slice()
                .reverse()
                .map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>
                      {editingIds.has(a.id) ? (
                        <TextField
                          label="Cantidad"
                          size="small"
                          InputLabelProps={{ style: { fontSize: 12 } }}
                          value={quantity[a.id] || ''}
                          onChange={(e) => {
                            if (!isValidInteger(e.target.value)) return;
                            setQuantity({
                              ...quantity,
                              [a.id]: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        a.amount
                      )}
                    </TableCell>
                    <TableCell>
                      {editingIds.has(a.id) ? (
                        <TextField
                          label="Precio"
                          size="small"
                          InputLabelProps={{ style: { fontSize: 12 } }}
                          value={prices[a.id] || ''}
                          onChange={(e) => {
                            handlePriceChange(a.id, e.target.value);
                          }}
                        />
                      ) : (
                        prices[a.id] || a.price
                      )}
                    </TableCell>
                    <TableCell>
                      <>
                        <Tooltip title={editingIds.has(a.id) ? 'Guardar' : 'Editar'}>
                          <IconButton
                            onClick={() => {
                              if (editingIds.has(a.id)) {
                                handleSaveQuantity(a.id, quantity[a.id], prices[a.id]);
                                toggleEdit(a.id);
                              } else {
                                toggleEdit(a.id);
                              }
                            }}
                          >
                            {editingIds.has(a.id) ? <Save /> : <Edit />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDeleteArticle(a.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {articles.length === 0 && (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', py: 2 }}>
            <Info sx={{ width: 20, height: 20, color: 'gray', opacity: 0.6 }} />
            <Typography variant="h6" sx={{ color: 'gray', opacity: 0.6 }}>
              No hay artículos seleccionados
            </Typography>
          </Box>
        )}
      </Card>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          columnGap: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Total de la orden:</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>${totalValue()}</Typography>
      </Box>
      <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Selecciona los proveedores:</Typography>
      <Autocomplete
        disablePortal
        fullWidth
        filterOptions={filterProviderOptions}
        onChange={(e, val, reason) => {
          if (reason === 'clear') {
            setProvider([]);
            return;
          }
          e.stopPropagation();
          setProvider([val]);
          setProviderError(false);
        }}
        loading={isLoadingProviders && providers.length === 0}
        getOptionLabel={(option) => option.nombreContacto + ' ' + option.nombreCompania}
        options={providers}
        isOptionEqualToValue={(option, value) => {
          return option?.id === value?.id;
        }}
        value={(provider as IProvider[])[0] ? (provider as IProvider[]).at(0) : null}
        noOptionsText="No se encontraron proveedores"
        renderInput={(params) => (
          <TextField
            {...params}
            error={providerError}
            helperText={providerError && 'Selecciona un proveedor'}
            placeholder="Proveedores"
            sx={{ width: '50%' }}
          />
        )}
      />
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Selecciona el método de pago:</Typography>
        <Stack direction="row" spacing={2}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <TextField
              select
              label="Método de Pago"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(Number(e.target.value))}
              fullWidth
              disabled={!provider}
            >
              <MenuItem value={1}>Crédito</MenuItem>
              <MenuItem value={3}>Transferencia</MenuItem>
              <MenuItem value={2}>Efectivo</MenuItem>
            </TextField>
          </FormControl>
        </Stack>
      </Box>
      <Note note={note} setNote={setNote} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          mt: 2,
          bottom: 0,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Cancel />}
          color="error"
          onClick={() => {
            // props.setOpen(false);
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          endIcon={<Save />}
          disabled={editingIds.size > 0 || articles.length === 0}
          onClick={() => handleNextStep()}
        >
          Guardar Cambios
        </Button>
      </Box>
    </>
  );
};
