import { Box, Button, Card, IconButton, MenuItem, Modal, Stack, TextField, Tooltip } from '@mui/material';
import { TablePatientsEntry } from './PatientsEntryTable';
import { SearchBar } from '../../Inputs/SearchBar';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { DateFilterComponent } from '../../Commons/DateFilterComponent';
import { FilterList } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { HospitalizationEntryComponent } from './Modal/HospitalizationEntryComponent';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const PatientsEntry = () => {
  const setSearch = usePatientRegisterPaginationStore((state) => state.setSearch);
  const search = usePatientRegisterPaginationStore((state) => state.search);
  const setStartDate = usePatientRegisterPaginationStore((state) => state.setStartDate);
  const setEndDate = usePatientRegisterPaginationStore((state) => state.setEndDate);
  const clearFilters = usePatientRegisterPaginationStore((state) => state.clearFilters);
  const startDate = usePatientRegisterPaginationStore((state) => state.startDate);
  const endDate = usePatientRegisterPaginationStore((state) => state.endDate);
  const accountStatus = usePatientRegisterPaginationStore((state) => state.accountStatus);
  const setAccountStatus = usePatientRegisterPaginationStore((state) => state.setAccountStatus);
  const clearData = usePatientRegisterPaginationStore((state) => state.clearData);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, []);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <SearchBar
              searchState={setSearch}
              search={search}
              size="medium"
              sx={{ width: '100%', flex: 3 }}
              title="Buscar el registro..."
            />
            <Box sx={{ display: 'flex', flex: 3, justifyContent: 'flex-end' }}>
              <TextField
                select
                size="small"
                label="Estatus de Paciente"
                fullWidth
                sx={{ mr: 1, maxWidth: '35%' }}
                value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value)}
              >
                <MenuItem key={1} value="1">
                  Pacientes Activos
                </MenuItem>
                <MenuItem key={2} value="2">
                  Pacientes Inactivos
                </MenuItem>
              </TextField>
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
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Ingresar Paciente
              </Button>
            </Box>
          </Box>
          <TablePatientsEntry />
        </Stack>
      </Card>
      <Modal open={open}>
        <>
          <HospitalizationEntryComponent setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
