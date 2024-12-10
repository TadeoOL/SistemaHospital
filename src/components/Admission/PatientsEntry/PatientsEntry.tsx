import { Box, Button, Card, IconButton, Modal, Select, Stack, Tooltip } from '@mui/material';
import { TablePatientsEntry } from './PatientsEntryTable';
import { SearchBar } from '../../Inputs/SearchBar';
import { DateFilterComponent } from '../../Commons/DateFilterComponent';
import { FilterList } from '@mui/icons-material';
import { useState } from 'react';
import { HospitalizationEntryComponent } from './Modal/HospitalizationEntryComponent';
import { usePatientEntryPaginationStore } from '@/store/admission/usePatientEntryPagination';
import { MenuItem } from '@mui/material';
import { PatientAccountStatus } from '@/types/checkout/patientAccountTypes';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const PatientsEntry = () => {
  const setSearch = usePatientEntryPaginationStore((state) => state.setSearch);
  const search = usePatientEntryPaginationStore((state) => state.search);
  const setStartDate = usePatientEntryPaginationStore((state) => state.setStartDate);
  const setEndDate = usePatientEntryPaginationStore((state) => state.setEndDate);
  const clearFilters = usePatientEntryPaginationStore((state) => state.clearFilters);
  const startDate = usePatientEntryPaginationStore((state) => state.startDate);
  const endDate = usePatientEntryPaginationStore((state) => state.endDate);
  const setStatus = usePatientEntryPaginationStore((state) => state.setStatus);
  const status = usePatientEntryPaginationStore((state) => state.status);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Ingresar Paciente
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <SearchBar
              searchState={setSearch}
              search={search}
              size="medium"
              sx={{ width: '100%' }}
              title="Buscar el registro..."
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Select
                value={status ?? -1}
                onChange={(e) => setStatus(e.target.value === -1 ? null : (e.target.value as number))}
                label="Estado"
                sx={{
                  maxWidth: '100%',
                  display: 'flex',
                }}
                size="small"
              >
                <MenuItem value={-1}>Todos</MenuItem>
                <MenuItem value={PatientAccountStatus.Admitted}>Admitidos</MenuItem>
                <MenuItem value={PatientAccountStatus.Scheduled}>Programados</MenuItem>
                <MenuItem value={PatientAccountStatus.Closed}>Cuenta Cerradas</MenuItem>
              </Select>
              <DateFilterComponent
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                endDate={endDate}
                startDate={startDate}
              />
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                <Tooltip title="Limpiar filtros">
                  <IconButton onClick={clearFilters}>
                    <FilterList />
                  </IconButton>
                </Tooltip>
              </Box>
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
