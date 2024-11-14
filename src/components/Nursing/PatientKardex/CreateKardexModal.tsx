import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Divider,
  Autocomplete,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { KardexFormData, kardexSchema } from '../../../schema/nursing/karedexSchema';
import { useGetPharmacyConfig } from '../../../hooks/useGetPharmacyConfig';
import { useState, useEffect, useMemo } from 'react';
import { IWarehouseArticle } from '../../../types/warehouse/article/warehouseArticle';
import { getExistingArticles } from '../../../services/warehouse/articleWarehouseService';
import debounce from 'lodash/debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetHospitalServices } from '../../../hooks/hospitalServices/useGetHospitalServices';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: KardexFormData) => void;
  id_IngresoPaciente: string;
}

export const CreateKardexModal = ({ open, onClose, onSubmit, id_IngresoPaciente }: Props) => {
  const [filteredArticles, setFilteredArticles] = useState<{ [key: number]: IWarehouseArticle[] }>({});
  const { data: pharmacyConfig } = useGetPharmacyConfig();
  const { data: hospitalServices } = useGetHospitalServices({ serviceType: 2 });

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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KardexFormData>({
    defaultValues: {
      id_IngresoPaciente,
      indicacionesMedicas: '',
      dieta: '',
      dietaObservaciones: '',
      observaciones: '',
      medicamentos: [],
      servicios: [],
    },
    resolver: zodResolver(kardexSchema),
  });

  const {
    fields: medicamentosFields,
    append: appendMedicamento,
    remove: removeMedicamento,
  } = useFieldArray({
    control,
    name: 'medicamentos',
  });

  const {
    fields: serviciosFields,
    append: appendServicio,
    remove: removeServicio,
  } = useFieldArray({
    control,
    name: 'servicios',
  });

  const handleClose = () => {
    reset();
    setFilteredArticles({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth keepMounted={false}>
      <HeaderModal
        title="Nuevo Kardex"
        setOpen={handleClose}
        sx={{
          color: 'primary.contrastText',
          borderRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Controller
                name="indicacionesMedicas"
                control={control}
                rules={{ required: 'Campo requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Indicaciones Médicas"
                    multiline
                    rows={3}
                    error={!!errors.indicacionesMedicas}
                    helperText={errors.indicacionesMedicas?.message}
                  />
                )}
              />

              <Controller
                name="dieta"
                control={control}
                rules={{ required: 'Campo requerido' }}
                render={({ field }) => (
                  <TextField {...field} label="Dieta" error={!!errors.dieta} helperText={errors.dieta?.message} />
                )}
              />

              <Controller
                name="dietaObservaciones"
                control={control}
                render={({ field }) => <TextField {...field} label="Observaciones de Dieta" multiline rows={2} />}
              />

              <Controller
                name="observaciones"
                control={control}
                render={({ field }) => <TextField {...field} label="Observaciones Generales" multiline rows={2} />}
              />
            </Box>

            <Divider textAlign="left">Medicamentos</Divider>
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
              onClick={() =>
                appendMedicamento({
                  id_Articulo: '',
                  dosis: '',
                  via: '',
                  frecuencia: '',
                  horario: '',
                })
              }
            >
              Agregar Medicamento
            </Button>

            <Divider textAlign="left">Servicios</Divider>
            {serviciosFields.map((field, index) => (
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
                <IconButton onClick={() => removeServicio(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => appendServicio({ id_Servicio: '', indicaciones: '' })}>
              Agregar Servicio
            </Button>
          </Box>
        </DialogContent>

        {errors.id_IngresoPaciente?.message && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {errors.id_IngresoPaciente.message}
          </Alert>
        )}

        <DialogActions sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Crear Kardex
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
