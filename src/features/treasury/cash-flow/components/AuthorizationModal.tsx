import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';
import { Button, Grid, Stack } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { createAuthorization } from '../../services/treasury';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface Props {
  //   itemId?: string;
  open: boolean;
  //   onSuccess: Function;
  onClose: Function;
}

export const addAuthorization = z.object({
  monto: z.string().min(1, 'Escribe un monto'),
  fechaDeposito: z.string().min(1, 'Escribe una fecha'),
});

interface IAuthorization {
  monto: string;
  id_CajaRevolvente: string;
  id_ConceptoSalida: string;
  fechaDeposito: string;
}

const AuthorizationModal = (props: Props) => {
  const { open, onClose } = props;

  const defaultValues = {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IAuthorization>({
    defaultValues,
    resolver: zodResolver(addAuthorization),
  });

  const onSubmit = async (data: any) => {
    console.log('data:', data);
    await createAuthorization({
      id_CajaRevolvente: 0, // TODO: Cambiar por el valor correcto
      id_ConceptoSalida: 0,
      monto: data.monto,
      fechaDeposito: 0,
    });
  };

  const onError = (errors: any) => {
    console.log('errors:', errors);
  };

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button
        variant="contained"
        onClick={handleSubmit(onSubmit, onError)}
        // onClick={handleSubmit(onSubmit, handleError)}
        startIcon={<SaveOutlinedIcon />}
      >
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic header="Nueva autorizacion" open={open} onClose={onClose} actions={actions}>
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <SelectBasic
              {...register('id_CajaRevolvente')}
              label="Caja Revolvente"
              helperText={errors.id_CajaRevolvente?.message}
              error={errors.id_CajaRevolvente}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <SelectBasic
              {...register('id_ConceptoSalida')}
              label="Concepto de salida"
              helperText={errors.id_ConceptoSalida?.message}
              error={errors.id_ConceptoSalida}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic {...register('monto')} label="Monto" helperText={errors.monto?.message} error={errors.monto} />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={0.5}>
              <Typography>Fecha:</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Fecha y Hora"
                  value={dayjs(watch('fechaDeposito'))}
                  onChange={(newValue) => setValue('fechaDeposito', dayjs(newValue).format('YYYY-MM-DDTHH:mm'))}
                  format="DD/MM/YYYY HH:mm"
                  ampm={false}
                  slotProps={{
                    textField: {
                      error: !!errors.fechaDeposito,
                      helperText: errors.fechaDeposito?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default AuthorizationModal;
