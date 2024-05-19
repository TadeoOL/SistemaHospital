import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useHospitalizationRegisterStore } from '../../../store/hospitalization/hospitalizationRegister';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clinicalDataSchema } from '../../../schema/programming/programmingSchemas';
import { toast } from 'react-toastify';

const TYPOGRAPHY_STYLE = { fontSize: 11, fontWeight: 500 };

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
  medicName: string;
  specialty: string;
  reasonForAdmission: string;
  admissionDiagnosis: string;
  procedure: string;
  comments: string;
};

interface ClinicalDataFormProps {
  setOpen: Function;
}

export const ClinicalDataForm = (props: ClinicalDataFormProps) => {
  const step = useHospitalizationRegisterStore((state) => state.step);
  const setStep = useHospitalizationRegisterStore((state) => state.setStep);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(clinicalDataSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      toast.success('Paciente dado de alta correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HeaderModal setOpen={() => {}} title="Datos Clínicos" />
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
            <Grid item xs={12} md={7}>
              <Typography sx={TYPOGRAPHY_STYLE}>Medico tratante</Typography>
              <TextField
                fullWidth
                placeholder="Medico tratante..."
                {...register('medicName')}
                error={!!errors.medicName?.message}
                helperText={errors.medicName?.message}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography sx={TYPOGRAPHY_STYLE}>Especialidad</Typography>
              <TextField
                fullWidth
                placeholder="Especialidad..."
                {...register('specialty')}
                error={!!errors.specialty?.message}
                helperText={errors.specialty?.message}
              />
            </Grid>
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
              <Typography sx={TYPOGRAPHY_STYLE}>Procedimiento</Typography>
              <TextField
                fullWidth
                placeholder="Procedimiento..."
                {...register('procedure')}
                error={!!errors.procedure?.message}
                helperText={errors.procedure?.message}
              />
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
            Registrar Paciente
          </Button>
        </Box>
      </form>
    </>
  );
};
