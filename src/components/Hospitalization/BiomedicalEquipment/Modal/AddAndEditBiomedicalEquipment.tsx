import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IBiomedicalEquipment } from '../../../../types/hospitalizationTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { biomedicalEquipmentSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import { toast } from 'react-toastify';
import {
  createBiomedicalEquipment,
  modifyBiomedicalEquipment,
} from '../../../../services/hospitalization/biomedicalEquipmentService';
import { useState } from 'react';
import { useBiomedicalEquipmentPaginationStore } from '../../../../store/hospitalization/biomedicalEquipmentPagination';

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
interface AddAndEditBiomedicalEquipmentProps {
  setOpen: Function;
  biomedicalEquipment?: IBiomedicalEquipment;
}

interface Inputs {
  id?: string;
  name: string;
  price: number;
  description: string;
  codigoContpaqi?: string;
  codigoSAT?: string;
}
export const AddAndEditBiomedicalEquipment = (props: AddAndEditBiomedicalEquipmentProps) => {
  const { biomedicalEquipment } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useBiomedicalEquipmentPaginationStore((state) => state.fetchData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: biomedicalEquipment?.id ?? '',
      description: biomedicalEquipment?.descripcion ?? '',
      name: biomedicalEquipment?.nombre ?? '',
      price: biomedicalEquipment?.precio ?? 0,
      codigoContpaqi: biomedicalEquipment?.codigoContpaqi ?? '',
      codigoSAT: biomedicalEquipment?.codigoSAT ?? '',
    },
    resolver: zodResolver(biomedicalEquipmentSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      biomedicalEquipment
        ? await modifyBiomedicalEquipment({
            id: data.id as string,
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
            codigoContpaqi: data.codigoContpaqi,
            codigoSAT: data.codigoSAT,
          })
        : await createBiomedicalEquipment({
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
            codigoContpaqi: data.codigoContpaqi,
            codigoSAT: data.codigoSAT,
          });
      toast.success(`Equipo biomédico ${biomedicalEquipment ? 'modificado' : 'agregado'} correctamente`);
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error al ${biomedicalEquipment ? 'modificar' : 'agregar'} el equipo biomédico.`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={props.biomedicalEquipment ? 'Modificar equipo biomédico' : 'Agregar equipo biomédico'}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ bgcolor: 'background.paper', p: 2, display: 'flex' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Nombre</Typography>
              <TextField
                label="Nombre del equipo..."
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
