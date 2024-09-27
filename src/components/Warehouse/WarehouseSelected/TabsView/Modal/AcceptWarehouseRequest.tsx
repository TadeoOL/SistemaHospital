import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
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
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import React, { useEffect, useState } from 'react';
import { Cancel, Delete, Edit, Check, Warning, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { IWarehouseData, MerchandiseEntry } from '../../../../../types/types';
import { articlesOutputToWarehouse, getAmountForArticleInWarehouse } from '../../../../../api/api.routes';
import { useExistingArticleLotesPagination } from '../../../../../store/warehouseStore/existingArticleLotePagination';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { isValidIntegerOrZero } from '../../../../../utils/functions/dataUtils';

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

export type ArticlesFetched = {
  id?: string;
  nombre: string;
  stockActual?: number;
  cantidad: number;
};

type ArticlesToSelectLote = {
  id_Articulo: string;
  id_ArticuloAlmacen: string | null;//este no viene en fetch pero se asigna despues
  nombre: string;
  cantidadSeleccionar: number;
  cantidad: number;
};

const renderOutputView = (
  step: number,
  articles: ArticlesToSelectLote[],
  setArticles: Function,
  subWarehouse: any,
  request: MerchandiseEntry,
  handleAddArticle: Function
) => {
  switch (step) {
    case 0:
      return (
        <ArticlesOutput
          articles={articles}
          setArticles={setArticles}
          handleAddArticle={handleAddArticle}
          request={request}

        />
      );

    case 1:
      return (
        <OutputResume
          articles={articles}
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

export const AceptWareHouseRequestModalRework = (props: ArticlesViewProps) => {
  const [articles, setArticles] = useState<ArticlesToSelectLote[]>(
    props.request.historialArticulos.map((art) => ({
      nombre: art.nombre,
      cantidadSeleccionar: art.cantidad,
      cantidad: 0,
      id_Articulo: (art as any).id_ArticuloExistente,
      id_ArticuloAlmacen: null
    }))
  );
  const [value, setValue] = useState(0);
  const [subWarehouse, setSubWarehouse] = useState<IWarehouseData | null>(null);

  const [loading, setLoading] = useState(false);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);
  const wData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const warehouseData = useWarehouseTabsNavStore((state) => state.warehouseData);

  useEffect(() => {
    console.log(warehouseData)
    setWarehouseId(wData.id);
    console.log(props.request);
    const subwarehousefind = warehouseData.subAlmacenes.find((sbw) => sbw.id === props.request.id_AlmacenDestino );
    setSubWarehouse(subwarehousefind ?? null)
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    // NO HACE NADA EN HD
    const object = {
      Id_HistorialMovimiento: props.request.id,
      ArticulosSalida: articles
        .map((art) =>
        ({
          Id_ArticuloAlmacenStock: art.id_ArticuloAlmacen !== null ? art.id_ArticuloAlmacen : "",
          Id_Articulo: art.id_Articulo,
          Nombre: art.nombre,
          Cantidad: art.cantidad
        })),
      Estatus: 2,
    };
    try {
      await articlesOutputToWarehouse(object);
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

  const handleAddArticle = (articleQuantity: ArticlesToSelectLote) => {
      const direction = articles.findIndex((art: ArticlesToSelectLote) => art.id_Articulo === articleQuantity.id_Articulo);
      if (direction > -1) {
      articles.splice(direction, 1);
      setArticles([...articles, articleQuantity]);
    } else {
      articles.push(articleQuantity)
      setArticles(articles);
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
          setValue(1)
        }
      });
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
            subWarehouse,
            props.request,
            handleAddArticle
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
              setValue(1);
            }
          }}
          startIcon={<Cancel />}
        >
          {value === 0 ? 'Cancelar' : 'Regresar'}
        </Button>
        <Button
          variant="contained"
          disabled={props.request.historialArticulos.length < 1 || loading}
          onClick={() => {
            console.log("Articulos que mando");
            console.log(articles);
            console.log("Articulos que solicitan");
            console.log(props.request.historialArticulos);

            if (articles.length === 0) return toast.error('Agrega artículos!');
            if (articles.flatMap((article) => article.cantidad).some((cantidad) => cantidad === 0)){
              console.log("elfokinpana");
              return toast.error('Rellena todas las cantidades');
            }
            if(value === 1){
              handleSubmit()
            }
            else{
              let flagQuant = false
            articles.forEach(artQ => { 
              if(flagQuant = artQ.cantidad < artQ.cantidadSeleccionar){
                flagQuant = true;
                return;
              }
            });
              if(articles.length < props.request.historialArticulos.length || flagQuant ){
                continueRequest()
              }
              else{
                setValue(1)
              }
            }
          }}
          startIcon={<Check />}
        >
          {'Aceptar'}
        </Button>
      </Box>
    </Box>
  );
};

interface ArticlesOutputProp {
  articles: ArticlesToSelectLote[];
  setArticles: Function;
  handleAddArticle: Function;
  request: MerchandiseEntry;
}

const ArticlesOutput: React.FC<ArticlesOutputProp> = ({
  articles,
  setArticles,
  handleAddArticle,
  request,
}) => {
  return (
    <>
      <Stack spacing={2}>
        <React.Fragment>
          <ArticlesTable
            articles={articles}
            setArticles={setArticles}
            isResume={false}
            handleAddArticle={handleAddArticle}
            request={request}
          />
        </React.Fragment>
      </Stack>
    </>
  );
};

interface ArticlesTableProps {
  articles: ArticlesToSelectLote[];
  setArticles?: Function;
  isResume: boolean;
  handleAddArticle: Function;
  request: MerchandiseEntry
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  setArticles,
  isResume,
  handleAddArticle,
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
              { !isResume && (<TableCell sx={{ textAlign: 'center' }}>Acción</TableCell>)}
              <TableCell>Cantidad Seleccionada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <ArticlesTableRow
                request={request}
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
      {/*<Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
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
      </Modal>*/}
    </Card>
  );
};

