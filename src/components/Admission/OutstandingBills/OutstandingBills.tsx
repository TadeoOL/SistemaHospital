import { Box } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { OutstandingBillsTable } from './OutstandingBillsTable';
import { useOutstandingBillsPaginationStore } from '../../../store/admission/useOutstandingBillsPagination';

export const OutstandingBills = () => {
  const setSearch = useOutstandingBillsPaginationStore((state) => state.setSearch);

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
          <SearchBar searchState={setSearch} size="medium" sx={{ width: '100%' }} title="Buscar la cuenta..." />
        </Box>
        <OutstandingBillsTable />
      </Box>
    </>
  );
};
