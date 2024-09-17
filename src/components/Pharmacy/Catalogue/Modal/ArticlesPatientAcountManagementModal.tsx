import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  Checkbox,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { patientArticlesManagement, getExistingArticles } from '../../../../api/api.routes';
import { addNewArticlesPackage } from '../../../../schema/schemas';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Save, Delete, Info, Cancel } from '@mui/icons-material';
import {
  IArticleFromSearchWithBarCode,
  IArticleFromSearchWithQuantity,
  IArticlesFromPatientAcount,
  IArticlesPackage,
  IPatientFromSearch,
} from '../../../../types/types';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { getPatientsWithAccount } from '../../../../services/programming/patientService';
import { getArticlesFromAcountId } from '../../../../store/programming/AcountArticlesService';
import { isValidInteger } from '../../../../utils/functions/dataUtils';

const OPTIONS_LIMIT = 30;
const filterPatientOptions = createFilterOptions<IPatientFromSearch>({
  limit: OPTIONS_LIMIT,
});
const filterSearchArticleOptions = createFilterOptions<IArticleFromSearchWithQuantity>({
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

export const ArticlesPatientAcountManagementModal = (props: { setOpen: Function; warehouseId: string; refetch: Function }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [isLoadingArticlesWareH, setIsLoadingArticlesWareH] = useState(false);
  const [dataWerehouseSelectedArticles, setDataWerehouseArticlesSelected] = useState<IArticleFromSearchWithBarCode[]>(
    []
  );
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [search, setSearch] = useState('');
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [patientSearch, setPatientSearch] = useState('');

  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);

  useEffect(() => {
    setWarehouseId(props.warehouseId);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        // nursesCall();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, []);
  const [articles, setArticles] = useState<IArticlesFromPatientAcount[] | []>([]);
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [userError, setUserError] = useState(false);
  const [dataWerehouseArticles, setDataWerehouseSelected] = useState<IArticleFromSearchWithQuantity[]>([]);
  const [articleSelected, setArticleSelected] = useState<null | IArticleFromSearchWithQuantity>(null);
  const [articleError, setArticleError] = useState(false);
  const [articlesMap, setArticlesMap] = useState<Map<string, IArticlesFromPatientAcount>>(new Map());
  const [originalMap, setOriginalMap] = useState<Map<string, IArticlesFromPatientAcount>>(new Map());
  const [gridKey, setGridKey] = useState(123);

  useEffect(() => {
    setArticleSelected(null);
  }, [props.setOpen]);

  useEffect(() => {
    patientsCall();
  }, [patientSearch]);

  useEffect(() => {
    const fetch = async () => {
      await handleFetchArticlesFromWareHouse()
    };
    fetch();
  }, [search]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        handleFetchArticlesFromWareHouse()
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
  /*
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
          id_ArticuloCuenta: articleSelected?.id_Articulo as string,
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
      } else {
        setArticles((prev: any) => [...prev, updatedArticle]);
        setArticleSelected(null);
      }
    };
  */

    const compareMaps = (
      originalMap: Map<string, IArticlesFromPatientAcount>,
      articlesMap: Map<string, IArticlesFromPatientAcount>
    ) => {
      const addedOrIncreased: IArticlesFromPatientAcount[] = [];
      const removedOrDecreased: IArticlesFromPatientAcount[] = [];
    
      // Recorrer articlesMap para encontrar artículos nuevos o con cantidad aumentada
      articlesMap.forEach((article, id_Articulo) => {
        const originalArticle = originalMap.get(id_Articulo);
    
        if (!originalArticle) {
          // El artículo es nuevo
          addedOrIncreased.push(article);
        } else if (article.cantidad > originalArticle.cantidad) {
          // La cantidad del artículo ha aumentado
          addedOrIncreased.push({...article, cantidad: article.cantidad - originalArticle.cantidad});
        }
      });
    
      // Recorrer originalMap para encontrar artículos eliminados o con cantidad reducida
      originalMap.forEach((originalArticle, id_Articulo) => {
        const article = articlesMap.get(id_Articulo);
    
        if (!article) {
          // El artículo ha sido eliminado
          removedOrDecreased.push({ ...originalArticle });
        } else if (article.cantidad < originalArticle.cantidad) {
          // La cantidad del artículo ha disminuido
          removedOrDecreased.push({ ...article, cantidad:  - (article.cantidad - originalArticle.cantidad)});
        }
      });
    
      return { addedOrIncreased, removedOrDecreased };
    };

  const deleteArticles = (directions: string[]) => {
    const newwmap = articlesMap
    directions.forEach(dir => {
      newwmap.delete(dir)
    });
    console.log(newwmap);
    setArticles(Array.from(newwmap.values()))


  };

  const handleFetchArticlesFromAccount = async (id_cuenta: string) => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getArticlesFromAcountId(id_cuenta, true, props.warehouseId,false,true);
      const transformedData = res.map((item: any) => ({
        id_ArticuloCuenta: item.id_ArticuloCuenta,
        id_Articulo: item.id_Articulo,
        nombre: item.nombre,
        cantidad: item.cantidad,
        codigoBarras: item.codigoBarras,
        stock: item.stock + item.cantidad
      }));
      setDataWerehouseArticlesSelected(transformedData);
      //cexp
      setArticles(res);
      setArticlesMap(() => {
        const newMap = new Map();
        res.forEach((article: IArticlesFromPatientAcount) => {
          newMap.set(article.id_Articulo,{ ...article});
        });
        return newMap;
      }
      )
      setOriginalMap(() => {
        const newMap = new Map();
        res.forEach((article: IArticlesFromPatientAcount) => {
          newMap.set(article.id_Articulo,{ ...article});
        });
        return newMap;
      }
      )


    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

  const handleFetchArticlesFromWareHouse = async () => {
    try {
      setIsLoadingArticlesWareH(true);
      const res = await getExistingArticles(
        `${'pageIndex=1&pageSize=20'}&search=${search}&habilitado=${true}&Id_Almacen=${props.warehouseId}&Id_AlmacenPrincipal=${props.warehouseId}&fechaInicio=&fechaFin=&sort=`
      );
      const transformedData = res.data.map((item: any) => ({
        id_Articulo: item.id_Articulo,
        nombre: item.nombre,
        stock: item.stockActual,
        id_ArticuloAlmacen: item.id_ArticuloAlmacen
      }));
      setDataWerehouseSelected(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticlesWareH(false);
    }
  };

  const changeArticleQuantityInMap = (idArticle: string, cantidad: number) => {
    const articleToedit = articlesMap.get(idArticle);
    if (articleToedit) {
      articleToedit.cantidad = cantidad;
      setArticlesMap(articlesMap.set(idArticle, articleToedit))
    }
  }

  const { handleSubmit } = useForm<IArticlesPackage>({
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
    resolver: zodResolver(addNewArticlesPackage),
  });
  const validateAmount = (articlesToCheck:IArticlesFromPatientAcount[]) => {
    for (const articulo of articlesToCheck) {
      if (articulo.cantidad > articulo.stock) {
        toast.error(`La cantidad de salida del articulo ${articulo.nombre} está superando las existencias actuales!`);
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
    try {
      const resultComparation = compareMaps(originalMap, articlesMap);
      if (!validateAmount(resultComparation.addedOrIncreased)) return;
      setLoadingSubmit(true);
      const object = {
        //NombreEnfermero: nurseSelected.nombre,
        Id_Almacen: props.warehouseId,
        ArticulosPorSalir: resultComparation.addedOrIncreased.length > 0?
          resultComparation.addedOrIncreased.map((newArt) => 
            ({ Id_Articulo: newArt.id_Articulo, 
              Nombre: newArt.nombre,
              Cantidad: newArt.cantidad  }))
          :
          undefined,
          ArticulosPorEntrar: resultComparation.removedOrDecreased.length > 0?
          resultComparation.removedOrDecreased.map((newArt) => 
            ({ Id_Articulo: newArt.id_Articulo, 
              Id_ArticuloCuenta: newArt.id_ArticuloCuenta, 
              Nombre: newArt.nombre,
              Cantidad: newArt.cantidad  }))
          :
          undefined,
        IngresoMotivo: 'Devolución de artículos',
        Id_CuentaPaciente: userSelected.id_Cuenta,
        SolicitadoEn: 2,
      };
      await patientArticlesManagement(object);
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
                    loading={isLoadingArticlesWareH || usersData.length === 0}
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
              </Box>
              {/*<Stack sx={{ display: 'flex', flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de articulo</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
                  filterOptions={filterArticleOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    if (val !== null) {
                      if (!articles.map((art) => art.id_ArticuloCuenta).includes(val.id_ArticuloCuenta)) {
                        //q no lo deje
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
              </Stack>*/}
              <Stack sx={{ display: 'flex', flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de articulo</Typography>
                <Autocomplete
                  disablePortal
                  fullWidth
                  filterOptions={filterSearchArticleOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    if (val !== null) {
                      if (
                        articles.map((art) => art.id_Articulo).includes(val.id_Articulo)
                      ) {
                        return;
                      }
                      else if( val.stock === 0 ){
                        toast.error(`La cantidad de salida del articulo ${val.nombre} esta superando la existencias actuales! `);
                        return;
                      }
                      setArticleId(val.id_Articulo);
                      setArticleSelected(val);
                      articlesMap.set(val.id_Articulo, {
                        id_Articulo: val.id_Articulo,
                        id_ArticuloCuenta: "",
                        id_CuentaPAciente: "",
                        cantidad: 1,
                        codigoBarras: "",
                        nombre: val.nombre,
                        stock: val.stock
                      });
                      setArticlesMap(articlesMap);
                      setGridKey(gridKey + 1)
                      setArticleError(false);
                    }
                  }}
                  loading={isLoadingArticlesWareH && dataWerehouseSelectedArticles.length === 0}
                  getOptionLabel={(option) => option.nombre}
                  options={dataWerehouseArticles}
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

              <ArticlesTable
                key={gridKey}
                setOpen={props.setOpen}
                submitData={onSubmit}
                initialData={[]}
                setArticleSelected={setArticleSelected}
                setArticles={setArticles}
                articles={articles || []}
                setArticleId={setArticleId}
                deleteArticles={deleteArticles}
                setAmountText={changeArticleQuantityInMap}
                articlesMap={Array.from(articlesMap.values())}
                loading={isLoadingArticlesWareH}
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
    </Box>
  );
};

const ArticlesTable = (props: {
  setOpen: Function;
  submitData: Function;
  initialData: IArticlesFromPatientAcount[];
  articles: IArticlesFromPatientAcount[];
  setArticles: Function;
  setArticleId: Function;
  setArticleSelected: Function;
  deleteArticles: Function;
  setAmountText: Function;
  articlesMap: IArticlesFromPatientAcount[];
  loading: boolean;
}) => {
  const [idsSelected, setIdsSelected] = useState<string[]>([])
  const halfIndex = Math.ceil(props.articlesMap.length / 2);
  const fhalf = props.articlesMap.slice(0, halfIndex)
  const shalf = props.articlesMap.slice(halfIndex)
  return (
    <>
      {
        props.loading ?
        (<CircularProgress size={50} sx={{mx:'auto'}}/>)
      :
      (<Card sx={{ mt: 4, overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 380, display: 'flex', flexDirection: 'row', }}>
          <Table>
            {/*<TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ whiteSpace: 'pre-line' }}>{'Cantidad'}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>*/}
            <Box>
              <Tooltip title="Eliminar">
                <IconButton
                  onClick={() => {
                    props.deleteArticles(idsSelected)
                    //setArticles(articles.filter((art: any) => art.id_Articulo !== articleRow.id_Articulo));
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', }} >
              <Box>
                {props.articles?.length > 0 ? (
                  fhalf.map((a) => (
                    <ArticlesRows
                      key={a.id_Articulo}
                      articleRow={a}
                      setIdsSelected={setIdsSelected}
                      idsSelected={idsSelected}
                      setAmountText={props.setAmountText}
                      amountText={a.cantidad.toString()}
                    />
                  ))
                ) : (
                  <></>
                )}
              </Box>
              <Box>
                {props.articlesMap?.length > 0 ? (
                  shalf.map((a) => (
                    <ArticlesRows
                      key={a.id_Articulo}
                      articleRow={a}
                      setIdsSelected={setIdsSelected}
                      idsSelected={idsSelected}
                      setAmountText={props.setAmountText}
                      amountText={a.cantidad.toString()}
                    />
                  ))
                ) : (
                  <></>
                )}
              </Box>
            </Box>

          </Table>
          {/*<Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  //setArticles(articles.filter((art: any) => art.id_Articulo !== articleRow.id_Articulo));
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
                </TableCell>
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
                      setArticleSelected={props.setArticleSelected}
                      setArticles={props.setArticles}
                      articleRow={a}
                      articles={props.articles}
                      setArticleId={props.setArticleId}
                    />
                  ))
              ) : (
                <></>
              )}
            </TableBody>
          </Table>*/}
        </TableContainer>
        {props.articles.length === 0 && (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', py: 2 }}>
            <Info sx={{ width: 20, height: 20, color: 'gray', opacity: 0.6 }} />
            <Typography variant="h6" sx={{ color: 'gray', opacity: 0.6 }}>
              No hay artículos seleccionados
            </Typography>
          </Box>
        )}
      </Card>)}
    </>
  );
};

interface ArticlesRowsProps {
  setIdsSelected: Function;
  articleRow: any;
  idsSelected: string[];
  setAmountText: Function;
  amountText: string;
}
const ArticlesRows: React.FC<ArticlesRowsProps> = ({
  articleRow,
  setIdsSelected,
  idsSelected,
  setAmountText,
  amountText
}) => {
  const [checked, setChecked] = useState(false);
  const [numberText, setNumberText] = useState(amountText);

  return (
    <>
      <TableRow key={articleRow.id_Articulo}>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <Checkbox
              checked={checked}
              onChange={((e) => {
                if (checked) {
                  setIdsSelected(idsSelected.filter(item => item !== articleRow.id_Articulo))
                }
                else {
                  idsSelected.push(articleRow.id_Articulo)
                  setIdsSelected(idsSelected)
                }
                setChecked(e.target.checked);
              })}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            {articleRow.nombre}
          </Box>
        </TableCell>
        <TableCell></TableCell>
        <TableCell align={'center'}>
          <TextField
            label="Cantidad"
            size="small"
            InputLabelProps={{ style: { fontSize: 12 } }}
            value={numberText}
            onChange={(e) => {
              if (!isValidInteger(e.target.value)) return;
              setAmountText(articleRow.id_Articulo, Number(e.target.value))
              if (e.target.value === "") {
                setNumberText('0');
              }
              setNumberText(e.target.value);

            }}
          />
        </TableCell>
      </TableRow>
    </>
  );
};