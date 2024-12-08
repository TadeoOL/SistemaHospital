import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { surgeryProcedureSchema } from '../../../../schema/programming/programmingSchemas';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  modifySurgeryProcedure,
  registerSurgeryProcedure,
} from '../../../../services/operatingRoom/surgeryProcedureService';
import { useSurgeryProcedurePaginationStore } from '../../../../store/programming/surgeryProcedurePagination';
import 'dayjs/locale/es-mx';
import { ISurgery } from '../../../../types/operatingRoom/suergeryProcedureTypes';
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
  description: string;
  price: number;
};

interface AddSurgeryProcedureModalProps {
  setOpen: Function;
  editData?: ISurgery;
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
      description: editData ? editData.descripcion : '',
      price: editData ? editData.precio : 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!editData) {
        await registerSurgeryProcedure({
          nombre: data.name,
          descripcion: data.description,
          precio: data.price,
        });
        toast.success('Procedimiento dado de alta correctamente');
      } else {
        await modifySurgeryProcedure({
          nombre: data.name,
          descripcion: data.description,
          precio: data.price,
          id: editData.id_Cirugia,
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
            <Grid item xs={12}>
              <Typography>Precio de la Cirugía</Typography>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    placeholder="Precio Cirugía"
                    value={value}
                    type="number"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      onChange(val);
                    }}
                    error={!!errors.price?.message}
                    helperText={errors.price?.message}
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                        step: 0.01,
                      },
                    }}
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
