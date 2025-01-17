import {
  Autocomplete,
  Box,
  Modal,
  Button,
  Card,
  CircularProgress,
  Radio,
  IconButton,
  Stack,
  styled,
  Collapse,
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
  tableCellClasses,
  alpha,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  articlesOutputToWarehouseToWarehouse,
  getArticlesFromWarehouseSearch,
  getNursesUsers,
  getExistingArticles,
  getPackageById,
} from '../../../../api/api.routes';
import { addNewArticlesPackage } from '../../../../schema/schemas';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Save, Edit, Delete, Info, Cancel, ExpandLess, ExpandMore, WarningAmber } from '@mui/icons-material';
import {
  IArticleFromSearch,
  IArticlesPackage,
  IArticlesPackageSearch,
  IExistingArticleList,
  IPatientFromSearch,
} from '../../../../types/types';
import { ArticlesFetched } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/ArticlesOutput';
import { LoteSelectionRemake2 } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelectionRemake2';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { getPatientsWithAccount } from '../../../../services/programming/patientService';
import { usePackageNamesPaginationStore } from '../../../../store/warehouseStore/packagesNamesPagination';
import { shallow } from 'zustand/shallow';
///cambiar esta fokin she
const OPTIONS_LIMIT = 30;
const filterArticleOptions = createFilterOptions<IArticleFromSearch>({
  limit: OPTIONS_LIMIT,
});
const filterPackageOptions = createFilterOptions<IArticlesPackageSearch>({
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
const NestedTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 1),
    fontWeight: 'bold',
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
    fontSize: 11,
  },
  [`&.${tableCellClasses.root}`]: {
    paddingLeft: '20px',
    width: '50%',
    paddingTop: '5px',
    paddingBottom: '5px',
    justifyContent: 'center',
  },
}));

const useGetAllData = () => {
  const { isLoading, data, searchPack, setSearchPack, fetchWarehousePackages } = usePackageNamesPaginationStore(
    (state) => ({
      searchPack: state.search,
      setSearchPack: state.setSearch,
      data: state.data,
      isLoading: state.isLoading,
      fetchWarehousePackages: state.fetchWarehousePackages,
    }),
    shallow
  );

  useEffect(() => {
    fetchWarehousePackages();
  }, [searchPack]);

  return {
    isLoading,
    data,
    setSearchPack,
  };
};

