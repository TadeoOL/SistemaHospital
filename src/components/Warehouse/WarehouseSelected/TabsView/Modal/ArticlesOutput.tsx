import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
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
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import React, { useEffect, useState, useRef } from 'react';
import { Delete, Edit, Save, ArrowForward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { IArticleFromSearch, IWarehouseData } from '../../../../../types/types';
import { getAmountForArticleInWarehouse, getArticlesFromWarehouseSearch } from '../../../../../api/api.routes';
import { useExistingArticlePagination } from '../../../../../store/warehouseStore/existingArticlePagination';
import { useExistingArticleLotesPagination } from '../../../../../store/warehouseStore/existingArticleLotePagination';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { articlesOutputToWarehouseToWarehouse } from '../../../../../services/warehouse/articleWarehouseService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 600, md: 800 },
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

const OPTIONS_LIMIT = 30;
const filterSubWarehousesOptions = createFilterOptions<any>({
  limit: OPTIONS_LIMIT,
});

export type ArticlesFetched = {
  id_Articulo: string;
  //id_ArticuloCuenta: string; Cambio del tadeo arreglar despois
  id_ArticuloStock: string;
  nombre: string;
  //stockActual: string;
  cantidad: string;
  stockActual: number;
  cantidadSeleccionar?: string;
  codigoBarras?: string;
};

const renderOutputView = (
  step: number,
  articles: ArticlesFetched[],
  setArticles: Function,
  reasonMessage: string,
  setReasonMessage: Function,
  radioSelected: number,
  setRadioSelected: Function,
  subWarehouse: any,
  setSubWarehouse: Function
) => {
  switch (step) {
    case 0:
      return (
        <ArticlesOutput
          articles={articles}
          setArticles={setArticles}
          reasonMessage={reasonMessage}
          setReasonMessage={setReasonMessage}
          radioSelected={radioSelected}
          setRadioSelected={setRadioSelected}
          subWarehouse={subWarehouse}
          setSubWarehouse={setSubWarehouse}
        />
      );

    case 1:
      return (
        <OutputResume
          articles={articles}
          reasonMessage={reasonMessage}
          radioSelected={radioSelected}
          subWarehouse={subWarehouse}
        />
      );
  }
};
interface ArticlesViewProps {
  setOpen: Function;
}
export const ArticlesView = (props: ArticlesViewProps) => {
  const [articles, setArticles] = useState<ArticlesFetched[] | []>([]);
  const [reasonMessage, setReasonMessage] = useState('');
  const [value, setValue] = useState(0);
  const [radioSelected, setRadioSelected] = useState(0);
  const [subWarehouse, setSubWarehouse] = useState<IWarehouseData | null>(null);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const existingArticles = articles.map((article) => {
      return {
        Id_Articulo: article.id_Articulo,
        Id_ArticuloAlmacenStock: article.id_ArticuloStock,
        Nombre: article.nombre,
        Cantidad: Number(article.cantidad),
      };
    });
    const object = {
      articulos: existingArticles,
      id_Almacen: warehouseData.id_Almacen,
      motivo: radioSelected === 1 ? reasonMessage : undefined,
    };
    try {
      await articlesOutputToWarehouseToWarehouse(object);
      useExistingArticlePagination.getState().fetchExistingArticles();
      toast.success('Salida a artículos con éxito!');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al dar salida a artículos!');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Salida de artículos" />
      <Box sx={{ overflowY: 'auto', ...styleBar, bgcolor: 'background.paper', p: 2 }}>
        <Box
          sx={{
            maxHeight: 500,
          }}
        >
          {renderOutputView(
            value,
            articles,
            setArticles,
            reasonMessage,
            setReasonMessage,
            radioSelected,
            setRadioSelected,
            subWarehouse,
            setSubWarehouse
          )}
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
          disabled={isLoading}
          variant="outlined"
          onClick={() => {
            if (value === 0) {
              props.setOpen(false);
            } else {
              setValue((prev) => prev - 1);
            }
          }}
        >
          {value === 0 ? 'Cancelar' : 'Regresar'}
        </Button>
        <Button
          variant="contained"
          disabled={isLoading}
          endIcon={value === 0 ? <ArrowForward /> : <Save />}
          onClick={() => {
            if (value === 0) {
              if (articles.length === 0) return toast.error('Agrega artículos!');
              if (
                articles.flatMap((article) => article.cantidad).some((cantidad) => cantidad === '' || cantidad === '0')
              )
                return toast.error('Rellena todas las cantidades');
              if (radioSelected === 0) {
                if (!subWarehouse) {
                  if (warehouseData.esSubAlmacen) {
                    setSubWarehouse({
                      nombre: '',
                      descripcion: '',
                      esSubAlmacen: false,
                      id_AlmacenPrincipal: null,
                      id_UsuarioEncargado: null,
                      articuloExistentes: null,
                      id_Almacen: warehouseData.id_AlmacenPrincipal || '',
                      fechaCreacion: '',
                      fechaModificacion: '',
                      habilitado: true,
                      subAlmacenes: [],
                    });
                  } else {
                    return toast.error('Selecciona un Sub Almacén');
                  }
                }
              } else {
                if (reasonMessage === '') return toast.error('Agrega un motivo de salida');
              }
              setValue((prev) => prev + 1);
            } else {
              handleSubmit();
            }
          }}
        >
          {value === 0 ? 'Siguiente' : 'Guardar'}
        </Button>
      </Box>
    </Box>
  );
};

interface ArticlesOutputProp {
  articles: ArticlesFetched[];
  setArticles: Function;
  reasonMessage: string;
  setReasonMessage: Function;
  radioSelected: number;
  setRadioSelected: Function;
  subWarehouse: any;
  setSubWarehouse: Function;
}

const ArticlesOutput: React.FC<ArticlesOutputProp> = ({
  articles,
  setArticles,
  reasonMessage,
  setReasonMessage,
  radioSelected,
  setRadioSelected,
  subWarehouse,
  setSubWarehouse,
}) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const [articlesFetched, setArticlesFetched] = useState<IArticleFromSearch[] | []>([]);
  const [articleSelected, setArticleSelected] = useState<IArticleFromSearch | null>(null);
  const [amountArticleSelected, setAmountArticleSelected] = useState(0);
  const [idArticleSelected, setIdArticleSelected] = useState('');
  const ExitReasonRef = useRef<HTMLInputElement | null>(null);
  const [amountError, setAmountError] = useState(false);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);
  const [amountText, setAmountText] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getArticlesFromWarehouseSearch(search, warehouseData.id_Almacen);
        setArticlesFetched(
          (res as any).map((a: IArticleFromSearch) => {
            return { ...a };
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [search, warehouseData]);

  useEffect(() => {
    setWarehouseId(warehouseData.id_Almacen);
  }, []);

  const handleAddArticle = (articleToAdd: ArticlesFetched, edit: boolean) => {
    if (edit) {
      const direction = articles.findIndex(
        (art: any) => art.id_Articulo === ((articleSelected as any)?.id_Articulo || '')
      );
      articles.splice(direction, 1);
      setArticles([...(articles as any), articleToAdd]);
      setArticleSelected(null);
    } else {
      setArticles((prev: any) => [...prev, articleToAdd]);
      setArticleSelected(null);
    }
    setAmountArticleSelected(0);
    setIdArticleSelected('');
    setAmountText('');
  };

  const searchArticleAmount = async (Id_Articulo: string) => {
    setIsLoading(true);
    try {
      const amountResponse = await getAmountForArticleInWarehouse(Id_Articulo, warehouseData.id_Almacen);
      setIsLoading(false);
      setAmountArticleSelected(amountResponse.stockActual as number);
      setIdArticleSelected(amountResponse.id_ArticuloStock);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setAmountArticleSelected(0);
      setIdArticleSelected('');
    }
  };

  /* const EditArrowRow = (idArticuloExistente: string, quantityChange: number) => {
    const direction = articles.findIndex((art) => art.id_Articulo === idArticuloExistente);
    if (direction === -1) {
      toast.error(`Artículo no encontrado`);
      return;
    }
    articles[direction].cantidad = quantityChange.toString();
    setArticles(articles);
  };*/
  const handleOtherReassonChangeText = (event: any) => {
    setReasonMessage(event.target.value);
  };

  const radioOptions = ['Caduco', 'Empaque dañado', 'Producto defectuoso', 'Robo o perdida'];

  return (
    <>
      <Stack spacing={2}>
        <Stack flexDirection={'row'} display={'flex'} alignItems={'center'}>
          <Stack width={'100%'}>
            <Stack width={'100%'} display={'flex'} flexDirection={'row'}>
              <Typography width={'75%'}>Selección de artículos</Typography>
              <Typography width={'20%'}>disponible: {amountArticleSelected} </Typography>
            </Stack>
            <Stack width={'100%'} display={'flex'} flexDirection={'row'}>
              <Autocomplete
                disablePortal
                fullWidth
                sx={{ width: '65%' }}
                loading={isLoading}
                loadingText="Cargando artículos..."
                onChange={(e, val) => {
                  e.stopPropagation();
                  if (val && val.id_Articulo) {
                    setArticleId(val.id_Articulo);
                    //setOpenLoteModal(true);
                    //hacer el c mamut
                    searchArticleAmount(val.id_Articulo);
                  }
                  setArticleSelected(val);
                }}
                getOptionLabel={(option) => option.nombre}
                options={articlesFetched}
                value={articleSelected}
                noOptionsText="No se encontraron artículos"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Artículos..."
                    sx={{ width: '100%' }}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                )}
              />
              <TextField
                sx={{ width: '15%', ml: 'auto', mr: 'auto' }}
                size="small"
                fullWidth
                placeholder="Cantidad"
                value={amountText}
                error={amountError}
                onChange={(e) => {
                  if (!isValidInteger(e.target.value)) return;
                  if (Number(e.target.value) > amountArticleSelected) {
                    setAmountError(true);
                    return;
                  }
                  setAmountText(e.target.value);
                  setAmountError(false);
                }}
              />

              <Button
                variant="contained"
                disabled={articleSelected === null || isNaN(Number(amountText)) || amountError || isLoading}
                onClick={() => {
                  handleAddArticle(
                    {
                      id_Articulo: articleSelected?.id_Articulo ?? '',
                      nombre: articleSelected?.nombre ?? '',
                      cantidad: amountText,
                      stockActual: amountArticleSelected,
                      id_ArticuloStock: idArticleSelected,
                    },
                    false
                  );
                }}
              >
                {'Agregar'}
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <ArticlesTable
          articles={articles}
          setArticles={setArticles}
          isResume={false}
          setArticleSelected={setArticleSelected}
        />
        <Divider />
        <FormControl>
          <FormLabel>
            <b>Seleccione el tipo de salida</b>
          </FormLabel>
          <RadioGroup row value={radioSelected} sx={{ justifyContent: 'space-between', px: 4 }}>
            <FormControlLabel
              onChange={(e: any) => setRadioSelected(Number(e.target.value))}
              value={0}
              control={<Radio />}
              label={warehouseData.esSubAlmacen ? 'Se dirige al almacen principal' : 'Se dirige a otro almacén'}
            />
            <FormControlLabel
              value={1}
              onChange={(e: any) => setRadioSelected(Number(e.target.value))}
              control={<Radio />}
              label="Salida del sistema por motivo"
            />
          </RadioGroup>
        </FormControl>
        <Stack flexDirection={'row'}>
          {warehouseData.subAlmacenes.length > 0 && !warehouseData.esSubAlmacen && (
            <Box sx={{ width: '35%' }}>
              <Autocomplete
                disabled={radioSelected === 1}
                disablePortal
                sx={{ width: 200, mx: 'auto' }}
                filterOptions={filterSubWarehousesOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setSubWarehouse(val);
                }}
                getOptionLabel={(option) => option.nombre}
                options={warehouseData.subAlmacenes}
                value={subWarehouse}
                noOptionsText="No existen registros de Sub Almacenes"
                renderInput={(params) => <TextField {...params} placeholder="Sub Almacén..." fullWidth />}
              />
            </Box>
          )}

          <Box
            sx={{
              width: '65%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              visibility: radioSelected === 0 ? 'hidden' : 'visible',
            }}
          >
            <Typography textAlign={'center'}>Motivos de salida:</Typography>

            <RadioGroup
              sx={{
                mx: '10%',
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 1,
              }}
              value={reasonMessage}
              onChange={(e) => setReasonMessage(e.target.value)}
            >
              {radioOptions.map((option) => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Typography> Otro </Typography>
              <TextField
                sx={{ mt: 1, width: 200, ml: 4 }}
                inputRef={ExitReasonRef}
                onChange={(e) => {
                  handleOtherReassonChangeText(e);
                }}
                placeholder="Motivo de salida"
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
      {/*<Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <LoteSelectionRemake2
          sx={{ p: 2 }}
          setOpen={setOpenLoteModal}
          articleName={articleSelected?.nombre || ''}
          addFunction={handleAddArticle}
          editing={loteEditing}
          selectedLotes={lotesSelected?.length > 0 ? lotesSelected : undefined}
          empityLotes={true}
        />
      </Modal>*/}
    </>
  );
};

