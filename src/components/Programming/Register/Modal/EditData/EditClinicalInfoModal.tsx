import { Backdrop, Box, Button, CircularProgress, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { IClinicalData } from '../../../../../types/types';
import { clinicalDataModifySchema } from '../../../../../schema/programming/programmingSchemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  editClinicalHistory,
  getClinicalHistoryById,
} from '../../../../../services/programming/clinicalHistoryService';
import { HistorialClinico } from '../../../../../types/admissionTypes';
import Swal from 'sweetalert2';
import { usePatientRegisterPaginationStore } from '../../../../../store/programming/patientRegisterPagination';
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
  maxHeight: { xs: 650, md: 900 },
};

const useGetClinicalData = (clinicalHistoryId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clinicalData, setClinicalData] = useState<HistorialClinico>();

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await getClinicalHistoryById(clinicalHistoryId);
        setClinicalData(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);
  return {
    clinicalData,
    isLoading,
  };
};

interface EditClinicalInfoModalProps {
  clinicalDataId: string;
  setOpen: Function;
}

export const EditClinicalInfoModal = (props: EditClinicalInfoModalProps) => {
  const { clinicalData, isLoading } = useGetClinicalData(props.clinicalDataId);
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IClinicalData>({
    resolver: zodResolver(clinicalDataModifySchema),
    defaultValues: {
      bloodType: '',
    },
  });

  useEffect(() => {
    if (!clinicalData) return;
    setValue('admissionDiagnosis', clinicalData.diagnosticoIngreso);
    setValue('comments', clinicalData.comentarios);
    setValue('reasonForAdmission', clinicalData.motivoIngreso);
    setValue('bloodType', clinicalData.tipoSangre);
    setValue('allergies', clinicalData.alergias);
  }, [isLoading, clinicalData]);

  const watchBloodType = watch('bloodType');

  const onSubmit: SubmitHandler<IClinicalData> = async (data) => {
    const id = props.clinicalDataId;
    const objModified = {
      id,
      diagnosticoIngreso: data.admissionDiagnosis,
      comentarios: data.comments,
      motivoIngreso: data.reasonForAdmission,
      alergias: data.allergies,
      tipoSangre: data.bloodType,
    };
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Estas a punto de modificar los datos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await editClinicalHistory(objModified);
          refetch();
          Swal.fire({
            title: 'Actualizado!',
            text: 'Historial clínico actualizado',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
          props.setOpen(false);
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error!',
            text: `No se pudo actualizar el historial clínico`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    });
  };
  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Datos Clínicos" />
      <form onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            p: 3,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: { xs: 500, md: 700 },
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
