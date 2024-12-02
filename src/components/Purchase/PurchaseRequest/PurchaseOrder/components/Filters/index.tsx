import { Box, TextField, IconButton, MenuItem } from '@mui/material';
import { FilterListOff as FilterListOffIcon } from '@mui/icons-material';
import { SearchBar } from '../../../../../Inputs/SearchBar';
import { StatusPurchaseOrderFilter } from '../../../../../../types/types';
import { ExportMenu } from './ExportMenu';

interface FiltersProps {
  search: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  status: string;
  authorization: number | null;
  onSearchChange: (value: string) => void;
  onDateChange: (type: 'startDate' | 'endDate', value: string) => void;
  onStatusChange: (value: string) => void;
  onAuthorizationChange: (value: number) => void;
  onClearFilters: () => void;
}

export const Filters = ({
  dates,
  status,
  authorization,
  onSearchChange,
  onDateChange,
  onStatusChange,
  onAuthorizationChange,
  onClearFilters,
}: FiltersProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          flex: { xs: '1 1 100%', md: 3 },
          minWidth: { xs: '100%', md: 'auto' },
        }}
      >
        <SearchBar title="Buscar orden de compra..." searchState={onSearchChange} size="small" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: { xs: '1 1 100%', md: 1 },
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <TextField
          label="Fecha inicio"
          size="small"
          type="date"
          value={dates.startDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => onDateChange('startDate', e.target.value)}
          fullWidth
        />
        <TextField
          label="Fecha final"
          size="small"
          type="date"
          value={dates.endDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => onDateChange('endDate', e.target.value)}
          fullWidth
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: { xs: '1 1 100%', md: 1 },
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <TextField
          select
          label="Autorización?"
          value={authorization}
          onChange={(e) => onAuthorizationChange(Number(e.target.value))}
          size="small"
          sx={{ flex: 1, minWidth: { xs: '100%', sm: '150px' } }}
        >
          {[
            { id: 0, name: 'Todas las Ordenes' },
            { id: 1, name: 'Sin autorizar' },
            { id: 2, name: 'Autorizada' },
          ].map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Estatus"
          size="small"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
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

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: { xs: 'flex-end', md: 'center' },
            flex: { xs: '0 0 auto', md: '0 0 auto' },
          }}
        >
          <IconButton onClick={onClearFilters}>
            <FilterListOffIcon />
          </IconButton>
          <ExportMenu />
        </Box>
      </Box>
    </Box>
  );
};
