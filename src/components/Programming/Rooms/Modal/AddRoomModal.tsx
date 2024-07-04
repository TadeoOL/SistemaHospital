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
import { isValidFloat } from '../../../../utils/functions/dataUtils';
import { useGetAllTypesRoom } from '../../../../hooks/programming/useGetAllTypesRoom';
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
  roomType: string;
  description: string;
  price: string;
};

interface AddRoomModalProps {
  setOpen: Function;
  editData?: IRoom;
}
export const AddRoomModal = (props: AddRoomModalProps) => {
  const { editData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useRoomsPaginationStore((state) => state.fetchData);
  const { isLoadingTypeRoom, data } = useGetAllTypesRoom();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: editData ? editData.nombre : '',
      roomType: editData ? editData.tipoCuarto : '',
      description: editData ? editData.descripcion : '',
      price: editData ? editData.precio.toString() : '',
    },
  });

  const watchRoomType = watch('roomType');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!editData) {
        await registerRoom({
          nombre: data.name,
          id_TipoCuarto: data.roomType,
          descripcion: data.description,
          precio: parseFloat(data.price),
        });
        toast.success('Cuarto dado de alta correctamente');
      } else {
        await modifyRoom({
          nombre: data.name,
          id_TipoCuarto: data.roomType,
          descripcion: data.description,
          id: editData.id,
          precio: parseFloat(data.price),
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

  if (isLoadingTypeRoom)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
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
                {data.map((roomType) => {
                  return (
                    <MenuItem value={roomType.id} key={roomType.id}>
                      {roomType.nombre}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Precio del cuarto</Typography>
              <TextField
                label="Precio"
                fullWidth
                error={!!errors.price?.message}
                helperText={errors.price?.message}
                value={watch('price')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isValidFloat(value)) return;
                  if (value === '.') {
                    setValue('price', '');
                    return;
                  }
                  setValue('price', value);
                }}
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
