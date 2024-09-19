import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
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
import 'dayjs/locale/es-mx';
import { useGetSizeUnit } from '../../../../hooks/contpaqi/useGetSizeUnit';
dayjs.locale('es-mx');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 600, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 800 },
};

type Inputs = {
  name: string;
  surgeryDuration: string;
  hospitalizationDuration: string;
  description: string;
  price: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
};

interface AddSurgeryProcedureModalProps {
  setOpen: Function;
  editData?: ISurgeryProcedure;
}
export const AddSurgeryProcedureModal = (props: AddSurgeryProcedureModalProps) => {
  const { editData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const refetch = useSurgeryProcedurePaginationStore((state) => state.fetchData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(surgeryProcedureSchema),
    defaultValues: {
      name: editData ? editData.nombre : '',
      surgeryDuration: editData ? editData.duracionCirujia : '',
      hospitalizationDuration: editData ? editData.duracionHospitalizacion.toString() : '',
      description: editData ? editData.descripcion : '',
      price: editData ? editData.precioCirujia.toString() : '',
      codigoSAT: editData?.codigoSAT ?? '',
      codigoUnidadMedida: editData?.codigoUnidadMedida ?? 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!editData) {
        await registerSurgeryProcedure({
          nombre: data.name,
          duracionCirujia: data.surgeryDuration,
          duracionHospitalizacion: parseInt(data.hospitalizationDuration),
          descripcion: data.description,
          precioCirujia: parseFloat(data.price),
          codigoSAT: data.codigoSAT,
          codigoUnidadMedida: data.codigoUnidadMedida,
        });
        toast.success('Procedimiento dado de alta correctamente');
      } else {
        await modifySurgeryProcedure({
          nombre: data.name,
          duracionCirujia: data.surgeryDuration,
          duracionHospitalizacion: parseInt(data.hospitalizationDuration),
          descripcion: data.description,
          precioCirujia: parseFloat(data.price),
          id: editData.id,
          codigoSAT: data.codigoSAT,
          codigoUnidadMedida: data.codigoUnidadMedida,
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

  const onError = (errors: any) => {
    console.log(errors);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={editData ? 'Modificar procedimiento' : 'Agregar un procedimiento'} />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                defaultValue={editData ? editData.duracionHospitalizacion.toString() : ''}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    placeholder="Duracion Hospitalizacion"
                    value={value}
                    type={'number'}
                    onChange={onChange}
                    error={!!errors.hospitalizationDuration?.message}
                    helperText={errors.hospitalizationDuration?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Duración de Cirugía</Typography>
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
                      slotProps={{
                        textField: {
                          error: !!errors.surgeryDuration?.message,
                          helperText: errors.surgeryDuration?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Precio de la Cirugía</Typography>
              <Controller
                control={control}
                name="price"
                defaultValue={editData ? editData.precioCirujia.toString() : ''}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    placeholder="Precio Cirugía"
                    value={value}
                    type={'number'}
                    onChange={onChange}
                    error={!!errors.price?.message}
                    helperText={errors.price?.message}
                  />
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
            <Grid item xs={6}>
              <Typography>Código de SAT</Typography>
              <TextField
                placeholder="Escriba un codigo de SAT"
                fullWidth
                error={!!errors.codigoSAT?.message}
                helperText={errors.codigoSAT?.message}
                {...register('codigoSAT')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Código de Unidad de Medida</Typography>
              <TextField
                label="Selecciona una unidad de medida"
                fullWidth
                error={!!errors.codigoUnidadMedida?.message}
                helperText={errors.codigoUnidadMedida?.message}
                {...register('codigoUnidadMedida')}
                value={watch('codigoUnidadMedida')}
                select
              >
                {isLoadingConcepts ? (
                  <MenuItem>Cargando...</MenuItem>
                ) : (
                  sizeUnit.map((item) => (
                    <MenuItem value={item.id_UnidadMedida} key={item.id_UnidadMedida}>
                      {item.nombre}
                    </MenuItem>
                  ))
                )}
              </TextField>
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
