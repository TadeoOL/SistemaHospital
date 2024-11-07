import { Autocomplete, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSAMISchema } from '../../../../schema/programming/programmingSchemas';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import 'dayjs/locale/es-mx';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import { modifySamiPatient, registerSamiPatient } from '../../../../services/admission/samiRegisterService';
import { useSamiPAtientsPaginationStore } from '../../../../store/admission/useSamiPatientsPagination';
import { ISAMIPatient } from '../../../../types/admission/admissionTypes';
import { useGetMedics } from '../../../../hooks/programming/useGetDoctors';
// import { Print } from '@mui/icons-material';
// import { useMemo } from 'react';
// import { generateSamiDoc } from '../../../Documents/AdmissionDocs/AdmissionDoc';
dayjs.locale('es-mx');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650, md: 800 },
};
const scrollBarStyle = {
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

type Inputs = {
  name: string;
  lastName: string;
  secondLastName: string;
  birthDate: Date | null;
  genere: string;
  civilStatus: string;
  phoneNumber: string;
  zipCode: string;
  neighborhood: string;
  address: string;
  personInCharge: string;
  medicId: string;
};

const GENERE = ['Hombre', 'Mujer'];
const TYPOGRAPHY_STYLE = { fontSize: 13, fontWeight: 600 };

export const AddPatientsEntrySami = (props: {
  setOpen: (value: boolean) => void;
  isEdit?: boolean;
  patientData?: ISAMIPatient;
  medicId: string;
}) => {
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Agregar paciente SAMI" />
      <BodyModal
        setOpen={props.setOpen}
        isEdit={props.isEdit}
        patientData={props.patientData}
        medicId={props.medicId}
      />
    </Box>
  );
};

