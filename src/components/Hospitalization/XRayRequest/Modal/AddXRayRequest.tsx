import { Autocomplete, Box, Button, Divider, Stack, TextField, Typography, createFilterOptions } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Cancel, Save } from '@mui/icons-material';
import { IPatientFromSearch } from '../../../../types/types';
import { getPatientsWithAccount } from '../../../../services/programming/patientService';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useXRayPaginationStore } from '../../../../store/hospitalization/xrayPagination';
import { IService } from '../../../../types/hospitalizationTypes';
import { addServiceRequestToPatient } from '../../../../services/hospitalization/ServicesService';

const OPTIONS_LIMIT = 30;
const filterPatientOptions = createFilterOptions<IPatientFromSearch>({
  limit: OPTIONS_LIMIT,
});

const filterServicesOptions = createFilterOptions<IService>({
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

const useGetServicesData = () => {
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

interface Props {
  setOpen: Function;
  refetch: Function;
  id_Patient?: string;
  services?: string[];
  isPreselected?: boolean;
}

export const AddXRayRequestModal = (props: Props) => {
  const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
  const [servicesSelected, setServicesSelected] = useState<IService[]>([]);
  const [userError, setUserError] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const setType = useXRayPaginationStore((state) => state.setType);
  const refetch = useXRayPaginationStore((state) => state.fetchData);
  const { data, isLoading, setSearchXray } = useGetServicesData();

  useEffect(() => {
    if (props.id_Patient && usersData.length > 0) {
      const patient = usersData.find((user) => user.id_Paciente === props.id_Patient);
      setUserSelected(patient || null);
    }
  }, [props.id_Patient, usersData]);

  useEffect(() => {
    if (props.services && props.services.length > 0 && data.length > 0) {
      const selectedServices = data.filter((service) => props.services?.includes(service.id_Servicio));
      setServicesSelected(selectedServices);
    }
  }, [props.services, data]);

  useEffect(() => {
    patientsCall();
    return () => {
      setType(null);
    };
  }, [patientSearch]);

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
      if (servicesSelected.length === 0) {
        setRequestError(true);
        return toast.warning('Selecciona al menos un estudio de gabinete!');
      }

      await Promise.all(
        servicesSelected.map((service) => {
          const object = {
            Id_CuentaPaciente: userSelected.id_CuentaPaciente,
            Id_Servicio: service.id_Servicio,
          };
          return addServiceRequestToPatient(object);
        })
      );

      toast.success('Solicitudes creadas');
      refetch();
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
      <HeaderModal setOpen={props.setOpen} title="Solicitud de Estudios" />
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
                getOptionLabel={(option) => option.nombrePaciente}
                options={usersData}
                disabled={props.isPreselected}
                value={userSelected}
                noOptionsText="No se encontraron pacientes"
                isOptionEqualToValue={(op, val) => op.id_Paciente === val.id_Paciente}
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
          {!isLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
              <Stack sx={{ display: 'flex', flex: 1, ml: 5 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Tipo de Estudio de Gabinete</Typography>
                <Autocomplete
                  multiple
                  disablePortal
                  fullWidth
                  disabled={props.isPreselected}
                  filterOptions={filterServicesOptions}
                  onChange={(e, val) => {
                    e.stopPropagation();
                    setServicesSelected(val);
                    setRequestError(false);
                  }}
                  loading={isLoading}
                  getOptionLabel={(option) => option.nombre}
                  options={data}
                  value={servicesSelected}
                  noOptionsText="No se encontraron servicios"
                  isOptionEqualToValue={(op, val) => op.id_Servicio === val.id_Servicio}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={requestError}
                      helperText={requestError && 'Selecciona al menos un servicio'}
                      placeholder="Servicios"
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
          )}
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
