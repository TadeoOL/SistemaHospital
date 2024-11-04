import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { roomSchema } from '../../../../schema/programming/programmingSchemas';
import { useEffect, useState } from 'react';
import { modifyRoom, registerRoom } from '../../../../services/programming/roomsService';
import { IRoom } from '../../../../types/types';
import { useRoomsPaginationStore } from '../../../../store/programming/roomsPagination';
import { useGetAllTypesRoom } from '../../../../hooks/programming/useGetAllTypesRoom';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 600, md: 700 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 800, sm: 900 },
};

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
      roomType: '',
      description: editData ? editData.descripcion : '',
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
        });
        toast.success('Espacio hospitalario dado de alta correctamente');
      } else {
        await modifyRoom({
          nombre: data.name,
          id_TipoCuarto: data.roomType,
          descripcion: data.description,
          id: editData.id,
        });
        toast.success('Espacio hospitalario modificado correctamente');
      }
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      editData
        ? toast.error('Error al modificar el espacio hospitalario')
        : toast.error('Error al intentar dar de alta el espacio hospitalario');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!editData) return;
    const roomType = data.find((d) => d.nombre === editData.tipoCuarto);
    setValue('roomType', roomType ? roomType.id_TipoCuarto : '');
  }, [editData]);

  if (isLoadingTypeRoom)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={editData ? 'Modificar espacio hospitalario' : 'Agregar espacio hospitalario'}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', bgcolor: 'background.paper', p: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>Nombre</Typography>
              <TextField
                placeholder="Escriba un nombre..."
                fullWidth
                error={!!errors.name?.message}
                helperText={errors.name?.message}
                {...register('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Categoría de espacio hospitalario</Typography>
              <TextField
                label="Selecciona una categoría de espacio hospitalario"
                fullWidth
                select
                error={!!errors.roomType?.message}
                helperText={errors.roomType?.message}
                {...register('roomType')}
                value={watchRoomType}
              >
                {data.map((roomType) => {
                  return (
                    <MenuItem value={roomType.id_TipoCuarto} key={roomType.id_TipoCuarto}>
                      {roomType.nombre}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Descripción</Typography>
              <TextField
                placeholder="Escriba una descripción..."
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
