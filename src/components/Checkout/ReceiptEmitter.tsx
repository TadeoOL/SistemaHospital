import { Box, Button, Card, FormControl, IconButton, MenuItem, Modal, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { GenerateReceiptModal } from './Modal/GenerateReceiptModal';
//import { useCheckoutUserEmitterPaginationStore } from '../../store/checkout/checkoutUserEmitterPagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { SearchBar } from '../Inputs/SearchBar';
import { FilterListOff } from '@mui/icons-material';
import { useCheckoutPaginationStore } from '@/store/checkout/checkoutPagination';
const thisLocation = '/ventas/emitir-recibo';

const useGetData = () => {
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const search = useCheckoutPaginationStore((state) => state.search);
  const sort = useCheckoutPaginationStore((state) => state.sort);
  const endDate = useCheckoutPaginationStore((state) => state.endDate);
  const startDate = useCheckoutPaginationStore((state) => state.startDate);
  const status = useCheckoutPaginationStore((state) => state.status);
  const setConceptoVenta = useCheckoutPaginationStore((state) => state.setConcept);
  useEffect(() => {
    setConceptoVenta(null)
    fetch();
  }, [pageIndex, pageSize, search, sort, endDate, startDate, status]);
};

export const ReceiptEmitter = () => {
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);
  useEffect(() => {
    setIdCaja('');
  }, []);
  useGetData();
  const data = useCheckoutPaginationStore((state) => state.data);
  const count = useCheckoutPaginationStore((state) => state.count);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutPaginationStore((state) => state.setPageSize);
  const setSearch = useCheckoutPaginationStore((state) => state.setSearch);
  const setStartDate = useCheckoutPaginationStore((state) => state.setStartDate);
  const setEndDate = useCheckoutPaginationStore((state) => state.setEndDate);
  const clearFilters = useCheckoutPaginationStore((state) => state.clearFilters);
  const endDate = useCheckoutPaginationStore((state) => state.endDate);
  const startDate = useCheckoutPaginationStore((state) => state.startDate);
  const setStatus = useCheckoutPaginationStore((state) => state.setStatus);
  const status = useCheckoutPaginationStore((state) => state.status);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== thisLocation) {
      navigate(thisLocation);
    }
  }, []);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              width: '100%',
              minWidth: 350,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                columnGap: 2,
                p: 2,
                justifyContent: 'flex-start',
                minWidth: '100%',
                overflowX: 'scroll',
                whiteSpace: 'nowrap',
                width: '100%',
                '&::-webkit-scrollbar': {
                  height: '0.4em',
                },
                '&::-webkit-scrollbar-track': {
                  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                  webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,.1)',
                  outline: '1px solid slategrey',
                },
              }}
            >
              <SearchBar
                title="Buscar venta..."
                searchState={setSearch}
                sx={{ display: 'flex', flex: 1 }}
                size="small"
              />
              <FormControl component="fieldset" sx={{ minWidth: 100, maxWidth: 200 }}>
                <TextField
                  sx={{ width: 'auto' }}
                  select
                  label="Método de Pago"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  fullWidth
                >
                  <MenuItem value={0}>Cancelado</MenuItem>
                  <MenuItem value={1}>Pendiente</MenuItem>
                  <MenuItem value={2}>Pagado</MenuItem>
                  <MenuItem value={404}>Todos</MenuItem>
                </TextField>
              </FormControl>
              <TextField
                label="Fecha inicio"
                size="small"
                type="date"
                value={startDate}
                sx={{ minWidth: 100, maxWidth: 200 }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
              <TextField
                label=" Fecha final"
                size="small"
                type="date"
                value={endDate}
                sx={{ minWidth: 100, maxWidth: 200 }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <IconButton onClick={() => clearFilters()}>
                <FilterListOff />
              </IconButton>
              <Button variant="contained" onClick={() => setOpen(true)} sx={{ minWidth: 170, maxWidth: 250 }}>
                Generar Pase a Caja
              </Button>
            </Box>
          </Box>
          <CheckoutTableComponent
            data={data}
            admin={false}
            count={count}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            fromPointOfSale={false}
          />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <GenerateReceiptModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
