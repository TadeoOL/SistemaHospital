import { Box, Divider, IconButton, MenuItem, TextField } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { PurchaseAuthorizationTable } from './PurchaseAuthorizationTable';
import { usePurchaseAuthorizationHistoryPagination } from '../../../../store/purchaseStore/purchaseAuthorizationHistoryPagination';
import { StatusPurchaseRequest } from '../../../../types/types';
import { useMemo } from 'react';
import { FilterListOff } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';

export const PurchaseHistoryAuthorization = () => {
  const { setSearch, status, endDate, startDate, setStartDate, setEndDate, setStatus, clearFilters } =
    usePurchaseAuthorizationHistoryPagination(
      (state) => ({
        setSearch: state.setSearch,
        status: state.status,
        endDate: state.endDate,
        startDate: state.startDate,
        setStartDate: state.setStartDate,
        setEndDate: state.setEndDate,
        setStatus: state.setStatus,
        clearFilters: state.clearFilters,
      }),
      shallow
    );

  const values = useMemo(() => {
    const statusPurchaseOrderValues: string[] = [];

    for (const value in StatusPurchaseRequest) {
      if (!isNaN(Number(StatusPurchaseRequest[value]))) {
        statusPurchaseOrderValues.push(StatusPurchaseRequest[value]);
      }
    }
    return statusPurchaseOrderValues;
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
        <SearchBar title="Buscar solicitud de compra..." searchState={setSearch} sx={{ display: 'flex', flex: 2 }} />
        <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
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
        </Box>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <TextField
            select
            label="Estatus"
            size="small"
            defaultValue={-1}
            fullWidth
            value={status}
            onChange={(e) => {
              const { value } = e.target;
              setStatus(value);
            }}
          >
            {values.map((v: any) => (
              <MenuItem key={v} value={v}>
                {StatusPurchaseRequest[v]}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <IconButton onClick={() => clearFilters()}>
            <FilterListOff />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <PurchaseAuthorizationTable />
    </Box>
  );
};
