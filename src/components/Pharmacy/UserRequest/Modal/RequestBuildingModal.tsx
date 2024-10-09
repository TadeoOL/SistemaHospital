import { Cancel, Check, Delete, Edit, Save, Warning } from '@mui/icons-material';
import {
  Button,
  Stack,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import withReactContent from 'sweetalert2-react-content';
import { updateStatusNurseRequest } from '../../../../api/api.routes';
import { useExistingArticleLotesPagination } from '../../../../store/warehouseStore/existingArticleLotePagination';
import { InurseRequest, IPrebuildedArticleFromArticleRequest } from '../../../../types/types';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import Swal from 'sweetalert2';
import { isValidIntegerOrZero } from '../../../../utils/functions/dataUtils';

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

interface RequestBuildingModalProps {
  setOpen: Function;
  refetch: Function;
  request: InurseRequest;
  preLoadedArticles: IPrebuildedArticleFromArticleRequest[];
}

export const RequestBuildingModal = (props: RequestBuildingModalProps) => {
  const [articles, setArticles] = useState<IPrebuildedArticleFromArticleRequest[]>(props.preLoadedArticles);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);

  useEffect(() => {
    setWarehouseId(props.request.id_AlmacenSolicitado);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const object = {
      Id: props.request.id_SolicitudEnfermero,
      Lotes: articles.map((art) => ({
        Id_Articulo: art.id_Articulo,
        Id_ArticuloAlmacen: art.id_ArticuloAlmacen ?? '',
        Cantidad: art.cantidad.toString(),
      })),
      EstadoSolicitud: 2,
      Id_AlmacenOrigen: props.request.id_AlmacenSolicitado,
      Id_CuentaPaciente: props.request.id_CuentaPaciente,
    };
    try {
      //await articlesOutputToWarehouse(object);
      await updateStatusNurseRequest(object);
      props.refetch();
      toast.success('Solicitud aceptada');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al dar salida a artículos!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = (articleEdited: IPrebuildedArticleFromArticleRequest) => {
    const direction = articles.findIndex((art) => art.id_Articulo === articleEdited.id_Articulo);
    if (direction > -1) {
      articles.splice(direction, 1);
      setArticles([...articles, articleEdited]);
    } /*else {
      articles.push(articleEdited)
      setArticles(articles);
    }*/
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
      totalToSendByArticle += article.cantidad;
      if (totalToSendByArticle < Number(article.cantidadSeleccionar)) diferentNumbers = true;
    });
    if (diferentNumbers || articles.length !== props.request.articulos.length) {
      continueRequest();
      return;
    } else {
      handleSubmit();
    }
  };

  const checkPreloadedQuantyties = () => {
    const quantityMap: {
      [key: string]: { cantidad: number };
    } = {};
    let flag = true;
    props.preLoadedArticles.forEach((article) => {
      if (!quantityMap[article.id_Articulo ?? '']) {
        quantityMap[article.id_Articulo ?? ''] = {
          cantidad: 0,
        };
      }
      quantityMap[article.id_Articulo ?? ''].cantidad += article.cantidad;
    });

    // Verificar que todos los artículos en articlesIDs están presentes en quantityMap con la cantidad correcta
    for (const article of props.request.articulos) {
      const requiredQuantity = article.cantidad;
      const availableArticle = quantityMap[article.id_Articulo ?? ''];

      if (!availableArticle || availableArticle.cantidad < requiredQuantity) {
        flag = false; // Falta cantidad o artículo
      }
    }
    setArticles(props.preLoadedArticles);
    return flag; // Todo está bien
  };

  useEffect(() => {
    if (checkPreloadedQuantyties()) {
    }
  }, []);

  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Solicitud de Artículos" />
      <Box sx={{ overflowY: 'auto', ...styleBar, bgcolor: 'background.paper', p: 2 }}>
        <Box
          sx={{
            maxHeight: 300,
          }}
        >
          <Stack spacing={2}>
            <React.Fragment>
              <ArticlesTable
                articles={articles}
                setArticles={setArticles}
                isResume={false}
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
  articles: IPrebuildedArticleFromArticleRequest[];
  setArticles?: Function;
  isResume: boolean;
  handleAddArticle: Function;
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles, setArticles, isResume, handleAddArticle }) => {
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
                handleAddArticle={handleAddArticle}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

interface ArticlesTableRowProps {
  articles: IPrebuildedArticleFromArticleRequest[];
  article: IPrebuildedArticleFromArticleRequest;
  setArticles: Function;
  isResume: boolean;
  handleAddArticle: Function;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  handleAddArticle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amountText, setAmountText] = useState(article.cantidadSeleccionar.toString());

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>{article.nombre}</Box>
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{article.cantidadSeleccionar}</TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title={isEditing ? 'Guardar' : 'Editar'}>
              <IconButton
                disabled={article.stock == 0}
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    //handleSaveValue();
                    const quant = Number(amountText);
                    /*if (quant > article.stock) {
                      return toast.error('La cantidad excede el stock del articulo ' + article.nombre);
                    }*/

                    handleAddArticle({ ...article, cantidad: quant, id_ArticuloAlmacen: article.id_ArticuloAlmacen });
                  }
                }}
              >
                {isEditing ? <Save /> : <Edit />}
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
          {isEditing ? (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              <TextField
                sx={{ width: '60%', ml: 'auto' }}
                size="small"
                fullWidth
                placeholder="Cantidad"
                value={amountText}
                onChange={(e) => {
                  if (!isValidIntegerOrZero(e.target.value)) return;
                  setAmountText(e.target.value);
                }}
              />
              <Typography> Stock actual: {article.stock} </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              {article.cantidad === 0 && <Warning sx={{ color: 'red', mr: 2 }} />}
              {article.cantidad !== 0 && article.cantidad < Number(article.cantidadSeleccionar) && (
                <Warning sx={{ color: '#FFA500', mr: 2 }} />
              )}
              {article.cantidad}
            </Box>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
