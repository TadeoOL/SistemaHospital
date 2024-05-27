import { Box, Button, Card, CircularProgress, Grid, Modal, Stack, Tooltip, Typography } from '@mui/material';
import AnimateButton from '../../@extended/AnimateButton';
import { usePosArticlesPaginationStore } from '../../../store/pharmacy/pointOfSale/posArticlesPagination';
import { useEffect, useMemo, useState } from 'react';
import { usePosOrderArticlesStore } from '../../../store/pharmacy/pointOfSale/posOrderArticles';
import { IArticle2, IExistingArticleList } from '../../../types/types';
import { neutral } from '../../../theme/colors';
import { Info } from '@mui/icons-material';
import { LoteSelectionRemake } from '../../Warehouse/WarehouseSelected/TabsView/Modal/LoteSelectionRemake';
import { useExistingArticleLotesPagination } from '../../../store/warehouseStore/existingArticleLotePagination';

const scrollBar = {
  '&::-webkit-scrollbar': {
    width: '0.5em',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: '10px',
  },
};

const useGetAllData = () => {
  const data = usePosArticlesPaginationStore((state) => state.data);
  const fetchData = usePosArticlesPaginationStore((state) => state.fetchData);
  const pageCount = usePosArticlesPaginationStore((state) => state.pageCount);
  const pageIndex = usePosArticlesPaginationStore((state) => state.pageIndex);
  const search = usePosArticlesPaginationStore((state) => state.search);
  const loading = usePosArticlesPaginationStore((state) => state.loading);
  const subCategoryId = usePosArticlesPaginationStore((state) => state.subCategoryId);
  const setPageIndex = usePosArticlesPaginationStore((state) => state.setPageIndex);
  const setFetchPagination = usePosArticlesPaginationStore((state) => state.setFetchPagination);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, subCategoryId]);

  return {
    data,
    pageIndex,
    loading,
    pageCount,
    setPageIndex,
    setFetchPagination,
  };
};

interface ArticlesToSaleProps {
  sx?: any;
}

