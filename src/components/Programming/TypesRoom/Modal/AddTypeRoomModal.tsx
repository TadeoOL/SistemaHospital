import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  //MenuItem,
  Radio,
  RadioGroup,
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
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { typeRoomSchema } from '../../../../schema/programming/programmingSchemas';
import { useEffect, useState } from 'react';
import { useTypesRoomPaginationStore } from '../../../../store/programming/typesRoomPagination';
import { IRecoveryRoomOperatingRoom } from '../../../../types/operatingRoom/operatingRoomTypes';
import { recoveryRoomOperatingRoomSchema } from '../../../../schema/operatingRoom/operatingRoomSchema';
import { TableHeaderComponent } from '../../../Commons/TableHeaderComponent';
import { Delete } from '@mui/icons-material';
import { NoDataInTableInfo } from '../../../Commons/NoDataInTableInfo';
import { isValidFloat, isValidInteger, isValidIntegerIncludeZero } from '../../../../utils/functions/dataUtils';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { modifyTypeRoom, registerTypeRoom } from '../../../../services/programming/typesRoomService';
import 'dayjs/locale/es-mx';
import { modifySurgeryRoomType, registerSurgeryRoomType } from '../../../../services/programming/suergeryRoomTypes';
import { ITypeRoom } from '../../../../types/admission/admissionTypes';
//import { useGetSizeUnit } from '../../../../hooks/contpaqi/useGetSizeUnit';
dayjs.locale('es-mx');

