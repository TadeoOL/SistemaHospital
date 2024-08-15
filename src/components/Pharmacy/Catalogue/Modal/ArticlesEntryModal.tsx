import {
  Autocomplete,
  Box,
  Modal,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Collapse,
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
  tableCellClasses,
  alpha,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { articlesEntryToWarehouse, getNursesUsers } from '../../../../api/api.routes';
import { addNewArticlesPackage } from '../../../../schema/schemas';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Save, Edit, Delete, Info, Cancel, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  IArticleFromSearchWithBarCode,
  IArticlesPackage,
  IExistingArticleList,
  IPatientFromSearch,
} from '../../../../types/types';
import { ArticlesFetched } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/ArticlesOutput';
import { LoteSelectionRemake2 } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelectionRemake2';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { getPatientsWithAccount } from '../../../../services/programming/patientService';
import { getArticlesFromAcountId } from '../../../../store/programming/AcountArticlesService';

const OPTIONS_LIMIT = 30;
const filterArticleOptions = createFilterOptions<IArticleFromSearchWithBarCode>({
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
  width: { xs: 380, md: 700, lg: 900 },

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

export const ArticlesEntryModal = (props: { setOpen: Function; warehouseId: string; refetch: Function }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticleFromSearchWithBarCode[]>(
    []
  );
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  // const [search, setSearch] = useState('');
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [nurseSearch, setNurseSearch] = useState('');
  const [nursesData, setNursesData] = useState<{ id_Enfermero: string; nombre: string }[]>([]);

  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);
  const [nurseSelected, setNurseSelected] = useState<{ id_Enfermero: string; nombre: string } | null>();

  useEffect(() => {
    setWarehouseId(props.warehouseId);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        nursesCall();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, []);
  const [articles, setArticles] = useState<ArticlesFetched[] | []>([]);
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [userError, setUserError] = useState(false);

  const [articleSelected, setArticleSelected] = useState<null | IArticleFromSearchWithBarCode>(null);
  const [articleError, setArticleError] = useState(false);
  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [loteEditing, setLoteEditing] = useState(false);
  const [loteSelected, setLoteSelected] = useState<
    { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[] | null
  >(null);

  useEffect(() => {
    setArticleSelected(null);
  }, [props.setOpen]);

  useEffect(() => {
    if (!openLoteModal) {
      setArticleSelected(null);
    }
  }, [openLoteModal]);

  useEffect(() => {
    patientsCall();
  }, [patientSearch]);

  useEffect(() => {
    nursesCall();
  }, [nurseSearch]);

  const patientsCall = async () => {
    const url = `Search=${patientSearch}`;
    const res = await getPatientsWithAccount(url);
    if (res) {
      setUsersData(res);
    }
  };

  const nursesCall = async () => {
    // const url = `Search=${patientSearch}`;
    const resNurses = await getNursesUsers();
    //const res = await getPatientsWithAccount(url);
    if (resNurses) {
      setNursesData(resNurses);
    }
  };

  const handleAddArticle = (lotesArticles: IExistingArticleList[], edit: boolean) => {
    let totalQuantityByArticle = 0;
    const updatedLote: {
      cantidad: number;
      fechaCaducidad: string;
      id_ArticuloCuenta: string;
      id_ArticuloExistente: string;
    }[] = [];
    lotesArticles.forEach((element) => {
      const nestedLote = {
        cantidad: element.cantidad,
        id_ArticuloExistente: element.id_ArticuloExistente,
        id_ArticuloCuenta: articleSelected?.id_ArticuloCuenta as string,
        fechaCaducidad: element.fechaCaducidad,
      };
      updatedLote.push(nestedLote);
      totalQuantityByArticle += element.cantidad;
    });
    if (totalQuantityByArticle > (articleSelected?.cantidad ? articleSelected.cantidad : 0)) {
      toast.error('La cantidad de articulos a devolver es mayor al de la cuenta');
      return;
    }
    const updatedArticle = {
      ...articleSelected,
      cantidad: totalQuantityByArticle,
      lote: updatedLote,
    };
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

  const handleFetchArticlesFromAccount = async (id_cuenta: string) => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getArticlesFromAcountId(id_cuenta);
      const transformedData = res.map((item: any) => ({
        id_ArticuloCuenta: item.id_ArticuloCuenta,
        id_Articulo: item.id_Articulo,
        nombre: item.nombre,
        cantidad: item.cantidad,
        codigoBarras: item.codigoBarras,
      }));
      setDataWerehouseArticlesSelected(transformedData);
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
    if (!userSelected) {
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
            Id_ArticuloCuenta: loteA.id_ArticuloCuenta,
            Cantidad: loteA.cantidad.toString(),
            fechaCaducidad: loteA.fechaCaducidad,
          });
        });
      }

      const object = {
        Lotes: articlesArticlesExit.map((loteA: any) => ({
          Id_ArticuloExistente: loteA.Id_ArticuloExistente,
          Id_ArticuloCuenta: loteA.Id_ArticuloCuenta,
          Cantidad: loteA.Cantidad,
          fechaCaducidad: loteA.fechaCaducidad,
        })),
        NombreEnfermero: nurseSelected.nombre,
        Id_Almacen: props.warehouseId,
        IngresoMotivo: 'Devolución de artículos',
        Id_CuentaPaciente: userSelected.id_Cuenta,
      };
      await articlesEntryToWarehouse(object);
      props.refetch();
      toast.success('Entrada de artículos con éxito!');
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

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Entrada de artículos" />
      <Box sx={style2}>
        {isLoadingWarehouse ? (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
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
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar paciente</Typography>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    filterOptions={filterPatientOptions}
                    onChange={(e, val) => {
                      e.stopPropagation();
                      setUserSelected(val);
                      if (val !== null) {
                        handleFetchArticlesFromAccount(val.id_Cuenta);
                      }
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
                <Stack sx={{ display: 'flex', flex: 1 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de enfermeros</Typography>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    onChange={(e, val) => {
                      e.stopPropagation();
                      setNurseSelected(val);
                      setArticleError(false);
                    }}
                    loading={isLoadingArticlesWareH}
                    options={nursesData}
                    getOptionLabel={(option) => option.nombre}
                    value={nurseSelected}
                    noOptionsText="No se encontraron enfermeros"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={articleError}
                        helperText={articleError && 'Selecciona un enfermero'}
                        fullWidth
                        placeholder="Enfermeros"
                        onChange={(e) => {
                          if (e.target.value === null) {
                            setNurseSearch('');
                          }
                          setNurseSearch(e.target.value);
                        }}
                      />
                    )}
                  />
                </Stack>
              </Box>
              <Stack sx={{ display: 'flex', flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de articulo</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
                  filterOptions={filterArticleOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    if (val !== null) {
                      if (!articles.map((art) => art.id_ArticuloCuenta).includes(val.id_ArticuloCuenta)) {
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
                      // onChange={(e) => {
                      //   setSearch(e.target.value);
                      // }}
                      placeholder="Artículos"
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Stack>

              <ArticlesTable
                setOpen={props.setOpen}
                submitData={onSubmit}
                initialData={[]}
                setLoteEditing={setLoteEditing}
                setLoteSelected={setLoteSelected}
                setArticleSelected={setArticleSelected}
                setOpenLoteModal={setOpenLoteModal}
                setArticles={setArticles}
                articles={articles || []}
                setArticleId={setArticleId}
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
        )}
      </Box>

      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <>
          <LoteSelectionRemake2
            setOpen={setOpenLoteModal}
            //lotes={(articleSelected?.lote as any) || []}
            articleName={articleSelected?.nombre || ''}
            addFunction={handleAddArticle}
            editing={loteEditing}
            selectedLotes={loteSelected as { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[]}
            adding={true}
            empityLotes={null}
            maxAmountSelect={articleSelected?.cantidad || null}
          />
        </>
      </Modal>
    </Box>
  );
};

const ArticlesTable = (props: {
  setOpen: Function;
  submitData: Function;
  initialData: ArticlesFetched[];
  articles: ArticlesFetched[];
  setArticles: Function;
  setArticleId: Function;
  setLoteEditing: Function;
  setLoteSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
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
