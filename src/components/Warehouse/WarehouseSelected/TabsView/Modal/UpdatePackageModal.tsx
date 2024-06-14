import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
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
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IArticle, IArticlesPackage } from '../../../../../types/types';
import { modifyPackage, getArticlesFromWarehouseSearch } from '../../../../../api/api.routes';
import { addNewArticlesPackage } from '../../../../../schema/schemas';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import AnimateButton from '../../../../@extended/AnimateButton';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { shallow } from 'zustand/shallow';
import { Save, Edit, Delete, Info, Cancel } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { usePackagePaginationStore } from '../../../../../store/warehouseStore/packagesPagination';

const OPTIONS_LIMIT = 5;
const filterArticleOptions = createFilterOptions<IArticle>({
  limit: OPTIONS_LIMIT,
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 600 },
  bgcolor: 'background.paper',
  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
  overflowY: 'auto',
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

export const UpdatePackageModal = (props: { setOpen: Function; package: IArticlesPackage }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticle[]>([]);
  const [serch, setSerch] = useState('');
  const [valueState, setValueState] = useState('');
  const { warehouseId } = useParams();

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        handleFetchArticlesFromWareHouse(warehouseId as string);
      } catch (error) {
        console.log('error');
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
    console.log('contenido pre', props.package.contenido);
    const articlesFromPackage = props.package.contenido.map((art) => ({
      id: art.id_Articulo,
      name: art.nombre,
      amount: art.cantidad,
    }));
    setArticles(articlesFromPackage);
  }, []);

  const { setArticles, articles, setArticlesFetched, articlesFetched } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      warehouseSelected: state.warehouseSelected,
      setWarehouseSelected: state.setWarehouseSelected,
      setArticles: state.setArticles,
      articles: state.articles,
      setArticlesFetched: state.setArticlesFetched,
      articlesFetched: state.articlesFetched,
    }),
    shallow
  );
  const { setPageIndex, pageIndex, fetchWarehousePackages } = usePackagePaginationStore(
    (state) => ({
      setPageIndex: state.setPageIndex,
      pageIndex: state.pageIndex,
      fetchWarehousePackages: state.fetchWarehousePackages,
    }),
    shallow
  );

  const [articleSelected, setArticleSelected] = useState<null | IArticle>(null);
  const [amountText, setAmountText] = useState('');
  const [articleError, setArticleError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  useEffect(() => {
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
    setDataWerehouseArticlesSelected(dataWerehouseSelectedArticles.filter((art) => art.id !== articleSelected.id));
    setArticleSelected(null);
    setAmountText('');
  };

  const handleFetchArticlesFromWareHouse = async (wareH: string) => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getArticlesFromWarehouseSearch(serch, wareH);
      const transformedData = res.map((item: any) => ({
        id: item.id_Articulo,
        nombre: item.nombre,
      }));
      const articlesFromPackage = props.package.contenido.map((art) => art.id_Articulo);
      const objectFiltered = transformedData.filter((art: any) => !articlesFromPackage.includes(art.id));
      setDataWerehouseArticlesSelected(objectFiltered);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IArticlesPackage>({
    defaultValues: {
      nombre: props.package.nombre,
      descripcion: props.package.descripcion,
    },
    resolver: zodResolver(addNewArticlesPackage),
  });
  if (isLoadingWarehouse)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );

  const onSubmit: SubmitHandler<any> = async (data) => {
    data.historialArticulos = articles.map((art) => ({ id_Articulo: art.id, cantidad: art.amount }));
    try {
      const object = {
        Id: props.package.id_PaqueteArticulo,
        Nombre: data.nombre,
        Descripcion: data.descripcion,
        Id_Almacen: warehouseId as string,
        Contenido: JSON.stringify(data.historialArticulos),
      };
      await modifyPackage(object);
      toast.success('Paquete Actualizado');
      fetchWarehousePackages();
      setPageIndex(pageIndex);
      props.setOpen(false);
      setDataWerehouseArticlesSelected([]);
      setArticleSelected(null);
    } catch (error) {
      console.log(error);
      toast.error('Algo salio mal');
    }
  };
  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueState(event.currentTarget.value);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Editar paquete de articulos" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
          <Grid component="span" container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>Nombre</Typography>
              <TextField
                fullWidth
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
                size="small"
                placeholder="Escriba un Nombre"
                {...register('nombre')}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography>Descripción</Typography>
              <TextField
                fullWidth
                error={!!errors.descripcion}
                size="small"
                placeholder="Escriba una Descripción"
                {...register('descripcion')}
                multiline
                onChange={handleChangeText}
                helperText={
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>{errors ? (errors.descripcion ? errors.descripcion.message : null) : null}</Box>
                    <Box>{`${valueState.length}/${200}`}</Box>
                  </Box>
                }
                maxRows={3}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
          </Grid>
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
                loading={isLoadingArticlesWareH && dataWerehouseSelectedArticles.length === 0}
                getOptionLabel={(option) => option.nombre}
                options={dataWerehouseSelectedArticles}
                value={articleSelected}
                noOptionsText="No se encontraron artículos"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={articleError}
                    helperText={articleError && 'Selecciona un articulo'}
                    placeholder="Artículos"
                    sx={{ width: '90%' }}
                    onChange={(e) => {
                      setSerch(e.target.value);
                    }}
                  />
                )}
              />
            </Stack>
            <Stack sx={{ display: 'flex' }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Ingresar cantidad</Typography>
              <TextField
                sx={{ width: '50%' }}
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
            <Box
              sx={{
                display: 'flex',
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
          </Box>

          <ArticlesTable setOpen={props.setOpen} submitData={onSubmit} />
        </Stack>
      </form>
    </Box>
  );
};

const ArticlesTable = (props: { setOpen: Function; submitData: Function }) => {
  const { articles, articlesFetched, setArticlesFetched, setArticles, setProvider } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        articles: state.articles,
        articlesFetched: state.articlesFetched,
        setArticlesFetched: state.setArticlesFetched,
        setArticles: state.setArticles,
        step: state.step,
        setProvider: state.setProvider,
      }),
      shallow
    );
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<any>({});

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

    const articleToUpdate = articles.find((article) => article.id === id);

    if (articleToUpdate) {
      const newAmount = parseFloat(newQuantity);
      if (newAmount > (articleToUpdate.stock as number)) {
        toast.warning('La cantidad excede el stock disponible');
        return;
      }
      const updatedArticles = articles.map((article) => {
        if (article.id === id) {
          return {
            ...article,
            amount: newAmount,
          };
        }
        return article;
      });
      setArticles(updatedArticles);
    }
  };

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
                .map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>
                      {editingIds.has(a.id) ? (
                        <>
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
                        </>
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
          endIcon={<Save />}
          disabled={editingIds.size > 0 || articles.length === 0}
          type="submit"
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};
