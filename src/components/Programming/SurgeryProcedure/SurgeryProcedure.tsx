import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { SurgeryProcedureTable } from './SurgeryProcedureTable';
import { useSurgeryProcedurePaginationStore } from '../../../store/programming/surgeryProcedurePagination';
import { useState } from 'react';
import { AddSurgeryProcedureModal } from './Modal/AddSurgeryProcedureModal';

export const SurgeryProcedure = () => {
  const [open, setOpen] = useState(false);
  const setSearch = useSurgeryProcedurePaginationStore((state) => state.setSearch);
  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', p: 4, rowGap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'start', justifyContent: 'space-between' }}>
          <SearchBar searchState={setSearch} title="Buscar procedimiento..." />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar procedimiento
          </Button>
        </Box>
        <SurgeryProcedureTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddSurgeryProcedureModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
