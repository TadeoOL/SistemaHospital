import { Box, Card, Stack } from '@mui/material';
import { TablePatientsEntry } from './PatientsEntryTable';
import { SearchBar } from '../../Inputs/SearchBar';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const PatientsEntry = () => {
  //const [open, setOpen] = useState(false);
  const setSearch = usePatientRegisterPaginationStore((state) => state.setSearch);

  return (
    <>
      <Card sx={{ px: 2, pt: 4, pb: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <SearchBar searchState={setSearch} size='medium' sx={{ width : '100%' }} title="Buscar lel registro..." />
          </Box>
          <TablePatientsEntry />
        </Stack>
      </Card>
    </>
  );
};
