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
import { Cancel, Delete, Edit, Info, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import AnimateButton from '../../../../@extended/AnimateButton';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { IWarehouseData, MerchandiseEntry } from '../../../../../types/types';
import { addMerchandiseEntry, getExistingArticles, getWarehouseById } from '../../../../../api/api.routes';

type Article = {
  id: string;
  nombre: string;
  stock: number;
};
const OPTIONS_LIMIT = 30;
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

export const AddMerchandisePetitionModal = (props: { setOpen: Function; refetch: Function }) => {
  const { warehouseId } = useParams();
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [warehouseData, setWarehouseData] = useState<IWarehouseData[]>([]);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [subWarehouseFlag, setSubWarehouseFlag] = useState(true);
  const [subWarehouseSelected, setSubWarehouseSelected] = useState('');
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<Article[]>([]);
  const [serch, setSerch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        const warehouse = await getWarehouseById(warehouseId as string);
        if (warehouse?.esSubAlmacen) {
          const fatherWarehouse = await getWarehouseById(warehouse.id_AlmacenPrincipal ?? '');
          setWarehouseData([fatherWarehouse]);
          setWarehouseSelected(fatherWarehouse.id_Almacen);
          setSubWarehouseSelected(warehouse.id_Almacen);
          handleFetchArticlesFromWareHouse(fatherWarehouse.id_Almacen, warehouse.id_Almacen);
          setSubWarehouseFlag(true);
        } else {
          setWarehouseData(warehouse.subAlmacenes);
          setWarehouseSelected(warehouse.id_Almacen);
          setSubWarehouseFlag(false);
        }
      } catch (error) {
        console.log('error');
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, [warehouseId]);
  useEffect(() => {
    if (warehouseSelected) {
      handleFetchArticlesFromWareHouse(warehouseSelected, subWarehouseSelected);
    }
  }, [serch]);

  const { warehouseSelected, setWarehouseSelected, setArticles, articles, setArticlesFetched, articlesFetched } =
    useDirectlyPurchaseRequestOrderStore(
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
  const [articleSelected, setArticleSelected] = useState<null | Article>(null);
  const [amountText, setAmountText] = useState('');
  const [warehouseError, setWarehouseError] = useState(false);
  const [articleError, setArticleError] = useState(false);
  const [amountError, setAmountError] = useState(false);

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
    if (Number(amountText) > articleSelected.stock) {
      setAmountError(true);
      return toast.warning('La cantidad excede el stock!');
    }
    const objectArticle = {
      id: articleSelected.id,
      name: articleSelected.nombre,
      amount: parseFloat(amountText),
      price: 0,
      stock: articleSelected.stock,
    };
    const objectFiltered = articlesFetched.filter((a) => a.id !== objectArticle.id);
    setArticlesFetched(objectFiltered);
    setArticles([...articles, objectArticle]);
    setDataWerehouseArticlesSelected(dataWerehouseSelectedArticles.filter((art) => art.id !== articleSelected.id));
    setArticleSelected(null);
    setAmountText('');
  };

  const handleFetchArticlesFromWareHouse = async (wareH: string, subwareH: string) => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getExistingArticles(
        `${'pageIndex=1&pageSize=10'}&search=${serch}&habilitado=${true}&Id_Almacen=${subwareH}&Id_AlmacenPrincipal=${wareH}&fechaInicio=&fechaFin=&sort=`
      );
      const transformedData = res.data.map((item: any) => ({
        id: item.id_Articulo,
        nombre: item.nombre,
        stock: item.stockActual,
      }));

      setDataWerehouseArticlesSelected(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

  if (isLoadingWarehouse)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );

  const onSubmit: SubmitHandler<MerchandiseEntry> = async (data) => {
    try {
      if (!warehouseSelected) {
        setWarehouseError(true);
        toast.warning('Selecciona un almacen!');
        return true;
      }
      const object = {
        Id_AlmacenOrigen: data.almacenDestino,
        Id_AlmacenDestino: subWarehouseFlag ? subWarehouseSelected : (warehouseId as string),
        ListaArticulos: data.historialArticulos,
      };
      await addMerchandiseEntry(object);
      toast.success('Solicitud creada');
      props.refetch();
      props.setOpen(false);
      setDataWerehouseArticlesSelected([]);
      setWarehouseSelected('');
      setArticleSelected(null);
      return true;
    } catch (error) {
      console.log(error);
      toast.error('Algo salio mal');
      return true;
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Petición de almacén" />
      <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
        <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un almacén de destino</Typography>

          {!isLoadingWarehouse && (
            <TextField
              select
              label="Almacén"
              size="small"
              error={warehouseError}
              helperText={warehouseError && 'Selecciona un almacén'}
              value={subWarehouseFlag ? warehouseSelected : subWarehouseSelected}
              onChange={(e) => {
                setWarehouseError(false);
                if (subWarehouseFlag) {
                  setWarehouseSelected(e.target.value);
                } else {
                  setSubWarehouseSelected(e.target.value);
                  handleFetchArticlesFromWareHouse(warehouseSelected, e.target.value);
                }

                setArticles([]);
              }}
            >
              {warehouseData?.length > 0 &&
                warehouseData
                  .filter((warehouse) => warehouse.id_Almacen !== warehouseId)
                  .map((warehouse) => (
                    <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
                      {warehouse.nombre}
                    </MenuItem>
                  ))}
            </TextField>
          )}
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
                  sx={{ width: '95%' }}
                  onChange={(e) => {
                    if (e.target.value === null) {
                      setSerch('');
                    }
                    setSerch(e.target.value);
                  }}
                />
              )}
            />
          </Stack>
          <Stack sx={{ display: 'flex' }}>
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
            {articleSelected?.id && (
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                Stock Disponible : {articleSelected?.stock}{' '}
              </Typography>
            )}
          </Stack>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            ml: '80%',
            mt: 2,
          }}
        >
          <AnimateButton>
            <Button size="medium" variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleAddArticles()}>
              Agregar
            </Button>
          </AnimateButton>
        </Box>
        <ArticlesTable
          setWarehouseError={setWarehouseError}
          setOpen={props.setOpen}
          submitData={onSubmit}
          subWarehouseSelected={subWarehouseSelected}
          subWarehouseFlag={subWarehouseFlag}
        />
      </Stack>
    </Box>
  );
};

const ArticlesTable = (props: {
  setWarehouseError: Function;
  setOpen: Function;
  submitData: Function;
  subWarehouseSelected: string;
  subWarehouseFlag: boolean;
}) => {
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
  const [isLoading, setIsLoading] = useState(false);

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
                          <Typography>stack max: {a.stock} </Typography>
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
          disabled={editingIds.size > 0 || articles.length === 0 || isLoading}
          onClick={async () => {
            setIsLoading(true);
            //subWarehouseSelected
            await props.submitData({
              almacenDestino: props.subWarehouseFlag ? warehouseSelected : props.subWarehouseSelected,
              historialArticulos: articles.map((art) => ({
                Id_ArticuloExistente: art.id,
                Nombre: art.name,
                Cantidad: art.amount,
                FechaCaducidad: null,
              })),
            });
            setIsLoading(false);
          }}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};
