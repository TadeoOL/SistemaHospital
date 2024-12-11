import { Box, Button, Checkbox, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { IAdmitPatientCommand } from '../../../../../types/admission/admissionTypes';
import { admitPatient } from '../../../../../services/admission/admisionService';
import { useGetPatientInfo } from '../../../../../hooks/admission/useGetPatientInfo';
import { FullscreenLoader } from '../../../../../common/components/FullscreenLoader';
import { usePatientEntryPaginationStore } from '../../../../../store/admission/usePatientEntryPagination';
import { basePatientSchema, editAdmissionPatientSchema } from '@/schema/programming/programmingSchemas';
import { usePatientRegisterPaginationStore } from '@/store/programming/patientRegisterPagination';
dayjs.locale('es-mx');

const style = (isProgramming?: boolean) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95%',
    sm: '90%',
    md: '80%',
    lg: '75%',
  },
  maxWidth: '1000px',
  maxHeight: '90vh',
  height: isProgramming ? 'auto' : '90vh',
  minHeight: isProgramming ? 'auto' : '90vh',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.paper',
  overflow: 'hidden',
});

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

const GENERE = ['Hombre', 'Mujer'];
const TYPOGRAPHY_STYLE = { fontSize: 13, fontWeight: 600 };

type Inputs = {
  name: string;
  lastName: string;
  secondLastName: string;
  birthDate: Date;
  genere: string;
  civilStatus: string;
  phoneNumber: string;
  occupation: string;
  zipCode: string;
  neighborhood: string;
  address: string;
  personInCharge: string;
  relationship: string;
  sameAddress: boolean;
  hasInsurance: boolean;
  insurance: string;
  personInChargeZipCode: string;
  personInChargeNeighborhood: string;
  personInChargeAddress: string;
  personInChargePhoneNumber: string;
  state: string;
  city: string;
  reasonForAdmission: string;
  admissionDiagnosis: string;
  allergies: string;
  bloodType: string;
  comments: string;
  curp: string;
  personInChargeCity: string;
  personInChargeState: string;
};

interface EditPersonalInfoModalProps {
  setOpen: Function;
  id_IngresoPaciente: string;
  admit?: boolean;
  isProgramming?: boolean;
  optionalRefetch?: Function;
}

