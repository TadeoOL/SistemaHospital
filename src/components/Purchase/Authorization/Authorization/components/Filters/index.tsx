import { Box, TextField, IconButton } from '@mui/material';
import { FilterListOff as FilterListOffIcon } from '@mui/icons-material';
import { SearchBar } from '../../../../../Inputs/SearchBar';

interface FiltersProps {
  search: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  onSearchChange: (value: string) => void;
  onDateChange: (type: 'startDate' | 'endDate', value: string) => void;
  onClearFilters: () => void;
}

const PurchaseAuthorizationFilters = ({ dates, onSearchChange, onDateChange, onClearFilters }: FiltersProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
        px: 2,
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
          gap: 1,
          justifyContent: { xs: 'flex-end', md: 'center' },
          flex: { xs: '0 0 auto', md: '0 0 auto' },
        }}
      >
        <IconButton onClick={onClearFilters}>
          <FilterListOffIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PurchaseAuthorizationFilters;
