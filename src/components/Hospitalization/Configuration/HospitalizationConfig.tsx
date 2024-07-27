import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetHospitalizationConfig } from '../../../hooks/hospitalization/useGetHospitalizationConfig';
import { modifyModuleConfig } from '../../../api/api.routes';
import { IFactor, IPurchaseInternConfig } from '../../../types/types';
import { addNewFactorSchema } from '../../../schema/schemas';

const styleInput = {
  paddingTop: '0.4rem',
  paddingBottom: '0.4rem',
};

export const HospitalizationConfig = () => {
  const { isLoadingHospitalizationConfig, config, isError, refetch } = useGetHospitalizationConfig();
  const [configPurchase, setConfigPurchase] = useState<IPurchaseInternConfig>();
  const [addNewFactor, setAddNewFactor] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoadingHospitalizationConfig) return;
    if (config.factor !== null) {
      setConfigPurchase(config);
    } else {
      setConfigPurchase({
        factor: [],
        factorInterno: [],
      });
    }
  }, [config]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFactor>({
    defaultValues: {
      cantidadMinima: '',
      cantidadMaxima: '',
      factorMultiplicador: '',
    },
    resolver: zodResolver(addNewFactorSchema),
  });

  const onSubmitNewFactor: SubmitHandler<IFactor> = async (data) => {
    if (configPurchase === undefined || configPurchase.factor === null) {
      return;
    }
    const isOverlapping = configPurchase?.factor.some(
      (factor) =>
        (data.cantidadMinima >= factor.cantidadMinima && data.cantidadMinima <= factor.cantidadMaxima) ||
        (data.cantidadMaxima >= factor.cantidadMinima && data.cantidadMaxima <= factor.cantidadMaxima)
    );
    const isFactorDuplicated = configPurchase?.factor.some(
      (factor) => factor.factorMultiplicador === data.factorMultiplicador
    );

    if (!isOverlapping && !isFactorDuplicated) {
      setConfigPurchase((prevConfig) => {
        if (prevConfig) {
          return {
            ...prevConfig,
            factor: [...(prevConfig.factor ?? []), data],
          };
        } else {
          return prevConfig;
        }
      });
      setAddNewFactor(false);
      setHasChanges(true);
      reset();
    } else {
      if (isOverlapping) {
        toast.error('El nuevo factor se superpone con un factor existente.');
      }
      if (isFactorDuplicated) {
        toast.error('El factor multiplicador ya existe en los factores existentes.');
      }
    }
  };

  const handleModifyConfig = async () => {
    setIsLoading(true);
    if (!configPurchase) return;
    try {
      const object = {
        factor: configPurchase.factor,
      };
      await modifyModuleConfig(object, 'Hospitalizacion');
      toast.success('Configuración modificada con éxito!');
      refetch();
      setHasChanges(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al modificar la configuración!');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isLoadingHospitalizationConfig) return;
    const hasConfigChanges = () => {
      if (!config || !configPurchase) return false;
      if (config.factor?.length !== configPurchase.factor?.length) {
        return true;
      }
      if (config.factor != null) {
        for (let i = 0; i < config.factor.length; i++) {
          const factor1 = config.factor[i];
          if (configPurchase.factor === null) {
            return false;
          }
          const factor2 = configPurchase.factor[i];
          if (
            Number(factor1.cantidadMinima) !== Number(factor2.cantidadMinima) ||
            Number(factor1.cantidadMaxima) !== Number(factor2.cantidadMaxima) ||
            Number(factor1.factorMultiplicador) !== Number(factor2.factorMultiplicador)
          ) {
            return true;
          }
        }
      }

      return false;
    };
    setHasChanges(hasConfigChanges());
  }, [isLoadingHospitalizationConfig, config, configPurchase]);

  const handleDelete = (factor: string | number) => {
    setHasChanges(true);
    if (!configPurchase) return;
    setConfigPurchase((prevConfig) => {
      if (prevConfig) {
        if (configPurchase === undefined || configPurchase.factor === null) {
          return;
        }
        return {
          ...prevConfig,
          factor: configPurchase?.factor.filter((f) => f.factorMultiplicador !== factor),
        };
      } else {
        return prevConfig;
      }
    });
  };

  if (!isLoadingHospitalizationConfig && isError) {
    toast.error('Ha habido un error!');
    return null;
  }
  if (isLoadingHospitalizationConfig || !{ configPurchase })
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Box
      sx={{
        boxShadow: 10,
        borderRadius: 2,
        bgcolor: 'white',
      }}
    >
      {
        <Stack
          sx={{
            display: 'flex',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: '20px',
            borderColor: 'black',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Factores</Typography>
          <Box sx={{ overflowY: 'auto' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2, maxHeight: 250 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={'50%'}>Rango</TableCell>
                    <TableCell width={'35%'}>Factor</TableCell>
                    <TableCell width={'15%'}>Acciones </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {configPurchase?.factor &&
                    configPurchase.factor.map((i) => (
                      <TableRow key={i.factorMultiplicador}>
                        <TableCell width={'50%'} sx={{ whiteSpace: 'nowrap' }}>
                          ${i.cantidadMinima} a ${i.cantidadMaxima}
                        </TableCell>
                        <TableCell width={'35%'}>{i.factorMultiplicador}</TableCell>
                        <TableCell width={'15%'}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(i.factorMultiplicador);
                              setHasChanges(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {
            <form noValidate onSubmit={handleSubmit(onSubmitNewFactor)}>
              <Stack
                sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  columnGap: addNewFactor ? 2 : 0,
                  mb: 2,
                }}
              >
                <Collapse in={addNewFactor} orientation="horizontal">
                  <Stack
                    spacing={{ xs: 1, md: 0 }}
                    sx={{
                      flexDirection: { md: 'row', xs: 'column' },
                      columnGap: 3,
                    }}
                  >
                    <Tooltip title="Cantidad minima">
                      <TextField
                        inputProps={{
                          style: {
                            ...styleInput,
                          },
                        }}
                        type="number"
                        size="small"
                        placeholder="Cantidad minima"
                        {...register('cantidadMinima')}
                        error={!!errors.cantidadMinima && addNewFactor}
                        helperText={errors.cantidadMinima && addNewFactor ? errors?.cantidadMinima?.message : null}
                      />
                    </Tooltip>
                    <Tooltip title="Cantidad maxima">
                      <TextField
                        inputProps={{
                          style: {
                            ...styleInput,
                          },
                        }}
                        type="number"
                        size="small"
                        placeholder="Cantidad maxima"
                        {...register('cantidadMaxima')}
                        error={!!errors.cantidadMaxima && addNewFactor}
                        helperText={errors.cantidadMaxima && addNewFactor ? errors?.cantidadMaxima?.message : null}
                      />
                    </Tooltip>
                    <Tooltip title="Factor">
                      <TextField
                        inputProps={{
                          style: {
                            ...styleInput,
                          },
                        }}
                        type="number"
                        size="small"
                        placeholder="Factor"
                        {...register('factorMultiplicador')}
                        error={!!errors.factorMultiplicador && addNewFactor}
                        helperText={
                          errors.factorMultiplicador && addNewFactor ? errors?.factorMultiplicador?.message : null
                        }
                      />
                    </Tooltip>
                  </Stack>
                </Collapse>
                <Stack spacing={1} sx={{ display: 'flex', flex: 1 }}>
                  <Box>
                    <Button
                      sx={{ marginTop: '10px' }}
                      fullWidth={addNewFactor ? true : false}
                      variant="contained"
                      type={addNewFactor ? 'submit' : 'button'}
                      startIcon={addNewFactor ? <SaveOutlinedIcon /> : <AddBoxOutlinedIcon />}
                      onClick={(e) => {
                        if (addNewFactor) {
                          e.stopPropagation();
                        } else {
                          setAddNewFactor(true);
                          e.preventDefault();
                        }
                      }}
                    >
                      {addNewFactor ? 'Guardar' : 'Nuevo factor'}
                    </Button>
                  </Box>
                  <Collapse in={addNewFactor}>
                    <Button
                      fullWidth={addNewFactor ? true : false}
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => setAddNewFactor(false)}
                    >
                      Cancelar
                    </Button>
                  </Collapse>
                </Stack>
              </Stack>
            </form>
          }

          {hasChanges && (
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'red' }}>
                *Tienes cambios efectuados no guardados*
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 400, color: 'red' }}>
                Nota: Los cambios no guardados se perderán en caso de salir de esta ventana.
              </Typography>
            </Box>
          )}
          <Stack
            sx={{
              mt: 4,
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={() => handleModifyConfig()}
              startIcon={<SaveOutlinedIcon />}
            >
              Guardar
            </Button>
          </Stack>
        </Stack>
      }
    </Box>
  );
};
