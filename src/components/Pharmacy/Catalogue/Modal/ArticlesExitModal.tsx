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
import { addNewArticlesPackage } from '../../../../schema/schemas';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Save, Edit, Delete, Info, Cancel, WarningAmber } from '@mui/icons-material';
import { IArticleFromSearchWithQuantity, IArticlesPackage, IPatientFromSearch } from '../../../../types/types';
//import { ArticlesFetched } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/ArticlesOutput';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import AnimateButton from '../../../@extended/AnimateButton';
import {
  articlesOutputToWarehouseToWarehouse,
  getExistingArticles,
} from '../../../../services/warehouse/articleWarehouseService';
import { IHospitalSpace } from '@/types/admission/admissionTypes';
import { getPatientInfoByAdmissionId, getPatientsWithAccount } from '@/services/programming/patientService';
import { useGetAllNursesUsers } from '@/hooks/hospitalization/useGetAllNurse';
import { chargeArticlesToPatientDirectly } from '@/services/pharmacy/inventoryOutflowsService';
///cambiar esta fokin she
const OPTIONS_LIMIT = 30;
const filterArticleOptions = createFilterOptions<IArticleFromSearchWithQuantity>({
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
  width: { xs: 380, md: 900 },

  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
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

export const ArticlesExitModal = (props: { setOpen: Function; warehouseId: string; refetch: Function }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticleFromSearchWithQuantity[]>(
    []
  );
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [reasonMessage, setReasonMessage] = useState('');
  const [search, setSearch] = useState('');

  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);

  useEffect(() => {
    setWarehouseId(props.warehouseId);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        handleFetchArticlesFromWareHouse();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetch = async () => {
      await handleFetchArticlesFromWareHouse();
    };
    fetch();
  }, [search]);
  const [articles, setArticles] = useState<IArticleFromSearchWithQuantity[] | []>([]);
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);

  const [articleSelected, setArticleSelected] = useState<null | IArticleFromSearchWithQuantity>(null);
  const [articleError, setArticleError] = useState(false);
  const [articlesToSelect, setArticlesToSelect] = useState<IArticleFromSearchWithQuantity[] | []>([]);
  const [amountText, setAmountText] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [userError, setUserError] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [rooms, setRooms] = useState<IHospitalSpace[]>([]);
  const [roomSelected, setRoomSelected] = useState<null | IHospitalSpace>(null);
  const [roomError, setRoomError] = useState(false);
  const [nurseSelected, setNurseSelected] = useState<{ id: string; nombre: string; } | null>(null)
  const [nurseError, setNurseError] = useState(false);
  const { nursesUsersData, isLoadingNursesUsers } = useGetAllNursesUsers();


  useEffect(() => {
    setArticleSelected(null);
  }, [props.setOpen]);

  const handleAddArticle = () => {
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
      id_Articulo: articleSelected.id_Articulo,
      id_ArticuloAlmacen: articleSelected.id_ArticuloAlmacen,
      nombre: articleSelected.nombre,
      cantidad: parseFloat(amountText),
      stock: articleSelected.stock,
    };

    setArticles([...articles, objectArticle]);
    setDataWerehouseArticlesSelected(
      dataWerehouseSelectedArticles.filter((art) => art.id_Articulo !== articleSelected.id_Articulo)
    );
    setArticleSelected(null);
    setAmountText('');
  };

  const handleEditArticle = (editedArticle: IArticleFromSearchWithQuantity) => {
    console.log('lo q manda', editedArticle);
    const direction = articles.findIndex((artp) => artp.id_Articulo === editedArticle.id_Articulo);
    const copy = articles.slice();
    copy[direction] = editedArticle;
    setArticles(copy);
  };

  const handleFetchArticlesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getExistingArticles(
        `${'pageIndex=1&pageSize=20'}&search=${search}&habilitado=${true}&Id_Almacen=${props.warehouseId}&Id_AlmacenPrincipal=${props.warehouseId}&fechaInicio=&fechaFin=&sort=`
      );
      const transformedData = res.data.map((item: any) => ({
        id_Articulo: item.id_Articulo as string,
        nombre: item.nombre as string,
        stock: item.stockActual as number ,
        id_ArticuloAlmacen: item.id_ArticuloAlmacen as string,
        cantidad: null
      }));
      console.log(transformedData);
      setDataWerehouseArticlesSelected(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };
  /*
  const handleFetchArticlesPackagesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      const resNurses = await getNursesUsers();
      setNursesData(resNurses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };
  */
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
    if(reasonMessage === 'Cuenta Paciente' ){
      const flagError = userError && roomError && nurseError && articles.length < 1
      if(flagError){
        if(userError){
          toast.error('Selecciona un paciente');
        }
        if(roomError){
          toast.error('Selecciona un cuarto o quirofano');
        }
        if(nurseError){
          toast.error('Selecciona un enfermero');
        }
        if(articles.length < 1){
          toast.error('Agrega un articulo');
        }
        return;
      }
      else{
        try {
          if (!validateAmount) return;
          setLoadingSubmit(true);
          const arttest = articles.map((article) => { return {
            Id_Articulo: article.id_Articulo,
            Cantidad: Number(article.cantidad)
          }})
          const obj2 = {
            Id_CuentaEspacioHospitalario: roomSelected?.id_EspacioHospitalario ?? '',
            Id_Almacen: props.warehouseId,
            Id_Enfermero: nurseSelected?.id ?? '',
            Articulos: arttest
          }
    
          await chargeArticlesToPatientDirectly(obj2)
  
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
        } finally{
          return
        }
      }
    }
    /*if (!nurseSelected) {
      toast.error('Selecciona enfermero');
      return;
    }*/
    try {
      if (!validateAmount) return;
      setLoadingSubmit(true);
      
      const existingArticles = articles.map((article) => {
        return {
          Id_Articulo: article.id_Articulo,
          Id_ArticuloAlmacenStock: article.id_ArticuloAlmacen,
          Nombre: article.nombre,
          Cantidad: Number(article.cantidad),
        };
      });

      const object = {
        articulos: existingArticles,
        id_Almacen: props.warehouseId,
        //EnEspera: true,
        //Id_CuentaPaciente: userSelected?.id_Cuenta,
        motivo:
          reasonMessage === 'Otro'
            ? textFieldRef.current?.value
            : `${reasonMessage} ${userSelected?.nombrePaciente || ''}`,
        //SolicitadoPor: nurseSelected.nombre,
        //Id_Enfermero: nurseSelected.id_Enfermero,
      };
      await articlesOutputToWarehouseToWarehouse(object);
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

  useEffect(() => {
    patientsCall();
  }, [patientSearch]);

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
    const roomsFiltered = resCuartos.espaciosHospitalarios;
    setRooms(roomsFiltered);
    setIsLoadingRooms(false);
  };

  const radioOptions = ['Uso interno', 'Cuenta Paciente', 'Otro'];

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Salida de artículos" />
      {isLoadingWarehouse ? (
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: 300,
          }}
        >
          <CircularProgress size={40} sx={{ my: 'auto' }} />
        </Box>
      ) : (
        <Box sx={style2}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
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
                    setUserSelected(null);
                  }}
                >
                  {radioOptions.map((option) => (
                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                  ))}
                 {reasonMessage === 'Otro' && ( <TextField
                    inputRef={textFieldRef}
                    label={'Razón de salida'}
                    error={true}
                    sx={{
                      visibility: reasonMessage === 'Otro' ? 'visible' : 'hidden',
                    }}
                  />)}
                </RadioGroup>
              </Box>
              {reasonMessage === 'Cuenta Paciente' && (
                <>
                <Stack sx={{ display: 'flex', flexDirection:'row' }} >
                <Stack sx={{ display: 'flex',flex:1, maxWidth:400, minWidth:200 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar Paciente</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
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
                <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300, ml: 'auto' }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un cuarto destino</Typography>

                <Autocomplete
                  disablePortal
                  fullWidth
                  filterOptions={filterPatientRoomsOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    setRoomSelected(val);
                    setRoomError(false);
                  }}
                  loading={isLoadingRooms && rooms.length === 0}
                  getOptionLabel={(option) => option.nombreEspacioHospitalario}
                  options={rooms}
                  value={roomSelected}
                  isOptionEqualToValue={(option, value) =>
                    option.id_EspacioHospitalario === value.id_EspacioHospitalario
                  }
                  disabled={!userSelected}
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
                </Stack>
                
              <Stack sx={{ display: 'flex', flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de enfermeros</Typography>
                <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setNurseSelected(val)
              setNurseError(false)
            }}
            loading={isLoadingNursesUsers}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={nursesUsersData}
            value={nurseSelected}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setNurseSelected(null)
              }
            }}
            noOptionsText="No se encontraron enfermeros"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enfermero"
                error={nurseError}
                helperText={'Es necesario seleccionar un enfermero'}
              />
            )}
          />
              </Stack>
              </>
              )}
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
                        if (val !== null) {
                          if (
                            !(
                              articles.map((art) => art.id_Articulo).includes(val.id_Articulo) ||
                              articlesToSelect.map((art) => art.id_Articulo).includes(val.id_Articulo)
                            )
                          ) {
                            console.log('no se wey');
                          }
                          setArticleId(val.id_Articulo);
                          setArticleSelected(val);
                          console.log('eldeste', val);
                          setArticleError(false);
                        }
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
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                          placeholder="Artículos"
                          sx={{ width: '100%' }}
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
                    {articleSelected?.id_Articulo && (
                      <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                        Stock Disponible : {articleSelected.stock}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        mt: 2,
                      }}
                    >
                      <AnimateButton>
                        <Button
                          size="medium"
                          variant="contained"
                          startIcon={<AddCircleIcon />}
                          onClick={() => handleAddArticle()}
                        >
                          Agregar
                        </Button>
                      </AnimateButton>
                    </Box>
                  </Stack>
                </Box>
              </Box>
              <ArticlesTable
                setOpen={props.setOpen}
                submitData={onSubmit}
                setArticleSelected={setArticleSelected}
                setArticles={setArticles}
                articles={articles || []}
                articlesPending={articlesToSelect}
                setArticlesPending={setArticlesToSelect}
                setArticleId={setArticleId}
                handleEditArticle={handleEditArticle}
              />

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
        </Box>
      )}
    </Box>
  );
};

