import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Autocomplete,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetHospitalServices } from '../../../hooks/hospitalServices/useGetHospitalServices';
import { kardexServicesSchema } from '../../../schema/nursing/karedexSchema';

const addServicesSchema = z.object({
  servicios: z.array(kardexServicesSchema).min(1, 'Debe agregar al menos un servicio'),
});

export type AddServicesFormData = z.infer<typeof addServicesSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddServicesFormData) => void;
  kardexId: string;
}

export const AddServicesModal = ({ open, onClose, onSubmit }: Props) => {
  const { data: hospitalServices } = useGetHospitalServices({ serviceType: 2 });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddServicesFormData>({
    defaultValues: {
      servicios: [{ id_Servicio: '', indicaciones: '' }],
    },
    resolver: zodResolver(addServicesSchema),
  });

  const {
    fields: servicesFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: 'servicios',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <HeaderModal
        title="Agregar Servicios"
        setOpen={handleClose}
        sx={{ color: 'primary.contrastText', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {servicesFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr auto' } }}
              >
                <Controller
                  name={`servicios.${index}.id_Servicio`}
                  control={control}
                  rules={{ required: 'Seleccione un servicio' }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={hospitalServices || []}
                      getOptionLabel={(option) => option.nombre}
                      noOptionsText="No se encontraron servicios"
                      onChange={(_, newValue) => {
                        onChange(newValue ? newValue.id_Servicio : '');
                      }}
                      value={hospitalServices?.find((serv) => serv.id_Servicio === value) || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Servicio"
                          error={!!errors.servicios?.[index]?.id_Servicio}
                          helperText={errors.servicios?.[index]?.id_Servicio?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name={`servicios.${index}.indicaciones`}
                  control={control}
                  rules={{ required: 'Campo requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Indicaciones"
                      error={!!errors.servicios?.[index]?.indicaciones}
                      helperText={errors.servicios?.[index]?.indicaciones?.message}
                    />
                  )}
                />
                <IconButton onClick={() => removeService(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => appendService({ id_Servicio: '', indicaciones: '' })}>
              Agregar Servicio
            </Button>
          </Box>
        </DialogContent>

        {errors.servicios?.message && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {errors.servicios.message}
          </Alert>
        )}

        <DialogActions
          sx={{
            p: 2.5,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Agregar Servicios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
