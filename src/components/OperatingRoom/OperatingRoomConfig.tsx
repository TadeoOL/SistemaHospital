import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { TableHeaderComponent } from '../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../Commons/NoDataInTableInfo';
import { useEffect, useState } from 'react';
import { getOperatingRoomConfig } from '../../services/operatingRoom/operatingRoomService';
import { IOperatingRoomConfig, IRecoveryRoomOperatingRoom } from '../../types/operatingRoomTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recoveryRoomOperatingRoomSchema } from '../../schema/operatingRoom/operatingRoomSchema';
import { isValidFloat, isValidInteger, isValidIntegerIncludeZero } from '../../utils/functions/dataUtils';
import { Delete } from '@mui/icons-material';
import { modifyModuleConfig } from '../../api/api.routes';
import { toast } from 'react-toastify';

const HOUR_COST_TABLE_HEADERS = ['Tiempo', 'Precio', 'Acción'];

const useGetOperatingRoomConfig = () => {
  const [data, setData] = useState<IOperatingRoomConfig | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await getOperatingRoomConfig();
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);
  return {
    data,
    loading,
  };
};

export const OperatingRoomConfig = () => {
  const { data, loading } = useGetOperatingRoomConfig();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('md'));

  const updateOperatingRoomConfig = async (config: IRecoveryRoomOperatingRoom[]) => {
    const object = {
      configuracionRecuperacion: data?.configuracionRecuperacion,
      configuracionQuirofano: config,
    };
    try {
      await modifyModuleConfig(object, 'Quirofano');
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.log(error);
    }
  };

  const updateRecoveryConfig = async (config: IRecoveryRoomOperatingRoom[]) => {
    const object = {
      configuracionRecuperacion: config,
      configuracionQuirofano: data?.configuracionQuirofano,
    };
    try {
      await modifyModuleConfig(object, 'Quirofano');
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ boxShadow: 5, borderRadius: 4, p: 2, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', columnGap: 4, flexDirection: { xs: 'column', md: 'row' }, rowGap: 2 }}>
        <OperatingRoomHourCostTable
          data={data?.configuracionQuirofano as IRecoveryRoomOperatingRoom[]}
          xs={xs}
          updateOperatingRoomConfig={updateOperatingRoomConfig}
        />
        <Divider />
        <RecoveryRoomHourCostTable
          data={data?.configuracionRecuperacion as IRecoveryRoomOperatingRoom[]}
          xs={xs}
          updateRecoveryConfig={updateRecoveryConfig}
        />
      </Box>
    </Box>
  );
};

