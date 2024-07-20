import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clinicalDataSchema } from '../../../schema/programming/programmingSchemas';
import { toast } from 'react-toastify';
import { IClinicalData } from '../../../types/types';

const TYPOGRAPHY_STYLE = { fontSize: 11, fontWeight: 500 };
const BLOOD_TYPE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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

interface ClinicalDataFormProps {
  setOpen: Function;
}

export const ClinicalDataForm = (props: ClinicalDataFormProps) => {
  const step = useProgrammingRegisterStore((state) => state.step);
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const clinicalData = useProgrammingRegisterStore((state) => state.clinicalData);
  const roomValues = useProgrammingRegisterStore((state) => state.roomValues);
  const setClinicalData = useProgrammingRegisterStore((state) => state.setClinicalData);
  const { admissionDiagnosis, comments, reasonForAdmission, allergies, bloodType } = clinicalData;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IClinicalData>({
    resolver: zodResolver(clinicalDataSchema),
    defaultValues: {
      admissionDiagnosis,
      comments,
      reasonForAdmission,
      allergies,
      bloodType,
    },
  });
  const watchBloodType = watch('bloodType');

  const onSubmit: SubmitHandler<IClinicalData> = async (data) => {
    if (roomValues.length < 1) return toast.error('Debes seleccionar un cuarto para dar de alta al paciente');
    let startDate = roomValues[0].horaInicio;
    let endDate = roomValues[0].horaFin;

    for (let i = 1; i < roomValues.length; i++) {
      if (roomValues[i].horaInicio < startDate) {
        startDate = roomValues[i].horaInicio;
      }
      if (roomValues[i].horaFin > endDate) {
        endDate = roomValues[i].horaFin;
      }
    }
    setClinicalData({
      admissionDiagnosis: data.admissionDiagnosis,
      comments: data.comments,
      reasonForAdmission: data.reasonForAdmission,
      allergies: data.allergies,
      bloodType: data.bloodType,
    });
    toast.success('Datos registrados correctamente');
    setStep(step + 1);
  };

  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Datos Clínicos" />
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
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Datos Clínicos</Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography sx={TYPOGRAPHY_STYLE}>Motivo de ingreso</Typography>
              <TextField
                fullWidth
                placeholder="Motivo de ingreso..."
                {...register('reasonForAdmission')}
                error={!!errors.reasonForAdmission?.message}
                helperText={errors.reasonForAdmission?.message}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={TYPOGRAPHY_STYLE}>Diagnostico de ingreso</Typography>
              <TextField
                fullWidth
                placeholder="Diagnostico de ingreso..."
                {...register('admissionDiagnosis')}
                error={!!errors.admissionDiagnosis?.message}
                helperText={errors.admissionDiagnosis?.message}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={TYPOGRAPHY_STYLE}>Alergias</Typography>
              <TextField
                fullWidth
                placeholder="Alergias..."
                {...register('allergies')}
                error={!!errors.allergies?.message}
                helperText={errors.allergies?.message}
              />
            </Grid>
            <Grid item xs={12} md={12}>
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
            <Grid item xs={12} md={12}>
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
          <Button variant="contained" onClick={() => setStep(step - 1)}>
            Regresar
          </Button>
          <Button type="submit" variant="contained">
            Siguiente
          </Button>
        </Box>
      </form>
    </>
  );
};
