import { Box, Button } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { PatientInvoiceTable } from './PatientInvoiceTable';

export const PatientInvoice = () => {
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
          <SearchBar searchState={() => {}} title="Buscar la solicitud..." sx={{ flex: 1 }} />
        </Box>
        <PatientInvoiceTable />
      </Box>
    </>
  );
};