interface Inputs {
  inicio: string;
  fin: string;
  precio: string;
  noneHour: boolean;
}
interface OperatingRoomHourCostTableProps {
  data: IRecoveryRoomOperatingRoom[];
  xs: boolean;
  updateOperatingRoomConfig: Function;
}
const OperatingRoomHourCostTable = (props: OperatingRoomHourCostTableProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [configList, setConfigList] = useState<IRecoveryRoomOperatingRoom[]>(data);

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      inicio: '',
      fin: '',
      precio: '',
      noneHour: false,
    },
    resolver: open ? zodResolver(recoveryRoomOperatingRoomSchema) : undefined,
  });

  const handleAdd = () => {
    setOpen(true);
  };

  const handleSave: SubmitHandler<Inputs> = (data) => {
    if (!open) return handleAdd();
    const newData = {
      inicio: data.inicio,
      fin: data.fin ? data.fin : null,
      precio: data.precio,
    };
    if (!validateConfig(configList, newData)) return;
    const config = [...configList, newData];
    setConfigList((prev) => [...prev, { ...newData, fin: newData.fin ? newData.fin : '' }]);
    props.updateOperatingRoomConfig(config);
    setOpen(false);
    reset();
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleDelete = (price: string) => {
    const config = configList.filter((d) => d.precio !== price);
    setConfigList((prev) => prev.filter((d) => d.precio !== price));
    props.updateOperatingRoomConfig(config);
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <Typography variant="h5">Precio hora quirófano</Typography>
      <Card sx={{ flex: 1 }}>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={HOUR_COST_TABLE_HEADERS} />
            <TableBody>
              {configList &&
                configList.map((d, n) => (
                  <TableRow key={n}>
                    <TableCell>{`${d.inicio} - ${!d.fin ? '♾️' : d.fin}`}</TableCell>
                    <TableCell>{d.precio}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDelete(d.precio)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!configList ||
          (configList.length === 0 && (
            <NoDataInTableInfo infoTitle="No hay precios agregados" sizeIcon={30} variantText="h4" />
          ))}
      </Card>
      <Box sx={{ mt: 1, display: 'flex' }}>
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Collapse in={open}>
            <form id="form1" onSubmit={handleSubmit(handleSave)}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  rowGap: 2,
                  columnGap: 2,
                  alignItems: 'start',
                }}
              >
                <TextField
                  label="Inicio"
                  fullWidth
                  value={watch('inicio')}
                  onChange={(e) => {
                    if (!isValidIntegerIncludeZero(e.target.value)) return;
                    setValue('inicio', e.target.value);
                  }}
                  error={!!errors.inicio?.message}
                  helperText={errors.inicio?.message}
                />
                <TextField
                  label="Fin"
                  fullWidth
                  value={watch('fin')}
                  disabled={watch('noneHour')}
                  onChange={(e) => {
                    if (!isValidInteger(e.target.value)) return;
                    setValue('fin', e.target.value);
                  }}
                  error={!!errors.fin?.message}
                  helperText={errors.fin?.message}
                />
                <TextField
                  label="Precio"
                  fullWidth
                  value={watch('precio')}
                  onChange={(e) => {
                    if (!isValidFloat(e.target.value)) return setValue('precio', '');
                    setValue('precio', e.target.value);
                  }}
                  error={!!errors.precio?.message}
                  helperText={errors.precio?.message}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption">Sin hora de finalización</Typography>
                <Checkbox checked={watch('noneHour')} {...register('noneHour')} />
              </Box>
            </form>
          </Collapse>
        </Box>
        <Box sx={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
          <Box>
            <Button variant="contained" form="form1" type="submit">
              {!open ? 'Agregar' : 'Guardar'}
            </Button>
            <Collapse in={open} sx={{ mt: 1 }}>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancelar
              </Button>
            </Collapse>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
interface RecoveryRoomHourCostTableProps {
  data: IRecoveryRoomOperatingRoom[];
  xs: boolean;
  updateRecoveryConfig: (config: IRecoveryRoomOperatingRoom[]) => void;
}
const RecoveryRoomHourCostTable = (props: RecoveryRoomHourCostTableProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [configList, setConfigList] = useState<IRecoveryRoomOperatingRoom[]>(data);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      inicio: '',
      fin: '',
      precio: '',
      noneHour: false,
    },
    resolver: open ? zodResolver(recoveryRoomOperatingRoomSchema) : undefined,
  });

  const handleAdd = () => {
    setOpen(true);
  };

  const handleSave: SubmitHandler<Inputs> = (data) => {
    if (!open) return handleAdd();
    const newData = {
      inicio: data.inicio,
      fin: data.fin ? data.fin : null,
      precio: data.precio,
    };
    if (!validateConfig(configList, newData)) return;
    const config = [...configList, newData];
    setConfigList((prev) => [...prev, { ...newData, fin: newData.fin ? newData.fin : '' }]);
    props.updateRecoveryConfig(config);
    reset();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleDelete = (price: string) => {
    const config = configList.filter((d) => d.precio !== price);
    setConfigList((prev) => prev.filter((d) => d.precio !== price));
    props.updateRecoveryConfig(config);
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <Typography variant="h5">Precio hora recuperación</Typography>
      <Card sx={{ flex: 1 }}>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={HOUR_COST_TABLE_HEADERS} />
            <TableBody>
              {configList &&
                configList.map((d, n) => (
                  <TableRow key={n}>
                    <TableCell>{`${d.inicio} - ${!d.fin ? '♾️' : d.fin}`}</TableCell>
                    <TableCell>{d.precio}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDelete(d.precio)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!configList ||
          (configList.length === 0 && (
            <NoDataInTableInfo infoTitle="No hay precios agregados" sizeIcon={30} variantText="h4" />
          ))}
      </Card>
      <Box sx={{ mt: 1, display: 'flex' }}>
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Collapse in={open}>
            <form id="form2" onSubmit={handleSubmit(handleSave)}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  rowGap: 2,
                  columnGap: 2,
                  alignItems: 'start',
                }}
              >
                <TextField
                  label="Inicio"
                  fullWidth
                  value={watch('inicio')}
                  onChange={(e) => {
                    if (!isValidIntegerIncludeZero(e.target.value)) return;
                    setValue('inicio', e.target.value);
                  }}
                  error={!!errors.inicio?.message}
                  helperText={errors.inicio?.message}
                />
                <TextField
                  label="Fin"
                  fullWidth
                  value={watch('fin')}
                  disabled={watch('noneHour')}
                  onChange={(e) => {
                    if (!isValidInteger(e.target.value)) return;
                    setValue('fin', e.target.value);
                  }}
                  error={!!errors.fin?.message}
                  helperText={errors.fin?.message}
                />
                <TextField
                  label="Precio"
                  fullWidth
                  value={watch('precio')}
                  onChange={(e) => {
                    if (!isValidFloat(e.target.value)) return setValue('precio', '');
                    setValue('precio', e.target.value);
                  }}
                  error={!!errors.precio?.message}
                  helperText={errors.precio?.message}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption">Sin hora de finalización</Typography>
                <Checkbox checked={watch('noneHour')} {...register('noneHour')} />
              </Box>
            </form>
          </Collapse>
        </Box>
        <Box sx={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
          <Box>
            <Button variant="contained" form="form2" type="submit">
              {!open ? 'Agregar' : 'Guardar'}
            </Button>
            <Collapse in={open} sx={{ mt: 1 }}>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancelar
              </Button>
            </Collapse>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function validateConfig(currentConfig: IRecoveryRoomOperatingRoom[], config: IRecoveryRoomOperatingRoom): boolean {
  for (const existingConfig of currentConfig) {
    if (existingConfig.fin === null) {
      if (config.inicio >= existingConfig.inicio) {
        toast.warning('No se puede crear una configuración que comienza después de una configuración abierta.');
        return false;
      }
    } else {
      if (
        (config.inicio >= existingConfig.inicio && config.inicio < existingConfig.fin) ||
        (config.fin !== null && config.fin > existingConfig.inicio && config.fin <= existingConfig.fin) ||
        (config.inicio <= existingConfig.inicio && (config.fin === null || config.fin >= existingConfig.fin))
      ) {
        toast.warning('El rango de horas está interfiere con una configuración existente.');
        return false;
      }
    }
  }

  if (currentConfig.some((d) => d.precio === config.precio)) {
    toast.warning('Ya existe un precio con este valor.');
    return false;
  }

  return true;
}
