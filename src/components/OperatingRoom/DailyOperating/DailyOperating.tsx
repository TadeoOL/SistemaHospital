import { Autocomplete, Box, TextField } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { DailyOperatingTable } from './DailyOperatingTable';
import { useDailyOperatingRoomsPaginationStore } from '../../../store/operatingRoom/dailyOperatingRoomsPagination';
import { useGetAllOperatingRooms } from '../../../hooks/operatingRoom/useGetAllOperatingRoomTypes';

export const DailyOperating = () => {
  const setSearch = useDailyOperatingRoomsPaginationStore((state) => state.setSearch);
  const setOperatingRoomId = useDailyOperatingRoomsPaginationStore((state) => state.setOperatingRoomId);
  const { data, isLoading } = useGetAllOperatingRooms();
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SearchBar searchState={setSearch} title="Buscar cirugía" sx={{ flex: 4 }} />
        <Autocomplete
          options={data}
          loading={isLoading}
          loadingText={'Cargando quirófanos...'}
          renderInput={(params) => <TextField {...params} placeholder="Quirófanos" />}
          onChange={(_, val) => setOperatingRoomId(val?.id ?? '')}
          getOptionLabel={(option) => option.nombre}
          sx={{ flex: 1 }}
        />
      </Box>
      <DailyOperatingTable />
    </Box>
  );
};