const BLOOD_TYPE = ['PE', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const EditPersonalInfoModal = (props: EditPersonalInfoModalProps) => {
  const { data: personalData, isLoading } = useGetPatientInfo(props.id_IngresoPaciente);
  const refetch = props.isProgramming
    ? usePatientRegisterPaginationStore((state) => state.fetchData)
    : usePatientEntryPaginationStore((state) => state.fetchData);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const obj: IAdmitPatientCommand = {
      id_IngresoPaciente: props.id_IngresoPaciente,
      datosClinicos: {
        motivoIngreso: data.reasonForAdmission,
        diagnosticoIngreso: data.admissionDiagnosis,
        comentarios: data.comments,
      },
      paciente: {
        nombre: data.name,
        apellidoPaterno: data.lastName,
        apellidoMaterno: data.secondLastName,
        fechaNacimiento: data.birthDate,
        genero: data.genere,
        estadoCivil: data.civilStatus,
        telefono: data.phoneNumber,
        ocupacion: data.occupation,
        alergias: data.allergies,
        tipoSangre: data.bloodType,
        codigoPostal: data.zipCode,
        colonia: data.neighborhood,
        direccion: data.address,
        curp: data.curp,
        ciudad: data.city,
        estado: data.state,
        aseguradora: data.hasInsurance,
        nombreAseguradora: data.insurance
      },
      responsablePaciente: {
        nombreResponsable: data.personInCharge,
        parentesco: data.relationship,
        coloniaResponsable: data.personInChargeNeighborhood,
        domicilioResponsable: data.personInChargeAddress,
        ciudadResponsable: data.personInChargeCity,
        estadoResponsable: data.personInChargeState,
        telefonoResponsable: data.personInChargePhoneNumber,
        codigoPostalResponsable: data.personInChargeZipCode,
      },
    };
    Swal.fire({
      title: '¿Estas seguro?',
      text: `Estas a punto de ${props.admit ? 'admitir al paciente' : 'modificar los datos'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await admitPatient(obj);
          refetch();
          props.optionalRefetch != undefined ?  props.optionalRefetch() :refetch();
          Swal.fire({
            title: 'Actualizado!',
            text: `${props.admit ? 'Paciente admitido' : 'Datos actualizados'} correctamente`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
          props.setOpen(false);
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error!',
            text: `${props.admit ? 'No se pudo admitir al paciente' : 'No se pudo actualizar los datos'}`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    });
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(props.isProgramming ? basePatientSchema : editAdmissionPatientSchema),
    values: {
      name: personalData?.paciente?.nombre || '',
      lastName: personalData?.paciente?.apellidoPaterno || '',
      secondLastName: personalData?.paciente?.apellidoMaterno || '',
      birthDate: personalData?.paciente?.fechaNacimiento ? new Date(personalData.paciente.fechaNacimiento) : new Date(),
      genere: personalData?.paciente?.genero || '',
      civilStatus: personalData?.paciente?.estadoCivil || '',
      phoneNumber: personalData?.paciente?.telefono || '',
      occupation: personalData?.paciente?.ocupacion || '',
      zipCode: personalData?.paciente?.codigoPostal || '',
      neighborhood: personalData?.paciente?.colonia || '',
      address: personalData?.paciente?.direccion || '',
      curp: personalData?.paciente?.curp || '',
      city: personalData?.paciente?.ciudad || '',
      state: personalData?.paciente?.estado || '',
      hasInsurance: personalData?.paciente?.aseguradora || false ,
      insurance: personalData?.paciente?.nombreAseguradora || '' ,

      personInCharge: personalData?.responsablePaciente?.nombreResponsable || '',
      relationship: personalData?.responsablePaciente?.parentesco || '',
      personInChargeZipCode: personalData?.responsablePaciente?.codigoPostalResponsable || '',
      personInChargeNeighborhood: personalData?.responsablePaciente?.coloniaResponsable || '',
      personInChargeAddress: personalData?.responsablePaciente?.domicilioResponsable || '',
      personInChargePhoneNumber: personalData?.responsablePaciente?.telefonoResponsable || '',
      personInChargeCity: personalData?.responsablePaciente?.ciudadResponsable || '',
      personInChargeState: personalData?.responsablePaciente?.estadoResponsable || '',

      reasonForAdmission: personalData?.datosClinicos?.motivoIngreso || '',
      admissionDiagnosis: personalData?.datosClinicos?.diagnosticoIngreso || '',
      allergies: personalData?.paciente?.alergias || '',
      bloodType: personalData?.paciente?.tipoSangre || '',
      comments: personalData?.datosClinicos?.comentarios || '',

      sameAddress: false,
    },
    disabled: isLoading,
  });

  const watchAddresPersonInCharge = watch('personInChargeAddress');
  const watchPersonInChargeZipCode = watch('personInChargeZipCode');
  const watchPersonInChargeNeighborhood = watch('personInChargeNeighborhood');
  const watchPersonInChargeCity = watch('personInChargeCity');
  const watchPersonInChargeState = watch('personInChargeState');

  const watchSameAddress = watch('sameAddress');
  const watchInsurance = watch('hasInsurance');
  const watchZipCode = watch('zipCode');
  const watchNeighborhood = watch('neighborhood');
  const watchAddress = watch('address');
  const watchCity = watch('city');
  const watchState = watch('state');
  const watchGenere = watch('genere');
  const watchBloodType = watch('bloodType');

  useEffect(() => {
    if (watchSameAddress) {
      setValue('personInChargeAddress', watchAddress);
      setValue('personInChargeZipCode', watchZipCode);
      setValue('personInChargeNeighborhood', watchNeighborhood);
      setValue('personInChargeCity', watchCity);
      setValue('personInChargeState', watchState);
    }
  }, [watchSameAddress, watchZipCode, watchAddress, watchNeighborhood, watchCity, watchState]);

  useEffect(() => {
    if (
      watchAddress &&
      watchAddresPersonInCharge &&
      watchNeighborhood &&
      watchPersonInChargeNeighborhood &&
      watchZipCode &&
      watchPersonInChargeZipCode &&
      watchAddresPersonInCharge === watchAddress &&
      watchNeighborhood === watchPersonInChargeNeighborhood &&
      watchZipCode === watchPersonInChargeZipCode &&
      watchCity === watchPersonInChargeCity &&
      watchState === watchPersonInChargeState
    ) {
      setValue('sameAddress', true);
    }
  }, [
    watchAddress,
    watchZipCode,
    watchNeighborhood,
    watchCity,
    watchState,
    watchPersonInChargeNeighborhood,
    watchPersonInChargeZipCode,
    watchAddresPersonInCharge,
    watchPersonInChargeCity,
    watchPersonInChargeState,
  ]);

  console.log(props.isProgramming);

  if (isLoading) return <FullscreenLoader />;
  return (
    <Box sx={style(props.isProgramming)}>
      <HeaderModal setOpen={props.setOpen} title="Alta de Paciente" />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, (e) => {
          console.log(e);
        })}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: { xs: 1, sm: 2 },
            ...scrollBarStyle,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Paciente</Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={1}>
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
            {!props.isProgramming && (
              <>
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
                <Grid item xs={12}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Ocupación/Empleo</Typography>
                  <TextField
                    fullWidth
                    placeholder="Escribe la ocupación..."
                    {...register('occupation')}
                    error={!!errors.occupation?.message}
                    helperText={errors.occupation?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>CURP</Typography>
                  <TextField
                    fullWidth
                    placeholder="CURP..."
                    {...register('curp')}
                    error={!!errors.curp?.message}
                    helperText={errors.curp?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Código Postal</Typography>
                  <TextField
                    fullWidth
                    placeholder="Código Postal..."
                    {...register('zipCode')}
                    error={!!errors.zipCode?.message}
                    helperText={errors.zipCode?.message}
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
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
                  <TextField
                    fullWidth
                    placeholder="Dirección..."
                    {...register('address')}
                    error={!!errors.address?.message}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Estado</Typography>
                  <TextField
                    fullWidth
                    placeholder="Estado..."
                    {...register('state')}
                    error={!!errors.state?.message}
                    helperText={errors.state?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Ciudad</Typography>
                  <TextField
                    fullWidth
                    placeholder="Ciudad..."
                    {...register('city')}
                    error={!!errors.city?.message}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox {...register('hasInsurance')} checked={watchInsurance} />
                  <Typography sx={TYPOGRAPHY_STYLE}>Tiene aseguradora</Typography>
                </Grid>
                { watchInsurance &&
                  (<Grid item xs={3}>
                    <Typography sx={TYPOGRAPHY_STYLE}>Nombre Aseguradora</Typography>
                    <TextField
                      fullWidth
                      placeholder="Aseguradora..."
                      error={!!errors.personInChargeAddress?.message}
                      helperText={errors.personInChargeAddress?.message}
                      {...register('insurance')}
                    />
                  </Grid>)
                }
                <Grid item xs={12}>
                  <Typography sx={{ mt: 1, fontSize: 18, fontWeight: 500 }}>Datos de contacto</Typography>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Persona Responsable</Typography>
                  <TextField
                    fullWidth
                    placeholder="Nombre..."
                    {...register('personInCharge')}
                    error={!!errors.personInCharge?.message}
                    helperText={errors.personInCharge?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Parentesco</Typography>
                  <TextField
                    fullWidth
                    placeholder="Parentesco..."
                    {...register('relationship')}
                    error={!!errors.relationship?.message}
                    helperText={errors.relationship?.message}
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox {...register('sameAddress')} checked={watchSameAddress} />
                  <Typography sx={TYPOGRAPHY_STYLE}>Mismo Domicilio</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Código Postal</Typography>
                  <TextField
                    fullWidth
                    placeholder="Código postal..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeZipCode?.message}
                    helperText={errors.personInChargeZipCode?.message}
                    {...register('personInChargeZipCode')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Colonia</Typography>
                  <TextField
                    fullWidth
                    placeholder="Colonia..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeNeighborhood?.message}
                    helperText={errors.personInChargeNeighborhood?.message}
                    {...register('personInChargeNeighborhood')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
                  <TextField
                    fullWidth
                    placeholder="Dirección..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeAddress?.message}
                    helperText={errors.personInChargeAddress?.message}
                    {...register('personInChargeAddress')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Teléfono</Typography>
                  <TextField
                    fullWidth
                    placeholder="Teléfono..."
                    error={!!errors.personInChargePhoneNumber?.message}
                    helperText={errors.personInChargePhoneNumber?.message}
                    {...register('personInChargePhoneNumber')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Ciudad</Typography>
                  <TextField
                    fullWidth
                    placeholder="Ciudad..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeCity?.message}
                    helperText={errors.personInChargeCity?.message}
                    {...register('personInChargeCity')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Estado</Typography>
                  <TextField
                    fullWidth
                    placeholder="Estado..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeState?.message}
                    helperText={errors.personInChargeState?.message}
                    {...register('personInChargeState')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ mt: 1, fontSize: 18, fontWeight: 500 }}>Datos clínicos</Typography>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Motivo de ingreso</Typography>
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Motivo de ingreso..."
                    {...register('reasonForAdmission')}
                    error={!!errors.reasonForAdmission?.message}
                    helperText={errors.reasonForAdmission?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Diagnostico de ingreso</Typography>
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Diagnostico de ingreso..."
                    {...register('admissionDiagnosis')}
                    error={!!errors.admissionDiagnosis?.message}
                    helperText={errors.admissionDiagnosis?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Alergias</Typography>
                  <TextField
                    fullWidth
                    placeholder="Alergias..."
                    {...register('allergies')}
                    error={!!errors.allergies?.message}
                    helperText={errors.allergies?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Tipo de sangre</Typography>
                  <TextField
                    fullWidth
                    select
                    value={watchBloodType}
                    placeholder="Tipo de sangre..."
                    {...register('bloodType')}
                    error={!!errors.bloodType?.message}
                    helperText={errors.bloodType?.message}
                  >
                    {BLOOD_TYPE.map((bt) => (
                      <MenuItem key={bt} value={bt}>
                        {bt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Comentarios</Typography>
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Comentarios..."
                    {...register('comments')}
                    error={!!errors.comments?.message}
                    helperText={errors.comments?.message}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            p: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Button variant="outlined" onClick={() => props.setOpen(false)} color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Aceptar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
