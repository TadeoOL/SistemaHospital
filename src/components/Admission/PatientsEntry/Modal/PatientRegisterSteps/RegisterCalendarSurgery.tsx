import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { useGetHospitalizationAppointments } from '../../../../../hooks/admission/useGetHospitalizationAppointments';
import { useEffect, useState } from 'react';
import { CalendarSurgeryPatientRegisterComponent } from './Calendar/CalendarSurgeryPatientRegisterComponent';
import { toast } from 'react-toastify';
import { useGetAllOperatingRooms } from '../../../../../hooks/operatingRoom/useGetAllOperatingRoom';

interface RegisterCalendarHospitalizationProps {
  setOpen: Function;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 900 },
};

export const RegisterCalendarSurgery = ({ setOpen }: RegisterCalendarHospitalizationProps) => {
  const { data, isLoading } = useGetAllOperatingRooms();
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const surgeryEvents = usePatientEntryRegisterStepsStore((state) => state.surgeryEvents);
  const originalSurgeryEvents = usePatientEntryRegisterStepsStore((state) => state.originalSurgeryEvents);
  const setSurgeryEvents = usePatientEntryRegisterStepsStore((state) => state.setSurgeryEvents);
  const setOriginalSurgeryEvents = usePatientEntryRegisterStepsStore((state) => state.setOriginalSurgeryEvents);
  const roomsRegistered = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);
  const [day, setDay] = useState(new Date());
  const [surgeryRoomSelected, setSurgeryRoomSelected] = useState('0');
  useGetHospitalizationAppointments(
    day,
    setSurgeryEvents,
    surgeryEvents,
    1,
    originalSurgeryEvents,
    setOriginalSurgeryEvents
  );

  const handleNextStep = () => {
    if (roomsRegistered.length < 1 || !roomsRegistered.some((r) => r.tipoCuarto == 1))
      return toast.warning('Es necesario seleccionar un quirófano');
    setStep(step + 1);
  };

  const handleChangeRoomSelected = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSurgeryRoomSelected(e.target.value);
  };

  useEffect(() => {
    if (surgeryRoomSelected === '0') {
      setSurgeryEvents(originalSurgeryEvents);
    } else {
      const filteredEvents = originalSurgeryEvents.filter((e) => e.roomId === surgeryRoomSelected);
      const cleaningRooms = originalSurgeryEvents.filter((e) => filteredEvents.some((fe) => fe.id === e.roomId));
      setSurgeryEvents([...filteredEvents, ...cleaningRooms]);
    }
  }, [surgeryRoomSelected, originalSurgeryEvents]);

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Seleccionar Quirófano" />
      <Box sx={{ bgcolor: 'background.paper', p: 1, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h3" color={'CaptionText'}>
            Selección de Quirófano
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end', marginBottom: 4 } }}>
          <TextField
            select
            label="Quirófanos"
            sx={{ width: { xs: '50%', sm: '30%', md: '23%', lg: '18%' } }}
            onChange={handleChangeRoomSelected}
          >
            {isLoading ? (
              <MenuItem>
                <tr>Cargando...</tr>
              </MenuItem>
            ) : (
              data.map((or) => (
                <MenuItem key={or.id} value={or.id}>
                  {or.nombre}
                </MenuItem>
              ))
            )}
            <MenuItem key={'0'} value={'0'}>
              Todos
            </MenuItem>
          </TextField>
        </Box>
        <CalendarSurgeryPatientRegisterComponent day={day} setDay={setDay} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          bgcolor: 'background.paper',
        }}
      >
        <Button color="error" variant="outlined" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};
