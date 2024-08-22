import { Box, Button, Card, IconButton, Modal, Stack, Tooltip } from '@mui/material';
import { TableHospitalization } from './TableHospitalization';
import { useState } from 'react';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';
import { CalendarRegister } from '../RegisterSteps/CalenderRegister';
import { SearchBar } from '../../Inputs/SearchBar';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { DateFilterComponent } from '../../Commons/DateFilterComponent';
import { OperatingRoomFilterComponent } from '../../Commons/OperatingRoomFilterComponent';
import { FilterListOff } from '@mui/icons-material';

export const HospitalizationRegister = () => {
  const [open, setOpen] = useState(false);
  const setSearch = usePatientRegisterPaginationStore((state) => state.setSearch);
  const startDate = usePatientRegisterPaginationStore((state) => state.startDate);
  const setStartDate = usePatientRegisterPaginationStore((state) => state.setStartDate);
  const endDate = usePatientRegisterPaginationStore((state) => state.endDate);
  const setEndDate = usePatientRegisterPaginationStore((state) => state.setEndDate);
  const setOperatingRoomFilter = usePatientRegisterPaginationStore((state) => state.setOperatingRoomFilter);
  const operatingRoomFilter = usePatientRegisterPaginationStore((state) => state.operatingRoomFilter);
  const clearFilters = usePatientRegisterPaginationStore((state) => state.clearFilters);

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
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', columnGap: 1 }}>
            <SearchBar searchState={setSearch} title="Buscar registro" sx={{ flex: 1.5 }} />
            <OperatingRoomFilterComponent
              operatingRoomId={operatingRoomFilter}
              setOperatingRoomId={setOperatingRoomFilter}
              sx={{ flex: 0.5 }}
            />
            <DateFilterComponent
              endDate={endDate}
              setEndDate={setEndDate}
              startDate={startDate}
              setStartDate={setStartDate}
              sx={{ flex: 1 }}
            />
            <Tooltip title="Limpiar filtros">
              <IconButton onClick={clearFilters}>
                <FilterListOff />
              </IconButton>
            </Tooltip>
          </Box>
          <TableHospitalization />
        </Stack>
      </Card>
      <Modal open={open}>
        <>
          <CalendarRegister setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
