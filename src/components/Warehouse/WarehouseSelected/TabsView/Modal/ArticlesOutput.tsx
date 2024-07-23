import {
  Autocomplete,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Modal,
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
  alpha,
  createFilterOptions,
  styled,
  tableCellClasses,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import React, { useEffect, useState, useRef } from 'react';
import { Delete, Edit, ExpandLess, ExpandMore, Save, ArrowForward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { IArticleFromSearch, IExistingArticleList, IWarehouseData } from '../../../../../types/types';
import { articlesOutputToWarehouseToWarehouse, getArticlesFromWarehouseSearch } from '../../../../../api/api.routes';
import { useExistingArticlePagination } from '../../../../../store/warehouseStore/existingArticlePagination';
import { LoteSelectionRemake2 } from './LoteSelectionRemake2';
import { useExistingArticleLotesPagination } from '../../../../../store/warehouseStore/existingArticleLotePagination';
import { returnExpireDate } from '../../../../../utils/expireDate';

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

export type ArticlesFetched = {
  id_Articulo: string;
  nombre: string;
  loteChanges?: loteFetch[]; //Lote cuyos valores se pueden manipular
  stockActual: string;
  cantidad: string;
  cantidadSeleccionar?: string;
  codigoBarras?: string;
  lote: loteFetch[]; //Lote que debe permanecer sin cambios
};
type loteFetch = {
  cantidad: number;
  fechaCaducidad: string;
  id_ArticuloExistente: string;
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
    const existingArticles = articles
      .flatMap((article) => article.lote)
      .map((article) => {
        return {
          Id_ArticuloExistente: article.id_ArticuloExistente,
          Cantidad: article.cantidad,
        };
      });
    const object = {
      Lotes: existingArticles,
      id_almacenDestino: radioSelected === 0 ? (subWarehouse ? subWarehouse.id : '') : '',
      id_almacenOrigen: warehouseData.id,
      SalidaMotivo: radioSelected === 1 ? reasonMessage : undefined,
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
                      id: warehouseData.id_AlmacenPrincipal || '',
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
  const [lotesSelected, setLotesSelected] = useState<loteFetch[] | []>([]);
  const ExitReasonRef = useRef<HTMLInputElement | null>(null);
  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [loteEditing, setLoteEditing] = useState(false);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getArticlesFromWarehouseSearch(search, warehouseData.id);
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
    setWarehouseId(warehouseData.id);
  }, []);

  const handleAddArticle = (lotesArticles: IExistingArticleList[], edit: boolean) => {
    let totalQuantityByArticle = 0;
    const updatedLote: loteFetch[] = [];
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

  const EditArrowRow = (idArticuloExistente: string, idLote: string, quantityChange: number) => {
    const direction = articles.findIndex((art) => art.id_Articulo === idArticuloExistente);
    if (direction === -1) {
      toast.error(`Artículo no encontrado`);
      return;
    }
    const articulo = articles[direction];
    const lote = articulo.lote.find((lote) => lote.id_ArticuloExistente === idLote);
    if (!lote) {
      toast.error(`Artículo no encontrado`);
      return;
    }
    lote.cantidad = quantityChange;
    let totalQuantity = 0;
    articles[direction].lote.forEach((element) => {
      totalQuantity += element.cantidad;
    });
    articles[direction].cantidad = totalQuantity.toString();
    setArticles(articles);
  };
  const handleOtherReassonChangeText = (event: any) => {
    setReasonMessage(event.target.value);
  };

  const radioOptions = ['Caduco', 'Empaque dañado', 'Producto defectuoso', 'Robo o perdida'];

  return (
    <>
      <Stack spacing={2}>
        <Stack flexDirection={'row'} display={'flex'} alignItems={'center'}>
          <Stack width={'80%'}>
            <Typography>Selección de artículos</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              loading={isLoading}
              loadingText="Cargando artículos..."
              onChange={(e, val) => {
                e.stopPropagation();
                if (val) {
                  setArticleId(val?.id_Articulo);
                  setOpenLoteModal(true);
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
          </Stack>
        </Stack>

        <ArticlesTable
          articles={articles}
          setArticles={setArticles}
          isResume={false}
          setLoteEditing={setLoteEditing}
          setLotesSelected={setLotesSelected}
          setArticleSelected={setArticleSelected}
          setOpenLoteModal={setOpenLoteModal}
          onEditArrowRow={EditArrowRow}
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
      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <LoteSelectionRemake2
          sx={{ p: 2 }}
          setOpen={setOpenLoteModal}
          articleName={articleSelected?.nombre || ''}
          addFunction={handleAddArticle}
          editing={loteEditing}
          selectedLotes={lotesSelected?.length > 0 ? lotesSelected : undefined}
          empityLotes={true}
        />
      </Modal>
    </>
  );
};

interface ArticlesTableProps {
  articles: ArticlesFetched[];
  setArticles?: Function;
  isResume: boolean;
  setLoteEditing: Function;
  setLotesSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
  onEditArrowRow: (idArticuloExistente: string, idLote: string, quantityChange: number) => void;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  setArticles,
  isResume,
  setLoteEditing,
  setLotesSelected,
  setArticleSelected,
  setOpenLoteModal,
  onEditArrowRow,
}) => {
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
                setLoteEditing={setLoteEditing}
                setLotesSelected={setLotesSelected}
                setOpenLoteModal={setOpenLoteModal}
                setArticleSelected={setArticleSelected}
                onEditArrowRow={onEditArrowRow}
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
  setLoteEditing: Function;
  setLotesSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
  onEditArrowRow: (idArticuloExistente: string, idLote: string, quantityChange: number) => void;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  setLoteEditing,
  setArticleSelected,
  setLotesSelected,
  setOpenLoteModal,
  onEditArrowRow,
}) => {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(1);

  const render = () => {
    setSeed(seed + 1);
  };
  useEffect(() => {
    render;
  }, [article]);

  const deleteNestedRow = (idLoteToDelete: string) => {
    const direction = article.lote.findIndex((a) => a.id_ArticuloExistente === idLoteToDelete);
    if (direction !== -1) {
      article.cantidad = (Number(article.cantidad) - article.lote[direction].cantidad).toString();
      if (article.cantidad === '0') {
        setArticles(articles.filter((art) => art.id_Articulo !== article.id_Articulo));
        render();
        return;
      }
      article.lote.splice(direction, 1);
      render();
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
            {article.nombre}
          </Box>
        </TableCell>
        <TableCell key={`${article.id_Articulo}${seed} `}>{article.cantidad}</TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setLoteEditing(true);
                  setLotesSelected(article.lote);
                  setArticleSelected({ nombre: article.nombre, id_Articulo: article.id_Articulo });
                  setOpenLoteModal(true);
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
      <TableRow>
        <TableCell colSpan={3} sx={{ padding: 0 }}>
          <NestedArticlesTable
            articles={article.lote}
            deleteNestedRow={deleteNestedRow}
            open={open}
            onEditArrowRow={onEditArrowRow}
            render={render}
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
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
      <ArticlesTable
        articles={articles}
        isResume={true}
        setArticleSelected={() => {}}
        setLoteEditing={() => {}}
        setLotesSelected={() => {}}
        setOpenLoteModal={() => {}}
        onEditArrowRow={() => {}}
      />
    </Stack>
  );
};
