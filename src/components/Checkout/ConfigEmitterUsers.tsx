import { Box, Button, Chip, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { EmitterUsersTable } from './EmitterUsersTable';
import { Cancel, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { modifyModuleConfig } from '../../api/api.routes';
import { getCheckoutUsers } from '../../services/checkout/checkoutService';
import { IConfigEmitterUsers } from '../../types/types';
import LoadingView from '../../views/LoadingView/LoadingView';
import { useGetCheckoutConfig } from '../../hooks/useGetCheckoutConfig';
import { leaveConcepts } from '../../utils/checkoutUtils';

const useGetUsers = () => {
  const [hashTableUsers, setHashTableUsers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await getCheckoutUsers();
        const newHashTableUsers: typeof hashTableUsers = {};
        users.forEach((user) => (newHashTableUsers[user.id] = user.nombre));
        setHashTableUsers(newHashTableUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { users: hashTableUsers, loadingUsers: isLoading };
};

export const ConfigEmitterUsers = () => {
  const [userSelected, setUserSelected] = useState<string>('');
  const [leaveSelected, setLeaveSelected] = useState<string[]>([]);
  const [userError, setUserError] = useState(false);
  const [depError, setDepError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addNewUser, setAddNewUser] = useState(false);
  const { config } = useGetCheckoutConfig(addNewUser);
  const { loadingUsers, users } = useGetUsers();

  const handleEdit = (id: string) => {
    setUserSelected(id);
    const userLeaves = config.find((c) => c.id_Usuario === id);
    setLeaveSelected(userLeaves?.departamento as string[]);
  };

  const handleDelete = async (id: string) => {
    const newConfig = config?.filter((c) => c.id_Usuario !== id);
    try {
      await modifyModuleConfig(newConfig, 'Ventas');
      setAddNewUser(!addNewUser);
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      console.log(error);
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const handleSaveUser = async () => {
    if (!userSelected || userSelected.trim() === '') {
      toast.warning('Debes de llenar todos los datos para poder agregar un nuevo usuario');
      return setUserError(true);
    }
    if (!leaveSelected || leaveSelected.length === 0) {
      toast.warning('Debes de llenar todos los datos para poder agregar un nuevo usuario');
      return setDepError(true);
    }
    setIsLoading(true);
    const isEdit = config.findIndex((config) => config.id_Usuario === userSelected);
    const configFilter = config.filter((config) => config.id_Usuario !== userSelected);
    let configData: IConfigEmitterUsers[] = [];
    if (isEdit !== -1) {
      config[isEdit].departamento = leaveSelected;
    } else {
      configData = [
        {
          id_Usuario: userSelected,
          nombre: users[userSelected],
          departamento: leaveSelected,
        },
        ...configFilter,
      ];
    }
    try {
      await modifyModuleConfig(isEdit !== -1 ? config : configData, 'Ventas');
      setAddNewUser(!addNewUser);
      setLeaveSelected([]);
      setUserSelected('');
      if (isEdit !== -1) {
        toast.success('Usuario editado correctamente');
      } else {
        toast.success('Usuario agregado correctamente');
      }
    } catch (error) {
      console.error(error);
      toast.error('No se pudo agregar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userSelected.trim() === '') return;
    const userLeaves = config?.find((c) => c.id_Usuario === userSelected);
    if (!userLeaves) return setLeaveSelected([]);
    setLeaveSelected(userLeaves?.departamento as string[]);
  }, [userSelected, config]);

  if (loadingUsers) return <LoadingView />;
  return (
    <Box sx={{ display: 'flex', flex: 1, bgcolor: 'background.paper', p: 4, columnGap: 5 }}>
      <Stack spacing={4} sx={{ display: 'flex', flex: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Agregar nuevo usuario</Typography>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 2 }}>Nombre del usuario:</Typography>
            <TextField
              label="Usuario"
              fullWidth
              onChange={(e: any) => {
                setUserSelected(e.target.value);
                setUserError(false);
              }}
              select
              value={userSelected}
              error={userError}
              helperText={userError && 'Escribe un nombre de usuario'}
            >
              {Object.keys(users).length === 0 ? (
                <MenuItem value="" disabled>
                  No hay usuarios disponibles
                </MenuItem>
              ) : (
                Object.keys(users).map((user) => (
                  <MenuItem key={user} value={user}>
                    {users[user]}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 2 }}>Concepto de salida:</Typography>
            <TextField
              label="Concepto"
              fullWidth
              SelectProps={{
                multiple: true,
                renderValue: (selected: any) => {
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected &&
                        selected.map((value: string) => (
                          <Chip
                            key={value}
                            label={value}
                            style={{ margin: 2 }}
                            onDelete={() => {
                              setLeaveSelected(
                                leaveSelected.filter((item) => {
                                  return item !== value;
                                })
                              );
                            }}
                            deleteIcon={<Cancel onMouseDown={(event) => event.stopPropagation()} />}
                          />
                        ))}
                    </div>
                  );
                },
              }}
              select
              value={leaveSelected}
              onChange={(e: any) => {
                const value = [...e.target.value];
                setLeaveSelected(value);
                setDepError(false);
              }}
              error={depError}
              helperText={depError && 'Selecciona un concepto'}
            >
              {leaveConcepts.map((lc) => (
                <MenuItem key={lc} value={lc}>
                  {lc}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Save />}
              onClick={handleSaveUser}
            >
              Guardar
            </Button>
          </Box>
        </Stack>
      </Stack>
      <Stack sx={{ display: 'flex', flex: 2 }} spacing={3}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Usuarios agregados</Typography>
        <EmitterUsersTable
          data={config as IConfigEmitterUsers[]}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={isLoading}
        />
      </Stack>
    </Box>
  );
};
