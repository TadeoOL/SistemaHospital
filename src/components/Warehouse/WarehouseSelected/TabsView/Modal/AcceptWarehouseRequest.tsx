import {
  Box,
  Button,
  Card,
  Collapse,
  Grid,
  IconButton,
  Modal,
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
  styled,
  tableCellClasses,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import React, { useEffect, useState } from 'react';
import { Delete, Edit, ExpandLess, ExpandMore, Save } from '@mui/icons-material';
import { OutputReasonMessage } from './OutputReasonMessage';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { IWarehouseData, MerchandiseEntry } from '../../../../../types/types';
import { articlesOutputToWarehouse, getArticlesByWarehouseIdAndSearch } from '../../../../../api/api.routes';

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
  id?: string;
  nombre: string;
  lote?: { stock: number; fechaCaducidad: string }[];
  stockActual?: string;
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
  setOriginalArticlesSelected: Function,
  request: MerchandiseEntry
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
          request={request}
        />
      );

    case 1:
      return (
        <OutputResume
          articles={articles}
          reasonMessage={reasonMessage}
          radioSelected={radioSelected}
          subWarehouse={subWarehouse}
          request={request}
        />
      );
  }
};
interface ArticlesViewProps {
  setOpen: Function;
  refetch: Function;
  request: MerchandiseEntry;
}

export const AceptWareHouseRequestModal = (props: ArticlesViewProps) => {
  const [articles, setArticles] = useState<ArticlesFetched[]>(
    props.request.historialArticulos.map((art) => ({
      nombre: art.nombre,
      cantidad: art.cantidad.toString(),
      stockActual: undefined,
      lote: undefined,
      id: undefined,
    }))
  );
  const [reasonMessage, setReasonMessage] = useState('');
  const [value, setValue] = useState(0);
  const [radioSelected, setRadioSelected] = useState(0);
  const [subWarehouse, setSubWarehouse] = useState<IWarehouseData | null>(null);
  const [originalArticlesSelected, setOriginalArticlesSelected] = useState<ArticlesFetched[] | []>([]);

  const handleSubmit = async () => {
    const object = {
      id_almacenOrigen: props.request.almacenOrigen,
      id_almacenDestino: props.request.almacenDestino,
      Articulos: articles.map((art) => ({ Id_ArticuloExistente: art.id as string, Cantidad: art.cantidad.toString() })),
      Estatus: 2,
      Id_HistorialMovimiento: props.request.id,
    };
    try {
      await articlesOutputToWarehouse(object);
      props.refetch();
      toast.success('Solicitud aceptada');
    } catch (error) {
      console.log(error);
      toast.error('Error al dar salida a artículos!');
    }
  };
  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Solicitud de Artículos" />
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
            setOriginalArticlesSelected,
            props.request
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
            if (articles.length === 0) return toast.error('Agrega artículos!');
            if (articles.flatMap((article) => article.cantidad).some((cantidad) => cantidad === '' || cantidad === '0'))
              return toast.error('Rellena todas las cantidades');
            handleSubmit();
          }}
        >
          {'Aceptar'}
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
  request: MerchandiseEntry;
}

const ArticlesOutput: React.FC<ArticlesOutputProp> = ({ articles, setArticles, setReasonMessage, request }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getArticlesByWarehouseIdAndSearch(warehouseData.id, '');
        const filteredData = res.data.filter((dataItem: ArticlesFetched) =>
          articles.some((article) => article.nombre === dataItem.nombre)
        );
        const updatedData = filteredData.map((dataItem: ArticlesFetched) => {
          const correspondingArticle = articles.find((article) => article.nombre === dataItem.nombre);
          return {
            ...dataItem,
            cantidad: correspondingArticle ? correspondingArticle.cantidad : 0,
            stockActual: dataItem?.stockActual?.toString(),
          };
        });
        const combinedData = [
          ...articles.filter(
            (article) => !filteredData.some((dataItem: ArticlesFetched) => dataItem.nombre === article.nombre)
          ),
          ...updatedData,
        ];

        setArticles(combinedData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [warehouseData]);

  return (
    <>
      <Stack spacing={2}>
        {!isLoading && (
          <React.Fragment>
            <ArticlesTable
              articles={articles}
              setArticles={setArticles}
              isResume={false}
              originalArticlesSelected={articles}
              request={request}
            />
          </React.Fragment>
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
  request: MerchandiseEntry;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  setArticles,
  isResume,
  originalArticlesSelected,
  request,
}) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del articulo</TableCell>
              <TableCell>Cantidad Solicitada</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Acción</TableCell>
              <TableCell>Stock Actual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <ArticlesTableRow
                request={request}
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
  request: MerchandiseEntry;
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
    if (parseInt(cantidad) > parseInt(originalArticle?.stockActual ? originalArticle.stockActual : '0'))
      return toast.error('La cantidad excede el stock!');

    const updatedLote = [];
    let remainingAmount = parseInt(cantidad);
    if (parseInt(cantidad) > 0 && originalArticle?.lote) {
      for (const item of originalArticle?.lote) {
        const deductedAmount = Math.min(remainingAmount, item.stock);
        updatedLote.push({
          ...item,
          stock: deductedAmount,
        });
        remainingAmount -= deductedAmount;
        if (remainingAmount <= 0) break;
      }
    }

    const updatedArticle = { ...article, cantidad: e };
    const updatedArticles = articles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
    setArticles(updatedArticles);
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
        <TableCell sx={{ textAlign: 'center' }}>
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
        <TableCell sx={{ textAlign: 'center' }}>{article.stockActual}</TableCell>
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
          {articles?.map((a, i) => (
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
  request: MerchandiseEntry;
}

const OutputResume: React.FC<OutputResumeProps> = ({
  articles,
  reasonMessage,
  radioSelected,
  subWarehouse,
  request,
}) => {
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
      <ArticlesTable articles={articles} isResume={true} request={request} />
    </Stack>
  );
};
