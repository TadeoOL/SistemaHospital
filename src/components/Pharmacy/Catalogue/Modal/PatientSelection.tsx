import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    createFilterOptions,
  } from '@mui/material';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useEffect, useState } from 'react';
  import { toast } from 'react-toastify';
  import { addNewArticlesPackage } from '../../../../schema/schemas';
  import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
  import { Save, Cancel } from '@mui/icons-material';
  import {
    IArticlesPackage,
    IPatientFromSearch,
  } from '../../../../types/types';
  import { getPatientsWithAccount } from '../../../../services/programming/patientService';
  
  const OPTIONS_LIMIT = 30;
  const filterPatientOptions = createFilterOptions<IPatientFromSearch>({
    limit: OPTIONS_LIMIT,
  });
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 380, md: 600 },
  
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 600,
  };
  
  const style2 = {
    bgcolor: 'background.paper',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
  };
  
  export const ArticlesEntryModal = (props: { setOpen: Function; warehouseId: string; refetch: Function }) => {
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    // const [search, setSearch] = useState('');
    const [usersData, setUsersData] = useState<IPatientFromSearch[]>([]);
    const [patientSearch, setPatientSearch] = useState('');
    const [userSelected, setUserSelected] = useState<null | IPatientFromSearch>(null);
    const [userError, setUserError] = useState(false);
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  
    useEffect(() => {
      patientsCall();
    }, [patientSearch]);

  
    const patientsCall = async () => {
        setIsLoadingPatients(true)
      const url = `Search=${patientSearch}`;
      const res = await getPatientsWithAccount(url);
      if (res) {
        setUsersData(res);
      }
      setIsLoadingPatients(false)
    };
  
    const { handleSubmit } = useForm<IArticlesPackage>({
      defaultValues: {
        nombre: '',
        descripcion: '',
      },
      resolver: zodResolver(addNewArticlesPackage),
    });
    const validateAmount = (art: any) => {
      for (let i = 0; i < art.length; i++) {
        const articulo = art[i];
        if (articulo.amount > articulo.stock) {
          toast.error(`La cantidad de salida del articulo ${art.name} esta superando la existencias actuales! `);
          return false;
        }
      }
      return true;
    };
    const onSubmit = async () => {
      if (!userSelected) {
        setUserError(true);
        toast.error('Selecciona un paciente');
        return;
      }
      try {
        if (!validateAmount) return;
        setLoadingSubmit(true);
        /*const object = {
          Id_Almacen: props.warehouseId,
          IngresoMotivo: 'Devolución de artículos',
          Id_CuentaPaciente: userSelected.id_Cuenta,
        };
        //await articlesEntryToWarehouse(object);
        //checar aqui qp || no se usa  */
        props.refetch();
        toast.success('Entrada de artículos con éxito!');
        setLoadingSubmit(false);
        props.setOpen(false);
      } catch (error) {
        console.log(error);
        setLoadingSubmit(false);
        toast.error('Algo salio mal');
      }
    };
  
    return (
      <Box sx={style}>
        <HeaderModal setOpen={props.setOpen} title="Entrada de artículos" />
        <Box sx={style2}>
          {isLoadingPatients ? (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    columnGap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    rowGap: { xs: 2, sm: 0 },
                  }}
                >
                  <Stack sx={{ display: 'flex', flex: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Seleccionar paciente</Typography>
                    <Autocomplete
                      disablePortal
                      fullWidth
                      filterOptions={filterPatientOptions}
                      onChange={(e, val) => {
                        e.stopPropagation();
                        setUserSelected(val);
                        if (val !== null) {
                          //handleFetchArticlesFromAccount(val.id_Cuenta);
                        }
                      }}
                      //cambiar loading
                      loading={isLoadingPatients && usersData.length === 0}
                      getOptionLabel={(option) => option.nombreCompleto}
                      options={usersData}
                      value={userSelected}
                      noOptionsText="No se encontraron pacientes"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={userError}
                          helperText={userError && 'Selecciona un paciente'}
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
                    disabled={loadingSubmit}
                    onClick={() => {
                      onSubmit();
                    }}
                  >
                    Guardar
                  </Button>
                </Box>
              </Stack>
            </form>
          )}
        </Box>
      </Box>
    );
  };
  