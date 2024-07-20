import { Box, Button, Modal } from '@mui/material';
import { ProgrammingRequestTable } from './ProgrammingRequestTable';
import { SelectProgrammingRequest } from './Modal/SelectProgrammingRequest';
import { useState } from 'react';
import { SearchBar } from '../../Inputs/SearchBar';
import { useProgrammingRequestPaginationStore } from '../../../store/programming/programmingRequestPagination';

export const ProgrammingRequest = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const setSearch = useProgrammingRequestPaginationStore((state) => state.setSearch);
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 4,
          rowGap: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            rowGap: 2,
          }}
        >
          <SearchBar searchState={setSearch} title="Buscar solicitud de programación" sx={{}} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Nueva Solicitud
            </Button>
          </Box>
        </Box>
        <ProgrammingRequestTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <SelectProgrammingRequest setOpen={setOpen} setValue={setValue} value={value} />
        </>
      </Modal>
    </>
  );
};
