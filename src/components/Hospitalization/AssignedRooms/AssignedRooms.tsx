import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { AssignedRoomsTable } from './AssignedRoomsTable';

export const AssignedRooms = () => {
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
      <SearchBar searchState={() => {}} title="Buscar..." />
      <AssignedRoomsTable />
    </Box>
  );
};
