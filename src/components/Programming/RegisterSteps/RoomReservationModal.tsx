import { Box, Button, Chip, FormHelperText, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { Cancel } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RoomReservationTable } from './RoomReservationTable';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { zodResolver } from '@hookform/resolvers/zod';
import { addRoomReservation } from '../../../schema/programming/programmingSchemas';
dayjs.extend(localizedFormat);

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
  maxHeight: { xs: 900 },
};

interface RoomsInput {
  room: string;
  startTime: Dayjs;
  endDate: Dayjs;
}

interface Inputs {
  rooms: RoomsInput[];
  proceduresId: string[];
}

export const RoomReservationModal = () => {
  const {
    control: controlRooms,
    register: registerRooms,
    handleSubmit: handleSubmitRooms,
    formState: { errors: errorsRooms },
  } = useForm<RoomsInput>({
    resolver: zodResolver(addRoomReservation),
    defaultValues: {
      startTime: dayjs(),
      endDate: dayjs().add(1, 'day'),
    },
  });

  const onSubmitRooms: SubmitHandler<RoomsInput> = async (data) => {
    const startTime = data.startTime.toDate();
    const endDate = data.endDate.toDate();
    const room = data.room;
    const obj = {
      startTime,
      endDate,
      room,
    };
    console.log({ obj });
  };

  const {
    register: registerProcedures,
    handleSubmit: handleSubmitProcedures,
    formState: { errors: errorsProcedures },
  } = useForm<Inputs>();

  const onSubmitProcedures: SubmitHandler<Inputs> = async (data) => {
    console.log('Procedures Data:', data);
    // Aquí puedes manejar el envío del formulario Inputs
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={() => {}} title="Seleccione un horario" />

      <form onSubmit={handleSubmitProcedures(onSubmitProcedures)}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            bgcolor: 'background.paper',
            p: 3,
            rowGap: 4,
          }}
        >
          <Box>
            <Typography>Seleccione los procedimientos:</Typography>
            <TextField
              select
              SelectProps={{
                multiple: true,
                renderValue: (selected: any) => {
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected &&
                        selected.map((value: string) => (
                          <Chip
                            key={value}
                            label={value}
                            style={{ margin: 2 }}
                            onDelete={() => {}}
                            deleteIcon={<Cancel onMouseDown={(event) => event.stopPropagation()} />}
                          />
                        ))}
                    </div>
                  );
                },
              }}
              label="Procedimientos"
              fullWidth
              value={[]}
              {...registerProcedures('proceduresId')}
            >
              {/* Renderiza los MenuItem dinámicamente */}
              {<MenuItem value="procedimiento1">Procedimiento 1</MenuItem>}
              {<MenuItem value="procedimiento2">Procedimiento 2</MenuItem>}
            </TextField>
          </Box>

          <form onSubmit={handleSubmitRooms(onSubmitRooms)}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={4}>
                <Typography>Habitaciones disponibles</Typography>
                <TextField select label="Habitaciones" fullWidth {...registerRooms('room')}>
                  {<MenuItem value="H21">H21</MenuItem>}
                  {/* Agrega más habitaciones según sea necesario */}
                </TextField>
              </Grid>
              <Grid item sm={12} md={4}>
                <Typography>Hora de admisión</Typography>
                <Controller
                  control={controlRooms}
                  name="startTime"
                  render={({ field: { onChange, value } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Hora admisión"
                        ampm={false}
                        value={value}
                        onChange={(date) => onChange(date)}
                        minDateTime={dayjs(new Date())}
                        format="DD/MM/YYYY HH:mm"
                      />
                      {errorsRooms.startTime && <FormHelperText error>{errorsRooms.startTime.message}</FormHelperText>}
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <Typography>Hora de salida estimada</Typography>
                <Controller
                  control={controlRooms}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Hora salida"
                        ampm={false}
                        value={value}
                        onChange={(date) => onChange(date)}
                        minDateTime={dayjs(new Date())}
                        format="DD/MM/YYYY HH:mm"
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" type="button" onClick={handleSubmitRooms(onSubmitRooms)}>
                    Agregar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>

          <RoomReservationTable data={[]} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'background.paper',
            p: 1,
          }}
        >
          <Button variant="outlined" color="error">
            Cerrar
          </Button>
          <Button variant="contained" type="submit">
            Aceptar
          </Button>
        </Box>
      </form>
    </Box>
  );
};
