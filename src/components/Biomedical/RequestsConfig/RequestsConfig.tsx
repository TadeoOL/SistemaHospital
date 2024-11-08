import { Autocomplete, Box, Button, Chip, CircularProgress, createFilterOptions, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Cancel, Save } from '@mui/icons-material';
import { RequestConfigTable } from './RequestConfigTable';
import { IRequestConfig, REQUEST_TYPES } from '../../../types/hospitalizationTypes';
import { useGetRequestsConfig } from '../../../hooks/hospitalization/useGetRequestsConfig';
import { toast } from 'react-toastify';
import { getUsersBySearch, modifyModuleConfig } from '../../../api/api.routes';

const OPTIONS_LIMIT = 30;
const filterUserOptions = createFilterOptions<{id: string, nombre: string}>({
  limit: OPTIONS_LIMIT,
});


const useGetUsers = () => {
  const [hashTableUsers, setHashTableUsers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userSearch, setUserSearch] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await getUsersBySearch(userSearch);
        const newHashTableUsers: typeof hashTableUsers = {};
        users.forEach((user: any) => (newHashTableUsers[user.id] = user.nombre));
        setHashTableUsers(newHashTableUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { users: hashTableUsers, loadingUsers: isLoading, setUserSearch };
};

export const RequestsConfig = () => {
  const [userSelected, setUserSelected] = useState<{id: string; nombre: string;} | null >(null);
  const [requestSelected, setRequestSelected] = useState<number[]>([]);
  const { loadingUsers, users, setUserSearch } = useGetUsers();
  const { config, refetch } = useGetRequestsConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [userError, setUserError] = useState(false);
  const [depError, setDepError] = useState(false);

  const handleEdit = (user: IRequestConfig) => {
    setUserSelected({nombre: user.nombre, id: user.id_Usuario});
    const userLeaves = config.find((c) => c.id_Usuario === user.id_Usuario);
    setRequestSelected(userLeaves?.tipoServicio as number[]);
  };

  const handleDelete = async (id: string) => {
    const newConfig = config?.filter((c) => c.id_Usuario !== id);
    try {
      await modifyModuleConfig(newConfig, 'Servicios');
      toast.success('Usuario eliminado correctamente');
      refetch();
    } catch (error) {
      console.log(error);
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const handleSaveUser = async () => {
    if (!userSelected) {
      toast.warning('Debes de llenar todos los datos para poder agregar un nuevo usuario');
      return setUserError(true);
    }
    if (!requestSelected || requestSelected.length === 0) {
      toast.warning('Debes de llenar todos los datos para poder agregar un nuevo usuario');
      return setDepError(true);
    }
    setIsLoading(true);
    const isEdit = config.findIndex((config) => config.id_Usuario === userSelected.id);
    const configFilter = config.filter((config) => config.id_Usuario !== userSelected.id);
    let configData: IRequestConfig[] = [];
    if (isEdit !== -1) {
      config[isEdit].tipoServicio = requestSelected;
    } else {
      configData = [
        {
          id_Usuario: userSelected.id,
          nombre: userSelected.nombre,
          tipoServicio: requestSelected,
        },
        ...configFilter,
      ];
    }
    try {
      await modifyModuleConfig(isEdit !== -1 ? config : configData, 'Servicios');
      setRequestSelected([]);
      refetch();
      setUserSelected(null);
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

  if (loadingUsers) {
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', flex: 1, bgcolor: 'background.paper', p: 4, columnGap: 5 }}>
      <Stack spacing={4} sx={{ display: 'flex', flex: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Agregar nuevo usuario</Typography>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 2 }}>Nombre del usuario:</Typography>
            <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterUserOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setUserSelected(val);
                  setUserError(false);
                }}
                //cambiar loading
                loading={isLoading}
                getOptionLabel={(option) => option.nombre}
                options={ Object.entries(users).map(([id, nombre]) => ({ id, nombre})) }
                value={userSelected}
                noOptionsText="No se encontraron usuarios"
                isOptionEqualToValue={(op, val) => op.id === val.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={userError}
                    helperText={userError && 'Selecciona un usuario'}
                    placeholder="Usuario"
                    sx={{ width: '100%' }}
                    onChange={(e) => {
                      if (e.target.value === null) {
                        setUserSearch('');
                      }
                      setUserSearch(e.target.value);
                    }}
                  />
                )}
              />
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
                        selected.map((value: number) => (
                          <Chip
                            key={value}
                            label={REQUEST_TYPES[value]}
                            style={{ margin: 2 }}
                            onDelete={() => {
                              setRequestSelected(
                                requestSelected.filter((item) => {
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
              value={requestSelected}
              onChange={(e: any) => {
                const value = [...e.target.value].flatMap((val) => parseInt(val));
                setRequestSelected(value);
                setDepError(false);
              }}
              error={depError}
              helperText={depError && 'Selecciona un concepto'}
            >
              {Object.keys(REQUEST_TYPES).map((lc) => (
                <MenuItem key={lc} value={lc}>
                  {REQUEST_TYPES[lc as any as number]}
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
        <RequestConfigTable data={config} handleEdit={handleEdit} handleDelete={handleDelete} loading={isLoading} />
      </Stack>
    </Box>
  );
};
