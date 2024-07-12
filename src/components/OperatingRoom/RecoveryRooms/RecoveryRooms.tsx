import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { RecoveryRoomsTable } from './RecoveryRoomsTable';
import { useRecoveryRoomsPaginationStore } from '../../../store/operatingRoom/recoveryRoomsPagination';

export const RecoveryRooms = () => {
  const setSearch = useRecoveryRoomsPaginationStore((state) => state.setSearch);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <SearchBar searchState={setSearch} title="Buscar la sala de recuperación..." sx={{ flex: 1 }} />
      </Box>
      <RecoveryRoomsTable />
    </Box>
  );
};
