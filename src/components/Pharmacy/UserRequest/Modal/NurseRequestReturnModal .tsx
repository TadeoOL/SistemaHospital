import {
  Autocomplete,
  Box,
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  createFilterOptions,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getWarehouseById } from '../../../../api/api.routes';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { shallow } from 'zustand/shallow';
import { IWarehouseData, IPatientFromSearch } from '../../../../types/types';
import { Cancel, Save, Info } from '@mui/icons-material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { getPatientInfoByAdmissionId } from '../../../../services/programming/patientService';
import { IHospitalSpace } from '../../../../types/admission/admissionTypes';
import { createReturnArticlesRequest } from '../../../../services/hospitalization/articleRequestService';
import { ArticlesFromRoom, IArticleDto } from '../../../../types/hospitalization/articleRequestTypes';
import { getHospitalRoomArticles } from '../../../../services/programming/hospitalSpace';
import { getPatientsWithAccount } from '../../../../services/admission/admisionService';
import { useReturnRequestOrderStore } from '../../../../store/pharmacy/nurseRequest/nurseRequestOrderReturn';
import { SearchBar } from '../../../Inputs/SearchBar';

const OPTIONS_LIMIT = 30;

const filterPatientOptions = createFilterOptions<IPatientFromSearch>({
  limit: OPTIONS_LIMIT,
});
const filterPatientRoomsOptions = createFilterOptions<IHospitalSpace>({
  limit: OPTIONS_LIMIT,
});

