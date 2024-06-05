import React, { useEffect } from 'react';
import { Box, Button, Stack, Grid, Card, Typography, CircularProgress, TablePagination } from '@mui/material';
import { useExistingArticleLotesPagination } from '../../../../../store/warehouseStore/existingArticleLotePagination';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import AnimateButton from '../../../../@extended/AnimateButton';
import { Info } from '@mui/icons-material';

interface LoteSelectionProps {
  sx?: any;
  setOpen: (open: boolean) => void;
  articleName: string;
  addFunction: Function;
  alreadySelectedArticlesIDs?: string[];
}

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
  const data = useExistingArticleLotesPagination((state) => state.data);
  const fetchData = useExistingArticleLotesPagination((state) => state.fetchExistingArticles);
  const pageCount = useExistingArticleLotesPagination((state) => state.pageCount);
  const pageIndex = useExistingArticleLotesPagination((state) => state.pageIndex);
  const pageSize = useExistingArticleLotesPagination((state) => state.pageSize);
  const setPageSize = useExistingArticleLotesPagination((state) => state.setPageSize);
  const search = useExistingArticleLotesPagination((state) => state.search);
  const loading = useExistingArticleLotesPagination((state) => state.isLoading);
  const setPageIndex = useExistingArticleLotesPagination((state) => state.setPageIndex);
  const setSearch = useExistingArticleLotesPagination((state) => state.setSearch);

  useEffect(() => {
    fetchData(true);
  }, [search, pageIndex]);

  return {
    data,
    pageIndex,
    loading,
    pageCount,
    setPageIndex,
    pageSize,
    setPageSize,
    setSearch,
  };
};

export const LoteSelectionPOS: React.FC<LoteSelectionProps> = (props) => {
  const { data, pageCount, setPageIndex, pageIndex, loading, pageSize, setPageSize } = useGetAllData();

  useEffect(() => {
    if (data.length === 1) {
      if (!props.alreadySelectedArticlesIDs?.includes(data[0].id_ArticuloExistente) && data[0]) {
        props.addFunction(data[0]);
      }
      props.setOpen(false);
    }
  }, []);

  const LoteCard = ({ article, articleName, addFunction, setOpen, disabled }: any) => (
    <AnimateButton>
      <Card
        sx={{
          p: 2,
          height: 160,
          border: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          opacity: disabled ? 0.5 : 1,
          ...(disabled
            ? {}
            : {
                '&:hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: 3,
                },
              }),
          boxShadow: 3,
        }}
        onClick={() => {
          if (!disabled) {
            addFunction(article);
            setOpen(false);
          }
        }}
      >
        <Typography fontWeight={700} fontSize={14}>
          {articleName}
        </Typography>
        <Typography fontSize={14}>Caducidad</Typography>
        <Typography fontSize={14}>{article.fechaCaducidad}</Typography>
        <Box
          sx={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
          }}
        >
          <Box sx={{ display: 'flex', columnGap: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{article.cantidad} pza.</Typography>
          </Box>
        </Box>
      </Card>
    </AnimateButton>
  );
  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Lotes Disponibles" />
      <Box sx={{ overflowY: 'auto', ...styleBar, bgcolor: 'background.paper', p: 2 }}>
        <Stack sx={{ overflowY: 'auto', ...props.sx, ...scrollBar }}>
          <Stack sx={{ maxHeight: 550 }}>
            <Box sx={{ justifyContent: 'space-between', display: 'flex', mb: 2 }}>
              <Typography variant="h5">Nombre: {props.articleName} </Typography>
            </Box>
            <Typography variant="h5">Seleccione el lote del articulo que desea retirar:</Typography>

            {loading ? (
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 6, alignItems: 'center' }}>
                <Typography variant="h4">Cargando artículos...</Typography>
                <CircularProgress sx={{ ml: 2 }} size={30} />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ py: 2 }}>
                {data.length !== 0
                  ? data.map((article) => (
                      <Grid item xs={12} lg={3} key={article.id_ArticuloExistente}>
                        <LoteCard
                          key={`card${article.id_ArticuloExistente}`}
                          article={article}
                          articleName={props.articleName}
                          addFunction={props.addFunction}
                          setOpen={props.setOpen}
                          disabled={props.alreadySelectedArticlesIDs?.includes(article.id_ArticuloExistente)}
                        />
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
            )}
            <TablePagination
              component="div"
              count={pageCount}
              onPageChange={(_, page) => setPageIndex(page)} //ni idea de porque asi pero lloraba
              onRowsPerPageChange={(e: any) => {
                setPageSize(e.target.value);
              }}
              page={pageIndex}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Cuadros por página"
            />
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ maxWidth: 100 }}
              onClick={() => {
                props.setOpen(false);
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoteSelectionPOS;
