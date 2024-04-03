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
import React, { useEffect, useMemo, useState } from 'react';
import { Delete, Edit, ExpandLess, ExpandMore, Save } from '@mui/icons-material';
import { OutputReasonMessage } from './OutputReasonMessage';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { IWarehouseData } from '../../../../../types/types';
import { getArticlesByWarehouseIdAndSearch } from '../../../../../api/api.routes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 500, md: 600 },
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

type ArticlesFetched = {
  id: string;
  nombre: string;
  lote: { stock: number; fechaCaducidad: string }[];
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

  const handleSubmit = async () => {
    const object = {
      articles: articles,
      salida: radioSelected === 0 ? subWarehouse?.id : reasonMessage,
      fechaSalida: new Date().toLocaleDateString('es-ES'),
      almacenOrigen: warehouseData.id,
      esSalidaAlmacen: radioSelected === 0 ? true : false,
    };
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
          onClick={() => {
            if (value === 0) {
              if (articles.length === 0) return toast.error('Agrega artículos!');
              if (
                articles.flatMap((article) => article.cantidad).some((cantidad) => cantidad === '' || cantidad === '0')
              )
                return toast.error('Rellena todas las cantidades');
              if (radioSelected === 0) {
                if (!subWarehouse) return toast.error('Selecciona un subalmacen');
              } else {
                if (reasonMessage === '') return toast.error('Agrega un motivo de salida');
              }
              setValue((prev) => prev + 1);
            } else {
              handleSubmit();
            }
          }}
        >
          {value === 0 ? 'Siguiente' : 'Aceptar'}
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const [articlesFetched, setArticlesFetched] = useState<ArticlesFetched[] | []>([]);
  const [articleSelected, setArticleSelected] = useState<ArticlesFetched | null>(null);
  const [amount, setAmount] = useState('');

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
  }, [search, warehouseData]);

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
  return (
    <>
      <Stack spacing={2}>
        <Stack>
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
        <Stack>
          <Typography>Cantidad</Typography>
          <Box sx={{ alignItems: 'flex-end', display: 'flex', flex: 1, columnGap: 1 }}>
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
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', maxWidth: '50%' }}>
          <Button variant="contained" onClick={() => handleAddArticle()}>
            Agregar
          </Button>
        </Box>
        <Divider />
        <ArticlesTable
          articles={articles}
          setArticles={setArticles}
          isResume={false}
          originalArticlesSelected={originalArticlesSelected}
        />
        <Divider />
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
            fullWidth
            filterOptions={filterSubWarehousesOptions}
            onChange={(e, val) => {
              e.stopPropagation();
              setSubWarehouse(val);
            }}
            getOptionLabel={(option) => option.nombre}
            options={warehouseData.subAlmacenes}
            value={subWarehouse}
            noOptionsText="No se encontraron subalmacenes"
            renderInput={(params) => (
              <TextField
                {...params}
                // error={providerError}
                // helperText={providerError && 'Selecciona un subalmacen'}
                placeholder="Subalmacen..."
                sx={{ width: '50%' }}
              />
            )}
          />
        ) : (
          <>
            <Box>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Agregar motivo de salida
              </Button>
            </Box>
            <Typography>Motivo de salida: {reasonMessage}</Typography>
          </>
        )}
      </Stack>
      <Modal open={open} onClose={() => setOpen(!open)}>
        <>
          <OutputReasonMessage moduleApi="Almacen_MotivoSalida" open={setOpen} setReasonMessage={setReasonMessage} />
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
    const originalArticle = originalArticlesSelected.find((item) => item.id === article.id);
    if (!originalArticle) return;
    if (!isValidInteger(e)) return;

    const cantidad = e.trim() === '' || isNaN(parseInt(e)) ? '' : parseInt(e).toString();
    if (parseInt(cantidad) > parseInt(originalArticle.stockActual)) return toast.error('La cantidad excede el stock!');

    const updatedLote = [];
    let remainingAmount = parseInt(cantidad);
    if (parseInt(cantidad) > 0) {
      for (const item of originalArticle.lote) {
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
    const articlesFilter = articles.filter((item) => item.id !== article.id).concat(updatedArticle);
    setArticles(articlesFilter);
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
                  if (article.stockActual === '' || article.stockActual === '0')
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
          {articles.map((a, i) => (
            <TableRow key={i}>
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
