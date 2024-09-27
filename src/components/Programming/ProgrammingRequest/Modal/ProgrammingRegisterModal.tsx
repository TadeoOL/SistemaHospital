import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useGetAllSurgeryProcedures } from '../../../../hooks/programming/useGetAllSurgeryProcedure';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Cancel } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { createPatient } from '../../../../services/programming/patientService';
import { IPatient } from '../../../../types/types';
import { createProgrammingRequest } from '../../../../services/programming/programmingRequest';
import { useGetMedics } from '../../../../hooks/programming/useGetDoctors';
import { zodResolver } from '@hookform/resolvers/zod';
import { programmingRegisterSchema } from '../../../../schema/programming/programmingSchemas';
import 'dayjs/locale/es-mx';
dayjs.locale('es-mx');

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
interface ProgrammingRegisterModalProps {
  setOpen: Function;
}
interface Inputs {
  name: string;
  lastName: string;
  secondLastName: string;
  doctorId: string;
  date: Dayjs;
  wasRecommended: boolean;
  notes: string;
  surgeryProcedures: string[];
}

export const ProgrammingRegisterModal = (props: ProgrammingRegisterModalProps) => {
  const { data: proceduresData, isLoadingProcedures } = useGetAllSurgeryProcedures();
  const { doctorsData, isLoadingMedics } = useGetMedics();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(programmingRegisterSchema),
    defaultValues: {
      wasRecommended: false,
      surgeryProcedures: [],
      date: dayjs(),
      doctorId: '',
      lastName: '',
      name: '',
      notes: '',
      secondLastName: '',
    },
  });
  const watchProcedures = watch('surgeryProcedures');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const patientObj: IPatient = {
      lastName: data.lastName,
      name: data.name,
      secondLastName: data.secondLastName,
    };
    const procedureMap = new Map(proceduresData.map((p) => [p.id, p]));
    const programmingRequestObj = {
      id_Medico: data.doctorId,
      fechaSugerida: data.date as any as Date,
      recomendacionMedica: data.wasRecommended,
      notas: data.notes,
      procedimientos: JSON.stringify(
        data.surgeryProcedures.map((sp) => procedureMap.get(sp)).filter((obj) => obj !== undefined) as {
          id: string;
          nombre: string;
        }[]
      ),
    };
    try {
      const patientRes = await createPatient(patientObj);
      await createProgrammingRequest({ ...programmingRequestObj, id_Paciente: patientRes.id as string });
      toast.success('Solicitud de programación creada con éxito!');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar la solicitud de programación');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProcedures || isLoadingMedics)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Nueva solicitud de programación" />
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>Nombre del Paciente</Typography>
              <TextField
                label="Nombre"
                fullWidth
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Apellido Paterno</Typography>
              <TextField
                label="Apellido Paterno"
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Apellido Materno</Typography>
              <TextField
                label="Apellido Materno"
                fullWidth
                {...register('secondLastName')}
                error={!!errors.secondLastName?.message}
                helperText={errors.secondLastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Procedimiento</Typography>
              <TextField
                select
                label="Procedimiento"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: watchProcedures,
                  renderValue: (selected: any) => {
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {selected &&
                          selected.map((value: string) => {
                            const selectedValue = proceduresData.find((p) => p.id === value);
                            return (
                              <Chip
                                key={selectedValue?.id}
                                label={selectedValue?.nombre}
                                style={{ margin: 2 }}
                                onDelete={() => {
                                  const filtered = proceduresData.filter((p) => p.id !== value);

                                  setValue(
                                    'surgeryProcedures',
                                    filtered.map((p) => p.id)
                                  );
                                }}
                                deleteIcon={<Cancel onMouseDown={(event) => event.stopPropagation()} />}
                              />
                            );
                          })}
                      </div>
                    );
                  },
                }}
                {...register('surgeryProcedures')}
                error={!!errors.surgeryProcedures?.message}
                helperText={errors.surgeryProcedures?.message}
              >
                {proceduresData.length === 0 && <MenuItem disabled>No hay procedimientos</MenuItem>}
                {proceduresData.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Fue recomendado</Typography>
              <Checkbox {...register('wasRecommended')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Dia de la solicitud</Typography>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      onChange={onChange}
                      value={value}
                      label="Dia"
                      ampm={false}
                      slotProps={{
                        textField: {
                          error: !!errors.date?.message,
                          helperText: errors.date?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Seleccionar medico</Typography>
              <TextField
                label="Medico"
                fullWidth
                {...register('doctorId')}
                error={!!errors.doctorId?.message}
                helperText={errors.doctorId?.message}
                select
                SelectProps={{ ...register('doctorId'), value: watch('doctorId') }}
              >
                {doctorsData.length === 0 && <MenuItem disabled>No hay medicos</MenuItem>}
                {doctorsData.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Notas</Typography>
              <TextField label="Escribe las notas..." multiline fullWidth />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={25} color="info" /> : 'Agregar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
