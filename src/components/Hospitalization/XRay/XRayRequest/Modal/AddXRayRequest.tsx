import {
  Autocomplete,
  Box,
  Button,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Cancel, Save } from '@mui/icons-material';
import { IPatientFromSearch } from '../../../../../types/types';
import { getPatientsWithAccount } from '../../../../../services/programming/patientService';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useXRayPaginationStore } from '../../../../../store/hospitalization/xrayPagination';
import { IXRay, REQUEST_TYPES } from '../../../../../types/hospitalizationTypes';
import { addXRayRequest } from '../../../../../services/hospitalization/xrayService';

const OPTIONS_LIMIT = 30;
const filterPatientOptions = createFilterOptions<IPatientFromSearch>({
  limit: OPTIONS_LIMIT,
});
const filterXRayOptions = createFilterOptions<IXRay>({
  limit: OPTIONS_LIMIT,
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 800, lg: 900 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 600 },
};

const useGetXRayData = () => {
  const fetchData = useXRayPaginationStore((state) => state.fetchData);
  const data = useXRayPaginationStore((state) => state.data);
  const search = useXRayPaginationStore((state) => state.search);
  const setSearchXray = useXRayPaginationStore((state) => state.setSearch);
  const isLoading = useXRayPaginationStore((state) => state.loading);
  useEffect(() => {
    fetchData();
  }, [search]);
  return {
    data,
    isLoading,
    setSearchXray,
  };
};

export const AddXRayRequestModal = (props: { setOpen: Function; refetch: Function }) => {
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [requestSelected, setRequestSelected] = useState<number>(0);
  const [xraySelected, setXRaySelected] = useState<null | IXRay>(null);
  const [userError, setUserError] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [xrayError, setXRayError] = useState(false);
  const { data, isLoading, setSearchXray } = useGetXRayData();
  const setType = useXRayPaginationStore((state) => state.setType);
  const refetch = useXRayPaginationStore((state) => state.fetchData);

  useEffect(() => {
    patientsCall();
    return () => {
      setType(0);
    };
  }, [patientSearch]);

  useEffect(() => {
    const fetch = async () => {
      try {
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    fetch();
  }, []);

  const patientsCall = async () => {
    const url = `Search=${patientSearch}`;
    const res = await getPatientsWithAccount(url);
    if (res) {
      setUsersData(res);
    }
  };

  const onSubmit = async () => {
    try {
      if (!userSelected) {
        setUserError(true);
        return toast.warning('Selecciona un paciente!');
      }
      if (!requestSelected) {
        setRequestError(true);
        return toast.warning('Selecciona un tipo electrocardiograma!');
      }
      if (!xraySelected) {
        setXRayError(true);
        return toast.warning('Selecciona una electrocardiograma!');
      }
      const object = {
        Id_Paciente: userSelected.id_Paciente,
        Id_CuentaPaciente: userSelected.id_Cuenta,
        Id_Radiografia: xraySelected?.id || '',
      };
      await addXRayRequest(object);
      toast.success('Solicitud creada');
      props.refetch(true);
      props.setOpen(false);
      setUserSelected(null);
    } catch (error) {
      console.log(error);
      toast.error('Algo salio mal');
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Solicitud de electrocardiograma" />
      <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            columnGap: 2,
            flexDirection: 'column',
            rowGap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
            <Stack sx={{ display: 'flex', flex: 1, ml: 5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar paciente</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterPatientOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setUserSelected(val);
                  setUserError(false);
                }}
                //cambiar loading
                loading={usersData.length === 0}
                getOptionLabel={(option) => option.nombreCompleto}
                options={usersData}
                value={userSelected}
                noOptionsText="No se encontraron pacientes"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={userError}
                    helperText={userError && 'Selecciona una radiografía'}
                    placeholder="Pacientes"
                    sx={{ width: '100%' }}
                    onChange={(e) => {
                      if (e.target.value === null) {
                        setPatientSearch('');
                      }
                      setPatientSearch(e.target.value);
                    }}
                  />
                )}
              />
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
            <Stack sx={{ display: 'flex', flex: 1, ml: 5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Tipo de electrocardiograma</Typography>
              <TextField
                select
                label="Seleccionar el tipo de electrocardiograma"
                value={requestSelected}
                error={requestError}
                helperText={requestError && 'Selecciona un tipo de electrocardiograma'}
                onChange={(e) => {
                  setRequestSelected(parseInt(e.target.value));
                  setType(parseInt(e.target.value));
                  setXRaySelected(null);
                  refetch();
                }}
              >
                <MenuItem key={0} value={0} disabled>
                  Seleccionar
                </MenuItem>
                {Object.keys(REQUEST_TYPES).map((r) => (
                  <MenuItem key={r} value={r}>
                    {REQUEST_TYPES[r as any as number]}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
            <Stack sx={{ display: 'flex', flex: 1, ml: 5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar electrocardiograma</Typography>
              <Autocomplete
                disablePortal
                disabled={!requestSelected}
                fullWidth
                filterOptions={filterXRayOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setXRaySelected(val);
                  setXRayError(false);
                }}
                //cambiar loading
                loading={isLoading}
                getOptionLabel={(option) => option.nombre}
                options={data}
                value={xraySelected}
                noOptionsText="No se encontraron electrocardiogramas"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={xrayError}
                    helperText={xrayError && 'Selecciona un tipo de electrocardiograma'}
                    placeholder={REQUEST_TYPES[requestSelected]}
                    sx={{ width: '100%' }}
                    onChange={(e) => {
                      if (e.target.value === null) {
                        setSearchXray('');
                      }
                      setSearchXray(e.target.value);
                    }}
                  />
                )}
              />
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            mt: 2,
            bottom: 0,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            color="error"
            onClick={() => {
              props.setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            endIcon={<Save />}
            //disabled={editingIds.size > 0 || articles.length === 0}
            onClick={() => {
              onSubmit();
            }}
          >
            Guardar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
