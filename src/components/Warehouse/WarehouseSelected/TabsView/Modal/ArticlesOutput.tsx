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
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Delete, Edit, ExpandLess, ExpandMore, Save, ArrowForward } from '@mui/icons-material';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { IWarehouseData } from '../../../../../types/types';
import { articlesOutputToWarehouse, getArticlesByWarehouseIdAndSearch } from '../../../../../api/api.routes';
import { useExistingArticlePagination } from '../../../../../store/warehouseStore/existingArticlePagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
  id: string;
  nombre: string;
  lote: { stock: number; fechaCaducidad: string; id: string }[];
  stockActual: string;
  cantidad: string;
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
        return { Id_ArticuloExistente: article.id, Cantidad: article.stock.toString() };
      });
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
  const [amount, setAmount] = useState('');
  const ExitReasonRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getArticlesByWarehouseIdAndSearch(warehouseData.id, search);
        setArticlesFetched(
          res.data
            .map((a: ArticlesFetched) => {
              return { ...a, stockActual: a.stockActual.toString() };
            })
            .filter((a: ArticlesFetched) => !articles.some((ar) => ar.id === a.id))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [search, warehouseData, articles]);

  const maxAmount = useMemo(() => {
    if (!articleSelected) return '';
    return articleSelected.stockActual.toString();
  }, [articleSelected]);

  const handleAddArticle = () => {
    if (!articleSelected) return toast.error('Selecciona un articulo');
    if (amount === '0' || amount === '') return toast.error('Escribe una cantidad!');
    if (parseInt(amount) > parseInt(articleSelected.stockActual)) return toast.error('La cantidad excede el stock!');

    const loteFormatted = articleSelected.lote.map((item) => ({
      ...item,
      fechaCaducidad: new Date(item.fechaCaducidad).toLocaleDateString(),
    }));
    loteFormatted.sort((a, b) => {
      const dateA = new Date(a.fechaCaducidad).getTime();
      const dateB = new Date(b.fechaCaducidad).getTime();
      return dateA - dateB;
    });
    let remainingAmount = parseInt(amount);
    const updatedLote = [];
    for (const item of loteFormatted) {
      const deductedAmount = Math.min(remainingAmount, item.stock);
      updatedLote.push({
        ...item,
        stock: deductedAmount,
      });
      remainingAmount -= item.stock;
      if (remainingAmount <= 0) break;
    }
    const updatedArticle = {
      ...articleSelected,
      cantidad: amount,
      lote: updatedLote,
    };
    setArticles((prev: any) => [...prev, updatedArticle]);
    setOriginalArticlesSelected((prev: any) => [...prev, articleSelected]);
    setArticleSelected(null);
    setAmount('');
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
                setArticleSelected(val);
              }}
              getOptionLabel={(option) => option.nombre}
              options={articlesFetched}
              value={articleSelected}
              noOptionsText="No se encontraron artículos"
              renderInput={(params) => (
                <TextField
                  {...params}
                  // error={providerError}
                  // helperText={providerError && 'Selecciona un subalmacen'}
                  placeholder="Artículos..."
                  sx={{ width: '50%' }}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
            />
          </Stack>
          <Stack flexDirection={'column'} width={'50%'}>
            <Typography>Cantidad</Typography>
            <Box sx={{ display: 'flex', flex: 1, columnGap: 1, flexDirection: 'column' }}>
              <TextField
                placeholder="Cantidad"
                value={amount}
                disabled={!articleSelected}
                onChange={(e) => {
                  if (!articleSelected) return;
                  if (!isValidInteger(e.target.value)) return;
                  if (parseInt(e.target.value) > parseInt(articleSelected.stockActual)) return;
                  setAmount(e.target.value);
                }}
                sx={{ width: '50%' }}
              />
              <Typography variant="caption" color="error">
                Cantidad maxima: {maxAmount}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ heigth: 25 }}>
            <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleAddArticle()}>
              Agregar
            </Button>
          </Box>
        </Stack>

        <ArticlesTable
          articles={articles}
          setArticles={setArticles}
          isResume={false}
          originalArticlesSelected={originalArticlesSelected}
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // error={providerError}
                    // helperText={providerError && 'Selecciona un subalmacen'}
                    placeholder="Sub Almacén..."
                    fullWidth
                  />
                )}
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
                <FormControlLabel
                  key={option}
                  value={option} // Valor asociado al radio button
                  control={<Radio />} // Componente de radio button
                  label={option} // Etiqueta del radio button
                />
              ))}
            </RadioGroup>
          </Box>
        </Stack>
        <Typography>Motivo de salida seleccionado: {reasonMessage}</Typography>
      </Stack>
    </>
  );
};

interface ArticlesTableProps {
  articles: ArticlesFetched[];
  setArticles?: Function;
  isResume: boolean;
  originalArticlesSelected?: ArticlesFetched[];
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles, setArticles, isResume, originalArticlesSelected }) => {
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
                key={article.id}
                setArticles={setArticles as Function}
                articles={articles}
                isResume={isResume}
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
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  originalArticlesSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    const articlesFilter = articles.filter((a) => a.id !== article.id);
    setArticles(articlesFilter);
  };

  const handleEditAmount = (e: string) => {
    const originalArticleIndex = originalArticlesSelected.findIndex((item) => item.id === article.id);
    if (originalArticleIndex === -1) return;
    if (!isValidInteger(e)) return;

    const cantidad = e.trim() === '' || isNaN(parseInt(e)) ? '' : parseInt(e).toString();
    if (parseInt(cantidad) > parseInt(originalArticlesSelected[originalArticleIndex].stockActual)) {
      return toast.error('La cantidad excede el stock!');
    }

    const updatedLote = [];
    let remainingAmount = parseInt(cantidad);
    if (parseInt(cantidad) > 0) {
      for (const item of originalArticlesSelected[originalArticleIndex].lote) {
        const deductedAmount = Math.min(remainingAmount, item.stock);
        updatedLote.push({
          ...item,
          stock: deductedAmount,
        });
        remainingAmount -= deductedAmount;
        if (remainingAmount <= 0) break;
      }
    }

    const updatedArticle = {
      ...article,
      cantidad: cantidad.toString(),
      lote: updatedLote.length === 0 ? article.lote : updatedLote,
    };

    const articlesCopy = [...articles];
    articlesCopy[originalArticleIndex] = updatedArticle;
    setArticles(articlesCopy);
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
        <TableCell>
          {!isEditing ? (
            article.cantidad
          ) : (
            <TextField
              placeholder="Cantidad"
              inputProps={{ className: 'tableCell' }}
              value={article.cantidad}
              onChange={(e) => handleEditAmount(e.target.value)}
            />
          )}
        </TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  if (article.cantidad === '' || article.cantidad === '0')
                    return toast.error('Para guardar escribe una cantidad valida!');
                  setIsEditing(!isEditing);
                }}
              >
                {!isEditing ? <Edit /> : <Save />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => handleDelete()}>
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
            <TableRow key={a.id}>
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
      <ArticlesTable articles={articles} isResume={true} />
    </Stack>
  );
};
