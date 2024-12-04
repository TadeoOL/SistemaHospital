import { SearchBar } from '@/components/Inputs/SearchBar';
import { FilterListOff } from '@mui/icons-material';
import { Box, MenuItem, TextField } from '@mui/material';
import usePurchaseAuthorizationHistory from '../../hooks/usePurchaseAuthorizationHistory';
import { StatusPurchaseOrderFilter } from '@/types/types';
import { IconButton } from '@mui/material';

interface PurchaseHistoryFiltersProps {
  state: ReturnType<typeof usePurchaseAuthorizationHistory>['state'];
  handlers: ReturnType<typeof usePurchaseAuthorizationHistory>['handlers'];
}

const PurchaseHistoryFilters = ({ state, handlers }: PurchaseHistoryFiltersProps) => {
  const { search, dates } = state;
  const { setSearch, onChangeDate, clearFilters } = handlers;

  return (
    <Box sx={{ display: 'flex', flex: 1, columnGap: 2, px: 2, alignItems: 'center' }}>
      <SearchBar
        title="Buscar solicitud de compra..."
        searchState={setSearch}
        sx={{ display: 'flex', flex: 2 }}
        search={search}
        size="small"
      />
      <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
        <TextField
          label="Fecha inicio"
          size="small"
          type="date"
          value={dates.startDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            onChangeDate('startDate', e.target.value);
          }}
        />
        <TextField
          label=" Fecha final"
          size="small"
          type="date"
          value={dates.endDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            onChangeDate('endDate', e.target.value);
          }}
        />
      </Box>
      <TextField
        select
        label="Estatus"
        size="small"
        value={state.statusPurchaseOrder}
        onChange={(e) => handlers.onChangeStatusPurchaseOrder(e.target.value)}
        sx={{ flex: 1, minWidth: { xs: '100%', sm: '150px' } }}
      >
        {Object.entries(StatusPurchaseOrderFilter)
          .filter(([key]) => !isNaN(Number(key)))
          .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
          .map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
      </TextField>

      <Box>
        <IconButton onClick={() => clearFilters()}>
          <FilterListOff />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PurchaseHistoryFilters;
