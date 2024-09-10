import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IXRay } from '../../../../types/hospitalizationTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useXRayPaginationStore } from '../../../../store/hospitalization/xrayPagination';
import { createXRay, modifyXRay } from '../../../../services/hospitalization/xrayService';
import { xraySchema } from '../../../../schema/hospitalization/hospitalizationSchema';

const REQUEST_TYPES = [
  {
    value: 1,
    label: 'Laboratorio',
  },
  {
    value: 2,
    label: 'Radiografía',
  },
  {
    value: 3,
    label: 'Ultra sonido',
  },
  {
    value: 5,
    label: 'Electrocardiograma',
  },
  {
    value: 6,
    label: 'Cuidado Neonatal',
  },
];

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
  type: number;
  description: string;
  codigoContpaqi?: string;
  codigoSAT?: string;
}
export const AddAndEditXRay = (props: AddAndEditXRayProps) => {
  const { xray } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useXRayPaginationStore((state) => state.fetchData);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: xray?.id ?? '',
      description: xray?.descripcion ?? '',
      name: xray?.nombre ?? '',
      price: xray?.precio ?? 0,
      type: xray?.tipo ?? 0,
      codigoContpaqi: xray?.codigoContpaqi ?? '',
      codigoSAT: xray?.codigoSAT ?? '',
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
            tipo: data.type,
            codigoContpaqi: data.codigoContpaqi,
            codigoSAT: data.codigoSAT,
          })
        : await createXRay({
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
            tipo: data.type,
            codigoContpaqi: data.codigoContpaqi,
            codigoSAT: data.codigoSAT,
          });
      toast.success(`Solicitud ${xray ? 'modificado' : 'agregado'} correctamente`);
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error al ${xray ? 'modificar' : 'agregar'} la solicitud.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={props.xray ? 'Modificar la solicitud' : 'Agregar la solicitud'} />
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
              <Typography>Tipo de solicitud</Typography>
              <TextField
                label="Tipo..."
                select
                fullWidth
                value={watch('type')}
                onChange={(e) => setValue('type', parseInt(e.target.value))}
                error={!!errors.type?.message}
                helperText={errors.type?.message}
              >
                <MenuItem key={0} value={0} disabled>
                  Seleccionar
                </MenuItem>
                {REQUEST_TYPES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Descripción</Typography>
              <TextField label="Descripción..." multiline fullWidth {...register('description')} />
            </Grid>
            <Grid item xs={6}>
              <Typography>Código de Contpaqi</Typography>
              <TextField label="Escribe un codigo de Contpaqi" fullWidth {...register('codigoContpaqi')} />
            </Grid>
            <Grid item xs={6}>
              <Typography>Código de SAT</Typography>
              <TextField label="Escribe un codigo de SAT" fullWidth {...register('codigoSAT')} />
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
