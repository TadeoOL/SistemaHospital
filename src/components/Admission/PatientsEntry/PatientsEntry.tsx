import { Box, Card, IconButton, Modal, Stack, Tooltip } from '@mui/material';
import { TablePatientsEntry } from './PatientsEntryTable';
import { SearchBar } from '../../Inputs/SearchBar';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { DateFilterComponent } from '../../Commons/DateFilterComponent';
import { FilterList } from '@mui/icons-material';
import { useState } from 'react';
import { PatientRegisterStepsComponent } from './Modal/PatientRegisterSteps/PatientRegisterStepsComponent';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const PatientsEntry = () => {
  const [open, setOpen] = useState(false);
  const setSearch = usePatientRegisterPaginationStore((state) => state.setSearch);
  const search = usePatientRegisterPaginationStore((state) => state.search);
  const setStartDate = usePatientRegisterPaginationStore((state) => state.setStartDate);
  const setEndDate = usePatientRegisterPaginationStore((state) => state.setEndDate);
  const clearFilters = usePatientRegisterPaginationStore((state) => state.clearFilters);
  const startDate = usePatientRegisterPaginationStore((state) => state.startDate);
  const endDate = usePatientRegisterPaginationStore((state) => state.endDate);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Ingresar Paciente
            </Button>
          </Box> */}
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <SearchBar
              searchState={setSearch}
              search={search}
              size="medium"
              sx={{ width: '100%' }}
              title="Buscar el registro..."
            />
            <Box sx={{ display: 'flex' }}>
              <DateFilterComponent
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                endDate={endDate}
                startDate={startDate}
              />
              <Tooltip title="Limpiar filtros">
                <IconButton onClick={clearFilters}>
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TablePatientsEntry />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <PatientRegisterStepsComponent setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