const ArticlesTable = (props: {
  setOpen: Function;
  submitData: Function;
  articles: IArticleFromSearchWithQuantity[];
  setArticles: Function;
  setArticleId: Function;
  setArticleSelected: Function;
  articlesPending: IArticleFromSearchWithQuantity[] | null;
  setArticlesPending: Function;
  handleEditArticle: Function;
}) => {
  return (
    <>
      <Card sx={{ mt: 4, overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 380 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre Articulo</TableCell>
                <TableCell align={'center'}>Cantidad</TableCell>
                <TableCell align={'center'}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.articles?.length > 0 ? (
                props.articles
                  ?.slice()
                  .reverse()
                  .map((a) => (
                    <ArticlesRows
                      key={a.id_Articulo}
                      setArticles={props.setArticles}
                      articleRow={a}
                      articles={props.articles}
                      handleEditArticle={props.handleEditArticle}
                    />
                  ))
              ) : (
                <></>
              )}
              {props?.articlesPending && props.articlesPending?.length > 0 ? (
                props.articlesPending
                  ?.slice()
                  .reverse()
                  .map((a) => (
                    <TemporalArticlesRows
                      key={a.id_Articulo}
                      setArticleSelected={props.setArticleSelected}
                      setArticles={props.setArticlesPending}
                      articleRow={a}
                      articles={props.articlesPending}
                      setArticleId={props.setArticleId}
                    />
                  ))
              ) : (
                <></>
              )}
              {}
            </TableBody>
          </Table>
        </TableContainer>
        {props.articles.length === 0 && (
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

interface ArticlesRowsProps {
  setArticles: Function;
  articleRow: IArticleFromSearchWithQuantity;
  articles: IArticleFromSearchWithQuantity[];
  handleEditArticle: Function;
}
const ArticlesRows: React.FC<ArticlesRowsProps> = ({ setArticles, articleRow, articles, handleEditArticle }) => {
  const [edit, setEdit] = useState(false);
  const [amountText, setAmountText] = useState(articleRow.cantidad?.toString() ?? '');

  return (
    <>
      <TableRow key={articleRow.id_Articulo}>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>{articleRow.nombre}</Box>
        </TableCell>
        <TableCell align={'center'}>
          {edit ? (
            <>
              <TextField
                label="Cantidad"
                size="small"
                InputLabelProps={{ style: { fontSize: 12 } }}
                value={amountText}
                onChange={(e) => {
                  if (!isValidInteger(e.target.value)) return;
                  setAmountText(e.target.value);
                }}
              />
              <Typography>stack max: {articleRow.stock} </Typography>
            </>
          ) : (
            articleRow.cantidad
          )}
        </TableCell>
        <TableCell align={'center'}>
          <>
            <Tooltip title={edit ? 'Guardar' : 'Editar'}>
              <IconButton
                onClick={() => {
                  setEdit(!edit);
                  if (edit) {
                    handleEditArticle({ ...articleRow, cantidad: Number(amountText) });
                  }
                }}
              >
                {edit ? <Save /> : <Edit />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  setArticles(articles.filter((art: any) => art.id_Articulo !== articleRow.id_Articulo));
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        </TableCell>
      </TableRow>
    </>
  );
};

//Filas temporales de articulos que faltan de seleccionar lote
interface TemporalArticlesRowsProps {
  setArticleSelected: Function;
  setArticles: Function;
  articleRow: IArticleFromSearchWithQuantity;
  articles: any;
  setArticleId: Function;
}
const TemporalArticlesRows: React.FC<TemporalArticlesRowsProps> = ({
  setArticleSelected,
  setArticles,
  articleRow,
  articles,
  setArticleId,
}) => {
  return (
    <>
      <TableRow key={articleRow.id_Articulo}>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <WarningAmber
              sx={{
                mr: 1,
                color: (articleRow.cantidad ?? 0 > 0) ? 'rgb(204, 153, 0)' : 'red',
              }}
            />
            {articleRow.nombre}
          </Box>
        </TableCell>
        <TableCell align={'center'}>{articleRow.cantidad}</TableCell>
        <TableCell>
          <>
            {(articleRow.cantidad ?? 0) > 0 && (
              <Tooltip title={'Agregar'}>
                <IconButton
                  onClick={() => {
                    setArticleSelected(articleRow);
                    setArticleId(articleRow.id_Articulo);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  setArticles(articles.filter((art: any) => art.id_Articulo !== articleRow.id_Articulo));
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        </TableCell>
      </TableRow>
    </>
  );
};
