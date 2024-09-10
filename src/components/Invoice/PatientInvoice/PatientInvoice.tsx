import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { PatientInvoiceTable } from './PatientInvoiceTable';
import { useInvoicePatientBillPaginationStore } from '../../../store/invoice/invoicePatientBillPagination';

export const PatientInvoice = () => {
  const setSearch = useInvoicePatientBillPaginationStore((state) => state.setSearch);

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
          <SearchBar searchState={setSearch} title="Buscar la solicitud..." sx={{ flex: 1 }} />
        </Box>
        <PatientInvoiceTable />
      </Box>
    </>
  );
};
