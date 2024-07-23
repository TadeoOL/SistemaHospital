import { Box, Button, Divider, Modal, Stack, Typography } from '@mui/material';
import { UsersTable } from './SubComponents/UsersTable';
import { useState } from 'react';
import { AddUserModal } from './Modals/AddUserModal';
import { SearchBar } from '../Inputs/SearchBar';
import { useUserPaginationStore } from '../../store/userPagination';
import { shallow } from 'zustand/shallow';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

export const AccountAdminUsers = () => {
  const search = useUserPaginationStore((state) => state.searchPagination);
  const [openAddModal, setOpenAddModal] = useState(false);
  const { enabled, setEnabled } = useUserPaginationStore(
    (state) => ({
      enabled: state.enabled,
      setEnabled: state.setEnabled,
    }),
    shallow
  );

  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
          mt: 4,
          bgcolor: 'white',
          overflowX: 'auto',
        }}
      >
        <Stack sx={{ display: 'flex', flex: 1, minWidth: { xs: 950, xl: 0 } }}>
          <Stack
            sx={{
              p: 2,
              flexDirection: 'row',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography fontWeight={700} fontSize={24}>
              {enabled ? 'Usuarios' : 'Usuarios deshabilitados'}
            </Typography>
            <Stack sx={{ flexDirection: 'row', display: 'flex', columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
              >
                {enabled ? 'Mostrar usuarios deshabilitados' : 'Mostrar usuarios habilitados'}
              </Button>
              <Button onClick={() => setOpenAddModal(true)} variant="contained" startIcon={<AddCircleOutlinedIcon />}>
                Agregar
              </Button>
            </Stack>
          </Stack>
          <SearchBar title="Busca al usuario..." searchState={search} />
          <Divider sx={{ my: 2 }} />
          <UsersTable />
        </Stack>
      </Box>

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <div>
          <AddUserModal setOpen={setOpenAddModal} />
        </div>
      </Modal>
    </>
  );
};
