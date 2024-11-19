import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Modal, Button, TextField, Box, IconButton, Divider, Autocomplete, Alert, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { KardexFormData, kardexSchema } from '../../../../schema/nursing/karedexSchema';
import { useState, useEffect, useMemo } from 'react';
import { IWarehouseArticle } from '../../../../types/warehouse/article/warehouseArticle';
import { getExistingArticles } from '../../../../services/warehouse/articleWarehouseService';
import debounce from 'lodash/debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetHospitalServices } from '../../../../hooks/hospitalServices/useGetHospitalServices';
import { IPharmacyConfig } from '../../../../types/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: KardexFormData) => void;
  id_IngresoPaciente: string;
  pharmacyConfig: IPharmacyConfig;
}

export const CreateKardexModal = ({ open, onClose, onSubmit, id_IngresoPaciente, pharmacyConfig }: Props) => {
  const [filteredArticles, setFilteredArticles] = useState<{ [key: number]: IWarehouseArticle[] }>({});
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
    setValue,
    formState: { errors },
  } = useForm<KardexFormData>({
    defaultValues: {
      id_IngresoPaciente,
      indicacionesMedicas: '',
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
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: 900,
          maxHeight: '90vh',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <HeaderModal title="Nuevo Kardex" setOpen={handleClose} />

        <Box
          sx={{
            overflow: 'auto',
            flex: 1,
            bgcolor: 'background.paper',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} id="create-kardex-form">
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Indicaciones Médicas
                    </Typography>
                    <Controller
                      name="indicacionesMedicas"
                      control={control}
                      rules={{ required: 'Campo requerido' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          rows={3}
                          fullWidth
                          label="Indicaciones Médicas"
                          error={!!errors.indicacionesMedicas}
                          helperText={errors.indicacionesMedicas?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Observaciones Generales
                    </Typography>
                    <Controller
                      name="observaciones"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} multiline rows={2} fullWidth label="Observaciones Generales" />
                      )}
                    />
                  </Box>
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
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Medicamento
                        </Typography>
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
                                if (newValue) {
                                  setValue(`medicamentos.${index}.nombreArticulo`, newValue.nombre);
                                }
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
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Dosis
                        </Typography>
                        <Controller
                          name={`medicamentos.${index}.dosis`}
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              error={!!errors.medicamentos?.[index]?.dosis}
                              helperText={errors.medicamentos?.[index]?.dosis?.message}
                            />
                          )}
                        />
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Frecuencia
                        </Typography>
                        <Controller
                          name={`medicamentos.${index}.frecuencia`}
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              error={!!errors.medicamentos?.[index]?.frecuencia}
                              helperText={errors.medicamentos?.[index]?.frecuencia?.message}
                            />
                          )}
                        />
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Vía
                        </Typography>
                        <Controller
                          name={`medicamentos.${index}.via`}
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              error={!!errors.medicamentos?.[index]?.via}
                              helperText={errors.medicamentos?.[index]?.via?.message}
                            />
                          )}
                        />
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Horario
                        </Typography>
                        <Controller
                          name={`medicamentos.${index}.horario`}
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              error={!!errors.medicamentos?.[index]?.horario}
                              helperText={errors.medicamentos?.[index]?.horario?.message}
                            />
                          )}
                        />
                      </Box>

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
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Servicio
                      </Typography>
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
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Indicaciones
                      </Typography>
                      <Controller
                        name={`servicios.${index}.indicaciones`}
                        control={control}
                        rules={{ required: 'Campo requerido' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            error={!!errors.servicios?.[index]?.indicaciones}
                            helperText={errors.servicios?.[index]?.indicaciones?.message}
                          />
                        )}
                      />
                    </Box>

                    <IconButton
                      onClick={() => removeServicio(index)}
                      color="error"
                      sx={{ alignSelf: 'end', mb: 1 }} // Alineado con los campos
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => appendServicio({ id_Servicio: '', indicaciones: '' })}>
                  Agregar Servicio
                </Button>
              </Box>
            </Box>

            {errors.id_IngresoPaciente?.message && (
              <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
                {errors.id_IngresoPaciente.message}
              </Alert>
            )}
          </form>
        </Box>

        <Box
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" form="create-kardex-form">
            Crear Kardex
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
