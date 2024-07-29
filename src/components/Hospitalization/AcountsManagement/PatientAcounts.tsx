import { Box, FormControlLabel, Switch } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { PatientAccountTable } from './PatientAcountsTable';
import { usePatientAccountPaginationStore } from '../../../store/hospitalization/patientAcountsPagination';

export const PatientAcounts = () => {
  const setSearch = usePatientAccountPaginationStore((state) => state.setSearch);
  const setStatus = usePatientAccountPaginationStore((state) => state.setStatus);
  const status = usePatientAccountPaginationStore((state) => state.status);

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
          <SearchBar searchState={setSearch} size='medium' sx={{ width : '100%' }} title="Buscar la cuenta..." />
          <FormControlLabel
              control={
                <Switch
                  checked={status === 1}
                  onChange={(val) => {
                    if (val.target.checked) {
                      setStatus(1);
                    } else {
                      setStatus(2);
                    }
                  }}
                />
              }
              label="Pendientes"
            />
        </Box>
        <PatientAccountTable />
      </Box>
    </>
  );
};
