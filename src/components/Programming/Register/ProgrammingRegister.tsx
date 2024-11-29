import { Box, Button, Card, IconButton, Modal, Stack, Tooltip, TextField, MenuItem } from '@mui/material';
import { TableHospitalization } from './TableHospitalization';
import { useState } from 'react';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';
import { SearchBar } from '../../Inputs/SearchBar';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { DateFilterComponent } from '../../Commons/DateFilterComponent';
import { OperatingRoomFilterComponent } from '../../Commons/OperatingRoomFilterComponent';
import { FilterListOff } from '@mui/icons-material';
import { PatientRegisterStepsComponent } from '../../Admission/PatientsEntry/Modal/PatientRegisterSteps/PatientRegisterStepsComponent';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';

const spaceTypeOptions = [
  { value: HospitalSpaceType.Room, label: 'Habitaciones' },
  { value: HospitalSpaceType.OperatingRoom, label: 'Quirófanos' },
] as const;

export const HospitalizationRegister = () => {
  const [open, setOpen] = useState(false);
  const setSearch = usePatientRegisterPaginationStore((state) => state.setSearch);
  const startDate = usePatientRegisterPaginationStore((state) => state.startDate);
  const setStartDate = usePatientRegisterPaginationStore((state) => state.setStartDate);
  const endDate = usePatientRegisterPaginationStore((state) => state.endDate);
  const setEndDate = usePatientRegisterPaginationStore((state) => state.setEndDate);
  const setSpaceId = usePatientRegisterPaginationStore((state) => state.setSpaceId);
  const spaceId = usePatientRegisterPaginationStore((state) => state.spaceId);
  const clearFilters = usePatientRegisterPaginationStore((state) => state.clearFilters);
  const hospitalSpaceType = usePatientRegisterPaginationStore((state) => state.hospitalSpaceType);
  const setHospitalSpaceType = usePatientRegisterPaginationStore((state) => state.setHospitalSpaceType);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
            >
              Registro de paciente
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                flex: { xs: '1', md: '2' },
              }}
            >
              <SearchBar
                searchState={setSearch}
                title="Buscar registro"
                sx={{
                  flex: { xs: '1', sm: '1.5' },
                  width: '100%',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                flex: { xs: '1', md: '2' },
              }}
            >
              <TextField
                select
                label="Tipo de espacio"
                value={hospitalSpaceType}
                onChange={(e) => {
                  setHospitalSpaceType(e.target.value as unknown as HospitalSpaceType);
                  setSpaceId('');
                }}
                sx={{
                  flex: { xs: '1', sm: '1' },
                  minWidth: { xs: '100%', sm: '200px' },
                }}
              >
                {spaceTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <OperatingRoomFilterComponent
                hospitalSpaceType={hospitalSpaceType}
                spaceId={spaceId}
                setSpaceId={setSpaceId}
                sx={{
                  flex: { xs: '1', sm: '1' },
                  minWidth: { xs: '100%', sm: '200px' },
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                flex: { xs: '1', md: '2' },
              }}
            >
              <DateFilterComponent
                endDate={endDate}
                setEndDate={setEndDate}
                startDate={startDate}
                setStartDate={setStartDate}
                sx={{
                  flex: 1,
                  width: '100%',
                }}
              />

              <Tooltip title="Limpiar filtros">
                <IconButton
                  onClick={() => {
                    clearFilters();
                  }}
                  sx={{
                    alignSelf: { xs: 'flex-end', sm: 'center' },
                  }}
                >
                  <FilterListOff />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TableHospitalization />
        </Stack>
      </Card>
      <Modal open={open}>
        <>
          <PatientRegisterStepsComponent setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
