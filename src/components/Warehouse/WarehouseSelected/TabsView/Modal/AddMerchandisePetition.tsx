import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Stack,
  Autocomplete,
  Divider,
  MenuItem,
  createFilterOptions,
} from '@mui/material';
import { ArrowForward, Cancel, Delete, Edit, Info, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { useGetAlmacenes } from '../../../../../hooks/useGetAlmacenes';
import AnimateButton from '../../../../@extended/AnimateButton';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { MerchandiseEntry } from '../../../../../types/types';
import { ArticlesFetched } from './ArticlesOutput';
import { addMerchandiseEntry, getArticlesByWarehouseIdAndSearch } from '../../../../../api/api.routes';

type Article = {
  id: string;
  nombre: string;
};
const OPTIONS_LIMIT = 5;
const filterArticleOptions = createFilterOptions<Article>({
  limit: OPTIONS_LIMIT,
});
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

const useFetchPurchaseWarehouse = (warehouseId: string) => {
  const [isLoadingArticles, setIsLoadingExistingArticle] = useState(true);
  const [articlesRes, setArticlesFetched] = useState<ArticlesFetched[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingExistingArticle(true);
      try {
        const data = await getArticlesByWarehouseIdAndSearch(warehouseId, '');
        setArticlesFetched(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingExistingArticle(false);
      }
    };
    fetchData();
  }, [warehouseId]);
  return { isLoadingArticles, articlesRes };
};

export const AddMerchandisePetitionModal = (props: { setOpen: Function; refetch: Function }) => {
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const { warehouseId } = useParams();
  const { isLoadingArticles, articlesRes } = useFetchPurchaseWarehouse(warehouseId as string);
  const {
    warehouseSelected,
    setWarehouseSelected,
    setArticles,
    articles,
    setArticlesFetched,
    articlesFetched,
    setSearch,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      warehouseSelected: state.warehouseSelected,
      setWarehouseSelected: state.setWarehouseSelected,
      setArticles: state.setArticles,
      articles: state.articles,
      setArticlesFetched: state.setArticlesFetched,
      articlesFetched: state.articlesFetched,
      setSearch: state.setSearch,
    }),
    shallow
  );
  const [articleSelected, setArticleSelected] = useState<ArticlesFetched | null | Article>(null);
  const [amountText, setAmountText] = useState('');
  const [warehouseError, setWarehouseError] = useState(false);
  const [articleError, setArticleError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  useEffect(() => {
    if (!(articlesRes && articlesRes?.length > 0)) return;
    setArticlesFetched(articlesRes.map((art) => ({ id: art.id, nombre: art.nombre, precio: undefined })));
    setArticlesFetched(
      articlesRes.filter((a) => {
        return !articles.some((ar) => ar.id === a.id);
      })
    );
  }, [articlesRes]);

  useEffect(() => {
    setWarehouseSelected('');
    setArticleSelected(null);
  }, [props.setOpen]);

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
      price: 0,
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

  const onSubmit: SubmitHandler<MerchandiseEntry> = async (data) => {
    try {
      if (!warehouseSelected) {
        setWarehouseError(true);
        return toast.warning('Selecciona un almacen!');
      }
      const object = {
        Id_AlmacenOrigen: warehouseId as string,
        Id_AlmacenDestino: data.almacenDestino,
        ListaArticulos: JSON.stringify(data.historialArticulos),
      };
      await addMerchandiseEntry(object);
      props.refetch();
      props.setOpen(false);
      setWarehouseSelected('');
      setArticleSelected(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={() => {
          props.setOpen();
        }}
        title="Petición de almacén"
      />
      <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
        <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un almacén de destino</Typography>

          <TextField
            select
            label="Almacén"
            size="small"
            error={warehouseError}
            helperText={warehouseError && 'Selecciona un almacén'}
            value={warehouseSelected}
            onChange={(e) => {
              setWarehouseError(false);
              setWarehouseSelected(e.target.value);
            }}
          >
            {almacenes
              .filter((warehouse) => warehouse.id !== warehouseId)
              .map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.nombre}
                </MenuItem>
              ))}
          </TextField>
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
              loading={isLoadingArticles && articlesRes.length === 0}
              getOptionLabel={(option) => option.nombre}
              options={articlesRes}
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
            <Button size="medium" variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleAddArticles()}>
              Agregar
            </Button>
          </AnimateButton>
        </Box>
        <ArticlesTable setWarehouseError={setWarehouseError} setOpen={props.setOpen} submitData={onSubmit} />
      </Stack>
    </Box>
  );
};

const ArticlesTable = (props: { setWarehouseError: Function; setOpen: Function; submitData: Function }) => {
  const { articles, articlesFetched, setArticlesFetched, setArticles, step, warehouseSelected, setProvider } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        articles: state.articles,
        articlesFetched: state.articlesFetched,
        setArticlesFetched: state.setArticlesFetched,
        setArticles: state.setArticles,
        step: state.step,
        warehouseSelected: state.warehouseSelected,
        setProvider: state.setProvider,
      }),
      shallow
    );
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<any>({});
  const [isChargingPrices, setIsChargingPrices] = useState(true);

  const updateArticlesData = () => {
    const newQuantity: any = {};
    articles.forEach((article) => {
      newQuantity[article.id] = article.amount.toString();
    });
    setQuantity(newQuantity);
    setIsChargingPrices(false);
  };

  useEffect(() => {
    updateArticlesData();
  }, [step, articles]);

  useEffect(() => {
    setProvider(null);
  }, []);

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
          precio: 0,
        }
      : null;
    if (articleToAddModified) {
      setArticlesFetched([...articlesFetched, articleToAddModified]);
    }
    setArticles(articlesFiltered);
  };

  const handleSaveQuantity = (id: string, newQuantity: string) => {
    if (!newQuantity || parseFloat(newQuantity) <= 0) return;
    const updatedArticles = articles.map((article) => {
      if (article.id === id) {
        return {
          ...article,
          amount: parseFloat(newQuantity),
        };
      }
      return article;
    });
    setArticles(updatedArticles);
  };

  useEffect(() => {
    setArticles([]);
  }, [props.setOpen]);

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
                      <>
                        <Tooltip title={editingIds.has(a.id) ? 'Guardar' : 'Editar'}>
                          <IconButton
                            onClick={() => {
                              if (editingIds.has(a.id)) {
                                handleSaveQuantity(a.id, quantity[a.id]);
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
            props.setOpen(false);
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          disabled={editingIds.size > 0 || articles.length === 0}
          onClick={() => {
            props.submitData({
              almacenDestino: warehouseSelected,
              historialArticulos: articles.map((art) => ({ nombre: art.name, cantidad: art.amount })),
            });
          }}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};
