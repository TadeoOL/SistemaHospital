import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { roomSchema } from '../../../../schema/programming/programmingSchemas';
import { useState } from 'react';
import { modifyRoom, registerRoom } from '../../../../services/programming/roomsService';
import { IRoom } from '../../../../types/types';
import { useRoomsPaginationStore } from '../../../../store/programming/roomsPagination';
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

const ROOM_TYPES = ['Hospitalización', 'Quirófano'];

type Inputs = {
  name: string;
  roomType: string;
  description: string;
};

interface AddRoomModalProps {
  setOpen: Function;
  editData?: IRoom;
}
export const AddRoomModal = (props: AddRoomModalProps) => {
  const { editData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useRoomsPaginationStore((state) => state.fetchData);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: editData ? editData.nombre : '',
      roomType: editData ? editData.tipoCuarto : '',
      description: editData ? editData.descripcion : '',
    },
  });

  const watchRoomType = watch('roomType');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!editData) {
        await registerRoom({ nombre: data.name, tipoCuarto: data.roomType, descripcion: data.description });
        toast.success('Cuarto dado de alta correctamente');
      } else {
        await modifyRoom({
          nombre: data.name,
          tipoCuarto: data.roomType,
          descripcion: data.description,
          id: editData.id,
        });
        toast.success('Cuarto modificado correctamente');
      }
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      editData ? toast.error('Error al modificar el cuarto') : toast.error('Error al intentar dar de alta el cuarto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={editData ? 'Modificar cuarto' : 'Agregar cuarto'} />
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
            <Grid item xs={12}>
              <Typography>Tipo de cuarto</Typography>
              <TextField
                label="Selecciona un tipo de cuarto"
                fullWidth
                select
                error={!!errors.roomType?.message}
                helperText={errors.roomType?.message}
                {...register('roomType')}
                value={watchRoomType}
              >
                {ROOM_TYPES.map((roomType) => {
                  return (
                    <MenuItem value={roomType} key={roomType}>
                      {roomType}
                    </MenuItem>
                  );
                })}
              </TextField>
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
          <Button color="error" variant="outlined" disabled={isLoading}>
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
