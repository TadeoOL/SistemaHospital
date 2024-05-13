import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Radio,
  IconButton,
  Stack,
  Table,
  TableBody,
  FormControlLabel,
  TableCell,
  TableContainer,
  RadioGroup,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  articlesOutputToWarehouse,
  articlesEntryToWarehouse,
  getArticlesByWarehouseIdAndSearch,
  getNursesUsers,
  getPackagesByWarehouseId,
} from '../../../../api/api.routes';
import { addNewArticlesPackage } from '../../../../schema/schemas';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import AnimateButton from '../../../@extended/AnimateButton';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { shallow } from 'zustand/shallow';
import { Save, Edit, Delete, Info, Cancel } from '@mui/icons-material';
import { IArticle, IArticlesPackage } from '../../../../types/types';
import { ArticlesFetched } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/ArticlesOutput';

const OPTIONS_LIMIT = 5;
const filterArticleOptions = createFilterOptions<IArticle>({
  limit: OPTIONS_LIMIT,
});
const filterPackageOptions = createFilterOptions<IArticlesPackage>({
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

export const ArticlesExitModal = (props: {
  setOpen: Function;
  warehouseId: string;
  refetch: Function;
  articlesExit: boolean;
}) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [dataWerehouseSelectedPackages, setDataWerehousePackagesSelected] = useState<IArticlesPackage[]>([]);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticle[]>([]);
  const [dataWerehouseSelectedArticlesInitial, setDataWerehouseArticlesSelectedInitial] = useState<IArticle[]>([]);
  const [nursesData, setNursesData] = useState<string[]>([]);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [reasonMessage, setReasonMessage] = useState('');
  const [packageSelected, setPackageSelected] = useState<IArticlesPackage | null>(null);
  const [articlesFetchedAM, setArticlesFetchedAM] = useState<ArticlesFetched[] | []>([]);

  const defaultRoomsQuirofano = ['C-1', 'C-2', 'C-3', 'C-4', 'EndoPro', 'LPR'];
  const defaultRoomsHospitalizacion = [
    'C-104',
    'C-105',
    'C-201',
    'C-202',
    'C-203',
    'C-204',
    'C-205',
    'C-206',
    'C-207',
    'C-208',
    'C-209',
    'C-210',
    'C-211',
    'c-212',
    'C-213',
    'C-214',
  ];

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        const res = await getArticlesByWarehouseIdAndSearch(props.warehouseId, '');
        setArticlesFetchedAM(
          res.data.map((a: ArticlesFetched) => {
            return { ...a, stockActual: a.stockActual.toString() };
          })
        );
        handleFetchArticlesFromWareHouse();
        handleFetchArticlesPackagesFromWareHouse(props.warehouseId);
      } catch (error) {
        console.log('error');
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
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

  const [articleSelected, setArticleSelected] = useState<null | IArticle>(null);
  const [nurseSelected, setNurseSelected] = useState<string>();
  const [roomSelected, setRoomSelected] = useState<string | null>();
  const [roomError, setRoomError] = useState(false);
  const [articleError, setArticleError] = useState(false);

  useEffect(() => {
    setArticleSelected(null);
  }, [props.setOpen]);

  const handleAddArticles = () => {
    if (!articleSelected) {
      setArticleError(true);
      return toast.warning('Selecciona un articulo!');
    }
    const objectArticle = {
      id: articleSelected.id,
      name: articleSelected.nombre,
      amount: 1,
      price: 0,
      stock: Number(articlesFetchedAM.find((art) => art.id === articleSelected.id)?.stockActual) || 0,
      lote: articlesFetchedAM
        .find((f) => f.id === articleSelected.id)
        ?.lote?.sort((a, b) => {
          return new Date(b.fechaCaducidad).getTime() - new Date(a.fechaCaducidad).getTime();
        }),
    };
    const objectFiltered = articlesFetched.filter((a) => a.id !== objectArticle.id);
    setArticlesFetched(objectFiltered);
    setArticles([...articles, objectArticle]);
    setDataWerehouseArticlesSelected(dataWerehouseSelectedArticles.filter((art) => art.id !== articleSelected.id));
    setArticleSelected(null);
  };

  const handleAddArticlesFromPackage = (packageL: IArticlesPackage) => {
    let objectFiltered = articlesFetched;
    let dataArticlesState = dataWerehouseSelectedArticles;
    packageL.contenido.forEach((articulo) => {
      objectFiltered = objectFiltered.filter((a) => a.id !== articulo.id);
      dataArticlesState = dataArticlesState.filter((a) => a.id !== articulo.id);
    });

    setArticlesFetched(objectFiltered);
    setDataWerehouseArticlesSelected(dataArticlesState);
    setArticles(
      packageL.contenido.map((art) => ({
        name: art.nombre,
        amount: art.cantidad,
        id: art.id,
        stock: Number(articlesFetchedAM.find((f) => f.id === art.id)?.stockActual) || 0,
        lote: articlesFetchedAM
          .find((f) => f.id === art.id)
          ?.lote?.sort((a, b) => {
            return new Date(b.fechaCaducidad).getTime() - new Date(a.fechaCaducidad).getTime();
          }),
      }))
    );
    setArticleSelected(null);
  };

  const handleFetchArticlesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getArticlesByWarehouseIdAndSearch(props.warehouseId, '');
      const transformedData = res.data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        stock: item.stockActual,
        lote: item.lote,
      }));
      if (dataWerehouseSelectedArticlesInitial?.length < 1) {
        setDataWerehouseArticlesSelectedInitial(transformedData);
      }
      setDataWerehouseArticlesSelected(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

  const handleFetchArticlesPackagesFromWareHouse = async (wareH: string) => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getPackagesByWarehouseId(wareH);
      setDataWerehousePackagesSelected(res);
      const resNurses = await getNursesUsers();
      setNursesData(resNurses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

  const { handleSubmit } = useForm<IArticlesPackage>({
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
    resolver: zodResolver(addNewArticlesPackage),
  });
  const validateAmount = (art: any) => {
    for (let i = 0; i < art.length; i++) {
      const articulo = art[i];
      if (articulo.amount > articulo.stock) {
        toast.error(`La cantidad de salida del articulo ${art.name} esta superando la existencias actuales! `);
        return false;
      }
    }
    return true;
  };
  const onSubmit = async () => {
    if ((reasonMessage === 'Otro' && textFieldRef.current?.value === '') || reasonMessage === '') {
      toast.error('Selecciona un motivo de salida');
      return;
    }
    if ((reasonMessage === 'Quirofano' || reasonMessage === 'Hospitalizacion') && !roomSelected) {
      setRoomError(true);
      toast.error('Selecciona un cuarto');
      return;
    }
    if (!nurseSelected) {
      toast.error('Selecciona enfermero');
      return;
    }
    try {
      if (!validateAmount) return;
      setLoadingSubmit(true);

      let articlesArticlesExit: any = [];
      for (const article of articles as any) {
        //(articles as any).forEach((article: any) => {
        let amountArt = article.amount;
        if (amountArt > article.stock) {
          toast.error(`La cantidad de salida del articulo ${article.name} esta superando la existencias actuales! `);
          setLoadingSubmit(false);
          return;
        }
        article.lote.forEach((loteA: any) => {
          if (amountArt > loteA.stock) {
            articlesArticlesExit.push({
              Id_ArticuloExistente: loteA.id,
              Cantidad: loteA.stock.toString(),
            });
            amountArt = amountArt - loteA.stock;
          } else if (amountArt > 0) {
            articlesArticlesExit.push({
              Id_ArticuloExistente: loteA.id,
              Cantidad: amountArt.toString(),
            });
            amountArt = 0;
          }
        });
      }
      const object = {
        Articulos: articlesArticlesExit,
        id_almacenDestino: props.warehouseId,
        id_almacenOrigen: props.warehouseId,
        Estatus: 3,
        SalidaMotivo: reasonMessage === 'Otro' ? textFieldRef.current?.value : `${reasonMessage} ${roomSelected}`,
        SolicitadoPor: nurseSelected,
      };
      if (props.articlesExit) {
        await articlesOutputToWarehouse(object);
      } else {
        await articlesEntryToWarehouse(object);
      }
      props.refetch();
      toast.success('Salida a artículos con éxito!');
      setLoadingSubmit(false);
      props.setOpen(false);
      setDataWerehouseArticlesSelected([]);
      setArticleSelected(null);
    } catch (error) {
      console.log(error);
      setLoadingSubmit(false);
      toast.error('Algo salio mal');
    }
  };

  const radioOptions = ['Quirofano', 'Hospitalizacion', 'Uso interno', 'Otro'];

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Salida paquete de artículos" />
      {isLoadingWarehouse ? (
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un paquete</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterPackageOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setPackageSelected(val);
                  handleAddArticlesFromPackage(val as IArticlesPackage);
                }}
                loading={isLoadingArticlesWareH && dataWerehouseSelectedPackages.length === 0}
                getOptionLabel={(option) => option.nombre}
                options={dataWerehouseSelectedPackages}
                value={packageSelected}
                noOptionsText="No se encontraron paquetes"
                renderInput={(params) => (
                  <TextField {...params} placeholder="Paquetes de artículos" sx={{ width: '50%' }} />
                )}
              />
            </Stack>
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
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de articulo</Typography>
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
                      sx={{ width: '50%' }}
                    />
                  )}
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
            <ArticlesTable setOpen={props.setOpen} submitData={onSubmit} initialData={articlesFetchedAM} />
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography textAlign={'center'}>Motivos de salida:</Typography>

              <RadioGroup
                sx={{
                  mx: 'auto',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                }}
                value={reasonMessage}
                onChange={(e) => {
                  setReasonMessage(e.target.value);
                  setRoomSelected(null);
                }}
              >
                {radioOptions.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
                <TextField
                  inputRef={textFieldRef}
                  label={'Razón de salida'}
                  error={true}
                  sx={{
                    visibility: reasonMessage === 'Otro' ? 'visible' : 'hidden',
                  }}
                />
              </RadioGroup>
            </Box>
            {(reasonMessage === 'Quirofano' || reasonMessage === 'Hospitalizacion') && (
              <Stack sx={{ display: 'flex', flex: 1, p: 2 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccion de cuarto</Typography>
                {reasonMessage === 'Quirofano' ? (
                  <Autocomplete
                    disablePortal
                    fullWidth
                    onChange={(e, val) => {
                      e.stopPropagation();
                      setRoomSelected(val as string);
                      setRoomError(false); //cambiar
                    }}
                    options={defaultRoomsQuirofano}
                    value={roomSelected}
                    noOptionsText="No se encontraron enfermeros"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={roomError}
                        helperText={roomError && 'Selecciona un cuarto'}
                        placeholder="Cuartos"
                        sx={{ width: '50%' }}
                      />
                    )}
                  />
                ) : (
                  <Autocomplete
                    disablePortal
                    fullWidth
                    onChange={(e, val) => {
                      e.stopPropagation();
                      setRoomSelected(val as string);
                      setRoomError(false);
                    }}
                    options={defaultRoomsHospitalizacion}
                    value={roomSelected}
                    noOptionsText="No se encontraron enfermeros"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={roomError}
                        helperText={roomError && 'Selecciona un cuarto'}
                        placeholder="Cuartos"
                        sx={{ width: '50%' }}
                      />
                    )}
                  />
                )}
              </Stack>
            )}
            <Stack sx={{ display: 'flex', flex: 1, p: 2 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de enfermeros</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                //filterOptions={filterArticleOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setNurseSelected(val as string);
                  setArticleError(false); //cambiar
                }}
                loading={isLoadingArticlesWareH}
                //getOptionLabel={(option) => option.nombre}
                options={nursesData}
                value={nurseSelected}
                noOptionsText="No se encontraron enfermeros"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={articleError}
                    helperText={articleError && 'Selecciona un enfermero'}
                    placeholder="Enfermeros"
                    sx={{ width: '50%' }}
                  />
                )}
              />
            </Stack>
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
                disabled={articles.length === 0 || loadingSubmit}
                onClick={() => {
                  onSubmit();
                }}
              >
                Guardar
              </Button>
            </Box>
          </Stack>
        </form>
      )}
    </Box>
  );
};

const ArticlesTable = (props: { setOpen: Function; submitData: Function; initialData: ArticlesFetched[] }) => {
  const { articles, articlesFetched, setArticlesFetched, setArticles, step, setProvider } =
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

    const articleToUpdate = props.initialData.find((article) => article.id === id);
    if (articleToUpdate) {
      const newAmount = parseFloat(newQuantity);
      const articleStock = articleToUpdate.stockActual ? parseFloat(articleToUpdate.stockActual) : 0;
      if (newAmount > articleStock) {
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
                          <Typography>stock max: {a.stock} </Typography>
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
    </>
  );
};
