import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { RolesChip } from './RolesChip';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useCallback, useEffect, useState } from 'react';
import { ModifyUserModal } from '../Modals/ModifyUserModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { disableUser } from '../../../api/api.routes';
import { useAuthStore } from '../../../store/auth';
import CheckIcon from '@mui/icons-material/Check';
import { shallow } from 'zustand/shallow';
import { useUserPaginationStore } from '../../../store/userPagination';

const useDisableUserModal = () => {
  const setUserDisabled = useUserPaginationStore((state) => state.setUserDisabled);

  const disableUserModal = (userId: string, stateEnabled: boolean, userDisabled: boolean) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${stateEnabled ? 'deshabilitar' : 'habilitar'} un usuario.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `${stateEnabled ? 'Deshabilitar' : 'Habilitar'}`,
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableUser(userId);
            setUserDisabled(!userDisabled);
            withReactContent(Swal).fire({
              title: `${stateEnabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El usuario se ha ${stateEnabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${stateEnabled ? 'deshabilitar' : 'habilitar'} el usuario`,
              icon: 'error',
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          withReactContent(Swal).fire({
            title: 'Cancelado',
            icon: 'error',
          });
        }
      });
  };

  return disableUserModal;
};

export const UsersTable = () => {
  const profile = useAuthStore((state) => state.profile);
  const [userData, setUserData] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const disableUserModal = useDisableUserModal();

  const {
    fetchData,
    setPageIndex,
    isLoading,
    data,
    pageSize,
    enabled,
    search,
    pageIndex,
    count,
    setResultByPage,
    newUser,
    userDisabled,
  } = useUserPaginationStore(
    (state) => ({
      fetchData: state.fetchData,
      setPageIndex: state.setPageIndex,
      isLoading: state.loading,
      data: state.data,
      pageSize: state.pageSize,
      enabled: state.enabled,
      search: state.search,
      pageIndex: state.pageIndex,
      count: state.count,
      setResultByPage: state.setResultByPage,
      newUser: state.newUser,
      userDisabled: state.userDisabled,
    }),
    shallow
  );

  useEffect(() => {
    fetchData(pageSize, search, enabled, pageIndex);
  }, [pageSize, enabled, search, pageIndex, userDisabled, profile, newUser]);

  const handlePageChange = useCallback((event: any, value: any) => {
    event.stopPropagation();
    setPageIndex(value);
  }, []);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de usuario</TableCell>
              <TableCell>Nombre completo</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((user) => (
                    <TableRow key={user?.id}>
                      <TableCell>{user?.nombreUsuario}</TableCell>
                      <TableCell>{user?.nombre + ' ' + user?.apellidoPaterno + ' ' + user?.apellidoMaterno}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>
                        <RolesChip user={user} />
                      </TableCell>
                      <TableCell>{user?.telefono}</TableCell>
                      <TableCell>
                        <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={() => {
                                setUserData(user);
                                setOpenEditModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                disableUserModal(user.id, enabled, userDisabled);
                              }}
                            >
                              {enabled ? (
                                <RemoveCircleIcon sx={{ color: 'red' }} />
                              ) : (
                                <CheckIcon sx={{ color: 'green' }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
        {isLoading && (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {data.length === 0 && !isLoading && (
          <Card
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              columnGap: 1,
            }}
          >
            <ErrorOutlineIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
            <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
              No existen registros
            </Typography>
          </Card>
        )}
        <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(e: any) => {
            setResultByPage(e.target.value);
          }}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyUserModal user={userData} setOpen={setOpenEditModal} />
        </div>
      </Modal>
    </>
  );
};
