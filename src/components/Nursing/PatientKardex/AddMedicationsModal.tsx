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
import { useState, useEffect, useMemo } from 'react';
import { IWarehouseArticle } from '../../../types/warehouse/article/warehouseArticle';
import { getExistingArticles } from '../../../services/warehouse/articleWarehouseService';
import debounce from 'lodash/debounce';
import { useGetPharmacyConfig } from '../../../hooks/useGetPharmacyConfig';
import { kardexMedicationsSchema } from '../../../schema/nursing/karedexSchema';

const addMedicationsSchema = z.object({
  medicamentos: z
    .array(
      kardexMedicationsSchema.refine((data) => !!data.id_Articulo, {
        message: 'Seleccione un medicamento',
        path: ['id_Articulo'],
      })
    )
    .min(1, 'Debe agregar al menos un medicamento'),
});

export type AddMedicationsFormData = z.infer<typeof addMedicationsSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddMedicationsFormData) => void;
  kardexId: string;
}

export const AddMedicationsModal = ({ open, onClose, onSubmit }: Props) => {
  const [filteredArticles, setFilteredArticles] = useState<{ [key: number]: IWarehouseArticle[] }>({});
  const { data: pharmacyConfig } = useGetPharmacyConfig();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMedicationsFormData>({
    defaultValues: {
      medicamentos: [{ id_Articulo: '', dosis: '', via: '', frecuencia: '', horario: '' }],
    },
    resolver: zodResolver(addMedicationsSchema),
  });

  const debouncedFetchArticles = useMemo(
    () =>
      debounce(async (searchTerm: string, index: number) => {
        if (searchTerm && pharmacyConfig?.id_Almacen) {
          const response = await getExistingArticles(
            `search=${searchTerm}&id_Almacen=${pharmacyConfig.id_Almacen}&id_AlmacenPrincipal=${pharmacyConfig.id_Almacen}`
          );
          setFilteredArticles((prev) => ({
            ...prev,
            [index]: response?.data,
          }));
        }
      }, 300),
    [pharmacyConfig?.id_Almacen]
  );

  useEffect(() => {
    return () => {
      debouncedFetchArticles.cancel();
    };
  }, [debouncedFetchArticles]);

  const {
    fields: medicamentosFields,
    append: appendMedicamento,
    remove: removeMedicamento,
  } = useFieldArray({
    control,
    name: 'medicamentos',
  });

  const handleClose = () => {
    reset();
    setFilteredArticles({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <HeaderModal
        title="Agregar Medicamentos"
        setOpen={handleClose}
        sx={{ color: 'primary.contrastText', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {medicamentosFields.map((field, index) => {
              const articles = filteredArticles[index] || [];

              return (
                <Box
                  key={field.id}
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr 1fr 1fr auto' },
                  }}
                >
                  <Controller
                    name={`medicamentos.${index}.id_Articulo`}
                    control={control}
                    rules={{ required: 'Seleccione un medicamento' }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={articles}
                        getOptionLabel={(option: IWarehouseArticle) => option.nombre}
                        loading={false}
                        noOptionsText="No se encontraron resultados"
                        onInputChange={(_, newValue) => {
                          debouncedFetchArticles(newValue, index);
                        }}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.id_Articulo : '');
                        }}
                        value={articles.find((art) => art.id_Articulo === value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Medicamento"
                            error={!!errors.medicamentos?.[index]?.id_Articulo}
                            helperText={errors.medicamentos?.[index]?.id_Articulo?.message}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name={`medicamentos.${index}.dosis`}
                    control={control}
                    rules={{ required: 'Campo requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dosis"
                        error={!!errors.medicamentos?.[index]?.dosis}
                        helperText={errors.medicamentos?.[index]?.dosis?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`medicamentos.${index}.frecuencia`}
                    control={control}
                    rules={{ required: 'Campo requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Frecuencia"
                        error={!!errors.medicamentos?.[index]?.frecuencia}
                        helperText={errors.medicamentos?.[index]?.frecuencia?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`medicamentos.${index}.via`}
                    control={control}
                    rules={{ required: 'Campo requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Vía"
                        error={!!errors.medicamentos?.[index]?.via}
                        helperText={errors.medicamentos?.[index]?.via?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`medicamentos.${index}.horario`}
                    control={control}
                    rules={{ required: 'Campo requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Horario"
                        error={!!errors.medicamentos?.[index]?.horario}
                        helperText={errors.medicamentos?.[index]?.horario?.message}
                      />
                    )}
                  />

                  <IconButton onClick={() => removeMedicamento(index)} color="error" sx={{ alignSelf: 'center' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              );
            })}
            <Button
              startIcon={<AddIcon />}
              onClick={() => appendMedicamento({ id_Articulo: '', dosis: '', via: '', frecuencia: '', horario: '' })}
            >
              Agregar Medicamento
            </Button>
          </Box>
        </DialogContent>

        {errors.medicamentos?.message && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {errors.medicamentos.message}
          </Alert>
        )}

        <DialogActions sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Agregar Medicamentos
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