interface ArticlesTableRowProps {
  articles: ArticlesToSelectLote[];
  article: ArticlesToSelectLote;
  setArticles: Function;
  isResume: boolean;
  handleAddArticle: Function;
  request: MerchandiseEntry;
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({
  article,
  setArticles,
  articles,
  isResume,
  handleAddArticle,
  request
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amountText, setAmountText] = useState(article.cantidadSeleccionar.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [amountArticleSelected, setAmountArticleSelected] = useState(0);
  const [idArticleSelected, setIdArticleSelected] = useState('');

  const searchArticleAmount = async (Id_Articulo: string) => {
    setIsLoading(true);
    try {
      const amountResponse = await getAmountForArticleInWarehouse(Id_Articulo ,request.id_AlmacenOrigen)
      setIsLoading(false);
      setAmountArticleSelected(amountResponse.stockActual as number);
      setIdArticleSelected(amountResponse.id_ArticuloStock)
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setAmountArticleSelected(0);
      setIdArticleSelected('')

    }
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {article.nombre}
          </Box>
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{article.cantidadSeleccionar}</TableCell>
        {!isResume && (
          <TableCell>
            <Tooltip title={isEditing ? 'Guardar' : 'Editar'}>
              <IconButton
                disabled={isLoading}
                onClick={() => {
                  setIsEditing(!isEditing)
                  if (isEditing) {
                    //handleSaveValue();
                    const quant = Number(amountText);
                    if(quant > Number(amountArticleSelected)){
                      return toast.error('La cantidad excede el stock del articulo '+article.nombre);
                    }

                    handleAddArticle({...article, cantidad: quant, id_ArticuloAlmacen : idArticleSelected})
                  }
                  else{
                    searchArticleAmount(article.id_Articulo)
                  }
                  /*setLoteSelected(article.lote);
                  setArticleId(article.id_Articulo);
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
          {isEditing ? 
          (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
<TextField
                      disabled={isLoading}
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
                    <Typography> Stock actual: {amountArticleSelected} </Typography>
            </Box>
            
            ) 
          :
          (<Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {article.cantidad === 0 && <Warning sx={{ color: 'red', mr: 2 }} />}
            {article.cantidad !== 0 && article.cantidad < Number(article.cantidadSeleccionar) && (
              <Warning sx={{ color: '#FFA500', mr: 2 }} />
            )}
            {article.cantidad}
          </Box>)
        
          }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

interface OutputResumeProps {
  articles: any[];
  subWarehouse: any;
  request: MerchandiseEntry;
}

const OutputResume: React.FC<OutputResumeProps> = ({
  articles,
  subWarehouse,
  request,
}) => {
  const warehouseData = useWarehouseTabsNavStore((state) => state.warehouseData);
  const dateNow = Date.now();
  const today = new Date(dateNow);
  const flagSubwarehouse = warehouseData.esSubAlmacen;
  console.log(warehouseData);
  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Almacen de origen:</Typography>
          <Typography>{flagSubwarehouse ? "nombre origen" : warehouseData.nombre}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Fecha de salida:</Typography>
          <Typography>{today.toLocaleDateString('es-ES')}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {/*no se si falta un caso por si no se mandra a otro almacen*/}
              <Typography variant="subtitle1">Almacen de destino:</Typography>
              <Typography>{flagSubwarehouse ? warehouseData.nombre : subWarehouse.nombre}</Typography>
        </Grid>
      </Grid>
      <ArticlesTable
        articles={articles}
        isResume={true}
        handleAddArticle={() => {}}
        request={request}
      />
    </Stack>
  );
};