export const ArticlesExitModal = (props: { setOpen: Function; warehouseId: string; refetch: Function }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticleFromSearch[]>([]);
  const [dataWerehouseSelectedArticlesInitial, setDataWerehouseArticlesSelectedInitial] = useState<
    IArticleFromSearch[]
  >([]);
  const [nursesData, setNursesData] = useState<{ id_Enfermero: string; nombre: string }[]>([]);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [reasonMessage, setReasonMessage] = useState('');
  const [packageSelected, setPackageSelected] = useState<IArticlesPackage | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, setSearchPack } = useGetAllData();

  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
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
        handleFetchArticlesPackagesFromWareHouse();
        patientsCall();
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
      try {
        const res = await getExistingArticles(
          `${'pageIndex=1&pageSize=20'}&search=${search}&habilitado=${true}&Id_Almacen=${props.warehouseId}&Id_AlmacenPrincipal=${props.warehouseId}&fechaInicio=&fechaFin=&sort=`
        );
        setDataWerehouseArticlesSelected(
          res.data.map((a: IArticleFromSearch) => {
            return { ...a };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [search]);
  const [articles, setArticles] = useState<ArticlesFetched[] | []>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);

  const [articleSelected, setArticleSelected] = useState<null | IArticleFromSearch>(null);
  const [nurseSelected, setNurseSelected] = useState<{ id_Enfermero: string; nombre: string } | null>();
  const [userError, setUserError] = useState(false);
  const [articleError, setArticleError] = useState(false);
  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [loteEditing, setLoteEditing] = useState(false);
  const [temporalLoteEditing, setTemporalLoteEditing] = useState(false);
  const [loteSelected, setLoteSelected] = useState<
    { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[] | null
  >(null);
  const [articlesToSelect, setArticlesToSelect] = useState<ArticlesFetched[] | []>([]);
  const [amountToSelect, setAmountToSelect] = useState<number | undefined>();

  useEffect(() => {
    setArticleSelected(null);
  }, [props.setOpen]);

  useEffect(() => {
    patientsCall();
  }, [patientSearch]);

  useEffect(() => {
    if (!openLoteModal) {
      setArticleSelected(null);
      setAmountToSelect(undefined);
    }
  }, [openLoteModal]);

  const patientsCall = async () => {
    const url = `Search=${patientSearch}`;
    const res = await getPatientsWithAccount(url);
    if (res) {
      setUsersData(res);
    }
  };

  const handleAddArticle = (lotesArticles: IExistingArticleList[], edit: boolean) => {
    let totalQuantityByArticle = 0;
    const updatedLote: { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[] = [];
    lotesArticles.forEach((element) => {
      const nestedLote = {
        cantidad: element.cantidad,
        id_ArticuloExistente: element.id_ArticuloExistente,
        fechaCaducidad: element.fechaCaducidad,
      };
      updatedLote.push(nestedLote);
      totalQuantityByArticle += element.cantidad;
    });
    const updatedArticle = {
      ...articleSelected,
      cantidad: totalQuantityByArticle,
      lote: updatedLote,
    };
    if (temporalLoteEditing) {
      const direction = articlesToSelect.findIndex(
        (art) => art.id_Articulo === ((articleSelected as any)?.id_Articulo || '')
      );
      articlesToSelect.splice(direction, 1);
      setArticles([...(articles as any), updatedArticle]);
      setArticleSelected(null);
      setTemporalLoteEditing(false);
      return;
    }
    if (edit) {
      const direction = articles.findIndex(
        (art: any) => art.id_Articulo === ((articleSelected as any)?.id_Articulo || '')
      );
      articles.splice(direction, 1);
      setArticles([...(articles as any), updatedArticle]);
      setArticleSelected(null);
      setLoteEditing(false);
    } else {
      setArticles((prev: any) => [...prev, updatedArticle]);
      setArticleSelected(null);
    }
  };

  const handleAddArticlesFromPackage = (packageL: IArticlesPackage) => {
    const formatPackageL = packageL.contenido
      ?.filter(
        (val: any) =>
          !(
            articles.map((art) => art.id_Articulo).includes(val.id) ||
            articlesToSelect.map((art) => art.id_Articulo).includes(val.id)
          )
      )
      .map((artPack: any) => ({
        id_Articulo: artPack.id_Articulo,
        nombre: artPack.nombre,
        lote: artPack?.lote
          ? artPack.lote.map((artLote: any) => ({
              ...artLote,
            }))
          : [],
        cantidad: artPack.cantidad.toString(),
        cantidadSeleccionar: artPack.cantidadSeleccionar,
        //cambio quiza agregar codigo de barras
      }));
    setArticlesToSelect(formatPackageL as any[]);
  };

  const handleFetchArticlesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getArticlesFromWarehouseSearch(search, props.warehouseId);
      const transformedData = res.map((item: any) => ({
        id_Articulo: item.id_Articulo,
        nombre: item.nombre,
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
    if (reasonMessage === 'Cuenta Paciente' && !userSelected) {
      setUserError(true);
      toast.error('Selecciona un paciente');
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
        article.lote.forEach((loteA: any) => {
          articlesArticlesExit.push({
            Id_ArticuloExistente: loteA.id_ArticuloExistente,
            Cantidad: loteA.cantidad.toString(),
            fechaCaducidad: loteA.fechaCaducidad,
          });
        });
      }
      const object = {
        Lotes: articlesArticlesExit,
        id_almacenDestino: '',
        id_almacenOrigen: props.warehouseId,
        EnEspera: true,
        Id_CuentaPaciente: userSelected?.id_Cuenta,
        SalidaMotivo:
          reasonMessage === 'Otro'
            ? textFieldRef.current?.value
            : `${reasonMessage} ${userSelected?.nombreCompleto || ''}`,
        SolicitadoPor: nurseSelected.nombre,
        Id_Enfermero: nurseSelected.id_Enfermero,
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

  const radioOptions = ['Cuenta Paciente', 'Uso interno', 'Otro'];

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
              <Stack sx={{ display: 'flex', flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar un paquete</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
                  filterOptions={filterPackageOptions}
                  onChange={async (e, val) => {
                    e.stopPropagation();
                    if (val !== null) {
                      setIsLoadingWarehouse(true);
                      const packageProm = await getPackageById(val?.id_PaqueteArticulo as string);
                      setPackageSelected(packageProm);
                      handleAddArticlesFromPackage(packageProm);
                      setIsLoadingWarehouse(false);
                    }
                    setPackageSelected(null);
                  }}
                  loading={isLoading}
                  getOptionLabel={(option) => option.nombre}
                  options={data ? data : []}
                  value={packageSelected}
                  noOptionsText="No se encontraron paquetes"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Paquetes de artículos"
                      sx={{ width: '100%' }}
                      onChange={(e) => {
                        setSearchPack(e.target.value);
                      }}
                    />
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
                      if (val !== null) {
                        if (
                          !(
                            articles.map((art) => art.id_Articulo).includes(val.id_Articulo) ||
                            articlesToSelect.map((art) => art.id_Articulo).includes(val.id_Articulo)
                          )
                        ) {
                          setOpenLoteModal(true);
                        }
                        setArticleId(val.id_Articulo);
                        setArticleSelected(val);
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
              </Box>
              <ArticlesTable
                setOpen={props.setOpen}
                submitData={onSubmit}
                setLoteEditing={setLoteEditing}
                setLoteSelected={setLoteSelected}
                setArticleSelected={setArticleSelected}
                setOpenLoteModal={setOpenLoteModal}
                setArticles={setArticles}
                articles={articles || []}
                articlesPending={articlesToSelect}
                setArticlesPending={setArticlesToSelect}
                setTemporalLoteEditing={setTemporalLoteEditing}
                setArticleId={setArticleId}
                setAmountToSelect={setAmountToSelect}
              />
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
              {reasonMessage === 'Cuenta Paciente' && (
                <Stack sx={{ display: 'flex', flex: 1, ml: 5 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar paciente</Typography>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    filterOptions={filterPatientOptions}
                    onChange={(e, val) => {
                      e.stopPropagation();
                      setUserSelected(val);
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
              )}
              <Stack sx={{ display: 'flex', flex: 1, p: 2 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de enfermeros</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
                  //filterOptions={filterArticleOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    setNurseSelected(val);
                    setArticleError(false); //cambiar
                  }}
                  loading={isLoadingArticlesWareH}
                  getOptionLabel={(option) => option.nombre}
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
        </Box>
      )}
      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <>
          <LoteSelectionRemake2
            setOpen={setOpenLoteModal}
            //lotes={(articleSelected?.lote as any) || []}
            articleName={articleSelected?.nombre || ''}
            addFunction={handleAddArticle}
            editing={loteEditing}
            selectedLotes={loteSelected as { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[]}
            temporalFromPackageAmountSelect={amountToSelect}
            empityLotes={true}
          />
        </>
      </Modal>
    </Box>
  );
};

const ArticlesTable = (props: {
  setOpen: Function;
  submitData: Function;
  articles: ArticlesFetched[];
  setArticles: Function;
  setArticleId: Function;
  setLoteEditing: Function;
  setLoteSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
  articlesPending: ArticlesFetched[] | null;
  setArticlesPending: Function;
  setTemporalLoteEditing: Function;
  setAmountToSelect: Function;
}) => {
  return (
    <>
      <Card sx={{ mt: 4, overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 380 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre Articulo</TableCell>
                <TableCell style={{ whiteSpace: 'pre-line' }}>{'Cantidad a\nSeleccionar'}</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Acción</TableCell>
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
                      setLoteEditing={props.setLoteEditing}
                      setArticleSelected={props.setArticleSelected}
                      setOpenLoteModal={props.setOpenLoteModal}
                      setArticles={props.setArticles}
                      articleRow={a}
                      articles={props.articles}
                      setLoteSelected={props.setLoteSelected}
                      setArticleId={props.setArticleId}
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
                      setLoteEditing={props.setLoteEditing}
                      setArticleSelected={props.setArticleSelected}
                      setOpenLoteModal={props.setOpenLoteModal}
                      setArticles={props.setArticlesPending}
                      articleRow={a}
                      articles={props.articlesPending}
                      setTemporalLoteEditing={props.setTemporalLoteEditing}
                      setArticleId={props.setArticleId}
                      setAmountToSelect={props.setAmountToSelect}
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
  setLoteEditing: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
  setArticles: Function;
  setArticleId: Function;
  setLoteSelected: Function;
  articleRow: any;
  articles: any;
}
const ArticlesRows: React.FC<ArticlesRowsProps> = ({
  setLoteEditing,
  setArticleSelected,
  setOpenLoteModal,
  setLoteSelected,
  setArticleId,
  setArticles,
  articleRow,
  articles,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={articleRow.id_Articulo}>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
            {articleRow.nombre}
          </Box>
        </TableCell>
        <TableCell></TableCell>
        <TableCell align={'center'}>{articleRow.cantidad}</TableCell>
        <TableCell align={'center'}>
          <>
            <Tooltip title={'Editar'}>
              <IconButton
                onClick={() => {
                  setLoteSelected(articleRow.lote);
                  setArticleId(articleRow.id_Articulo);
                  setLoteEditing(true);
                  setArticleSelected(articleRow);
                  setOpenLoteModal(true);
                }}
              >
                <Edit />
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
      {articleRow?.lote?.length > 0 && (
        <TableRow>
          <TableCell colSpan={3} sx={{ padding: 0 }} key={`${articleRow.id_Articulo}${articleRow.nombre}`}>
            <NestedArticlesTable articles={articleRow.lote} open={open} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

interface NestedArticlesTableProps {
  articles: ArticlesFetched['lote'];
  open: boolean;
}
const NestedArticlesTable: React.FC<NestedArticlesTableProps> = ({ open, articles }) => {
  return (
    <Collapse in={open}>
      <Table sx={{ marginRight: 2 }}>
        <TableHead>
          <TableRow>
            <NestedTableCell>Cantidad</NestedTableCell>
            <NestedTableCell>Fecha de Caducidad</NestedTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles ? (
            articles.map((a) => (
              <TableRow key={a.id_ArticuloExistente}>
                <NestedTableCell>{a.cantidad}</NestedTableCell>
                <NestedTableCell>{a.fechaCaducidad}</NestedTableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </Collapse>
  );
};

//Filas temporales de articulos que faltan de seleccionar lote
interface TemporalArticlesRowsProps {
  setLoteEditing: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
  setArticles: Function;
  articleRow: any;
  articles: any;
  setTemporalLoteEditing: Function;
  setArticleId: Function;
  setAmountToSelect: Function;
}
const TemporalArticlesRows: React.FC<TemporalArticlesRowsProps> = ({
  setArticleSelected,
  setOpenLoteModal,
  setArticles,
  articleRow,
  articles,
  setTemporalLoteEditing,
  setArticleId,
  setAmountToSelect,
}) => {
  return (
    <>
      <TableRow key={articleRow.id_Articulo}>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <WarningAmber
              sx={{
                mr: 1,
                color: articleRow.cantidad > 0 ? 'rgb(204, 153, 0)' : 'red',
              }}
            />
            {articleRow.nombre}
          </Box>
        </TableCell>
        <TableCell align={'center'}>{articleRow.cantidadSeleccionar}</TableCell>
        <TableCell align={'center'}>{articleRow.cantidad}</TableCell>
        <TableCell>
          <>
            {articleRow.cantidad > 0 && (
              <Tooltip title={'Agregar'}>
                <IconButton
                  onClick={() => {
                    setTemporalLoteEditing(true);
                    setArticleSelected(articleRow);
                    setAmountToSelect(articleRow.cantidadSeleccionar);
                    setArticleId(articleRow.id_Articulo);
                    setOpenLoteModal(true);
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
