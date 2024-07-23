import { Box, Button, Card, FormControl, IconButton, MenuItem, Modal, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { GenerateReceiptModal } from './Modal/GenerateReceiptModal';
import { useCheckoutUserEmitterPaginationStore } from '../../store/checkout/checkoutUserEmitterPagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { SearchBar } from '../Inputs/SearchBar';
import { FilterListOff } from '@mui/icons-material';
const thisLocation = '/ventas/emitir-recibo';

const useGetData = () => {
  const fetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const search = useCheckoutUserEmitterPaginationStore((state) => state.search);
  const sort = useCheckoutUserEmitterPaginationStore((state) => state.sort);
  const endDate = useCheckoutUserEmitterPaginationStore((state) => state.endDate);
  const startDate = useCheckoutUserEmitterPaginationStore((state) => state.startDate);
  const status = useCheckoutUserEmitterPaginationStore((state) => state.status);
  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, sort, endDate, startDate, status]);
};

export const ReceiptEmitter = () => {
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);
  useEffect(() => {
    setIdCaja('');
  }, []);
  useGetData();
  const data = useCheckoutUserEmitterPaginationStore((state) => state.data);
  const count = useCheckoutUserEmitterPaginationStore((state) => state.count);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutUserEmitterPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutUserEmitterPaginationStore((state) => state.setPageSize);
  const setSearch = useCheckoutUserEmitterPaginationStore((state) => state.setSearch);
  const setStartDate = useCheckoutUserEmitterPaginationStore((state) => state.setStartDate);
  const setEndDate = useCheckoutUserEmitterPaginationStore((state) => state.setEndDate);
  const clearFilters = useCheckoutUserEmitterPaginationStore((state) => state.clearFilters);
  const endDate = useCheckoutUserEmitterPaginationStore((state) => state.endDate);
  const startDate = useCheckoutUserEmitterPaginationStore((state) => state.startDate);
  const setStatus = useCheckoutUserEmitterPaginationStore((state) => state.setStatus);
  const status = useCheckoutUserEmitterPaginationStore((state) => state.status);
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
