import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
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
import { useEffect, useState } from 'react';
import { addNurseRequest, getExistingArticles, getWarehouseById } from '../../../../api/api.routes';
import { usePosTabNavStore } from '../../../../store/pharmacy/pointOfSale/posTabNav';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import AnimateButton from '../../../@extended/AnimateButton';
import { shallow } from 'zustand/shallow';
import { useRequestOrderStore } from '../../../../store/pharmacy/nurseRequest/nurseRequestOrder';
import { IWarehouseData, IPatientFromSearch } from '../../../../types/types';
import { Cancel, Save, Edit, Delete, Info } from '@mui/icons-material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { getPatientsWithAccount } from '../../../../services/programming/patientService';

type Article = {
  id: string;
  nombre: string;
  stock: number;
};

const OPTIONS_LIMIT = 30;
const filterArticleOptions = createFilterOptions<Article>({
  limit: OPTIONS_LIMIT,
});
const filterPatientOptions = createFilterOptions<IPatientFromSearch>({
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

export const NurseRequestModal = (props: { setOpen: Function; refetch: Function }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<Article[]>([]);
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [search, setSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const warehouseId = usePosTabNavStore.getState().warehouseId;
  const [articleSelected, setArticleSelected] = useState<null | Article>(null);
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [userError, setUserError] = useState(false);
  const [articleError, setArticleError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [amountText, setAmountText] = useState('');
  const [warehousesFetched, setWarehousesFetched] = useState<{ nombre: string; id: string }[]>();
  const [warehouseError, setWarehouseError] = useState(false);
  const [roomSelected, setRoomSelected] = useState<string | null>();
  const [roomError, setRoomError] = useState(false);
  const [floorSelected, setFloorSelected] = useState<string | null>();
  const [floorError, setFloorError] = useState(false);
  //const defaultRoomsQuirofano = [];
  //const defaultRoomsHospitalizacion = [
  const defaultRooms = [
    'C-1',
    'C-2',
    'C-3',
    'C-4',
    'EndoPro',
    'LPR', //Quirofano
    'C-104', //Hosp
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
  const defaultFloors = ['Piso 1', 'Piso 2', 'Piso 3'];

  const { setArticles, articles, setWarehouseSelected, warehouseSelected } = useRequestOrderStore(
    (state) => ({
      setArticles: state.setArticles,
      articles: state.articles,
      setArticlesFetched: state.setArticlesFetched,
      articlesFetched: state.articlesFetched,
      warehouseSelected: state.warehouseSelected,
      setWarehouseSelected: state.setWarehouseSelected,
    }),
    shallow
  );

  const handleFetchArticlesFromWareHouse = async (id_warehouse: string) => {
    if (isLoadingArticlesWareH) return;
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getExistingArticles(
        `${'pageIndex=1&pageSize=10'}&search=${search}&habilitado=${true}&Id_Almacen=${id_warehouse}&Id_AlmacenPrincipal=${id_warehouse}&fechaInicio=&fechaFin=&sort=`
      );
      const transformedData = res.data.map((item: any) => ({
        id: item.id_Articulo,
        nombre: item.nombre,
        stock: item.stockActual,
      }));
      const articlesIds = articles.map((a) => a.id);
      setDataWerehouseArticlesSelected(transformedData.filter((art: any) => !articlesIds.includes(art.id)));
      //const resUsers = await qwewqqr();
      patientsCall();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

  useEffect(() => {
    patientsCall();
  }, [patientSearch]);

  useEffect(() => {
    const fetch = async () => {
      setDataWerehouseArticlesSelected([]);
      setArticles([]);
      setUserSelected(null);
      setArticleSelected(null);
      setIsLoadingWarehouse(true);
      try {
        const warehouse: IWarehouseData = await getWarehouseById(warehouseId as string);
        warehouse;
        const subWH = warehouse.subAlmacenes
          .map((swh: IWarehouseData) => ({
            nombre: swh.nombre,
            id: swh.id,
          }))
          .concat({ nombre: warehouse.nombre, id: warehouse.id });
        setWarehousesFetched(subWH);
      } catch (error) {
        console.log('error');
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (warehouseSelected && warehouseSelected !== '') {
      handleFetchArticlesFromWareHouse(warehouseSelected);
    }
  }, [search, warehouseSelected]);

  const patientsCall = async () => {
    const url = `Search=${patientSearch}`;
    const res = await getPatientsWithAccount(url);
    if (res) {
      setUsersData(res);
    }
  };

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
      stock: articleSelected.stock,
    };
    setArticles([...articles, objectArticle]);
    setDataWerehouseArticlesSelected(dataWerehouseSelectedArticles.filter((art) => art.id !== articleSelected.id));
    setArticleSelected(null);
    setAmountText('');
  };

  const onSubmit = async (data: any) => {
    try {
      if (!warehouseSelected) {
        setWarehouseError(true);
        return toast.warning('Selecciona un almacen!');
      }
      if (!userSelected) {
        setUserError(true);
        return toast.warning('Selecciona un paciente!');
      }
      if (!data || data.length < 1) {
        return toast.warning('Añade un articulo!');
      }
      const object = {
        Cuarto: roomSelected,
        Id_Paciente: userSelected.id_Paciente,
        Id_CuentaPaciente: userSelected.id_Cuenta,
        SolicitadoEn: floorSelected,
        Id_AlmacenSolicitado: warehouseSelected,
        ListaSolicitud: data,
      };
      await addNurseRequest(object);
      toast.success('Solicitud creada');
      props.refetch(true);
      props.setOpen(false);
      setDataWerehouseArticlesSelected([]);
      setArticles([]);
      setUserSelected(null);
      setArticleSelected(null);
      setWarehouseSelected('');
    } catch (error) {
      console.log(error);
      toast.error('Algo salio mal');
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Petición de enfermero" />
      <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            columnGap: 2,
            flexDirection: 'column',
            rowGap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
            <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un almacén de destino</Typography>

              {!isLoadingWarehouse && (
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
                    handleFetchArticlesFromWareHouse(e.target.value);
                    setArticles([]);
                  }}
                >
                  {warehousesFetched &&
                    warehousesFetched?.length > 0 &&
                    warehousesFetched.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.nombre}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            </Stack>

            <Stack sx={{ display: 'flex', flex: 1, pl: 3 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccion de cuarto</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                onChange={(e, val) => {
                  e.stopPropagation();
                  setRoomSelected(val as string);
                  setRoomError(false);
                }}
                options={defaultRooms}
                value={roomSelected}
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
            </Stack>
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccion de cuarto</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                onChange={(e, val) => {
                  e.stopPropagation();
                  setFloorSelected(val as string);
                  setFloorError(false);
                }}
                options={defaultFloors}
                value={floorSelected}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={floorError}
                    helperText={floorError && 'Selecciona un Piso'}
                    placeholder="Pisos"
                    sx={{ width: '50%' }}
                  />
                )}
              />
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
            <Stack sx={{ display: 'flex', flex: 1, ml: 5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar paciente</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterPatientOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setUserSelected(val);
                  setUserError(false);
                }}
                //cambiar loading
                loading={isLoadingArticlesWareH && usersData.length === 0}
                getOptionLabel={(option) => option.nombreCompleto}
                options={usersData}
                value={userSelected}
                noOptionsText="No se encontraron pacientes"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={userError}
                    helperText={userError && 'Selecciona un paciente'}
                    placeholder="Pacientes"
                    sx={{ width: '100%' }}
                    onChange={(e) => {
                      if (e.target.value === null) {
                        setPatientSearch('');
                      }
                      setPatientSearch(e.target.value);
                    }}
                  />
                )}
              />
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
                        setSearch('');
                      }
                      setSearch(e.target.value);
                    }}
                  />
                )}
              />
            </Stack>
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, width: '60%', ml: 'auto' }}>
                Ingresar cantidad
              </Typography>
              <TextField
                sx={{ width: '60%', ml: 'auto' }}
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
                <Typography sx={{ fontWeight: 500, fontSize: 14, width: '60%', ml: 'auto' }}>
                  Stock Disponible : {articleSelected?.stock}{' '}
                </Typography>
              )}
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
            </Stack>
          </Box>
        </Box>

        <ArticlesTable setEditingRow={() => {}} />
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
              //props.setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            endIcon={<Save />}
            //disabled={editingIds.size > 0 || articles.length === 0}
            onClick={() => {
              onSubmit(
                articles.map((art) => ({
                  Id_Articulo: art.id,
                  Nombre: art.name,
                  Cantidad: art.amount,
                  FechaCaducidad: null,
                }))
              );
              /*submitData({
              almacenDestino: warehouseSelected,
              historialArticulos: articles.map((art) => ({
                Id_ArticuloExistente: art.id,
                Nombre: art.name,
                Cantidad: art.amount,
                FechaCaducidad: null,
              })),
            });*/
            }}
          >
            Guardar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

const ArticlesTable = (props: { setEditingRow: Function }) => {
  //  const ArticlesTable = ( props: { editingRow: boolean, setEditingRow: Function } ) => {
  const { setArticles, articles, setArticlesFetched, articlesFetched } = useRequestOrderStore(
    (state) => ({
      setArticles: state.setArticles,
      articles: state.articles,
      setArticlesFetched: state.setArticlesFetched,
      articlesFetched: state.articlesFetched,
    }),
    shallow
  );
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<any>({});

  const updateArticlesData = () => {
    const newQuantity: any = {};
    articles.forEach((article) => {
      newQuantity[article.id] = article.amount.toString();
    });
    setQuantity(newQuantity);
  };

  useEffect(() => {
    updateArticlesData();
  }, [articles]);

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
    if (editingIds.size === 0) {
      props.setEditingRow(false);
    } else {
      props.setEditingRow(true);
    }
  }, [editingIds]);
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
    </>
  );
};
