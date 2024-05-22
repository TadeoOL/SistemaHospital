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
import { IWarehouseData } from '../../../../../types/types';
import { articlesOutputToWarehouse, getArticlesByWarehouseIdAndSearch } from '../../../../../api/api.routes';
import { useExistingArticlePagination } from '../../../../../store/warehouseStore/existingArticlePagination';
import { LoteSelection } from './LoteSelection';

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

const OPTIONS_LIMIT = 5;
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
  codigoBarras?: string;
  lote: loteFetch[]; //Lote que debe permanecer sin cambios
};
type loteFetch = {
  stock: number;
  fechaCaducidad: string;
  Id_ArticuloExistente: string;
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
  setSubWarehouse: Function,
  originalArticlesSelected: ArticlesFetched[],
  setOriginalArticlesSelected: Function
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
          originalArticlesSelected={originalArticlesSelected}
          setOriginalArticlesSelected={setOriginalArticlesSelected}
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
  const [originalArticlesSelected, setOriginalArticlesSelected] = useState<ArticlesFetched[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const existingArticles = articles
      .flatMap((article) => article.lote)
      .map((article) => {
        return {
          Id_ArticuloExistente: article.Id_ArticuloExistente,
          Cantidad: article.stock.toString(),
          FechaCaducidad: article.fechaCaducidad,
        };
      }); //cambiar?
    const object = {
      Articulos: existingArticles,
      id_almacenDestino: radioSelected === 0 ? (subWarehouse ? subWarehouse.id : '') : warehouseData.id,
      id_almacenOrigen: warehouseData.id,
      Estatus: 1,
      Mensaje: radioSelected === 1 ? reasonMessage : undefined,
    };
    try {
      await articlesOutputToWarehouse(object);
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
            setSubWarehouse,
            originalArticlesSelected,
            setOriginalArticlesSelected
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
                if (!subWarehouse) return toast.error('Selecciona un Sub Almacén');
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
  originalArticlesSelected: ArticlesFetched[];
  setOriginalArticlesSelected: Function;
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
  originalArticlesSelected,
  setOriginalArticlesSelected,
}) => {
  const [anotherReason, setAnotherReason] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const [articlesFetched, setArticlesFetched] = useState<ArticlesFetched[] | []>([]);
  const [articleSelected, setArticleSelected] = useState<ArticlesFetched | null>(null);
  const ExitReasonRef = useRef<HTMLInputElement | null>(null);
  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [loteEditing, setLoteEditing] = useState(false);
  const [loteSelected, setLoteSelected] = useState<loteFetch[] | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getArticlesByWarehouseIdAndSearch(warehouseData.id, search);
        setArticlesFetched(
          res.data
            .map((a: ArticlesFetched) => {
              return { ...a, stockActual: a.stockActual.toString() };
            })
            .filter((a: ArticlesFetched) => !articles.some((ar) => ar.id_Articulo === a.id_Articulo))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [search, warehouseData, articles]);

  const handleAddArticle = (lotesArticles: any, edit: boolean) => {
    const updatedLote = [];
    let totalAmount = 0;
    for (const item of lotesArticles) {
      updatedLote.push({
        stock: item.stock,
        id: item.Id_ArticuloExistente,
        fechaCaducidad: item.fechaCaducidad,
      }); //cambiar?
      totalAmount += item.stock;
    }
    const updatedArticle = {
      ...articleSelected,
      cantidad: totalAmount,
      lote: updatedLote,
    };
    if (edit) {
      const direction = articles.findIndex((art) => art.id_Articulo === (articleSelected?.id_Articulo || ''));
      articles.splice(direction, 1);
      setArticles([...articles, updatedArticle]);
      setOriginalArticlesSelected([...articles, articleSelected]);
      setArticleSelected(null);
      setLoteEditing(false);
    } else {
      setArticles((prev: any) => [...prev, updatedArticle]);
      setOriginalArticlesSelected((prev: any) => [...prev, articleSelected]);
      setArticleSelected(null);
    }
  };

  const handleOtherReassonChangeText = (event: any) => {
    setReasonMessage(event.target.value);
  };

  const radioOptions = [
    'Quirofano',
    'Hospitalizacion',
    'Caduco',
    'Empaque dañado',
    'Producto defectuoso',
    'Robo o perdida',
  ];

  return (
    <>
      <Stack spacing={2}>
        <Stack flexDirection={'row'} display={'flex'} alignItems={'center'}>
          <Stack width={'50%'} mb={2}>
            <Typography>Selección de artículos</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              loading={isLoading}
              loadingText="Cargando artículos..."
              onChange={(e, val) => {
                e.stopPropagation();
                setOpenLoteModal(true);
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
                  sx={{ width: '50%' }}
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
          originalArticlesSelected={originalArticlesSelected}
          setLoteEditing={setLoteEditing}
          setLoteSelected={setLoteSelected}
          setArticleSelected={setArticleSelected}
          setOpenLoteModal={setOpenLoteModal}
        />
        <Divider />
        <Stack flexDirection={'row'}>
          <Box>
            <FormControl>
              <FormLabel>Tipo de salida</FormLabel>
              <RadioGroup row value={radioSelected}>
                <FormControlLabel
                  onChange={(e: any) => setRadioSelected(Number(e.target.value))}
                  value={0}
                  control={<Radio />}
                  label="Almacen"
                />
                <FormControlLabel
                  value={1}
                  onChange={(e: any) => setRadioSelected(Number(e.target.value))}
                  control={<Radio />}
                  label="Otro"
                />
              </RadioGroup>
            </FormControl>
            {radioSelected === 0 ? (
              <Autocomplete
                disablePortal
                sx={{ width: 200 }}
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
            ) : (
              <>
                <Box>
                  <Button variant="contained" onClick={() => setAnotherReason(true)}>
                    Agregar motivo de salida
                  </Button>
                </Box>
                {anotherReason && (
                  <TextField
                    sx={{ mt: 1 }}
                    inputRef={ExitReasonRef}
                    onChange={(e) => {
                      handleOtherReassonChangeText(e);
                    }}
                    placeholder="Motivo de salida"
                    fullWidth
                  />
                )}
              </>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 1,
              }}
              value={reasonMessage}
              onChange={(e) => setReasonMessage(e.target.value)}
            >
              {radioOptions.map((option) => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
          </Box>
        </Stack>
        <Typography>Motivo de salida seleccionado: {reasonMessage}</Typography>
      </Stack>
      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <>
          <LoteSelection
            setOpen={setOpenLoteModal}
            open={openLoteModal}
            lotes={articleSelected?.lote || []}
            articleName={articleSelected?.nombre || ''}
            addFunction={handleAddArticle}
            setEditing={setLoteEditing}
            editing={loteEditing}
            selectedLotes={loteSelected as loteFetch[]}
          />
        </>
      </Modal>
    </>
  );
};

interface ArticlesTableProps {
  articles: ArticlesFetched[];
  setArticles?: Function;
  isResume: boolean;
  originalArticlesSelected?: ArticlesFetched[];
  setLoteEditing: Function;
  setLoteSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  setArticles,
  isResume,
  originalArticlesSelected,
  setLoteEditing,
  setLoteSelected,
  setArticleSelected,
  setOpenLoteModal,
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
                setLoteSelected={setLoteSelected}
                setOpenLoteModal={setOpenLoteModal}
                setArticleSelected={setArticleSelected}
                originalArticlesSelected={originalArticlesSelected as ArticlesFetched[]}
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
  originalArticlesSelected: ArticlesFetched[];
  setLoteEditing: Function;
  setLoteSelected: Function;
  setArticleSelected: Function;
  setOpenLoteModal: Function;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  originalArticlesSelected,
  setLoteEditing,
  setLoteSelected,
  setArticleSelected,
  setOpenLoteModal,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
            {article.nombre}
          </Box>
        </TableCell>
        <TableCell>{article.cantidad}</TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setLoteEditing(true);
                  setLoteSelected(article.lote);
                  setArticleSelected(originalArticlesSelected.find((art) => art.id_Articulo === article.id_Articulo));
                  setOpenLoteModal(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  console.log('orita veo');
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
          <NestedArticlesTable articles={article.lote} open={open} />
        </TableCell>
      </TableRow>
    </React.Fragment>
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
          {articles.map((a) => (
            <TableRow key={a.Id_ArticuloExistente}>
              <NestedTableCell>{a.stock}</NestedTableCell>
              <NestedTableCell>{a.fechaCaducidad}</NestedTableCell>
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
        setLoteEditing={() => {}}
        setLoteSelected={() => {}}
        setArticleSelected={() => {}}
        setOpenLoteModal={() => {}}
      />
    </Stack>
  );
};
