import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { PatientAccountTable } from './PatientAcountsTable';

export const PatientAcounts = () => {
  return (
    <>
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
          <SearchBar searchState={() => {}} title="Buscar la cuenta..." />
        </Box>
        <PatientAccountTable />
      </Box>
    </>
  );
};