const HOUR_COST_TABLE_HEADERS = ['Tiempo', 'Precio', 'Acción'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { md: 750 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

type Inputs = {
  name: string;
  description: string;
  reservedSpaceTime: Dayjs | null;
  priceByTimeRange: IRecoveryRoomOperatingRoom[];
  recoveryPriceByTimeRange: IRecoveryRoomOperatingRoom[];
  type: string;
  priceRoom: string;
  //codigoSATRecuperacion?: string;
  //codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
};

interface AddTypeRoomModalProps {
  setOpen: Function;
  editData?: ITypeRoom;
}
export const AddTypeRoomModal = (props: AddTypeRoomModalProps) => {
  const { editData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useTypesRoomPaginationStore((state) => state.fetchData);
  //const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(typeRoomSchema),
    defaultValues: {
      name: editData ? editData.nombre : '',
      description: editData ? editData.descripcion : '',
      priceByTimeRange: editData ? editData.configuracionPrecioHora : [],
      recoveryPriceByTimeRange: editData ? editData.configuracionRecuperacion : [],
      reservedSpaceTime: editData ? dayjs(editData.configuracionLimpieza, 'HH:mm:ss') : null,
      type: editData ? (editData.id_TipoCuarto ? '0' : '1') : '0',
      priceRoom: editData ? editData.precio?.toString() : '0',
      //codigoSATRecuperacion: editData?.codigoSATRecuperacion,
      //codigoSAT: editData?.codigoSAT,
      codigoUnidadMedida: editData?.codigoUnidadMedida ? editData.codigoUnidadMedida : 0,
      codigoUnidadMedidaRecuperacion: editData?.codigoUnidadMedidaRecuperacion
        ? editData.codigoUnidadMedidaRecuperacion
        : 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!editData) {
        if (data.type === '0') {
          await registerTypeRoom({
            nombre: data.name,
            descripcion: data.description,
            intervaloReservacion: data.reservedSpaceTime?.isValid()
              ? data.reservedSpaceTime.format('HH:mm:00')
              : undefined,
            precio: parseFloat(data.priceRoom),
            //codigoSATRecuperacion: data.codigoSATRecuperacion,
            //codigoSAT: data.codigoSAT,
            codigoUnidadMedida: data.codigoUnidadMedida,
            codigoUnidadMedidaRecuperacion: data.codigoUnidadMedidaRecuperacion
              ? data.codigoUnidadMedidaRecuperacion
              : undefined,
          });
        } else {
          await registerSurgeryRoomType({
            nombre: data.name,
            descripcion: data.description,
            intervaloReservacion: data.reservedSpaceTime?.isValid()
              ? data.reservedSpaceTime.format('HH:mm:00')
              : undefined,
            configuracionPrecio: data.priceByTimeRange
              ? data.priceByTimeRange.map((price) => ({
                  horaInicio: price.inicio,
                  horaFin: price.fin ? price.fin : undefined,
                  precio: price.precio,
                }))
              : undefined,
            configuracionPrecioRecuperacion: data.recoveryPriceByTimeRange
              ? data.recoveryPriceByTimeRange.map((price) => ({
                  horaInicio: price.inicio,
                  horaFin: price.fin ? price.fin : undefined,
                  precio: price.precio,
                }))
              : undefined,
            precio: parseFloat(data.priceRoom),
          });
        }
        toast.success('Categoría de espacio hospitalario dado de alta correctamente');
      } else {
        if (data.type === '0') {
          await modifyTypeRoom({
            nombre: data.name,
            descripcion: data.description,
            intervaloReservacion: data.reservedSpaceTime?.isValid()
              ? data.reservedSpaceTime.format('HH:mm:00')
              : undefined,
            id: editData.id_TipoCuarto as string,
            precio: parseFloat(data.priceRoom),
            //codigoSATRecuperacion: data.codigoSATRecuperacion,
            //codigoSAT: data.codigoSAT,
            codigoUnidadMedida: data.codigoUnidadMedida,
            codigoUnidadMedidaRecuperacion: data.codigoUnidadMedidaRecuperacion
              ? data.codigoUnidadMedidaRecuperacion
              : undefined,
          });
        } else {
          await modifySurgeryRoomType({
            nombre: data.name,
            descripcion: data.description,
            id: editData.id_TipoQuirofano as string,
            intervaloReservacion: data.reservedSpaceTime?.isValid()
              ? data.reservedSpaceTime.format('HH:mm:00')
              : undefined,
            configuracionPrecio: data.priceByTimeRange
              ? data.priceByTimeRange.map((price) => ({
                  horaInicio: price.inicio,
                  horaFin: price.fin ? price.fin : undefined,
                  precio: price.precio,
                }))
              : undefined,
            configuracionPrecioRecuperacion: data.recoveryPriceByTimeRange
              ? data.recoveryPriceByTimeRange.map((price) => ({
                  horaInicio: price.inicio,
                  horaFin: price.fin ? price.fin : undefined,
                  precio: price.precio,
                }))
              : undefined,
            precio: parseFloat(data.priceRoom),
          });
        }
        toast.success('Categoría de espacio hospitalario modificado correctamente');
      }
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      editData
        ? toast.error('Error al modificar la categoría de espacio hospitalario')
        : toast.error('Error al intentar dar de alta la categoría de espacio hospitalario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewPriceByTimeRange = (config: IRecoveryRoomOperatingRoom[]) => {
    setValue('priceByTimeRange', [...config]);
  };

  const handleAddNewRecoveryPriceByTimeRange = (config: IRecoveryRoomOperatingRoom[]) => {
    setValue('recoveryPriceByTimeRange', [...config]);
  };

  const handleAddPriceRoom = (price: string) => {
    setValue('priceRoom', price);
  };

  useEffect(() => {
    setValue('reservedSpaceTime', dayjs(editData?.configuracionLimpieza, 'HH:mm:ss'));
  }, [editData]);

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={
          editData ? 'Modificar la categoría de espacio hospitalario' : 'Agregar la categoría de espacio hospitalario'
        }
      />
      <form onSubmit={handleSubmit(onSubmit, (e) => console.log(e))} id="form1" />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          bgcolor: 'background.paper',
          p: 3,
          overflowY: 'auto',
        }}
      >
        <Grid container spacing={1} sx={{ maxHeight: { xs: 500, xl: 700 } }}>
          <Grid item xs={12}>
            <Typography>Nombre</Typography>
            <TextField
              placeholder="Escribe un nombre..."
              fullWidth
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Descripción</Typography>
            <TextField
              placeholder="Escribe una descripción..."
              fullWidth
              multiline
              error={!!errors.description?.message}
              helperText={errors.description?.message}
              {...register('description')}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ alignItems: 'flex-end', display: 'flex' }}>
            <Box>
              <Typography>Espacio entre reservaciones:</Typography>
              <Controller
                control={control}
                name="reservedSpaceTime"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      ampm={false}
                      view="minutes"
                      views={['hours', 'minutes']}
                      label="Margen de reservación"
                      onChange={onChange}
                      value={value}
                      slotProps={{
                        textField: {
                          helperText: 'El tiempo esta representado en horas y minutos.',
                          error: !!errors.reservedSpaceTime?.message,
                          sx: {
                            '.MuiFormHelperText-root': {
                              color: 'error.main',
                              fontSize: 11,
                              fontWeight: 700,
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup row value={value} onChange={onChange}>
                    <FormControlLabel value={0} control={<Radio />} label="Hospitalización" />
                    <FormControlLabel value={1} control={<Radio />} label="Quirófano" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {watch('type') === '1' ? (
              <>
                <RoomHourCostTable
                  xs={xs}
                  updateRecoveryConfig={handleAddNewPriceByTimeRange}
                  data={watch('priceByTimeRange')}
                  formKey="formOperatingRoom"
                />
                <RoomHourCostTable
                  xs={xs}
                  updateRecoveryConfig={handleAddNewRecoveryPriceByTimeRange}
                  data={watch('recoveryPriceByTimeRange')}
                  isRecovery
                  formKey="formRecoveryRoom"
                />
              </>
            ) : (
              <>
                <Typography>Precio cuarto del hospitalario:</Typography>
                <AddPriceHospitalizationRoom
                  priceRoom={watch('priceRoom')}
                  updatePriceRoom={handleAddPriceRoom}
                  error={errors}
                />
              </>
            )}
          </Grid>
          {/*watch('type') === '1' && (
            <Grid item xs={6}>
              <Typography>
                Codigo de SAT de <b>Recuperación</b>
              </Typography>
              <TextField
                placeholder="Escribe un codigo de SAT para Recuperación"
                fullWidth
                error={!!errors.codigoSATRecuperacion?.message}
                helperText={errors.codigoSATRecuperacion?.message}
                {...register('codigoSATRecuperacion')}
              />
            </Grid>
          )
          <Grid item xs={6}>
            <Typography>Código de SAT</Typography>
            <TextField
              placeholder="Escribe un código de SAT"
              fullWidth
              error={!!errors.codigoSAT?.message}
              helperText={errors.codigoSAT?.message}
              {...register('codigoSAT')}
            />
          </Grid>
          {<Grid item xs={12} md={6}>
            <Typography>Unidad de Medida Contpaqi</Typography>
            <TextField
              fullWidth
              size="small"
              select
              label="Seleccione una unidad de medida"
              error={!!errors.codigoUnidadMedida}
              helperText={errors?.codigoUnidadMedida?.message}
              {...register('codigoUnidadMedida')}
              value={watch('codigoUnidadMedida')}
            >
              {!isLoadingConcepts &&
                sizeUnit.map((data) => (
                  <MenuItem value={data.id_UnidadMedida} key={data.id_UnidadMedida}>
                    {data.nombre}
                  </MenuItem>
                ))}
              {isLoadingConcepts && <MenuItem>Cargando...</MenuItem>}
            </TextField>
          </Grid>*/}
          {/*watch('type') === '1' && (
            <Grid item xs={6}>
              <Typography>
                Código de Unidad de Medida de <b>Recuperación</b>
              </Typography>
              <TextField
                label="Escribe un codigo de Unidad de Medida de Recuperación"
                fullWidth
                error={!!errors.codigoUnidadMedidaRecuperacion?.message}
                helperText={errors.codigoUnidadMedidaRecuperacion?.message}
                {...register('codigoUnidadMedidaRecuperacion')}
                value={watch('codigoUnidadMedidaRecuperacion')}
                select
              >
                {!isLoadingConcepts &&
                  sizeUnit.map((data) => (
                    <MenuItem value={data.id_UnidadMedida} key={data.id_UnidadMedida}>
                      {data.nombre}
                    </MenuItem>
                  ))}
                {isLoadingConcepts && <MenuItem>Cargando...</MenuItem>}
              </TextField>
            </Grid>
          )*/}
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', bgcolor: 'background.paper', p: 1 }}>
        <Button color="error" variant="outlined" disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="contained" type="submit" disabled={isLoading} form="form1">
          {isLoading ? <CircularProgress size={15} /> : editData ? 'Modificar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
};

interface InputsRoomHourCost {
  inicio: string;
  fin: string | null;
  precio: string;
  noneHour: boolean;
}

interface RoomHourCostTableProps {
  data: IRecoveryRoomOperatingRoom[];
  xs: boolean;
  updateRecoveryConfig: (config: IRecoveryRoomOperatingRoom[]) => void;
  isRecovery?: boolean;
  formKey: string;
}

const RoomHourCostTable = (props: RoomHourCostTableProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [configList, setConfigList] = useState<IRecoveryRoomOperatingRoom[]>(sortByInicio(data));

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsRoomHourCost>({
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

  const handleSave: SubmitHandler<InputsRoomHourCost> = (data) => {
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

  useEffect(() => {
    if (watch('noneHour')) {
      setValue('fin', '');
    }
  }, [watch('noneHour')]);

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <Typography variant="h5">{props.isRecovery ? 'Precio hora recuperacion' : 'Precio hora quirófano'}</Typography>
      <Card sx={{ flex: 1 }}>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={HOUR_COST_TABLE_HEADERS} />
            <TableBody>
              {configList &&
                configList.map((d, n) => (
                  <TableRow key={n}>
                    <TableCell>{`${d.inicio} - ${!d.fin ? 'En adelante' : d.fin}`}</TableCell>
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
            <form id={props.formKey} onSubmit={handleSubmit(handleSave)}>
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
            <Button variant="contained" form={props.formKey} type="submit">
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

const AddPriceHospitalizationRoom = (props: {
  updatePriceRoom: (price: string) => void;
  priceRoom: string;
  error: FieldErrors<Inputs>;
}) => {
  return (
    <Box>
      <TextField
        label="Precio"
        value={props.priceRoom}
        onChange={(e) => {
          if (!isValidFloat(e.target.value)) return;
          props.updatePriceRoom(e.target.value);
        }}
        error={!!props.error.priceRoom?.message}
        helperText={props.error.priceRoom?.message}
      />
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

function sortByInicio(array?: IRecoveryRoomOperatingRoom[]) {
  if (!array) return [];
  return array.sort((a, b) => {
    if (a.inicio === null) return 1;
    if (b.inicio === null) return -1;
    return parseInt(a.inicio) - parseInt(b.inicio);
  });
}
