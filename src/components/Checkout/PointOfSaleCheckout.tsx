import { Box, Button, Card, FormControl, IconButton, MenuItem, Modal, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { CheckoutCloseModal } from './Modal/CheckoutCloseModal';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { SearchBar } from '../Inputs/SearchBar';
import { FilterListOff } from '@mui/icons-material';

const useGetData = () => {
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const search = useCheckoutPaginationStore((state) => state.search);
  const sort = useCheckoutPaginationStore((state) => state.sort);
  const endDate = useCheckoutPaginationStore((state) => state.endDate);
  const startDate = useCheckoutPaginationStore((state) => state.startDate);
  const status = useCheckoutPaginationStore((state) => state.status);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, sort, endDate, startDate, status]);
};

export const PointOfSaleCheckout = () => {
  useGetData();
  const [open, setOpen] = useState(false);
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

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <SearchBar
                title="Buscar venta..."
                searchState={setSearch}
                sx={{ display: 'flex', flex: 1 }}
                size="small"
              />
              <FormControl component="fieldset" sx={{ width: 200 }}>
                <TextField
                  select
                  label="Método de Pago"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  fullWidth
                >
                  <MenuItem value={0}>Cancelado</MenuItem>
                  <MenuItem value={1}>Pendiente</MenuItem>
                  <MenuItem value={2}>Pagado</MenuItem>
                </TextField>
              </FormControl>
              <TextField
                label="Fecha inicio"
                size="small"
                type="date"
                value={startDate}
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
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <IconButton onClick={() => clearFilters()}>
                <FilterListOff />
              </IconButton>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Cerrar caja
              </Button>
            </Box>
          </Box>
          <CheckoutTableComponent
            data={data}
            admin={true}
            count={count}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            fromPointOfSale={true}
          />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CheckoutCloseModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
