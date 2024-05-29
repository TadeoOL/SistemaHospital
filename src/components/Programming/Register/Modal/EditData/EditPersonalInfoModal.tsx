import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientRegistrationSchema } from '../../../../../schema/programming/programmingSchemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Paciente } from '../../../../../types/admissionTypes';
import { getPatientById, modifyPatient } from '../../../../../services/programming/patientService';
import { usePatientRegisterPaginationStore } from '../../../../../store/programming/patientRegisterPagination';
import Swal from 'sweetalert2';

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
  maxHeight: { xs: 900 },
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

const GENERE = ['Hombre', 'Mujer'];
const TYPOGRAPHY_STYLE = { fontSize: 11, fontWeight: 500 };

type Inputs = {
  name: string;
  lastName: string;
  secondLastName: string;
  age: string;
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
  personInChargeZipCode: string;
  personInChargeNeighborhood: string;
  personInChargeAddress: string;
  personInChargePhoneNumber: string;
};

interface EditPersonalInfoModalProps {
  setOpen: Function;
  patientId: string;
}

const useGetPersonalData = (patientId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [personalData, setPersonalData] = useState<Paciente>();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await getPatientById(patientId);
        setPersonalData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return {
    isLoading,
    personalData,
  };
};

export const EditPersonalInfoModal = (props: EditPersonalInfoModalProps) => {
  const { isLoading, personalData } = useGetPersonalData(props.patientId);
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const id = props.patientId;
    const { sameAddress, ...rest } = data;
    const obj = {
      id,
      ...rest,
    };

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Esta acción no se puede revertir',
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
          await modifyPatient(obj);
          refetch();
          Swal.fire({
            title: 'Actualizado!',
            text: 'Datos actualizados correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
          props.setOpen(false);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      genere: '',
    },
  });

  const defaultValues = {
    name: personalData?.nombre,
    lastName: personalData?.apellidoPaterno,
    secondLastName: personalData?.apellidoMaterno,
    phoneNumber: personalData?.telefono,
    genere: personalData?.genero ? personalData.genero : '',
    zipCode: personalData?.codigoPostal,
    personInChargeZipCode: personalData?.codigoPostalResponsable,
    neighborhood: personalData?.colonia,
    personInChargeNeighborhood: personalData?.coloniaResponsable,
    address: personalData?.direccion,
    personInChargeAddress: personalData?.domicilioResponsable,
    age: personalData?.edad.toString(),
    civilStatus: personalData?.estadoCivil,
    personInCharge: personalData?.nombreResponsable,
    occupation: personalData?.ocupacion,
    relationship: personalData?.parentesco,
    personInChargePhoneNumber: personalData?.telefonoResponsable,
  };

  const watchAddresPersonInCharge = watch('personInChargeAddress');
  const watchPersonInChargeZipCode = watch('personInChargeZipCode');
  const watchPersonInChargeNeighborhood = watch('personInChargeNeighborhood');

  const watchSameAddress = watch('sameAddress');
  const watchZipCode = watch('zipCode');
  const watchNeighborhood = watch('neighborhood');
  const watchAddress = watch('address');
  const watchGenere = watch('genere');

  useEffect(() => {
    if (!isLoading) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key as keyof typeof defaultValues, defaultValues[key as keyof typeof defaultValues] as string);
      });
    }
  }, [isLoading, setValue]);

  useEffect(() => {
    if (
      watchAddresPersonInCharge === watchAddress &&
      watchNeighborhood === watchPersonInChargeNeighborhood &&
      watchZipCode === watchPersonInChargeZipCode
    ) {
      setValue('sameAddress', true);
    }
  }, [
    watchAddress,
    watchZipCode,
    watchNeighborhood,
    watchPersonInChargeNeighborhood,
    watchPersonInChargeZipCode,
    watchAddresPersonInCharge,
  ]);

  if (!personalData)
    return (
      <Backdrop open>
        <CircularProgress size={15} />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={() => {}} title="Alta de Paciente" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            p: 3,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: 700,
            ...scrollBarStyle,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Paciente</Typography>
          <Divider sx={{ my: 1 }} />
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
              <Typography sx={TYPOGRAPHY_STYLE}>Edad</Typography>
              <TextField
                fullWidth
                placeholder="Edad..."
                {...register('age')}
                error={!!errors.age?.message}
                helperText={errors.age?.message}
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
            <Grid item xs={12} md={2}>
              <Typography sx={TYPOGRAPHY_STYLE}>Código Postal</Typography>
              <TextField
                fullWidth
                placeholder="Código Postal..."
                {...register('zipCode')}
                error={!!errors.zipCode?.message}
                helperText={errors.zipCode?.message}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography sx={TYPOGRAPHY_STYLE}>Colonia</Typography>
              <TextField
                fullWidth
                placeholder="Colonia..."
                {...register('neighborhood')}
                error={!!errors.neighborhood?.message}
                helperText={errors.neighborhood?.message}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
              <TextField
                fullWidth
                placeholder="Dirección..."
                {...register('address')}
                error={!!errors.address?.message}
                helperText={errors.address?.message}
              />
            </Grid>
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
    </Box>
  );
};
