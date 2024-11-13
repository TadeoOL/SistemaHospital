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
import { getWarehouseById } from '../../../../api/api.routes';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import AnimateButton from '../../../@extended/AnimateButton';
import { shallow } from 'zustand/shallow';
import { useRequestOrderStore } from '../../../../store/pharmacy/nurseRequest/nurseRequestOrder';
import { IWarehouseData, IPatientFromSearch } from '../../../../types/types';
import { Cancel, Save, Edit, Delete, Info } from '@mui/icons-material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { getPatientInfoByAdmissionId, getPatientsWithAccount } from '../../../../services/programming/patientService';
import { getExistingArticles } from '../../../../services/warehouse/articleWarehouseService';
import { HospitalSpaceType, IHospitalSpace } from '../../../../types/admission/admissionTypes';
import { createArticleRequest } from '../../../../services/hospitalization/articleRequestService';
import { IRegisterArticleRequest } from '../../../../types/hospitalization/articleRequestTypes';

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
const filterPatientRoomsOptions = createFilterOptions<IHospitalSpace>({
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
const style2 = {
  bgcolor: 'background.paper',
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
interface Props {
  setOpen: Function;
  refetch: Function;
  warehouseId: string;
  id_Patient?: string;
  id_PatientRoom?: string;
  id_PatientAdmission?: string;
}
export const NurseRequestModal = (props: Props) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<Article[]>([]);
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [search, setSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [articleSelected, setArticleSelected] = useState<null | Article>(null);
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [roomSelected, setRoomSelected] = useState<null | IHospitalSpace>(null);
  const [rooms, setRooms] = useState<IHospitalSpace[]>([]);
  const [userError, setUserError] = useState(false);
  const [articleError, setArticleError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [roomError, setRoomError] = useState(false);
  const [amountText, setAmountText] = useState('');
  const [mainWarehouse, setMainWarehouse] = useState('');
  const [warehousesFetched, setWarehousesFetched] = useState<{ nombre: string; id: string }[]>();
  const [warehouseError, setWarehouseError] = useState(false);
  const [samiPatient] = useState(false);
  const [disableSelectedRoom, setDisableSelectedRoom] = useState(false);
  const [disableUserSelection, setDisableUserSelection] = useState(false);

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
  useEffect(() => {
    setWarehouseSelected('');
  }, []);

  const handleFetchArticlesFromWareHouse = async (id_warehouse: string) => {
    if (isLoadingArticlesWareH) return;
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getExistingArticles(
        `${'pageIndex=1&pageSize=10'}&search=${search}&habilitado=${true}&Id_Almacen=${id_warehouse}&Id_AlmacenPrincipal=${mainWarehouse}&fechaInicio=&fechaFin=&sort=`
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
      ///ñaca
      setArticleSelected(null);
      setIsLoadingWarehouse(true);
      try {
        const warehouse: IWarehouseData = await getWarehouseById(props.warehouseId);
        warehouse;
        setMainWarehouse(warehouse.id_Almacen);
        const subWH = warehouse.subAlmacenes
          .map((swh: IWarehouseData) => ({
            nombre: swh.nombre,
            id: swh.id_Almacen,
          }))
          .concat({ nombre: warehouse.nombre, id: warehouse.id_Almacen });
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

  const fetchPatientRooms = async (admissionId: string) => {
    setIsLoadingRooms(true);
    const resCuartos = await getPatientInfoByAdmissionId(admissionId);
    const roomsFiltered = resCuartos.espaciosHospitalarios.filter(
      (r) => r.tipoEspacioHospitalario === HospitalSpaceType.Room
    );
    setRooms(roomsFiltered);
    setIsLoadingRooms(false);
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
    if (!warehouseSelected) {
      setWarehouseError(true);
      return toast.warning('Selecciona un almacen!');
    }
    if (!userSelected) {
      setUserError(true);
      return toast.warning('Selecciona un paciente!');
    }
    if (!roomSelected && !samiPatient) {
      setRoomError(true);
      return toast.warning('Selecciona un cuarto!');
    }
    if (!data || data.length < 1) {
      return toast.warning('Añade un articulo!');
    }
    const object: IRegisterArticleRequest = {
      id_Almacen: warehouseSelected,
      id_CuentaEspacioHospitalario: roomSelected!.id_EspacioHospitalario,
      articulos: data,
    };
    try {
      await createArticleRequest(object);
      toast.success('Solicitud creada');
      props.refetch(true);
      props.setOpen(false);
      setDataWerehouseArticlesSelected([]);
      setArticles([]);
      setUserSelected(null);
      //ñaca
      setArticleSelected(null);
      setWarehouseSelected('');
    } catch (error) {
      console.log(error);
      toast.error('Algo salio mal');
    }
  };

  useEffect(() => {
    if (props.id_Patient && usersData.length > 0) {
      const foundUser = usersData.find((user) => user.id_Paciente === props.id_Patient);
      if (foundUser) {
        setUserSelected(foundUser);
        fetchPatientRooms(foundUser.id_IngresoPaciente);
        setDisableUserSelection(true);
      }
    } else {
      setDisableUserSelection(false);
    }
  }, [props.id_Patient, usersData]);

  useEffect(() => {
    if (rooms && props.id_PatientRoom) {
      setRoomSelected(rooms.find((room) => room.id_Espacio === props.id_PatientRoom) || null);
      setDisableSelectedRoom(true);
    } else {
      setDisableSelectedRoom(false);
    }
  }, [rooms, props.id_PatientRoom]);

  console.log({ roomSelected });
  console.log({ rooms });

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Petición de enfermero" />
      <Box sx={style2}>
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
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
              <Stack sx={{ display: 'flex', flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar Paciente</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
                  disabled={disableUserSelection}
                  filterOptions={filterPatientOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    setUserSelected(val);
                    if (val?.id_IngresoPaciente !== undefined) {
                      fetchPatientRooms(val.id_IngresoPaciente);
                    }
                    setUserError(false);
                  }}
                  loading={isLoadingArticlesWareH && usersData.length === 0}
                  getOptionLabel={(option) => option.nombrePaciente}
                  isOptionEqualToValue={(option, value) => option.id_Paciente === value.id_Paciente}
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
              {!samiPatient && (
                <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300, ml: 'auto' }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un cuarto destino</Typography>

                  <Autocomplete
                    disablePortal
                    fullWidth
                    filterOptions={filterPatientRoomsOptions}
                    onChange={(e, val) => {
                      e.stopPropagation();
                      setRoomSelected(val);
                      setRoomError(false); //ñaca
                    }}
                    loading={isLoadingRooms && rooms.length === 0}
                    getOptionLabel={(option) => option.nombreEspacioHospitalario}
                    options={rooms}
                    value={roomSelected}
                    isOptionEqualToValue={(option, value) =>
                      option.id_EspacioHospitalario === value.id_EspacioHospitalario
                    }
                    disabled={disableSelectedRoom || !userSelected}
                    noOptionsText="No se encontraron cuartos"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={roomError}
                        helperText={roomError && 'Selecciona un cuarto'}
                        placeholder="Cuarto"
                        sx={{ width: '95%' }}
                      />
                    )}
                  />
                </Stack>
              )}
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
