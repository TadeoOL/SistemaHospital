import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { HospitalInvoiceTable } from './HospitalInvoiceTable';
import { useInvoicePharmacySellsBillPaginationStore } from '@/store/invoice/invoicePharmacySellsBillPagination';

export const HospitalInvoice = () => {
  const setSearch = useInvoicePharmacySellsBillPaginationStore((state) => state.setSearch);
  
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
          <SearchBar searchState={setSearch} title="Buscar la venta..." sx={{ flex: 1 }} />
        </Box>
        <HospitalInvoiceTable />
      </Box>
    </>
  );
};
