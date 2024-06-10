import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clinicalDataSchema } from '../../../schema/programming/programmingSchemas';
import { toast } from 'react-toastify';
import { IClinicalData } from '../../../types/types';
import { useEffect } from 'react';
import { createPatient } from '../../../services/programming/patientService';
import { createAdmission } from '../../../services/programming/admissionRegisterService';
import { createClinicalHistory } from '../../../services/programming/clinicalHistoryService';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';

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
  const patient = useProgrammingRegisterStore((state) => state.patient);
  const roomValues = useProgrammingRegisterStore((state) => state.roomValues);
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);
  const procedures = useProgrammingRegisterStore((state) => state.procedures);
  const setClinicalData = useProgrammingRegisterStore((state) => state.setClinicalData);
  const { admissionDiagnosis, comments, medicName, reasonForAdmission, specialty, allergies, bloodType } = clinicalData;

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
      medicName,
      reasonForAdmission,
      specialty,
      allergies,
      bloodType,
    },
  });
  const watchAdmissionDiagnosis = watch('admissionDiagnosis');
  const watchComments = watch('comments');
  const watchMedicName = watch('medicName');
  const watchAllergies = watch('allergies');
  const watchBloodType = watch('bloodType');
  const watchReasonForAdmission = watch('reasonForAdmission');
  const watchSpecialty = watch('specialty');

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
    try {
      const patientRes = await createPatient(patient);
      const registerClinicalHistoryObj = {
        Id_Paciente: patientRes.id,
        MedicoTratante: data.medicName,
        Especialidad: data.specialty,
        MotivoIngreso: data.reasonForAdmission,
        DiagnosticoIngreso: data.admissionDiagnosis,
        Comentarios: data.comments,
        Alergias: data.allergies,
        TipoSangre: data.bloodType,
      };
      const clinicalDataRes = await createClinicalHistory(registerClinicalHistoryObj);
      const registerAdmissionObj = {
        pacienteId: patientRes.id,
        historialClinicoId: clinicalDataRes.id,
        procedimientos: procedures,
        fechaInicio: startDate,
        fechaFin: endDate,
        cuartos: roomValues.map((r) => {
          return {
            cuartoId: r.id,
            horaInicio: r.horaInicio,
            horaFin: r.horaFin,
            tipoCuarto: r.tipoCuarto,
          };
        }),
      };
      console;
      await createAdmission(registerAdmissionObj);
      refetch();
      toast.success('Paciente dado de alta correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al dar de alta al paciente');
    }
  };

  useEffect(() => {
    setClinicalData({
      admissionDiagnosis: watchAdmissionDiagnosis,
      comments: watchComments,
      medicName: watchMedicName,
      reasonForAdmission: watchReasonForAdmission,
      specialty: watchSpecialty,
      allergies: watchAllergies,
      bloodType: watchBloodType,
    });
  }, [
    watchAdmissionDiagnosis,
    watchComments,
    watchMedicName,
    watchReasonForAdmission,
    watchSpecialty,
    watchAllergies,
    watchBloodType,
  ]);

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
            Registrar Paciente
          </Button>
        </Box>
      </form>
    </>
  );
};
