import { Close } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IRegisterRoom } from '../../../../../types/types';
import { getRegisterRoomsByRegisterId } from '../../../../../services/programming/admissionRegisterService';
import dayjs from 'dayjs';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650, md: 900 },
};

interface SelectRoomToEditProps {
  setOpen: Function;
  registerId: string;
  setValue: Function;
  setRegisterRoomId: Function;
}
const useGetRooms = (registerId: string) => {
  const [rooms, setRooms] = useState<IRegisterRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getRooms = async () => {
      setIsLoading(true);
      try {
        const res = await getRegisterRoomsByRegisterId(registerId);
        setRooms(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getRooms();
  }, []);

  return { rooms, isLoading };
};

export const SelectRoomToEdit = (props: SelectRoomToEditProps) => {
  const { setOpen, registerId } = props;
  const { rooms, isLoading } = useGetRooms(registerId);

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <Box
        sx={{ bgcolor: 'background.paper', display: 'flex', alignItems: 'end', justifyContent: 'space-between', p: 1 }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Selecciona un cuarto para editar</Typography>
        <IconButton onClick={() => setOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', display: 'flex', p: 3 }}>
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', rowGap: 2 }}>
          {rooms.map((room) => (
            <Box
              key={room.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2.5,
                boxShadow: '2px 2px 2px 3px rgba(0,0,0,.1)',
                borderRadius: 5,
                transition: '0.15s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(238, 238, 238,0.5)',
                  transition: '0.15s ease-in-out',
                  transform: 'scale(1.03) ',
                  boxShadow: '2px 2px 3px 5px rgba(0,0,0,.1)',
                },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{room.nombre}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{room.tipoCuarto}</Typography>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mr: 0.5 }}>
                  {dayjs(room.horaInicio).format('DD/MM/YYYY - HH:mm')} al
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                  {dayjs(room.horaFin).format('DD/MM/YYYY - HH:mm')}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1 }}>
        <Button variant="contained" onClick={() => props.setValue(0)}>
          Regresar
        </Button>
      </Box>
    </Box>
  );
};
