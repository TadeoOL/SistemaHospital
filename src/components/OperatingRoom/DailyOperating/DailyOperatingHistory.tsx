import { Box, TextField } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { DailyOperatingHistoryTable } from './DailyOperatingHistoryTable';
import { useSurgeriesHistoryPagination } from '../../../store/operatingRoom/surgeriesHistoryPagination';
import dayjs from 'dayjs';

export const DailyOperatingHistory = () => {
  const setDateFilter = useSurgeriesHistoryPagination((state) => state.setDateFilter);
  const dateFilter = useSurgeriesHistoryPagination((state) => state.dateFilter);
  const setSearch = useSurgeriesHistoryPagination((state) => state.setSearch);
  const dateFormatted = dayjs(dateFilter).format('YYYY-MM-DD');

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 4,
        boxShadow: 4,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SearchBar searchState={setSearch} title="Buscar cirugías" sx={{ flex: 1 }} />
        <TextField
          type="date"
          helperText="Filtro por fecha"
          onChange={(e) => setDateFilter(e.target.value)}
          value={dateFormatted}
        />
      </Box>
      <DailyOperatingHistoryTable />
    </Box>
  );
};
