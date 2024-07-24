import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../../Commons/TableHeaderComponent';
import { IArticleHistory, IExistingArticleList } from '../../../../types/types';
import { NoDataInTableInfo } from '../../../Commons/NoDataInTableInfo';
import { AddCircle, CheckCircle, Warning } from '@mui/icons-material';
import { LoteSelectionRemake2 } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelectionRemake2';
import { useState } from 'react';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { toast } from 'react-toastify';
import { useGetPharmacyConfig } from '../../../../hooks/useGetPharmacyConfig';
import { useWarehouseMovementPackagesPaginationStore } from '../../../../store/warehouseStore/movimientoAlmacenPaquetesPaginacion';
import { buildPackage } from '../../../../api/api.routes';

const TABLE_HEADERS = ['Nombre Articulo', 'Cantidad', 'Fecha de Caducidad', 'Acciones'];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 600 },

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

interface CreatePackageModalProps {
  setOpen: Function;
  articles: IArticleHistory[];
  movementHistoryId: string;
  setArticles: Function;
}

interface ArticlesInBatch {
  Id_ArticuloExistente: string;
  Cantidad: string;
}

export const CreatePackageModal = (props: CreatePackageModalProps) => {
  const [articlesInBatch, setArticlesInBatch] = useState<ArticlesInBatch[]>([]);
  const refetch = useWarehouseMovementPackagesPaginationStore((state) => state.fetchWarehouseMovements);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useGetPharmacyConfig();

  const handleSubmit = async () => {
    if (articlesInBatch.length !== props.articles.length) {
      toast.warning('Debes de agregar todos los artículos');
      return;
    }
    setIsLoading(true);
    const object = {
      id_HistorialMovimiento: props.movementHistoryId,
      lotes: articlesInBatch.map((a) => {
        return { ...a, Cantidad: parseInt(a.Cantidad) };
      }),
      id_AlmacenOrigen: data.id_Almacen,
    };
    try {
      await buildPackage(object);
      toast.success('Agregado correctamente!');
      props.setOpen(false);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar los artículos!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Armado de paquete" />
      <Box sx={style2}>
        <CreatePackageModalTable
          articles={props.articles}
          movementHistoryId={props.movementHistoryId}
          setArticles={props.setArticles}
          setArticlesInBatch={setArticlesInBatch}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isLoading ? <CircularProgress size={25} /> : 'Aceptar'}
        </Button>
      </Box>
    </Box>
  );
};

const CreatePackageModalTable = (props: {
  articles: IArticleHistory[];
  movementHistoryId: string;
  setArticles: Function;
  setArticlesInBatch: Function;
  isLoading: boolean;
  setIsLoading: Function;
}) => {
  const { articles, movementHistoryId, setArticles, setArticlesInBatch, isLoading, setIsLoading } = props;
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          <CreatePackageModalTableBody
            articles={articles}
            movementHistoryId={movementHistoryId}
            setArticles={setArticles}
            setArticlesInBatch={setArticlesInBatch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Table>
      </TableContainer>
      {!articles && <NoDataInTableInfo infoTitle="No hay artículos" sizeIcon={20} variantText="h4" />}
    </Card>
  );
};

const CreatePackageModalTableBody = (props: {
  articles: IArticleHistory[];
  movementHistoryId: string;
  setArticles: Function;
  setArticlesInBatch: Function;
  isLoading: boolean;
  setIsLoading: Function;
}) => {
  const { articles, movementHistoryId, setArticles, setArticlesInBatch, isLoading, setIsLoading } = props;
  return (
    <TableBody>
      {articles &&
        articles.map((a) => (
          <CreatePackageModalTableRow
            articles={articles}
            key={a.id_ArticuloExistente}
            article={a}
            movementHistoryId={movementHistoryId}
            setArticles={setArticles}
            setArticlesInBatch={setArticlesInBatch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ))}
    </TableBody>
  );
};

const CreatePackageModalTableRow = (props: {
  articles: IArticleHistory[];
  article: IArticleHistory;
  movementHistoryId: string;
  setArticles: Function;
  setArticlesInBatch: Function;
  isLoading: boolean;
  setIsLoading: Function;
}) => {
  const { article, movementHistoryId, setArticles, articles, setArticlesInBatch, isLoading, setIsLoading } = props;
  const [openLoteSelection, setOpenLoteSelection] = useState(false);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);

  const handleAddArticles = async (lotesArticles: IExistingArticleList[]) => {
    setIsLoading(true);
    if (lotesArticles.flatMap((a) => a.cantidad).reduce((a, b) => a + b, 0) !== article.cantidad) {
      setIsLoading(false);
      return toast.warning('Agrega la cantidad exacta!');
    }
    const object = {
      Id_HistorialMovimiento: movementHistoryId,
      Lotes: lotesArticles.map((a) => {
        return {
          Cantidad: a.cantidad.toString(),
          Id_ArticuloExistente: a.id_ArticuloExistente,
        };
      }),
      Estatus: 2,
    };
    setArticlesInBatch((prev: ArticlesInBatch[]) => [...prev, ...object.Lotes]);
    modifyArticlesList(articles, setArticles, article, lotesArticles);
    setIsLoading(false);
  };

  const handleAdd = () => {
    setOpenLoteSelection(true);
    setArticleId(article.id_Articulo as string);
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
            {!article.fechaCaducidad && (
              <Tooltip title="Articulo existente sin asignar">
                <Warning color="warning" />
              </Tooltip>
            )}
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{article.nombre}</Typography>
          </Box>
        </TableCell>
        <TableCell>{article.cantidad}</TableCell>
        <TableCell align="center">{article.fechaCaducidad ?? 'Sin asignar'}</TableCell>
        <TableCell>
          <Box>
            {!isLoading && !article.fechaCaducidad ? (
              <Tooltip title="Agregar articulo de lote">
                <IconButton onClick={handleAdd}>
                  <AddCircle color="disabled" />
                </IconButton>
              </Tooltip>
            ) : !isLoading && article.fechaCaducidad ? (
              <Tooltip title="Articulo agregado correctamente">
                <CheckCircle color="success" />
              </Tooltip>
            ) : (
              <CircularProgress size={20} />
            )}
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={openLoteSelection} onClose={() => setOpenLoteSelection(false)}>
        <>
          <LoteSelectionRemake2
            setOpen={setOpenLoteSelection}
            addFunction={handleAddArticles}
            articleName={article.nombre}
            empityLotes
          />
        </>
      </Modal>
    </>
  );
};

function modifyArticlesList(
  articles: IArticleHistory[],
  setArticles: Function,
  article: IArticleHistory,
  batch: IExistingArticleList[]
) {
  const newArticles = [...articles];
  const batchIndex = batch.findIndex((data) => data.id_Articulo === article.id_Articulo);
  const index = newArticles.findIndex((a) => a.id_Articulo === article.id_Articulo);
  newArticles[index] = {
    ...article,
    cantidad: newArticles[index].cantidad,
    fechaCaducidad: batch[batchIndex].fechaCaducidad,
  };
  setArticles(newArticles);
}
