import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useGetMedics } from '../../../../hooks/programming/useGetDoctors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicalShiftRegisterSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import { registerMedicalShift } from '../../../../services/hospitalization/medicalShift';
import { toast } from 'react-toastify';

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

interface MedicalShiftRegisterModalProps {
  setOpen: Function;
  start: Date;
  end: Date;
  newEventAdded: boolean;
  setNewEventAdded: Function;
}
interface Inputs {
  startShift: Date;
  endShift: Date;
  medicId: { id: string; nombre: string } | null;
}

export const MedicalShiftRegisterModal = (props: MedicalShiftRegisterModalProps) => {
  const { isLoadingMedics, doctorsData } = useGetMedics();

  const {
    formState: { errors },
    control,
    watch,
    setValue,
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      startShift: props.start,
      endShift: props.end,
      medicId: null,
    },
    resolver: zodResolver(medicalShiftRegisterSchema),
  });
  const watchMedicId = watch('medicId');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await registerMedicalShift({
        id_Medico: data.medicId?.id as string,
        finGuardia: data.endShift,
        inicioGuardia: data.startShift,
      });
      toast.success('Guardia registrada con éxito!');
      props.setNewEventAdded(!props.newEventAdded);
      props.setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message[0]);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Registrar guardia medico" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)} id="form1" />
        <Typography>Selecciona el medico:</Typography>
        <Autocomplete
          onChange={(_, val) => {
            if (!val) return;
            setValue('medicId', val);
          }}
          loading={isLoadingMedics}
          getOptionLabel={(option) => option.nombre}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={doctorsData}
          value={watchMedicId}
          onInputChange={(_, __, reason) => {
            if (reason === 'clear') {
              setValue('medicId', null);
            }
          }}
          noOptionsText="No se encontraron medicos"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Medicos"
              error={!!errors.medicId?.message}
              helperText={errors.medicId?.message}
            />
          )}
        />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography>Inicio de la guardia:</Typography>
            <Controller
              name="startShift"
              control={control}
              render={({ field: { onChange, value } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    ampm={false}
                    label="Fecha inicio"
                    defaultValue={dayjs(props.start)}
                    disablePast
                    value={dayjs(value)}
                    onChange={onChange}
                    slotProps={{
                      textField: {
                        error: !!errors.startShift?.message,
                        helperText: errors.startShift?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography>Fin de la guardia:</Typography>
            <Controller
              name="endShift"
              control={control}
              render={({ field: { onChange, value } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    ampm={false}
                    label="Fecha fin"
                    defaultValue={dayjs(props.end)}
                    value={dayjs(value)}
                    onChange={onChange}
                    slotProps={{
                      textField: {
                        error: !!errors.endShift?.message,
                        helperText: errors.endShift?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper' }}>
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" form="form1" type="submit">
          Guardar
        </Button>
      </Box>
    </Box>
  );
};
