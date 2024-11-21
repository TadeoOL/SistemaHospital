import { Box, MenuItem, Select } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { PatientAccountTable } from './PatientAcountsTable';
import { usePatientAccountPaginationStore } from '../../../store/checkout/patientAcountsPagination';
import { PatientAccountStatus, PatientAccountStatusLabels } from '../../../types/checkout/patientAccountTypes';
import { isNumber } from 'lodash';

export const PatientAcounts = () => {
  const setSearch = usePatientAccountPaginationStore((state) => state.setSearch);
  const setStatus = usePatientAccountPaginationStore((state) => state.setStatus);
  const status = usePatientAccountPaginationStore((state) => state.status);

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
        <SearchBar searchState={setSearch} size="medium" sx={{ width: '100%' }} title="Buscar la cuenta..." />
        <Select value={status} onChange={(val) => setStatus(val.target.value as PatientAccountStatus)}>
          {Object.values(PatientAccountStatus)
            .filter((v) => isNumber(v) && v !== PatientAccountStatus.Scheduled)
            .map((status) => (
              <MenuItem key={status} value={status}>
                {PatientAccountStatusLabels[status as PatientAccountStatus]}
              </MenuItem>
            ))}
        </Select>
      </Box>
      <PatientAccountTable status={status} />
    </Box>
  );
};
