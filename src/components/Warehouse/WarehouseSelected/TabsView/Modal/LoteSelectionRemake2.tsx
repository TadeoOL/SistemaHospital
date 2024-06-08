import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Grid,
  Card,
  Typography,
  CircularProgress,
  TablePagination,
  TextField,
} from '@mui/material';
import { useExistingArticleLotesPagination } from '../../../../../store/warehouseStore/existingArticleLotePagination';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { Info } from '@mui/icons-material';
import { debounce } from 'lodash';

interface LoteSelectionProps {
  sx?: any;
  setOpen: (open: boolean) => void;
  articleName: string;
  addFunction: Function;
  editing?: boolean;
  selectedLotes?: { cantidad: number; fechaCaducidad: string; id_ArticuloExistente: string }[];
  adding?: boolean;
  temporalFromPackageAmountSelect?: number;
  empityLotes: boolean | null;
}

interface LoteCardProps {
  article: any;
  articleName: string;
  initialQuantity: number;
  handleQuantityChange: (id_ArticuloExistente: string, value: number) => void;
  adding: boolean;
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

const useGetAllData = (lotes: boolean | null) => {
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
    fetchData(lotes);
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

export const LoteSelectionRemake2: React.FC<LoteSelectionProps> = (props) => {
  const { data, pageCount, setPageIndex, pageIndex, loading, pageSize, setPageSize } = useGetAllData(props.empityLotes);
  const [quantities, setQuantities] = useState<{ [id_ArticuloExistente: string]: number }>({});

  useEffect(() => {
    if (props.editing && props.selectedLotes) {
      const initialQuantities = props.selectedLotes.reduce(
        (acc, lote) => {
          acc[lote.id_ArticuloExistente] = lote.cantidad;
          return acc;
        },
        {} as { [id: string]: number }
      );
      setQuantities(initialQuantities);
    }
  }, [props.editing, props.selectedLotes]);
  useEffect(() => {}, [props.articleName]);

  const handleQuantityChange = (id_ArticuloExistente: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id_ArticuloExistente]: value }));
  };

  const handleConfirm = () => {
    const selectedLotes = data
      .filter((lote) => quantities[lote.id_ArticuloExistente] > 0)
      .map((lote) => ({
        ...lote,
        cantidad: quantities[lote.id_ArticuloExistente],
      }));
    props.addFunction(selectedLotes, props.editing);
    props.setOpen(false);
  };

  const LoteCard: React.FC<LoteCardProps> = ({
    article,
    articleName,
    initialQuantity,
    handleQuantityChange,
    adding,
  }) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.adding) {
        const value = Number(e.target.value);
        setQuantity(value);
        debouncedHandleQuantityChange(article.id_ArticuloExistente, value);
      } else {
        const value = Math.max(0, Math.min(article.cantidad, Number(e.target.value)));
        setQuantity(value);
        debouncedHandleQuantityChange(article.id_ArticuloExistente, value);
      }
    };

    const debouncedHandleQuantityChange = debounce(handleQuantityChange, 150);

    return (
      <Card
        sx={{
          p: 2,
          height: 160,
          border: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: 3,
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
            <TextField
              type="number"
              placeholder="Cantidad"
              inputProps={{ className: 'tableCell', min: 0, max: adding ? 1000 : article.cantidad }}
              value={quantity}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Lotes Disponibles" />
      <Box sx={{ overflowY: 'auto', ...styleBar, bgcolor: 'background.paper', p: 2 }}>
        <Stack sx={{ overflowY: 'auto', ...props.sx, ...scrollBar }}>
          <Stack sx={{ maxHeight: 550 }}>
            <Box sx={{ justifyContent: 'space-between', display: 'flex', mb: 2 }}>
              <Typography variant="h5">Nombre: {props.articleName}</Typography>
            </Box>
            <Typography variant="h5">
              Seleccione el lote del artículo que desea retirar
              {props.temporalFromPackageAmountSelect ? `(${props.temporalFromPackageAmountSelect})` : ''}:
            </Typography>

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
                          article={article}
                          articleName={props.articleName}
                          initialQuantity={quantities[article.id_ArticuloExistente] || 0}
                          handleQuantityChange={handleQuantityChange}
                          adding={props.adding || false}
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
              sx={{ maxWidth: 300, alignSelf: 'center', mb: 2 }}
              color="primary"
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
