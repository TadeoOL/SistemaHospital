import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { HospitalInvoiceTable } from './HospitalInvoiceTable';

export const HospitalInvoice = () => {
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
        <HospitalInvoiceTable />
      </Box>
    </>
  );
};
