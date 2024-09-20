import { Box, FormControlLabel, IconButton, Modal, Switch, Tooltip } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { PatientAccountTable } from './PatientAcountsTable';
import { usePatientAccountPaginationStore } from '../../../store/hospitalization/patientAcountsPagination';
import { Settings } from '@mui/icons-material';
import { useAuthStore } from '../../../store/auth';
import { useState } from 'react';
import { DiscountConfigModal } from './Modal/Config/DiscountConfigModal';

export const PatientAcounts = () => {
  const setSearch = usePatientAccountPaginationStore((state) => state.setSearch);
  const setStatus = usePatientAccountPaginationStore((state) => state.setStatus);
  const status = usePatientAccountPaginationStore((state) => state.status);
  const isAdmin = useAuthStore((state) => state.profile?.roles.includes('ADMIN'));
  const [open, setOpen] = useState(false);

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
          rowGap: isAdmin ? 0 : 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchBar searchState={setSearch} size="medium" sx={{ width: '100%' }} title="Buscar la cuenta..." />
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
          {isAdmin && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Configuración">
                <IconButton color="primary" onClick={() => setOpen(true)}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          <PatientAccountTable status={status} />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <DiscountConfigModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