const filterWarehouseOptions = createFilterOptions<{ nombre: string; id: string }>({
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
  articles?: (IArticleDto & { nombreArticulo: string })[];
}

interface ReturnResumeProps {
  generalData: GeneralDataResumeProps;
  returningArticles: ArticleInfo[];
  isQuirurgicalRoom: boolean;
}
interface GeneralDataResumeProps {
  patientName: string;
  warehouseName: string;
  RoomName: string;
}
interface ArticleInfo extends ArticlesFromRoom {
  amountReturn: number;
  amountPatient: number;
}

export const NurseRequestReturnModal = (props: Props) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [resumeFlag, setResumeFlag] = useState(false);
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [roomSelected, setRoomSelected] = useState<null | IHospitalSpace>(null);
  const [rooms, setRooms] = useState<IHospitalSpace[]>([]);
  const [userError, setUserError] = useState(false);
  const [roomError, setRoomError] = useState(false);
  const [warehousesFetched, setWarehousesFetched] = useState<{ nombre: string; id: string }[]>();
  const [warehouseError, setWarehouseError] = useState(false);
  const [samiPatient] = useState(false);
  const [disableSelectedRoom, setDisableSelectedRoom] = useState(false);
  const [disableUserSelection, setDisableUserSelection] = useState(false);

  const [articlesMap, setArticlesMap] = useState<Map<string, ArticlesFromRoom>>(new Map());
  const [originalMap, setOriginalMap] = useState<Map<string, ArticlesFromRoom>>(new Map());
  const [warehouseSelected, setWarehouseSelected] = useState<{ nombre: string; id: string } | null>(null);
  const [resumeArticles, setResumeArticles] = useState<ArticleInfo[]>([]);
  const { setArticles, articles, setSearch, search } = useReturnRequestOrderStore(
    (state) => ({
      search: state.search,
      setSearch: state.setSearch,
      articles: state.articles,
      setArticles: state.setArticles,
    }),
    shallow
  );

  useEffect(() => {
    patientsCall();
  }, [patientSearch]);

  useEffect(() => {
    const fetch = async () => {
      setSearch('')
      setArticles([]);
      setUserSelected(null);
      setRoomSelected(null)
      setIsLoadingWarehouse(true);
      try {
        const warehouse: IWarehouseData = await getWarehouseById(props.warehouseId);
        warehouse;
        const subWH = warehouse.subAlmacenes
          .map((swh: IWarehouseData) => ({
            nombre: swh.nombre,
            id: swh.id_Almacen,
          }))
          .concat({ nombre: warehouse.nombre, id: warehouse.id_Almacen });
        setWarehousesFetched(subWH);
        setWarehouseSelected(subWH.find((w) => w.id == props.warehouseId) ?? null)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, []);

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
    setRooms(resCuartos.espaciosHospitalarios);
    setIsLoadingRooms(false);
  };

  const changeArticleQuantityInMap = (idArticle: string, cantidad: number) => {

    const articleToedit = articlesMap.get(idArticle);
    if (articleToedit) {
      articleToedit.cantidad = cantidad;
      articlesMap.set(idArticle, articleToedit)

      setArticlesMap(articlesMap);
    }
  };

  const calculateAmounts = () => {
    if (roomSelected) {
      const result: ArticleInfo[] = [];

      for (const [key, originalArticle] of originalMap) {
        const editedArticle = articlesMap.get(key);

        if (editedArticle) {

          /*const amountReturn =
            roomSelected.tipoEspacioHospitalario === 2
              ? editedArticle.cantidad
              : Math.max(0, originalArticle.cantidad - editedArticle.cantidad);

          const amountPatient =
            roomSelected.tipoEspacioHospitalario === 2
              ? Math.max(0, originalArticle.cantidad - editedArticle.cantidad)
              : editedArticle.cantidad;
          result.push({
            ...editedArticle,
            cantidad: originalArticle.cantidad,
            amountReturn,
            amountPatient,
          });*/
          const amountReturn =  editedArticle.cantidad

          const amountPatient = Math.max(0, originalArticle.cantidad - editedArticle.cantidad)
          result.push({
            ...editedArticle,
            cantidad: originalArticle.cantidad,
            amountReturn,
            amountPatient,
          });
        }
      }
      setResumeArticles(result.filter((art) => art.amountReturn > 0))
    }
  }

  const onSubmit = async () => {
    const object = {
      id_CuentaEspacioHospitalario: roomSelected?.id_EspacioHospitalario ?? '',
      id_Almacen: warehouseSelected?.id ?? '',
      tipoDevolucion: roomSelected?.tipoEspacioHospitalario == 1? 6 : 8,
      articulos: resumeArticles.filter((ra) => ra.amountReturn > 0).map((ra) => ({
        id_CuentaArticulo: ra.id,
        id_Articulo: ra.id_Articulo,
        cantidad: ra.amountReturn * -1,
      }))
    }
    try {
      await createReturnArticlesRequest(object);
      toast.success('Solicitud creada');
      props.refetch(props.warehouseId);
      props.setOpen(false);
      setArticles([]);
      setUserSelected(null);
      setWarehouseSelected(null);
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

  if (isLoadingWarehouse)
    return (
      <Backdrop open>
        <CircularProgress size={24} />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={resumeFlag ? "Resumen" : "Devolución de Artículos"} />
      <Box sx={style2}>
        <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
          {resumeFlag ? (
            <>
              <ReturnResume
                generalData={{
                  patientName: userSelected?.nombrePaciente ?? "",
                  warehouseName: warehouseSelected?.nombre ?? "",
                  RoomName: roomSelected?.nombreEspacioHospitalario ?? ""
                }}
                returningArticles={resumeArticles}
                isQuirurgicalRoom={roomSelected != null && roomSelected.tipoEspacioHospitalario == 1}
              />
            </>
          )
            :
            (
              <>
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
                        loading={false && usersData.length === 0}
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
                        <>
                          <Autocomplete
                            disablePortal
                            fullWidth
                            filterOptions={filterWarehouseOptions}
                            onChange={(_, val) => {
                              setWarehouseError(false);
                              setWarehouseSelected(val);
                              setArticles([]);
                            }}
                            loading={isLoadingWarehouse}
                            getOptionLabel={(option) => option.nombre}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            options={warehousesFetched ?? []}
                            value={warehouseSelected}
                            noOptionsText="No se encontraron almacenes"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={userError}
                                helperText={userError && 'Selecciona un almacen'}
                                placeholder="Almacen"
                                sx={{ width: '100%' }}
                              />
                            )}
                          />
                        </>)}
                    </Stack>
                    {!samiPatient && (
                      <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300, ml: 'auto' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un cuarto destino</Typography>

                        <Autocomplete
                          disablePortal
                          fullWidth
                          filterOptions={filterPatientRoomsOptions}
                          onChange={async (e, val) => {
                            e.stopPropagation();
                            setRoomSelected(val);
                            setRoomError(false);
                            if (val?.tipoEspacioHospitalario) {
                              const res = await getHospitalRoomArticles(val?.id_EspacioHospitalario ?? '');
                              setArticles(res)
                              const newMap = new Map();
                              const newMapEdited = new Map();
                              res.forEach((article: ArticlesFromRoom) => {
                                newMap.set(article.id, { ...article });
                              });
                              res.forEach((article: ArticlesFromRoom) => {
                                newMapEdited.set(article.id, { ...article, cantidad: 0 });
                              });
                              setOriginalMap(newMap)
                              setArticlesMap(newMapEdited)
                            }
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
                  {roomSelected !== null && (<SearchBar
                    searchState={setSearch}
                    search={search}
                    size="medium"
                    sx={{ maxWidth: 310 }}
                    title="Buscar articulo..."
                  />)}
                </Box>

                <ArticlesTable setAmountText={changeArticleQuantityInMap} quirurgicalRoomFlag={roomSelected?.tipoEspacioHospitalario == 1} />
              </>
            )
          }
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
                if (resumeFlag) {
                  setResumeFlag(false)
                } else {
                  props.setOpen(false);
                }
              }}
            >
              {resumeFlag ? 'Regresar' : 'Cancelar'}
            </Button>
            <Button
              variant="contained"
              endIcon={<Save />}
              onClick={() => {
                if (resumeFlag) {
                  onSubmit();
                } else {
                  calculateAmounts();
                  setResumeFlag(true);
                }
              }}
              disabled={roomSelected == null || articles.length < 1 || warehouseError || userSelected == null}
            >
              Guardar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

const ArticlesTable = (props: { setAmountText: Function; quirurgicalRoomFlag: boolean }) => {
  const { articles } = useReturnRequestOrderStore(
    (state) => ({
      articles: state.articles,
    }),
    shallow
  );

  return (
    <>
      <Card sx={{ mt: 4, overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 380 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Articulo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Hora Cargo</TableCell>
                <TableCell>Devolución</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .map((a) => (
                  <ArticlesRows
                    articleRow={a}
                    setAmountText={props.setAmountText}
                    amountText={'0'}
                  />
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

interface ArticlesRowsProps {
  articleRow: ArticlesFromRoom;
  setAmountText: Function;
  amountText: string;
}
const ArticlesRows: React.FC<ArticlesRowsProps> = ({
  articleRow,
  setAmountText,
  amountText,
}) => {
  const [numberText, setNumberText] = useState(amountText);
  const { search } = useReturnRequestOrderStore(
    (state) => ({
      search: state.search
    }),
    shallow
  );
  return (
    articleRow.nombre.includes(search) || search === '' ? <TableRow key={articleRow.id_Articulo}>
      <TableCell>
        {articleRow.nombre}
      </TableCell>
      <TableCell>
        {articleRow.cantidad}
      </TableCell>
      <TableCell>
        {articleRow.fechaCargo}
      </TableCell>
      <TableCell>
        <TextField
          label="Cantidad"
          size="small"
          InputLabelProps={{ style: { fontSize: 12 } }}
          value={numberText}
          onChange={(e) => {
            if (!isValidInteger(e.target.value)) return;
            setAmountText(articleRow.id, Number(e.target.value));
            if (e.target.value === '') {
              setNumberText('0');
            }
            setNumberText(e.target.value);
          }}
        />
      </TableCell>
    </TableRow>
      : (<></>)
  );
};


const ReturnResume: React.FC<ReturnResumeProps> = ({
  generalData,
  returningArticles,
  isQuirurgicalRoom,
}) => {

  return (
    <>
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
            <Typography>Paciente: {generalData.patientName}</Typography>
            <Typography>Almacén Dirigido: {generalData.warehouseName}</Typography>
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
          <Stack sx={{ display: 'flex', flex: 1 }}>
            <Typography>Quirófano: {generalData.RoomName}</Typography>
          </Stack>
        </Box>
        <Card sx={{ mt: 4, overflowX: 'auto' }}>
          <TableContainer sx={{ minWidth: 380 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Articulo</TableCell>
                  <TableCell>Cantidad de Articulo</TableCell>
                  {isQuirurgicalRoom && (<TableCell>Uso en el Paciente</TableCell>)}
                  <TableCell>Devolución a Farmacia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returningArticles
                  .map((articleRow) => (
                    <TableRow key={articleRow.id} >
                      <TableCell>
                        {isQuirurgicalRoom ? articleRow.nombre : articleRow.nombre+" "+articleRow.fechaCargo}
                      </TableCell>
                      <TableCell>
                        {articleRow.cantidad}
                      </TableCell>
                      {isQuirurgicalRoom && (<TableCell>
                        {articleRow.amountPatient}
                      </TableCell>)}
                      <TableCell>
                        {articleRow.amountReturn}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {returningArticles.length === 0 && (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', py: 2 }}>
              <Info sx={{ width: 20, height: 20, color: 'gray', opacity: 0.6 }} />
              <Typography variant="h6" sx={{ color: 'gray', opacity: 0.6 }}>
                No hay artículos seleccionados
              </Typography>
            </Box>
          )}
        </Card>
      </Box>
    </>
  );
};