export const ArticlesToSale = (props: ArticlesToSaleProps) => {
  const { data, loading, pageIndex, pageCount, setPageIndex, setFetchPagination } = useGetAllData();
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  const setArticlesOnBasket = usePosOrderArticlesStore((state) => state.setArticlesOnBasket);
  const setArticleId = useExistingArticleLotesPagination((state) => state.setArticleId);

  const [articleSelected, setArticleSelected] = useState<null | IArticle2>(null);
  const [openLoteModal, setOpenLoteModal] = useState(false);
  const [loteEditing, setLoteEditing] = useState(false);

  /*const articlesToSale = useMemo(
    () =>
      data.filter(
        (article) => !articlesOnBasket.some((articleBasket) => articleBasket.id_Articulo === article.id_Articulo)
      ),
    [articlesOnBasket, data]
  );*/
  const hasMorePages = useMemo(() => {
    return pageIndex < pageCount;
  }, [pageIndex, pageCount]);

  //console.log({ pageIndex });
  //console.log({ pageCount });
  const handleAddArticleToBasket = (article: IArticle2) => {
    console.log(article);
    if (articlesOnBasket.some((a) => a.id_Articulo === article.id_Articulo)) return;
    const articleModified = data
      .map((a) => {
        return { ...a, cantidad: 1 };
      })
      .filter((a) => a.id_Articulo === article.id_Articulo);
    setArticlesOnBasket([...articlesOnBasket, ...articleModified]);
  };

  const handleAddArticle = (articles: any, lotesFromArticle: IExistingArticleList[]) => {
    if (articleSelected) {
      const updatedLote = {
        cantidad: 1,
        id_ArticuloExistente: articles.id_ArticuloExistente,
        fechaCaducidad: articles.fechaCaducidad,
        fechaCompraLote: articles.fechaCompraLote,
      }; //articlesOnBasket
      const alreadyAddedArticle = articlesOnBasket.find((a) => a.id_Articulo === (articleSelected?.id_Articulo || ''));
      if (alreadyAddedArticle && alreadyAddedArticle.lote) {
        alreadyAddedArticle.lote.push(updatedLote);
        const updatedArticle = {
          ...articleSelected,
          cantidad: (alreadyAddedArticle.cantidad || 0) + 1,
          lote: alreadyAddedArticle.lote,
        };
        const direction = articlesOnBasket.findIndex((a) => a.id_Articulo === (articleSelected?.id_Articulo || ''));
        articlesOnBasket.splice(direction, 1);
        setArticlesOnBasket([...articlesOnBasket, updatedArticle]);
        //setOriginalArticlesSelected((prev: any) => [...prev, articleSelected]);
        setArticleSelected(null);
      } else {
        const updatedArticle = {
          ...articleSelected,
          cantidad: 1,
          lote: [updatedLote],
        };
        const nosewe = {
          ...articleSelected,
          lote: [updatedArticle],
          cantidad: lotesFromArticle.reduce((total, lote) => total + lote.cantidad, 0),
        };
        setArticlesOnBasket([...articlesOnBasket, updatedArticle]);
        //setOriginalArticlesSelected((prev: any) => [...prev, nosewe]);
        setArticleSelected(null);
      }
    }
  };

  return (
    <Stack sx={{ overflowY: 'auto', ...props.sx, ...scrollBar }}>
      <Stack sx={{ maxHeight: 550 }}>
        <>
          <Typography variant="h5">Artículos</Typography>
          <Grid container spacing={2} sx={{ py: 2 }}>
            {data.length !== 0
              ? data.map((article) => (
                  <Grid item xs={12} lg={3} key={article.id_Articulo}>
                    <AnimateButton>
                      <Card
                        sx={{
                          p: 2,
                          height: 160,
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          '&:hover': {
                            cursor: 'pointer',
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease-in-out',
                            boxShadow: 3,
                          },
                          boxShadow: 3,
                        }}
                        onClick={() => {
                          setArticleSelected(article);
                          setArticleId(article.id_Articulo);
                          console.log('art seleccionado', article);
                          //setLoteEditing(true)
                          setOpenLoteModal(true);
                          //handleAddArticleToBasket(article);
                        }}
                      >
                        <Typography fontWeight={700} fontSize={18}>
                          {article.nombre.substring(0, 30).concat('...')}
                        </Typography>
                        <Typography sx={{ fontSize: 9, fontWeight: 500, mb: 0.5 }}>
                          Codigo: {article.codigoBarras}
                        </Typography>
                        {article.descripcion && article.descripcion.length > 100 ? (
                          <Tooltip title={article.descripcion}>
                            <Typography>{article.descripcion.substring(0, 80).concat('...')}</Typography>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption">{article.descripcion}</Typography>
                        )}
                        <Box
                          sx={{
                            marginTop: 'auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'end',
                          }}
                        >
                          <Box sx={{ display: 'flex', columnGap: 1 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                              Precio: ${article.precioVenta}
                            </Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 500, color: neutral[400] }}>
                              / {article.stockActual} pza.
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </AnimateButton>
                  </Grid>
                ))
              : !loading && (
                  <Box
                    sx={{
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'center',
                      p: 10,
                      alignItems: 'center',
                      columnGap: 2,
                    }}
                  >
                    <Info sx={{ color: 'gray', width: 50, height: 50 }} />
                    <Typography variant="h2" sx={{ color: 'gray' }}>
                      No se encontraron artículos
                    </Typography>
                  </Box>
                )}
          </Grid>
          {loading && (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 6, alignItems: 'center' }}>
              <Typography variant="h4">Cargando artículos...</Typography>
              <CircularProgress sx={{ ml: 2 }} size={30} />
            </Box>
          )}
          {hasMorePages && !loading && (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{ maxWidth: 300 }}
                onClick={() => {
                  setPageIndex(pageIndex + 1);
                  setFetchPagination(true);
                }}
              >
                Cargar mas artículos
              </Button>
            </Box>
          )}
        </>
      </Stack>
      <Modal open={openLoteModal} onClose={() => setOpenLoteModal(false)}>
        {/*<LoteSelection
          setOpen={setOpenLoteModal}
          open={openLoteModal}
          lotes={(articleSelected?.lote as any) || []}
          articleName={articleSelected?.nombre || ''}
          addFunction={handleAddArticle}
          setEditing={setLoteEditing}
          editing={loteEditing}
          //selectedLotes={loteSelected as loteFetch[]}
        />*/}
        {
          <LoteSelectionRemake
            sx={{ p: 2 }}
            setOpen={setOpenLoteModal}
            articleName={articleSelected?.nombre || ''}
            addFunction={handleAddArticle}
            alreadySelectedArticlesIDs={
              articlesOnBasket
                .find((artS) => artS.id_Articulo === articleSelected?.id_Articulo || '')
                ?.lote?.map((lot) => lot.id_ArticuloExistente) || undefined
            }
          />
        }
      </Modal>
    </Stack>
  );
};
