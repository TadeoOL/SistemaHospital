import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { HospitalRoomsTable } from './HospitalRoomsTable';
import { useHospitalRoomsPaginationStore } from '../../../store/hospitalization/hospitalRoomsPagination';

export const HospitalRooms = () => {
  const setSearch = useHospitalRoomsPaginationStore((state) => state.setSearch);

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
      <SearchBar searchState={setSearch} title="Buscar cuarto" />
      <HospitalRoomsTable />
    </Box>
  );
};
