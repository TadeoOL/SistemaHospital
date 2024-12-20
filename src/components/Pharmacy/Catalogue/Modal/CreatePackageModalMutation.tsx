import { Cancel, Check, Delete, Edit, Save, Warning } from '@mui/icons-material';
import {
  Button,
  Stack,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TextField,
  Typography,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import withReactContent from 'sweetalert2-react-content';
import { IArticleFromSearchWithQuantity, IArticleHistory, IarticlesPrebuildedRequest } from '../../../../types/types';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Swal from 'sweetalert2';
import { buildPackage, getExistingArticles } from '../../../../api/api.routes';
//import { PDFDownloadLink } from '@react-pdf/renderer';
//import { PackageReport } from '../../../Export/Pharmacy/PackageReport';
import { isValidInteger, isValidIntegerOrZero } from '../../../../utils/functions/dataUtils';
//import { generateArticlePackagePDF } from './pdfs/generateArticlePackagePDF';
import { useExistingArticleLotesPagination } from '@/store/warehouseStore/existingArticleLotePagination';
import AnimateButton from '@/components/@extended/AnimateButton';
import { SearchBar } from '@/components/Inputs/SearchBar';

const OPTIONS_LIMIT = 30;
const filterArticleOptions = createFilterOptions<IArticleFromSearchWithQuantity>({
  limit: OPTIONS_LIMIT,
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 650, md: 850 },
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

const styleBar = {
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

interface RequestBuildingModalProps {
  setOpen: Function;
  refetch: Function;
  requestedItems: IArticleHistory[];
  preLoadedArticles: IarticlesPrebuildedRequest[];
  id_SolicitudAlmacen: string;
  id_CuentaEspacioHospitalario: string;
  packageSelected: any;
  warehouseId: string
}

export const RequestBuildingModalMutation = (props: RequestBuildingModalProps) => {
  const [articles, setArticles] = useState<IarticlesPrebuildedRequest[]>(props.preLoadedArticles);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  //const [articlesToSelect, setArticlesToSelect] = useState<IArticleFromSearchWithQuantity[] | []>([]);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);
  const [articleSelected, setArticleSelected] = useState<null | IArticleFromSearchWithQuantity>(null);
  const [articleError, setArticleError] = useState(false);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [amountText, setAmountText] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [search, setSearch] = useState('');
  const [searchP, setSearchP] = useState('');
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticleFromSearchWithQuantity[]>(
    []
  );
  const handleFetchArticlesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getExistingArticles(
        `${'pageIndex=1&pageSize=20'}&search=${search}&habilitado=${true}&Id_Almacen=${props.warehouseId}&Id_AlmacenPrincipal=${props.warehouseId}&fechaInicio=&fechaFin=&sort=`
      );
      const transformedData = res.data.map((item: any) => ({
        id_Articulo: item.id_Articulo as string,
        nombre: item.nombre as string,
        stock: item.stockActual as number,
        id_ArticuloAlmacen: item.id_ArticuloAlmacen as string,
        cantidad: null
      }));
      setDataWerehouseArticlesSelected(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

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
    if(articles.find((art) => art.id_Articulo === articleSelected.id_Articulo) !== undefined ){
      return toast.warning('el articulo ya esta en el paquete');
    }
    const objectArticle = {
      id_Articulo: articleSelected.id_Articulo,
      nombre: articleSelected.nombre,
      cantidadSeleccionada: parseFloat(amountText),
      cantidadSolicitada: 0,
      stock: articleSelected.stock,
    };

    setArticles([...articles, objectArticle]);
    setDataWerehouseArticlesSelected(
      dataWerehouseSelectedArticles.filter((art) => art.id_Articulo !== articleSelected.id_Articulo)
    );
    setArticleSelected(null);
    setAmountText('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    const object = {
      id_SolicitudAlmacen: props.id_SolicitudAlmacen,
      id_CuentaEspacioHospitalario: props.id_CuentaEspacioHospitalario,
      articulos: articles.map((art) => ({
        Id_Articulo: art.id_Articulo,
        Cantidad: art.cantidadSeleccionada,
        Nombre: art.nombre,
      })),
      estatus: 2,
    };
    try {
      await buildPackage(object);
      toast.success('Agregado correctamente!');
      props.setOpen(false);
      props.refetch();
      //showAlert();
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar los artículos!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditArticle = (articleEdited: IarticlesPrebuildedRequest) => {
    const direction = articles.findIndex((art) => art.id_Articulo === articleEdited.id_Articulo);
    if (direction > -1) {
      articles.splice(direction, 1);
      setArticles([...articles, articleEdited]);
    }
  };

  const continueRequest = () => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas aceptar esta solicitud con artículos faltantes?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          handleSubmit();
        }
      });
  };
  const checkQuantyties = () => {
    let diferentNumbers = false;
    articles.forEach((article) => {
      let totalToSendByArticle = 0;
      totalToSendByArticle += article.cantidadSeleccionada;
      if (totalToSendByArticle < Number(article.cantidadSolicitada)) diferentNumbers = true;
    });
    if (diferentNumbers || articles.length < props.requestedItems.length) {
      continueRequest();
      return;
    } else {
      handleSubmit();
    }
  };

  /*const showAlert = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Agregado correctamente!',
      text: '¿Qué te gustaría hacer ahora?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Imprimir',
      cancelButtonText: 'Continuar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        generateArticlePackagePDF(props.packageSelected);

        // MySwal.fire({
        //   title: 'Imprimir',
        //   html: (
        //     <PDFDownloadLink
        //       onClick={() => {
        //         props.setOpen(false);
        //         props.refetch();
        //       }}
        //       document={
        //         <PackageReport
        //           articulos={articles.map((artr) => ({
        //             id_Articulo: artr.id_Articulo,
        //             nombre: artr.nombre,
        //             cantidadSeleccionar: artr.cantidadSolicitada,
        //             cantidad: artr.cantidadSeleccionada,
        //           }))}
        //         />
        //       }
        //       fileName={`${Date.now()}.pdf`}
        //       style={{ textDecoration: 'none', color: 'inherit' }}
        //     >
        //       {({ loading }) => <Button variant="contained">{loading ? 'Generando PDF...' : 'Descargar PDF'}</Button>}
        //     </PDFDownloadLink>
        //   ),
        //   showConfirmButton: false,
        //   showCancelButton: false,
        // });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        props.setOpen(false);
        props.refetch();
      }
    });
  };*/

  const checkPreloadedQuantyties = () => {
    const quantityMap: {
      [key: string]: { cantidad: number };
    } = {};
    let flag = true;
    props.preLoadedArticles.forEach((article) => {
      if (!quantityMap[article.id_Articulo ?? '']) {
        quantityMap[article.id_Articulo ?? ''] = {
          cantidad: 0,
        };
      }
      quantityMap[article.id_Articulo ?? ''].cantidad += article.cantidadSeleccionada;
    });

    // Verificar que todos los artículos en articlesIDs están presentes en quantityMap con la cantidad correcta
    for (const article of props.requestedItems) {
      const requiredQuantity = article.cantidad;
      const availableArticle = quantityMap[article.id_Articulo ?? ''];

      if (!availableArticle || availableArticle.cantidad < requiredQuantity) {
        flag = false; // Falta cantidad o artículo
      }
    }
    setArticles(props.preLoadedArticles);
    return flag; // Todo está bien
  };

  useEffect(() => {
    setWarehouseId(props.warehouseId);
    if (checkPreloadedQuantyties()) {
    }
    try {
      handleFetchArticlesFromWareHouse();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      await handleFetchArticlesFromWareHouse();
    };
    fetch();
  }, [search]);

  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Solicitud de Artículos" />
      <Box sx={{ overflowY: 'auto', ...styleBar, bgcolor: 'background.paper', p: 2 }}>
        <Box
          sx={{
            maxHeight: 500,
          }}
        >
          <Stack spacing={2}>
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
                          articles.map((art) => art.id_Articulo).includes(val.id_Articulo)// ||
                          //articlesToSelect.map((art) => art.id_Articulo).includes(val.id_Articulo)
                        )
                      ) {
                        //nada
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
                <SearchBar
                  searchState={setSearchP}
                  search={searchP}
                  size="medium"
                  sx={{ maxWidth: 310, mt:2 }}
                  title="Buscar articulo en paquete..."
                />
              </Stack>

              <Stack sx={{ display: 'flex', flexDirection:'row' }}>
                <Stack sx={{ display:'flex'}}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Ingresar cantidad</Typography>
                <TextField
                  sx={{ width: '60%' }}
                  size="small"
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
                </Stack>
                
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
            <React.Fragment>

              <ArticlesTable
                articles={searchP !== '' ? articles.filter((art) => art.nombre.includes(searchP.toUpperCase())).sort((a,b) => a.nombre.localeCompare(b.nombre)) : articles.sort((a,b) => a.nombre.localeCompare(b.nombre)) }
                setArticles={setArticles}
                isResume={false}
                handleEditArticle={handleEditArticle}
              />
            </React.Fragment>
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          padding: 1,
          px: 2,
        }}
      >
        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            if (value === 0) {
              props.setOpen(false);
            } else {
              setValue((prev) => prev - 1);
            }
          }}
          startIcon={<Cancel />}
        >
          {value === 0 ? 'Cancelar' : 'Regresar'}
        </Button>
        <Button
          variant="contained"
          //cambiar aqui despues condicion de deshabilitar un boton
          disabled={props.requestedItems.length < 1 || loading}
          onClick={() => {
            if (articles.length === 0) return toast.error('Agrega artículos!');
            if (articles.flatMap((article) => article.cantidadSeleccionada).some((cantidad) => cantidad === 0))
              return toast.error('Rellena todas las cantidades');

            checkQuantyties();
          }}
          startIcon={<Check />}
        >
          {loading ? 'Cargando...' : 'Aceptar'}
        </Button>
      </Box>
    </Box>
  );
};
interface ArticlesTableProps {
  articles: IarticlesPrebuildedRequest[];
  setArticles?: Function;
  isResume: boolean;
  handleEditArticle: Function;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles, setArticles, isResume, handleEditArticle }) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del articulo</TableCell>
              <TableCell>Cantidad Solicitada</TableCell>
              <TableCell>Cantidad Seleccionada</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((article) => (
              <ArticlesTableRow
                article={article}
                key={article.id_Articulo}
                setArticles={setArticles as Function}
                articles={articles}
                isResume={isResume}
                handleEditArticle={handleEditArticle}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

interface ArticlesTableRowProps {
  articles: IarticlesPrebuildedRequest[];
  article: IarticlesPrebuildedRequest;
  setArticles: Function;
  isResume: boolean;
  handleEditArticle: Function;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  handleEditArticle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amountText, setAmountText] = useState(article.cantidadSolicitada.toString());

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>{article.nombre}</Box>
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{article.cantidadSolicitada}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              <TextField
                sx={{ width: '60%', ml: 'auto' }}
                size="small"
                fullWidth
                placeholder="Cantidad"
                value={amountText}
                onChange={(e) => {
                  if (!isValidIntegerOrZero(e.target.value)) return;
                  setAmountText(e.target.value);
                }}
              />
              <Typography> Stock actual: {article.stock} </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', textAlign: 'center' }}>
              {article.cantidadSeleccionada === 0 && <Warning sx={{ color: 'red', mr: 2 }} />}
              {article.cantidadSeleccionada !== 0 &&
                article.cantidadSeleccionada < Number(article.cantidadSolicitada) && (
                  <Warning sx={{ color: '#FFA500', mr: 2 }} />
                )}
              {article.cantidadSeleccionada}
            </Box>
          )}
        </TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title={isEditing ? 'Guardar' : 'Editar'}>
              <IconButton
                disabled={article.stock == 0}
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    //handleSaveValue();
                    const quant = Number(amountText);
                    if (quant > article.stock) {
                      return toast.error('La cantidad excede el stock del articulo ' + article.nombre);
                    }

                    handleEditArticle({ ...article, cantidadSeleccionada: quant });
                  }
                }}
              >
                {isEditing ? <Save /> : <Edit />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  setArticles(articles.filter((a) => a.id_Articulo !== article.id_Articulo));
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </TableCell>
        )}
        
      </TableRow>
    </React.Fragment>
  );
};
