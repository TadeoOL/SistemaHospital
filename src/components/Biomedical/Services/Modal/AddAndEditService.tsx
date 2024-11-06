import { Box, Button, CircularProgress, Grid, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IXRay } from '../../../../types/hospitalizationTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useXRayPaginationStore } from '../../../../store/hospitalization/xrayPagination';
import { xraySchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import {
  createHospitalService,
  modifyHospitalService,
} from '../../../../services/hospitalServices/hospitalServicesService';
import { ServiceType } from '../../../../types/hospitalServices/hospitalServiceTypes';
//import { useGetSizeUnit } from '../../../../hooks/contpaqi/useGetSizeUnit';

const REQUEST_TYPES = [
  {
    value: ServiceType.Laboratorio,
    label: 'Laboratorio',
  },
  {
    value: ServiceType.Radiografia,
    label: 'Radiografía',
  },
  {
    value: ServiceType.Ultrasonido,
    label: 'Ultra sonido',
  },
  {
    value: ServiceType.Electrocardiograma,
    label: 'Electrocardiograma',
  },
  {
    value: ServiceType.Cuidado_Neonatal,
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
  autorization: boolean;
  //codigoSAT?: string;
  //codigoUnidadMedida?: number;
}
export const AddAndEditXRay = (props: AddAndEditXRayProps) => {
  const { xray } = props;
  const [isLoading, setIsLoading] = useState(false);
  //const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const refetch = useXRayPaginationStore((state) => state.fetchData);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: xray?.id_Servicio ?? '',
      description: xray?.descripcion ?? '',
      name: xray?.nombre ?? '',
      price: xray?.precio ?? 0,
      type: xray?.tipo ?? 0,
      autorization: xray?.requiereAutorizacion ?? false,
      //codigoSAT: xray?.codigoSAT ?? '',
      //codigoUnidadMedida: xray?.codigoUnidadMedida ?? 0,
    },
    resolver: zodResolver(xraySchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      xray
        ? await modifyHospitalService({
            id: data.id as string,
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
            tipoServicio: data.type,
            requiereAutorizacion: data.autorization,
            //codigoSAT: data.codigoSAT,
            //codigoUnidadMedida: data.codigoUnidadMedida,
          })
        : await createHospitalService({
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
            tipoServicio: data.type,
            requiereAutorizacion: data.autorization,
            //codigoSAT: data.codigoSAT,
            //codigoUnidadMedida: data.codigoUnidadMedida,
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
            <Grid item xs={6}>
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
            <Grid item xs={6} display="flex" alignItems="center">
              <Typography>Requiere Autorización</Typography>
              <Switch
                {...register('autorization')}
                checked={watch('autorization')}
                onChange={(e) => setValue('autorization', e.target.checked)}
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
            {/*isLoadingConcepts ? (
                  <MenuItem>Cargando...</MenuItem>
                ) : (
                  sizeUnit?.map((item) => (
                    <MenuItem key={item.id_UnidadMedida} value={item.id_UnidadMedida}>
                      {item.nombre}
                    </MenuItem>
                  ))
                )*/}
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
