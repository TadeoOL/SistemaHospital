import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { surgeryProcedureSchema } from '../../../../schema/programming/programmingSchemas';
import { useState } from 'react';
import { ISurgeryProcedure } from '../../../../types/types';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  modifySurgeryProcedure,
  registerSurgeryProcedure,
} from '../../../../services/programming/surgeryProcedureService';
import { useSurgeryProcedurePaginationStore } from '../../../../store/programming/surgeryProcedurePagination';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { md: 450 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

type Inputs = {
  name: string;
  surgeryDuration: string;
  hospitalizationDuration: string;
  description: string;
};

interface AddSurgeryProcedureModalProps {
  setOpen: Function;
  editData?: ISurgeryProcedure;
}
export const AddSurgeryProcedureModal = (props: AddSurgeryProcedureModalProps) => {
  const { editData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useSurgeryProcedurePaginationStore((state) => state.fetchData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(surgeryProcedureSchema),
    defaultValues: {
      name: editData ? editData.nombre : '',
      surgeryDuration: editData ? editData.duracionCirujia : '',
      hospitalizationDuration: editData ? editData.duracionHospitalizacion : '',
      description: editData ? editData.descripcion : '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!editData) {
        await registerSurgeryProcedure({
          nombre: data.name,
          duracionCirujia: data.surgeryDuration,
          duracionHospitalizacion: data.hospitalizationDuration,
          descripcion: data.description,
        });
        toast.success('Procedimiento dado de alta correctamente');
      } else {
        await modifySurgeryProcedure({
          nombre: data.name,
          duracionCirujia: data.surgeryDuration,
          duracionHospitalizacion: data.hospitalizationDuration,
          descripcion: data.description,
          id: editData.id,
        });
        toast.success('Procedimiento modificado correctamente');
      }
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      editData
        ? toast.error('Error al modificar el procedimiento')
        : toast.error('Error al intentar dar de alta el procedimiento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={editData ? 'Modificar procedimiento' : 'Agregar un procedimiento'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', bgcolor: 'background.paper', p: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>Nombre</Typography>
              <TextField
                placeholder="Escribe un nombre..."
                fullWidth
                error={!!errors.name?.message}
                helperText={errors.name?.message}
                {...register('name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Duración de hospitalización</Typography>
              <Controller
                control={control}
                name="hospitalizationDuration"
                defaultValue={editData ? editData.duracionHospitalizacion : ''}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Duración de hospitalización"
                      onChange={(newValue) => onChange(newValue ? newValue.format('HH:mm:ss') : '')}
                      value={value ? dayjs(value, 'HH:mm:ss') : null}
                      ampm={false}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Duración de crujía</Typography>
              <Controller
                control={control}
                name="surgeryDuration"
                defaultValue={editData ? editData.duracionCirujia : ''}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Duración de cirugía"
                      onChange={(newValue) => onChange(newValue ? newValue.format('HH:mm:ss') : '')}
                      value={value ? dayjs(value, 'HH:mm:ss') : null}
                      ampm={false}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Descripción</Typography>
              <TextField
                placeholder="Escribe una descripción..."
                fullWidth
                multiline
                error={!!errors.description?.message}
                helperText={errors.description?.message}
                {...register('description')}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', bgcolor: 'background.paper', p: 1 }}>
          <Button color="error" variant="outlined" disabled={isLoading} onClick={() => props.setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={15} /> : editData ? 'Modificar' : 'Agregar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
