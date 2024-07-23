import { Cancel, Check, Delete, Edit, ExpandLess, ExpandMore, Warning } from '@mui/icons-material';
import {
  Button,
  Stack,
  Modal,
  Box,
  Card,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  tableCellClasses,
  styled,
  alpha,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import withReactContent from 'sweetalert2-react-content';
import { updateStatusNurseRequest } from '../../../../api/api.routes';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { InurseRequest, IArticleFromSearch, IExistingArticleList } from '../../../../types/types';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import Swal from 'sweetalert2';
import { returnExpireDate } from '../../../../utils/expireDate';
import { LoteSelectionRemake2 } from '../../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelectionRemake2';

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

type ArticlesToSelectLote = {
  id_Articulo: string;
  nombre: string;
  cantidadSeleccionar: string;
  cantidad: number;
  lote?: IExistingArticleList[];
};

interface RequestBuildingModalProps {
  setOpen: Function;
  refetch: Function;
  request: InurseRequest;
}

export const RequestBuildingModal = (props: RequestBuildingModalProps) => {
  const [articles, setArticles] = useState<ArticlesToSelectLote[]>(
    props.request.articulos.map((art) => ({
      nombre: art.nombre,
      cantidadSeleccionar: art.cantidad.toString(),
      cantidad: 0,
      lote: undefined,
      id_Articulo: art.id_Articulo,
    }))
  );
  const [value, setValue] = useState(0);

  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [articleSelected, setArticleSelected] = useState<null | IArticleFromSearch>(null);
  const [loteEditing, setLoteEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loteSelected, setLoteSelected] = useState<
    { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[] | null
  >(null);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);

  useEffect(() => {
    setWarehouseId(props.request.id_AlmacenSolicitado);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const object = {
      Id: props.request.id_SolicitudEnfermero,
      Lotes: articles
        .map((art) =>
          art?.lote?.map((loteArt) => ({
            Id_ArticuloExistente: loteArt.id_ArticuloExistente,
            Cantidad: loteArt.cantidad.toString(),
          }))
        )
        .flat(1) as {
        Id_ArticuloExistente: string;
        Cantidad: string;
      }[],
      EstadoSolicitud: 2,
      Id_AlmacenOrigen: props.request.id_AlmacenSolicitado,
      Id_CuentaPaciente: props.request.id_CuentaPaciente,
    };
    try {
      //await articlesOutputToWarehouse(object);
      await updateStatusNurseRequest(object);
      props.refetch(false);
      toast.success('Solicitud aceptada');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al dar salida a artículos!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = (lotesArticles: IExistingArticleList[], edit: boolean) => {
    let totalQuantityByArticle = 0;
    const updatedLote: { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[] = [];
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
      article?.lote?.forEach((articleNested) => {
        totalToSendByArticle += articleNested.cantidad;
      });
      if (totalToSendByArticle < Number(article.cantidadSeleccionar)) diferentNumbers = true;
    });
    if (diferentNumbers || articles.length !== props.request.articulos.length) {
      continueRequest();
      return;
    } else {
      handleSubmit();
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
          <Stack spacing={2}>
            <React.Fragment>
              <ArticlesTable
                articles={articles}
                setArticles={setArticles}
                isResume={false}
                setOpenLoteModal={setOpenLoteModal}
                openLoteModal={openLoteModal}
                setArticleSelected={setArticleSelected}
                articleSelected={articleSelected}
                setLoteEditing={setLoteEditing}
                loteEditing={loteEditing}
                setLoteSelected={setLoteSelected}
                loteSelected={loteSelected}
                handleAddArticle={handleAddArticle}
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
          disabled={props.request.articulos.length < 1 || loading}
          onClick={() => {
            if (articles.length === 0) return toast.error('Agrega artículos!');
            if (articles.flatMap((article) => article.cantidad).some((cantidad) => cantidad === 0))
              return toast.error('Rellena todas las cantidades');

            checkQuantyties();
          }}
          startIcon={<Check />}
        >
          {'Aceptar'}
        </Button>
      </Box>
    </Box>
  );
};
interface ArticlesTableProps {
  articles: ArticlesToSelectLote[];
  setArticles?: Function;
  isResume: boolean;
  setOpenLoteModal: Function;
  openLoteModal: boolean;
  setArticleSelected: Function;
  articleSelected: null | IArticleFromSearch;
  setLoteEditing: Function;
  loteEditing: boolean;
  setLoteSelected: Function;
  loteSelected: { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[] | null;
  handleAddArticle: Function;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  setArticles,
  isResume,
  setOpenLoteModal,
  openLoteModal,
  setArticleSelected,
  articleSelected,
  setLoteEditing,
  loteEditing,
  setLoteSelected,
  loteSelected,
  handleAddArticle,
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
              <TableCell>Cantidad Seleccionada</TableCell>
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
                setOpenLoteModal={setOpenLoteModal}
                setArticleSelected={setArticleSelected}
                setLoteSelected={setLoteSelected}
                setLoteEditing={setLoteEditing}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        <>
          <LoteSelectionRemake2
            setOpen={setOpenLoteModal as (arg0: boolean) => void}
            articleName={articleSelected?.nombre || ''}
            addFunction={handleAddArticle}
            editing={loteEditing}
            selectedLotes={loteSelected as { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[]}
            empityLotes={true}
          />
        </>
      </Modal>
    </Card>
  );
};

interface ArticlesTableRowProps {
  articles: ArticlesToSelectLote[];
  article: ArticlesToSelectLote;
  setArticles: Function;
  isResume: boolean;
  setOpenLoteModal: Function;
  setArticleSelected: Function;
  setLoteSelected: Function;
  setLoteEditing: Function;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  setOpenLoteModal,
  setArticleSelected,
  setLoteSelected,
  setLoteEditing,
}) => {
  const [open, setOpen] = useState(false);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);
  const setSearch = useExistingArticleLotesPagination((state) => state.setSearch);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
            {article.nombre}
          </Box>
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{article.cantidadSeleccionar}</TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setLoteSelected(article.lote);
                  setArticleId(article.id_Articulo);
                  setSearch('');
                  setLoteEditing(true);
                  setArticleSelected(article);
                  setOpenLoteModal(true);
                  /*if (article.stockActual === '' || article.stockActual === '0')
                      return toast.error('Para guardar escribe una cantidad valida!');
                    setIsEditing(!isEditing);
                    setEditingRow(!isEditing);
                    */
                }}
              >
                <Edit />
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
        <TableCell sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {article.cantidad === 0 && <Warning sx={{ color: 'red', mr: 2 }} />}
            {article.cantidad !== 0 && article.cantidad < Number(article.cantidadSeleccionar) && (
              <Warning sx={{ color: '#FFA500', mr: 2 }} />
            )}
            {article.cantidad}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ padding: 0 }}>
          <NestedArticlesTable articles={article.lote} open={open} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
interface NestedArticlesTableProps {
  articles: ArticlesToSelectLote['lote'];
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
              <NestedTableCell>{a.cantidad}</NestedTableCell>
              <NestedTableCell>{returnExpireDate(a.fechaCaducidad)}</NestedTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapse>
  );
};
