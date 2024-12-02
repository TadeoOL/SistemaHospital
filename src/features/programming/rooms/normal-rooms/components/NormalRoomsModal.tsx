import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { ModalBasic } from '@/common/components';
import { useGetAllSurgeryRoomTypes } from '@/hooks/programming/useGetAllSurgeryRoomTypes';
import { useGetAllTypesRoom } from '@/hooks/programming/useGetAllTypesRoom';
import { roomSchema } from '@/schema/programming/programmingSchemas';
import { modifyRoom, registerRoom } from '@/services/programming/roomsService';
import { modifySurgeryRoom, registerSurgeryRoom } from '@/services/programming/surgeryRoom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface NormalRoomModalProps {
  open: boolean;
  onSuccess: Function;
  onClose: Function;
  defaultData?: any | null;
}

type Inputs = {
  name: string;
  roomType: string;
  description: string;
  type: number;
};

const isOperatingRoom = (roomType: any) => {
  return 'id_TipoQuirofano' in roomType;
};

const NormalRoomsModal = (props: NormalRoomModalProps) => {
  const { open, onClose, onSuccess, defaultData } = props;
  const { isLoadingTypeRoom, data: typeRoomTypes } = useGetAllTypesRoom();
  const { isLoadingSurgeryRoomType, data: surgeryRoomTypes } = useGetAllSurgeryRoomTypes();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    name: '',
    roomType: '',
    description: '',
    type: 1,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(roomSchema),
    defaultValues: defaultData || defaultValues,
  });

  useEffect(() => {
    if (!defaultData) return;
    setValue('name', defaultData.nombre);
    setValue('description', defaultData.descripcion);
  }, [defaultData]);

  const dataTypes = [...typeRoomTypes, ...surgeryRoomTypes];
  const watchRoomType = watch('roomType');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('data:', data);
    setIsLoading(true);
    try {
      // Encontrar el tipo de cuarto seleccionado
      const selectedRoomType = dataTypes.find(
        (type) => (type.id_TipoCuarto || type.id_TipoQuirofano) === data.roomType
      );

      const isQuirofano = isOperatingRoom(selectedRoomType);

      if (!defaultData) {
        if (isQuirofano) {
          await registerSurgeryRoom({
            nombre: data.name,
            id_TipoQuirofano: data.roomType,
            descripcion: data.description,
          });
        } else {
          await registerRoom({
            nombre: data.name,
            id_TipoCuarto: data.roomType,
            descripcion: data.description,
          });
        }
        toast.success('Espacio hospitalario dado de alta correctamente');
      } else {
        if (isQuirofano) {
          await modifySurgeryRoom({
            nombre: data.name,
            id_TipoQuirofano: data.roomType,
            descripcion: data.description,
            id: defaultData.id,
          });
        } else {
          await modifyRoom({
            nombre: data.name,
            id_TipoCuarto: data.roomType,
            descripcion: data.description,
            id: defaultData.id,
          });
        }
        toast.success('Espacio hospitalario modificado correctamente');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      defaultData
        ? toast.error('Error al modificar el espacio hospitalario')
        : toast.error('Error al intentar dar de alta el espacio hospitalario');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!defaultData) return;
    const roomType = dataTypes.find((d) => d.nombre === defaultData.tipoCuarto);
    setValue('roomType', roomType ? roomType.id_TipoCuarto : '');
  }, [defaultData]);

  useEffect(() => {
    if (!defaultData) return;
    setValue('type', defaultData.tipoCuarto === 'Quirofano' ? 2 : 1);
  }, [defaultData]);

  if (isLoadingTypeRoom || isLoadingSurgeryRoomType)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );

  const actions = (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', bgcolor: 'background.paper', p: 1 }}>
      <Button color="error" variant="outlined" disabled={isLoading}>
        Cancelar
      </Button>
      <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
        {isLoading ? <CircularProgress size={15} /> : defaultData ? 'Modificar' : 'Agregar'}
      </Button>
    </Box>
  );

  return (
    <ModalBasic
      isLoading={isLoading || isLoadingTypeRoom || isLoadingSurgeryRoomType}
      header={defaultData ? 'Modificar cuarto' : 'Agregar cuarto'}
      open={open}
      onClose={onClose}
      actions={actions}
    >
      <form noValidate>
        {JSON.stringify(watch())}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Nombre</Typography>
            <TextField
              placeholder="Escriba un nombre..."
              fullWidth
              value={watch('name')}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Categoría de espacio hospitalario</Typography>
            <TextField
              fullWidth
              select
              error={!!errors.roomType?.message}
              helperText={errors.roomType?.message}
              {...register('roomType')}
              value={watchRoomType}
            >
              {dataTypes.map((roomType) => {
                return (
                  <MenuItem
                    value={roomType.id_TipoCuarto || roomType.id_TipoQuirofano}
                    key={roomType.id_TipoCuarto || roomType.id_TipoQuirofano}
                  >
                    {roomType.nombre}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography>Descripción</Typography>
            <TextField
              value={watch('description')}
              placeholder="Escriba una descripción..."
              fullWidth
              multiline
              error={!!errors.description?.message}
              helperText={errors.description?.message}
              {...register('description')}
            />
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default NormalRoomsModal;
