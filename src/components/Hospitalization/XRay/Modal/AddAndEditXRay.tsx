import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IXRay } from '../../../../types/hospitalizationTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useXRayPaginationStore } from '../../../../store/hospitalization/xrayPagination';
import { createXRay, modifyXRay } from '../../../../services/hospitalization/xrayService';
import { xraySchema } from '../../../../schema/hospitalization/hospitalizationSchema';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
interface AddAndEditXRayProps {
  setOpen: Function;
  xray?: IXRay;
}

interface Inputs {
  id?: string;
  name: string;
  price: number;
  description: string;
}
export const AddAndEditXRay = (props: AddAndEditXRayProps) => {
  const { xray } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useXRayPaginationStore((state) => state.fetchData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: xray?.id ?? '',
      description: xray?.descripcion ?? '',
      name: xray?.nombre ?? '',
      price: xray?.precio ?? 0,
    },
    resolver: zodResolver(xraySchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      xray
        ? await modifyXRay({
            id: data.id as string,
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
          })
        : await createXRay({
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
          });
      toast.success(`Radiografía ${xray ? 'modificado' : 'agregado'} correctamente`);
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error al ${xray ? 'modificar' : 'agregar'} el radiografía.`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={props.xray ? 'Modificar radiografía' : 'Agregar radiografía'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ bgcolor: 'background.paper', p: 2, display: 'flex' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Nombre</Typography>
              <TextField
                label="Nombre..."
                fullWidth
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Precio</Typography>
              <TextField
                label="Precio..."
                type="number"
                fullWidth
                {...register('price')}
                error={!!errors.price?.message}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Descripción</Typography>
              <TextField label="Descripción..." multiline fullWidth {...register('description')} />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            p: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button variant="outlined" color="error">
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={25} /> : 'Aceptar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};