interface ArticlesTableProps {
  articles: ArticlesFetched[];
  setArticles?: Function;
  isResume: boolean;
  setArticleSelected: Function;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles, setArticles, isResume, setArticleSelected }) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del articulo</TableCell>
              <TableCell>Cantidad</TableCell>
              {!isResume && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <ArticlesTableRow
                article={article}
                key={article.id_Articulo}
                setArticles={setArticles as Function}
                articles={articles}
                isResume={isResume}
                setArticleSelected={setArticleSelected}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

interface ArticlesTableRowProps {
  articles: ArticlesFetched[];
  article: ArticlesFetched;
  setArticles: Function;
  isResume: boolean;
  setArticleSelected: Function;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  setArticleSelected,
}) => {
  const [seed, setSeed] = useState(1);

  const render = () => {
    setSeed(seed + 1);
  };
  useEffect(() => {
    render;
  }, [article]);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>{article.nombre}</Box>
        </TableCell>
        <TableCell key={`${article.id_Articulo}${seed} `}>{article.cantidad}</TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setArticleSelected({ nombre: article.nombre, id_Articulo: article.id_Articulo });
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  setArticles(articles.filter((art) => art.id_Articulo !== article.id_Articulo));
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

/* aqui yace la logica de lotes QEPD 08/08/2024
interface NestedArticlesTableProps {
  articles: ArticlesFetched['lote'];
  deleteNestedRow: Function;
  open: boolean;
  onEditArrowRow: (idArticuloExistente: string, idLote: string, quantityChange: number) => void;
  render: Function;
}
const NestedArticlesTable: React.FC<NestedArticlesTableProps> = ({ open, articles, deleteNestedRow }) => {
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
          {articles.map((a) => (
            <TableRow key={a.id_ArticuloExistente}>
              <NestedTableCell>{a.cantidad}</NestedTableCell>
              <NestedTableCell>{returnExpireDate(a.fechaCaducidad)}</NestedTableCell>
              <NestedTableCell>
                <Tooltip title="Eliminar">
                  <IconButton
                    onClick={() => {
                      deleteNestedRow(a.id_ArticuloExistente);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </NestedTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapse>
  );
};
*/
interface OutputResumeProps {
  articles: any[];
  reasonMessage: string;
  radioSelected: number;
  subWarehouse: any;
}

const OutputResume: React.FC<OutputResumeProps> = ({ articles, reasonMessage, radioSelected, subWarehouse }) => {
  const warehouseData = useWarehouseTabsNavStore((state) => state.warehouseData);
  const dateNow = Date.now();
  const today = new Date(dateNow);

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Almacen de origen:</Typography>
          <Typography>{warehouseData.nombre}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Fecha de salida:</Typography>
          <Typography>{today.toLocaleDateString('es-ES')}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {radioSelected === 0 ? (
            <>
              <Typography variant="subtitle1">Almacen de destino:</Typography>
              <Typography>{subWarehouse.nombre}</Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle1">Motivo de salida:</Typography>
              <Typography>{reasonMessage}</Typography>
            </>
          )}
        </Grid>
      </Grid>
      <ArticlesTable articles={articles} isResume={true} setArticleSelected={() => {}} />
    </Stack>
  );
};
