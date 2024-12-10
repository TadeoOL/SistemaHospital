import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Button,
  TextField,
  Box,
  IconButton,
  Divider,
  Autocomplete,
  Alert,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { KardexFormData, kardexSchema } from '../../../../schema/nursing/karedexSchema';
import { useState, useEffect, useMemo } from 'react';
//import { IWarehouseArticle } from '../../../../types/warehouse/article/warehouseArticle';
import { getExistingArticles } from '../../../../services/warehouse/articleWarehouseService';
import debounce from 'lodash/debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetHospitalServices } from '../../../../hooks/hospitalServices/useGetHospitalServices';
import { IPharmacyConfig } from '@/types/types';
import { Checkbox } from '@mui/material';

interface Props {
  initialData?: KardexFormData;
  onSubmit: (data: KardexFormData) => void;
  pharmacyConfig: IPharmacyConfig;
  handleCreateArticlesRequest: () => Promise<unknown>;
  handleCreateServicesRequest: () => Promise<unknown>;
  handleCheckMedication: (id: string, nombreArticulo: string) => void;
  handleCheckService: (id: string) => void;
  medicationChecked: string[];
  serviceChecked: string[];
}

export const MedicalInstructionsForm = ({
  initialData,
  onSubmit,
  pharmacyConfig,
  handleCreateArticlesRequest,
  handleCreateServicesRequest,
  handleCheckMedication,
  handleCheckService,
  medicationChecked,
  serviceChecked,
}: Props) => {
  const [filteredArticles, setFilteredArticles] = useState<{
    [key: string]: {
      id: string;
      nombre: string;
      precio: number;
      precioVenta: number;
    }[];
  }>({});
  const { data: hospitalServices } = useGetHospitalServices({ serviceType: 2 });

  useEffect(() => {
    const preloadMedicationData = async () => {
      if (pharmacyConfig?.id_Almacen) {
        // Precargar medicamentos
        if (initialData?.medicamentos) {
          const medicationsPromises = initialData.medicamentos.map(async (med, index) => {
            const searchTerm = med.nombreArticulo;
            if (searchTerm) {
              const response = await getExistingArticles(
                `search=${searchTerm}&id_Almacen=${pharmacyConfig.id_Almacen}&id_AlmacenPrincipal=${pharmacyConfig.id_Almacen}`
              );
              return { type: 'medicamento', index, data: response?.data };
            }
            return null;
          });

          // Precargar soluciones
          const solucionesPromises = (initialData.soluciones || []).map(async (sol, index) => {
            if (sol.nombreArticulo) {
              const response = await getExistingArticles(
                `search=${sol.nombreArticulo}&id_Almacen=${pharmacyConfig.id_Almacen}`
              );
              return { type: 'solucion', index, data: response?.data };
            }
            return null;
          });

          const results = await Promise.all([...medicationsPromises, ...solucionesPromises]);

          const newFilteredArticles = results.reduce(
            (acc, result) => {
              if (result) {
                acc[`${result.type}_${result.index}`] = result.data;
              }
              return acc;
            },
            {} as typeof filteredArticles
          );

          setFilteredArticles((prev) => ({
            ...prev,
            ...newFilteredArticles,
          }));
        }
      }
    };

    preloadMedicationData();
  }, [pharmacyConfig?.id_Almacen, initialData]);

  const debouncedFetchArticles = useMemo(
    () =>
      debounce(async (searchTerm: string, type: string, index: number) => {
        if (searchTerm && pharmacyConfig?.id_Almacen) {
          const response = await getExistingArticles(
            `search=${searchTerm}&id_Almacen=${pharmacyConfig.id_Almacen}&id_AlmacenPrincipal=${pharmacyConfig.id_Almacen}`
          );
          setFilteredArticles((prev) => ({
            ...prev,
            [`${type}_${index}`]: response as any,
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
    setValue,
    formState: { errors },
  } = useForm<KardexFormData>({
    values: initialData || {
      indicacionesMedicas: '',
      indicacionSoluciones: '',
      observaciones: '',
      medicamentos: [],
      servicios: [],
      soluciones: [],
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

  const {
    fields: solucionesFields,
    append: appendSolucion,
    remove: removeSolucion,
  } = useFieldArray({
    control,
    name: 'soluciones',
  });

  return (
    <Card sx={{ mx: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, (data) => console.log(data))} id="create-kardex-form">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Divider textAlign="left">Soluciones</Divider>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {solucionesFields.map((field, index) => {
                  const articles = filteredArticles[`solucion_${index}`] || [];
                  const isChecked = medicationChecked.includes(field.id);

                  return (
                    <Box
                      key={field.id}
                      sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                          xs: '25px 1fr',
                          sm: '25px 1fr auto',
                        },
                        gridTemplateAreas: {
                          xs: `
                            "checkbox input"
                            ". delete"
                          `,
                          sm: '"checkbox input delete"',
                        },
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ gridArea: 'checkbox' }}>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleCheckMedication(field.id as string, field.nombreArticulo as string)}
                        />
                      </Box>
                      <Box sx={{ gridArea: 'input' }}>
                        <Controller
                          name={`soluciones.${index}.id_Articulo`}
                          control={control}
                          rules={{ required: 'Seleccione una solución' }}
                          render={({ field: { onChange, value } }) => (
                            <Autocomplete
                              options={articles}
                              getOptionLabel={(option: {
                                id: string;
                                nombre: string;
                                precio: number;
                                precioVenta: number;
                              }) => option.nombre}
                              loading={false}
                              noOptionsText="No se encontraron resultados"
                              onInputChange={(_, newValue) => {
                                debouncedFetchArticles(newValue, 'solucion', index);
                              }}
                              onChange={(_, newValue) => {
                                onChange(newValue ? newValue.id : '');
                                if (newValue) {
                                  setValue(`soluciones.${index}.nombreArticulo`, newValue.nombre);
                                }
                              }}
                              value={
                                value
                                  ? {
                                      id: value ?? '',
                                      nombre:
                                        (field.nombreArticulo || articles.find((ar) => ar.id === value)?.nombre) ?? '',
                                      precio: 0,
                                      precioVenta: 0,
                                    }
                                  : null
                              }
                              isOptionEqualToValue={(option, value) =>
                                typeof value === 'string' ? option.id === value : option.id === value?.id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Solución"
                                  error={!!errors.soluciones?.[index]?.id_Articulo}
                                  helperText={errors.soluciones?.[index]?.id_Articulo?.message}
                                />
                              )}
                            />
                          )}
                        />
                      </Box>
                      <IconButton
                        onClick={() => removeSolucion(index)}
                        color="error"
                        sx={{
                          gridArea: 'delete',
                          justifySelf: 'start',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  );
                })}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() =>
                    appendSolucion({
                      id_Articulo: '',
                      nombreArticulo: '',
                    })
                  }
                >
                  Agregar Solución
                </Button>
              </Box>
              <Box>
                <Controller
                  name="indicacionSoluciones"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} multiline rows={2} fullWidth label="Indicaciones de Soluciones" />
                  )}
                />
              </Box>
            </Box>

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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCreateArticlesRequest} variant="contained">
                Crear solicitud de medicamentos
              </Button>
            </Box>
            {medicamentosFields.map((field, index) => {
              const articles = filteredArticles[`medicamento_${index}`] || [];
              const isChecked = medicationChecked.includes(field.id as string);

              return (
                <Box
                  key={field.id}
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateAreas: {
                      xs: `
                        "checkbox medicamento"
                        "dosis dosis"
                        "frecuencia frecuencia"
                        "via via"
                        "horario horario"
                        "delete delete"
                      `,
                      sm: '"checkbox medicamento dosis frecuencia via horario delete"',
                    },
                    gridTemplateColumns: {
                      xs: '40px 1fr',
                      sm: '40px 2fr 1fr 1fr 1fr 1fr auto',
                    },
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ gridArea: 'checkbox' }}>
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheckMedication(field.id as string, field.nombreArticulo as string)}
                    />
                  </Box>

                  <Box sx={{ gridArea: 'medicamento' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Medicamento
                    </Typography>
                    <Controller
                      name={`medicamentos.${index}.id`}
                      control={control}
                      rules={{ required: 'Seleccione un medicamento' }}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          options={articles}
                          getOptionLabel={(option: {
                            id: string;
                            nombre: string;
                            precio: number;
                            precioVenta: number;
                          }) => option.nombre || ''}
                          loading={false}
                          noOptionsText="No se encontraron resultados"
                          onInputChange={(_, newValue) => {
                            debouncedFetchArticles(newValue, 'medicamento', index);
                          }}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.id : '');
                            if (newValue) {
                              setValue(`medicamentos.${index}.nombreArticulo`, newValue.nombre);
                            }
                          }}
                          value={articles.find((article) => article.id === value) || null}
                          isOptionEqualToValue={(option, value) =>
                            typeof value === 'string' ? option.id === value : option.id === value?.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Medicamento"
                              error={!!errors.medicamentos?.[index]?.id}
                              helperText={errors.medicamentos?.[index]?.id?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ gridArea: 'dosis' }}>
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

                  <Box sx={{ gridArea: 'frecuencia' }}>
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

                  <Box sx={{ gridArea: 'via' }}>
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

                  <Box sx={{ gridArea: 'horario' }}>
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

                  <IconButton
                    onClick={() => removeMedicamento(index)}
                    color="error"
                    sx={{
                      gridArea: 'delete',
                      justifySelf: { xs: 'start', sm: 'center' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              );
            })}
            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                appendMedicamento({
                  id: '',
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCreateServicesRequest} variant="contained">
                Crear solicitud de servicios
              </Button>
            </Box>
            {serviciosFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '0.1fr 1fr 2fr auto' } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'end' }}>
                  <Checkbox
                    checked={serviceChecked.includes(field.id_Servicio || '')}
                    onChange={() => handleCheckService(field.id_Servicio || '')}
                  />
                </Box>
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

                <IconButton onClick={() => removeServicio(index)} color="error" sx={{ alignSelf: 'end', mb: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => appendServicio({ id_Servicio: '', indicaciones: '' })}>
              Agregar Servicio
            </Button>
          </Box>

          {errors.id_IngresoPaciente?.message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.id_IngresoPaciente.message}
            </Alert>
          )}
        </form>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button type="submit" variant="contained" form="create-kardex-form">
          Guardar
        </Button>
      </CardActions>
    </Card>
  );
};