const BodyModal = (props: {
  setOpen: (value: boolean) => void;
  isEdit?: boolean;
  patientData?: ISAMIPatient;
  medicId: string;
}) => {
  const fetch = useSamiPAtientsPaginationStore((state) => state.fetchData);
  const { doctorsData, isLoadingMedics } = useGetMedics();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(patientSAMISchema),
    defaultValues: {
      genere: props.isEdit ? props.patientData?.genero : '',
      birthDate: props.isEdit ? new Date(props.patientData?.fechaNacimiento as Date) : null,
      address: props.isEdit ? props.patientData?.direccion : '',
      civilStatus: props.isEdit ? props.patientData?.estadoCivil : '',
      phoneNumber: props.isEdit ? props.patientData?.telefono : '',
      zipCode: props.isEdit ? props.patientData?.codigoPostal : '',
      neighborhood: props.isEdit ? props.patientData?.colonia : '',
      lastName: props.isEdit ? props.patientData?.apellidoPaterno : '',
      secondLastName: props.isEdit ? props.patientData?.apellidoMaterno : '',
      name: props.isEdit ? props.patientData?.nombre : '',
      personInCharge: props.isEdit ? props.patientData?.nombreResponsable : '',
      medicId: props.isEdit ? props.medicId : '',
    },
  });

  const watchGenere = watch('genere');
  //   const watchBirthDate = watch('birthDate');
  //   const watchCivilStatus = watch('civilStatus');
  //   const watchPhoneNumber = watch('phoneNumber');
  //   const watchZipCode = watch('zipCode');
  //   const watchNeighborhood = watch('neighborhood');
  //   const watchAddress = watch('address');
  //   const watchName = watch('name');
  //   const watchLastName = watch('lastName');
  //   const watchSecondLastName = watch('secondLastName');
  //   const watchPersonInCharge = watch('personInCharge');

  //   const missingData = useMemo(() => {
  //     return (
  //       !watchGenere ||
  //       !watchBirthDate ||
  //       !watchCivilStatus ||
  //       !watchPhoneNumber ||
  //       !watchZipCode ||
  //       !watchNeighborhood ||
  //       !watchAddress ||
  //       !watchName ||
  //       !watchLastName ||
  //       !watchSecondLastName ||
  //       !watchPersonInCharge
  //     );
  //   }, [
  //     watchGenere,
  //     watchBirthDate,
  //     watchCivilStatus,
  //     watchPhoneNumber,
  //     watchZipCode,
  //     watchNeighborhood,
  //     watchAddress,
  //     watchName,
  //     watchLastName,
  //     watchSecondLastName,
  //     watchPersonInCharge,
  //   ]);

  //   const handlePrint = () => {
  //     generateSamiDoc({
  //       name: watchName,
  //       lastName: watchLastName,
  //       secondLastName: watchSecondLastName,
  //       birthDate: dayjs(watchBirthDate).toDate(),
  //       genere: watchGenere,
  //       civilStatus: watchCivilStatus,
  //       phoneNumber: watchPhoneNumber,
  //       zipCode: watchZipCode,
  //       neighborhood: watchNeighborhood,
  //       address: watchAddress,
  //       personInCharge: watchPersonInCharge,
  //     });
  //   };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      if (props.isEdit) {
        await modifySamiPatient({
          nombre: data.name,
          apellidoPaterno: data.lastName,
          apellidoMaterno: data.secondLastName,
          fechaNacimiento: data.birthDate as Date,
          genero: data.genere,
          estadoCivil: data.civilStatus,
          telefono: data.phoneNumber,
          codigoPostal: data.zipCode,
          colonia: data.neighborhood,
          direccion: data.address,
          nombreResponsable: data.personInCharge,
          id_Paciente: props.patientData?.id as string,
        });
        toast.success('Paciente modificado correctamente');
      } else {
        await registerSamiPatient({
          paciente: {
            nombre: data.name,
            apellidoPaterno: data.lastName,
            apellidoMaterno: data.secondLastName,
            fechaNacimiento: data.birthDate as Date,
            genero: data.genere,
            estadoCivil: data.civilStatus,
            telefono: data.phoneNumber,
            codigoPostal: data.zipCode,
            colonia: data.neighborhood,
            direccion: data.address,
            nombreResponsable: data.personInCharge,
          },
          id_Medico: data.medicId,
        });
        toast.success('Paciente dado de alta correctamente');
      }
      fetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al procesar la solicitud del paciente');
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, (e) => {
          console.log(e);
        })}
      >
        <Box
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: { xs: 500, md: 500 },
            ...scrollBarStyle,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Nombre</Typography>
              <TextField
                fullWidth
                placeholder="Nombre..."
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Apellido Paterno</Typography>
              <TextField
                fullWidth
                placeholder="Apellido Paterno..."
                {...register('lastName')}
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Apellido Materno</Typography>
              <TextField
                fullWidth
                placeholder="Apellido Materno..."
                {...register('secondLastName')}
                error={!!errors.secondLastName?.message}
                helperText={errors.secondLastName?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Genero</Typography>
              <TextField
                fullWidth
                label="Selecciona el genero"
                select
                value={watchGenere}
                error={!!errors.genere?.message}
                helperText={errors.genere?.message}
                {...register('genere')}
              >
                {GENERE.map((genero) => (
                  <MenuItem key={genero} value={genero}>
                    {genero}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Fecha Nacimiento</Typography>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es-mx'}>
                    <DatePicker
                      value={dayjs(value)}
                      onChange={onChange}
                      views={['year', 'month', 'day']}
                      disableFuture
                      format={'DD/MM/YYYY'}
                      label="Fecha de nacimiento"
                      slotProps={{
                        textField: {
                          error: !!errors.birthDate?.message,
                          helperText: errors.birthDate?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Estado Civil</Typography>
              <TextField
                fullWidth
                placeholder="Estado Civil..."
                {...register('civilStatus')}
                error={!!errors.civilStatus?.message}
                helperText={errors.civilStatus?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Teléfono</Typography>
              <TextField
                fullWidth
                placeholder="Teléfono..."
                {...register('phoneNumber')}
                error={!!errors.phoneNumber?.message}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
              <TextField
                fullWidth
                placeholder="Dirección..."
                {...register('address')}
                error={!!errors.address?.message}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Colonia</Typography>
              <TextField
                fullWidth
                placeholder="Colonia..."
                {...register('neighborhood')}
                error={!!errors.neighborhood?.message}
                helperText={errors.neighborhood?.message}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={TYPOGRAPHY_STYLE}>Código Postal</Typography>
              <TextField
                fullWidth
                placeholder="Código Postal..."
                {...register('zipCode')}
                error={!!errors.zipCode?.message}
                helperText={errors.zipCode?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={TYPOGRAPHY_STYLE}>Nombre Responsable</Typography>
              <TextField
                fullWidth
                placeholder="Nombre del responsable..."
                {...register('personInCharge')}
                error={!!errors.personInCharge?.message}
                helperText={errors.personInCharge?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Medico</Typography>
              <Controller
                name="medicId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    id="medic-select"
                    options={doctorsData}
                    value={doctorsData.find((d) => d.id_Medico === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id_Medico || '');
                    }}
                    getOptionLabel={(option) => option.nombre || ''}
                    isOptionEqualToValue={(option, value) => option.id_Medico === value?.id_Medico}
                    loading={isLoadingMedics}
                    noOptionsText="No se encontraron medicos"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Médico"
                        error={!!errors.medicId}
                        helperText={errors.medicId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Button variant="outlined" startIcon={<Print />} fullWidth disabled={missingData} onClick={handlePrint}>
                Imprimir Documento
              </Button>
            </Grid> */}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            bgcolor: 'background.paper',
            p: 1,
          }}
        >
          <Button variant="outlined" onClick={() => props.setOpen(false)} color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Aceptar
          </Button>
        </Box>
      </form>
    </>
  );
};
