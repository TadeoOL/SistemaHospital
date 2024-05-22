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
  articlesOutputToWarehouse,
  articlesEntryToWarehouse,
  getArticlesByWarehouseIdAndSearch,
  getNursesUsers,
  getPackagesByWarehouseId,
} from '../../../../api/api.routes';
import { addNewArticlesPackage } from '../../../../schema/schemas';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
//import { isValidInteger } from '../../../../utils/functions/dataUtils';
import AnimateButton from '../../../@extended/AnimateButton';
import { Save, Edit, Delete, Info, Cancel, ExpandLess, ExpandMore, WarningAmber } from '@mui/icons-material';
import { IArticle, IArticlesPackage } from '../../../../types/types';
import { ArticlesFetched } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/ArticlesOutput';
import { LoteSelection } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelection';

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
        console.log('res articucklos', res);
        const fokinshi = [
          {
            id_Articulo: 'article1',
            nombre: 'Articulo 1',
            lote: [
              { stock: 10, fechaCaducidad: '2024-06-01', Id_ArticuloExistente: 'lote1-1' },
              { stock: 20, fechaCaducidad: '2024-07-01', Id_ArticuloExistente: 'lote1-2' },
              { stock: 15, fechaCaducidad: '2024-08-01', Id_ArticuloExistente: 'lote1-3' },
            ],
            stockActual: '45',
            cantidad: '45',
            codigoBarras: '1234567890123',
          },
          {
            id_Articulo: 'article2',
            nombre: 'Articulo 2',
            lote: [
              { stock: 5, fechaCaducidad: '2024-06-10', Id_ArticuloExistente: 'lote2-1' },
              { stock: 7, fechaCaducidad: '2024-07-10', Id_ArticuloExistente: 'lote2-2' },
              { stock: 1, fechaCaducidad: '2024-08-10', Id_ArticuloExistente: 'lote2-3' },
            ],
            stockActual: '13',
            cantidad: '13',
            codigoBarras: '9876543210987',
          },
          {
            id_Articulo: 'article3',
            nombre: 'Articulo 3',
            lote: [
              { stock: 3, fechaCaducidad: '2024-05-15', Id_ArticuloExistente: 'lote3-1' },
              { stock: 4, fechaCaducidad: '2024-06-15', Id_ArticuloExistente: 'lote3-2' },
              { stock: 5, fechaCaducidad: '2024-07-15', Id_ArticuloExistente: 'lote3-3' },
            ],
            stockActual: '12',
            cantidad: '12',
            codigoBarras: '4567890123456',
          },
        ];
        setArticlesFetchedAM(
          fokinshi.map((a: ArticlesFetched) => {
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
  const [articles, setArticles] = useState<ArticlesFetched[] | []>([]);
  //const [originalArticlesSelected, setOriginalArticlesSelected] = useState<ArticlesFetched[] | []>([]);

  const [articleSelected, setArticleSelected] = useState<null | IArticle>(null);
  const [nurseSelected, setNurseSelected] = useState<string>();
  const [roomSelected, setRoomSelected] = useState<string | null>();
  const [roomError, setRoomError] = useState(false);
  const [articleError, setArticleError] = useState(false);
  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [loteEditing, setLoteEditing] = useState(false);
  const [temporalLoteEditing, setTemporalLoteEditing] = useState(false);
  //const [loteSelected, setLoteSelected] = useState<loteFetch[] | null>(null);
  const [articlesToSelect, setArticlesToSelect] = useState<ArticlesFetched[] | []>([]);

  useEffect(() => {
    setArticleSelected(null);
  }, [props.setOpen]);

  const handleAddArticles = () => {
    if (!articleSelected) {
      setArticleError(true);
      return toast.warning('Selecciona un articulo!');
    }

    /*const objectArticle = {
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
    */
  };

  const handleAddArticle = (articles: any, edit: boolean) => {
    const updatedLote = [];
    let totalAmount = 0;
    for (const item of articles) {
      updatedLote.push({
        stock: item.stock,
        Id_ArticuloExistente: item.id_ArticuloExistente,
        fechaCaducidad: item.fechaCaducidad,
      });
      totalAmount += item.stock;
    }
    const updatedArticle = {
      ...articleSelected,
      cantidad: totalAmount,
      loteChanges: updatedLote,
    };
    console.log(updatedArticle);
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
        id_Articulo: artPack.id,
        nombre: artPack.nombre,
        lote: artPack?.lote
          ? artPack.lote.map((artLote: any) => ({
              ...artLote,
            }))
          : [],
        cantidad: artPack.cantidad.toString(),
        stockActual: '0',
        //cambio quiza agregar codigo de barras
      }));
    setArticlesToSelect(formatPackageL as any[]);
  };

  const handleFetchArticlesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      console.log('esta puta mierda es la q se cicla');
      const res = await getArticlesByWarehouseIdAndSearch(props.warehouseId, '');
      const transformedData = res.data.map((item: any) => ({
        id: item.id_Articulo,
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
      console.log('paketaxos', res);
      setDataWerehousePackagesSelected(res);
      const resNurses = await getNursesUsers();
      console.log(resNurses);
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
        //let amountArt = article.amount;
        /*if (amountArt > article.stock) {
          toast.error(`La cantidad de salida del articulo ${article.name} esta superando la existencias actuales! `);
          setLoadingSubmit(false);
          return;
        }*/
        console.log('articulo vuelta', article);
        article.loteChanges.forEach((loteA: any) => {
          articlesArticlesExit.push({
            Id_ArticuloExistente: loteA.Id_ArticuloExistente,
            Cantidad: loteA.stock.toString(),
            fechaCaducidad: loteA.fechaCaducidad,
          });
          /*if (amountArt > loteA.stock) {
            articlesArticlesExit.push({
              Id_ArticuloExistente: loteA.id,
              Cantidad: loteA.stock.toString(),
              fechaCaducidad: loteA.fechaCaducidad
            });
            amountArt = amountArt - loteA.stock;
          } else if (amountArt > 0) {
            articlesArticlesExit.push({
              Id_ArticuloExistente: loteA.id,
              Cantidad: amountArt.toString(),
            });
            amountArt = 0;
          }*/
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
      console.log('aleluya', object);
      return;
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
                  if (val !== null) {
                    handleAddArticlesFromPackage(val as IArticlesPackage);
                  }
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
                    //console.log('ckickeisho', val);
                    if (val !== null) {
                      if (
                        !(
                          articles.map((art) => art.id_Articulo).includes(val.id) ||
                          articlesToSelect.map((art) => art.id_Articulo).includes(val.id)
                        )
                      ) {
                        setOpenLoteModal(true);
                      }
                    }
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
            <ArticlesTable
              setOpen={props.setOpen}
              submitData={onSubmit}
              initialData={articlesFetchedAM}
              setLoteEditing={setLoteEditing}
              //setLoteSelected={setLoteSelected}
              setArticleSelected={setArticleSelected}
              setOpenLoteModal={setOpenLoteModal}
              setArticles={setArticles}
              articles={articles || []}
              articlesPending={articlesToSelect}
              setArticlesPending={setArticlesToSelect}
              setTemporalLoteEditing={setTemporalLoteEditing}
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
      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <>
          <LoteSelection
            setOpen={setOpenLoteModal}
            open={openLoteModal}
            lotes={(articleSelected?.lote as any) || []}
            articleName={articleSelected?.nombre || ''}
            addFunction={handleAddArticle}
            setEditing={setLoteEditing}
            editing={loteEditing}
            //selectedLotes={loteSelected as loteFetch[]}
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
  setLoteEditing: Function;
  //setLoteSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
  articlesPending: ArticlesFetched[] | null;
  setArticlesPending: Function;
  setTemporalLoteEditing: Function;
}) => {
  if (false)
    //cambiar
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
  articleRow: any;
  articles: any;
}
const ArticlesRows: React.FC<ArticlesRowsProps> = ({
  setLoteEditing,
  setArticleSelected,
  setOpenLoteModal,
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
        <TableCell>{articleRow.cantidad}</TableCell>
        <TableCell>
          <>
            <Tooltip title={'Editar'}>
              <IconButton
                onClick={() => {
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
            <NestedArticlesTable articles={articleRow.loteChanges} open={open} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

interface NestedArticlesTableProps {
  articles: ArticlesFetched['loteChanges'];
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
              <TableRow key={a.Id_ArticuloExistente}>
                <NestedTableCell>{a.stock}</NestedTableCell>
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
}
const TemporalArticlesRows: React.FC<TemporalArticlesRowsProps> = ({
  setArticleSelected,
  setOpenLoteModal,
  setArticles,
  articleRow,
  articles,
  setTemporalLoteEditing,
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
        <TableCell>{articleRow.cantidad}</TableCell>
        <TableCell>
          <>
            {articleRow.cantidad > 0 && (
              <Tooltip title={'Agregar'}>
                <IconButton
                  onClick={() => {
                    setTemporalLoteEditing(true);
                    setArticleSelected(articleRow);
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
