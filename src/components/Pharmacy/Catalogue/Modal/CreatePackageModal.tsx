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
import { AddCircle, CheckCircle, Warning, Edit } from '@mui/icons-material';
import { LoteSelectionRemake2 } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelectionRemake2';
import { useEffect, useState } from 'react';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { toast } from 'react-toastify';
import { useGetPharmacyConfig } from '../../../../hooks/useGetPharmacyConfig';
import { useWarehouseMovementPackagesPaginationStore } from '../../../../store/warehouseStore/movimientoAlmacenPaquetesPaginacion';
import { buildPackage } from '../../../../api/api.routes';
//import { PackageReport } from '../../../Export/Pharmacy/PackageReport';
//import { PDFDownloadLink } from '@react-pdf/renderer';

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
  preLoadedArticles: IArticleHistory[];
}

interface ArticlesInBatch {
  Id_ArticuloExistente: string;
  Id_Articulo: string;
  Cantidad: number;//checar aqui a numero
}

export const CreatePackageModal = (props: CreatePackageModalProps) => {
  const [articlesInBatch, setArticlesInBatch] = useState<ArticlesInBatch[]>([]);
  const refetch = useWarehouseMovementPackagesPaginationStore((state) => state.fetchWarehouseMovements);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useGetPharmacyConfig();
  const [seed, setSeed] = useState(0);

  const handleSubmit = async () => {
    if (checkQuantyties()) {
      toast.warning('Debes de agregar todos los artículos');
      return;
    }
    setIsLoading(true);
    const object = {
      id_HistorialMovimiento: props.movementHistoryId,
      lotes: articlesInBatch.map((a) => {
        return { ...a, Id_ArticuloAlmacenStock: a.Id_ArticuloExistente };
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

  const checkQuantyties = () => {
    const quantityMap: { [key: string]: number } = {};

    // Llenar el mapa con las cantidades de articlesInBatch
    articlesInBatch.forEach((article) => {
      if (!quantityMap[article.Id_Articulo]) {
        quantityMap[article.Id_Articulo] = 0;
      }
      quantityMap[article.Id_Articulo] += article.Cantidad;
    });

    // Verificar que todos los artículos en articlesIDs están presentes en quantityMap con la cantidad correcta
    for (const article of props.articles) {
      const requiredQuantity = article.cantidad;
      const availableQuantity = quantityMap[article.id_Articulo ?? ''] || 0;

      if (availableQuantity < requiredQuantity) {
        return true; // Falta cantidad o artículo
      }
    }

    return false; // Todo está bien
  };

  const checkPreloadedQuantyties = () => {
    const quantityMap: { [key: string]: number } = {};

    // Llenar el mapa con las cantidades de articlesInBatch
    const listArt: ArticlesInBatch[] = [];
    props.preLoadedArticles.forEach((article) => {
      if (!quantityMap[article.id_Articulo ?? '']) {
        quantityMap[article.id_Articulo ?? ''] = 0;
      }
      quantityMap[article.id_Articulo ?? ''] += article.cantidad;
      listArt.push({
        Id_Articulo: article.id_Articulo ?? '',
        Id_ArticuloExistente: article.id_ArticuloExistente ?? '',
        Cantidad: article.cantidad,
      });
    });
    setArticlesInBatch(listArt);
    props.setArticles(props.preLoadedArticles);
    setSeed(seed + 1);
    // Verificar que todos los artículos en articlesIDs están presentes en quantityMap con la cantidad correcta
    for (const article of props.articles) {
      const requiredQuantity = article.cantidad;
      const availableQuantity = quantityMap[article.id_Articulo ?? ''] || 0;

      if (availableQuantity < requiredQuantity) {
        return true; // Falta cantidad o artículo
      }
    }

    return false; // Todo está bien
  };

  useEffect(() => {
    checkPreloadedQuantyties();
  }, []);

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Armado de paquete" />
      <Box sx={style2}>
        <CreatePackageModalTable
          key={seed}
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
        {/*<PDFDownloadLink
          document={<PackageReport articulos={articulos} />}
          fileName={`${Date.now()}.pdf`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {({ loading }) => <Button variant="contained">{loading ? 'Generando PDF...' : 'Descargar PDF'}</Button>}
        </PDFDownloadLink>*/}
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
    const object = {
      Id_HistorialMovimiento: movementHistoryId,
      Lotes: lotesArticles.map((a) => {
        return {
          Cantidad: a.cantidad.toString(),
          Id_ArticuloExistente: a.id_ArticuloExistente,
          Id_Articulo: a.id_Articulo,
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
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Box display={'flex'}>
              <Tooltip title="Agregar articulo de lote">
                <IconButton onClick={handleAdd}>
                  {article.fechaCaducidad ? <Edit sx={{ color: 'gray' }} /> : <AddCircle color="disabled" />}
                </IconButton>
              </Tooltip>
              {article.fechaCaducidad && (
                <Tooltip title="Articulo agregado correctamente" sx={{ my: 'auto' }}>
                  <CheckCircle color="success" sx={{ my: 'auto' }} />
                </Tooltip>
              )}
            </Box>
          )}
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
