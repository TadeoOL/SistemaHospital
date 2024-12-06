import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Collapse,
  Grid,
  Stack,
  TableCell,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import 'dayjs/locale/es-mx';
import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';
import { operatingRoomCategorySchema, operatingRoomPriceRangeSchema } from '../schemas/operating-room.schemas';
import { ICategoryOperatingRoom, IRoomPriceRange } from '../interfaces/operating-room.interface';
import { modifyOperatingRoomCategory, registerOperatingRoomCategory } from '../services/operating-room-categories';
import { isValidFloat, isValidInteger, isValidIntegerIncludeZero } from '@/utils/functions/dataUtils';
import { TableContainer } from '@mui/material';
import { Table } from '@mui/material';
import { TableHeaderComponent } from '@/components/Commons/TableHeaderComponent';
import { TableBody } from '@mui/material';
import { TableRow } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import { useApiConfigStore } from '@/store/apiConfig';
import { InvoiceProductService } from '@/services/invoice/invoice.product.service';
import { ProductType, productTypeLabel } from '@/types/contpaqiTypes';
import { ContpaqiProductService } from '@/services/contpaqi/contpaqi.product.service';

// import { modifyTypeRoom, registerTypeRoom } from '../../../../../services/programming/typesRoomService';

//import { useGetSizeUnit } from '../../../../hooks/contpaqi/useGetSizeUnit';
dayjs.locale('es-mx');

const HOUR_COST_TABLE_HEADERS = ['Tiempo', 'Precio', 'Acción'];

type Inputs = {
  name: string;
  description: string;
  intervaloReservacion: Dayjs | null;
  priceByTimeRangeHospitalization: IRoomPriceRange[];
  priceByTimeRangeRecovery: IRoomPriceRange[];
  priceByTimeRangeOutpatient: IRoomPriceRange[];
  type: string;
  priceRoom: string;
  //Facturacion
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoProducto?: string;
  tipoProducto?: number;
  codigoSATRecuperacion?: string;
  codigoProductoRecuperacion?: string;
  codigoUnidadMedidaRecuperacion?: number;
};

interface OperatingRoomCategoriesModalProps {
  open: boolean;
  onSuccess: Function;
  onClose: Function;
  defaultData?: ICategoryOperatingRoom | null;
}

const OperatingRoomCategoriesModal = (props: OperatingRoomCategoriesModalProps) => {
  const { open, onClose, onSuccess, defaultData } = props;
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('md'));
  const hasInvoiceService = useApiConfigStore((state) => state.hasInvoiceService);

  const [isLoading, setIsLoading] = useState(false);
  //const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const defaultValues = {
    name: '',
    description: '',
    priceByTimeRangeHospitalization: [],
    priceByTimeRangeRecovery: [],
    priceByTimeRangeOutpatient: [],
    intervaloReservacion: null,
    priceRoom: '0',
    codigoSATRecuperacion: '',
    codigoSAT: '',
    codigoUnidadMedida: 0,
    codigoUnidadMedidaRecuperacion: 0,
    tipoProducto: ProductType.TIPO_QUIROFANO,
    codigoProducto: '',
  };

  const {
    register,
    handleSubmit,
    // setValue,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(operatingRoomCategorySchema(hasInvoiceService)),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (!defaultData) {
      reset(defaultValues);
      return;
    }

    reset({
      name: defaultData.nombre,
      description: defaultData.descripcion,
      priceByTimeRangeHospitalization: defaultData.configuracionPrecio.hospitalizacion,
      priceByTimeRangeRecovery: defaultData.configuracionPrecioRecuperacion,
      priceByTimeRangeOutpatient: defaultData.configuracionPrecio.ambulatoria,
      intervaloReservacion: getDateOrNull(defaultData.intervaloReservacion),
      codigoSATRecuperacion: defaultData.codigoSATRecuperacion,
      codigoSAT: defaultData.codigoSAT,
      codigoUnidadMedida: defaultData.codigoUnidadMedida ? defaultData.codigoUnidadMedida : 0,
      codigoUnidadMedidaRecuperacion: defaultData.codigoUnidadMedidaRecuperacion
        ? defaultData.codigoUnidadMedidaRecuperacion
        : 0,
      tipoProducto: defaultValues.tipoProducto,
      codigoProducto: defaultData.codigoProducto,
    });
  }, [defaultData]);

  const getDateOrNull = (date: string | undefined | null | Dayjs) => {
    if (!date) return null;

    if (typeof date === 'string') {
      const [hour, minute, second] = date.split(':');
      return dayjs().hour(parseInt(hour)).minute(parseInt(minute)).second(parseInt(second));
    }

    return date;
  };

  const loadForm = () => {
    if (!defaultData) {
      reset(defaultValues);
      return;
    }

    const newValues: any = {
      name: defaultData.nombre,
      description: defaultData.descripcion,
      intervaloReservacion: getDateOrNull(defaultData.intervaloReservacion),
      priceRoom: defaultData.precio?.toString(),
      codigoSATRecuperacion: defaultData.codigoSATRecuperacion,
      codigoSAT: defaultData.codigoSAT,
      codigoUnidadMedida: defaultData.codigoUnidadMedida ? defaultData.codigoUnidadMedida : 0,
      codigoUnidadMedidaRecuperacion: defaultData.codigoUnidadMedidaRecuperacion
        ? defaultData.codigoUnidadMedidaRecuperacion
        : 0,
      tipoProducto: defaultValues.tipoProducto,
      codigoProducto: defaultData.codigoProducto,
    };

    reset(newValues);
  };

  useEffect(() => {
    loadForm();
  }, [defaultData?.id_TipoQuirofano]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const getRange = (range: IRoomPriceRange[]) => {
      if (!range) return [];
      return range.map((price) => ({
        horaInicio: price.horaInicio,
        horaFin: price.horaFin ?? null,
        precio: price.precio,
      }));
    };
    try {
      const roomCategoryData = {
        nombre: data.name,
        descripcion: data.description,
        intervaloReservacion: getDateOrNull(data.intervaloReservacion)?.format('HH:mm:00'),
        precio: parseFloat(data.priceRoom),
        configuracionPrecio: {
          hospitalizacion: getRange(data.priceByTimeRangeHospitalization),
          ambulatoria: getRange(data.priceByTimeRangeOutpatient),
        },
        configuracionPrecioRecuperacion: getRange(data.priceByTimeRangeRecovery),
      };

      const handleInvoiceServices = async (id_Relacion: string, isModifying: boolean) => {
        if (hasInvoiceService) {
          const resInvoice = await InvoiceProductService.addProductToInvoice({
            id: defaultData?.id_ProductoFactura || undefined,
            codigoSAT: data.codigoSAT || '',
            codigoUnidadMedida: data.codigoUnidadMedida?.toString() || '',
            codigoProducto: data.codigoProducto || '',
            codigoSATRecuperacion: data.codigoSATRecuperacion || '',
            codigoUnidadMedidaRecuperacion: data.codigoUnidadMedidaRecuperacion?.toString() || '',
            id_Relacion,
            tipoProducto: ProductType.TIPO_QUIROFANO,
          });

          // Datos para quirófano
          const contpaqiData = {
            nombre: data.name,
            codigoContpaq: resInvoice.producto.codigoProducto ?? '',
            precioVenta: Number.isNaN(roomCategoryData.precio) ? 0 : roomCategoryData.precio,
            iva: defaultData?.iva ?? false,
            codigoSAT: data.codigoSAT ?? '',
            id_UnidadMedida: Number(data.codigoUnidadMedida) || 0,
          };

          // Datos para recuperación
          const contpaqiRecoveryData = {
            nombre: `${data.name} - Recuperación`,
            codigoContpaq: resInvoice.productoRecuperacion?.codigoProducto ?? '',
            precioVenta: Number.isNaN(roomCategoryData.precio) ? 0 : roomCategoryData.precio,
            iva: defaultData?.ivaRecuperacion ?? false,
            codigoSAT: data.codigoSATRecuperacion ?? '',
            id_UnidadMedida: Number(data.codigoUnidadMedidaRecuperacion) || 0,
          };

          if (isModifying) {
            await ContpaqiProductService.modifyProductToInvoiceService(contpaqiData);
            await ContpaqiProductService.modifyProductToInvoiceService(contpaqiRecoveryData);
          } else {
            await ContpaqiProductService.addProductToInvoiceService(contpaqiData);
            await ContpaqiProductService.addProductToInvoiceService(contpaqiRecoveryData);
          }
        }
      };

      if (!defaultData) {
        const res = await registerOperatingRoomCategory(roomCategoryData);
        await handleInvoiceServices(res.id, false);
        toast.success('Categoría de quirófano dada de alta correctamente');
      } else {
        const res = await modifyOperatingRoomCategory({
          ...roomCategoryData,
          id: defaultData.id_TipoQuirofano as string,
        });
        await handleInvoiceServices(res.id, true);
        toast.success('Categoría de quirófanos modificada correctamente');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        defaultData
          ? 'Error al modificar la categoría de quirófanos'
          : 'Error al intentar dar de alta la categoría de quirófanos'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewPriceByTimeRange = (key: string) => {
    return (config: IRoomPriceRange[]) => setValue(key as any, [...config]);
  };

  const actions = (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', bgcolor: 'background.paper', p: 1 }}>
      <Button color="error" variant="outlined" disabled={isLoading}>
        Cancelar
      </Button>
      <Button variant="contained" disabled={isLoading} form="form1" type="submit">
        {isLoading ? <CircularProgress size={15} /> : defaultData ? 'Modificar' : 'Agregar'}
      </Button>
    </Box>
  );

  return (
    <ModalBasic
      isLoading={isLoading}
      open={open}
      header={defaultData ? 'Modificar categoria de quirofanos' : 'Agregar categoria de quirofanos'}
      onClose={onClose}
      actions={actions}
    >
      <form onSubmit={handleSubmit(onSubmit, (e) => console.log(e))} id="form1" />
      <Grid container spacing={1} sx={{ maxHeight: { xs: 500, xl: 700 } }}>
        <Grid item xs={12}>
          <InputBasic
            label="Nombre"
            placeholder="Escribe un nombre..."
            fullWidth
            error={!!errors.name?.message}
            helperText={errors.name?.message}
            {...register('name')}
          />
        </Grid>
        <Grid item xs={12}>
          <InputBasic
            label="Descripción"
            placeholder="Escribe una descripción..."
            fullWidth
            multiline
            error={!!errors.description?.message}
            helperText={errors.description?.message}
            {...register('description')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack>
            <Typography
              sx={{
                pb: 1,
              }}
            >
              Espacio entre reservaciones:
            </Typography>
            <Controller
              control={control}
              name="intervaloReservacion"
              render={({ field: { onChange, value } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    ampm={false}
                    view="minutes"
                    views={['hours', 'minutes']}
                    onChange={onChange}
                    value={value}
                    slotProps={{
                      textField: {
                        helperText: 'El tiempo esta representado en horas y minutos.',
                        error: !!errors.intervaloReservacion?.message,
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
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <>
            <PriceRangeTable
              xs={xs}
              title={'Precio por Hora Ambulatoria'}
              updateRecoveryConfig={handleAddNewPriceByTimeRange('priceByTimeRangeOutpatient')}
              data={watch('priceByTimeRangeOutpatient')}
            />
            <PriceRangeTable
              xs={xs}
              title={'Precio por Hora Hospitalización'}
              updateRecoveryConfig={handleAddNewPriceByTimeRange('priceByTimeRangeHospitalization')}
              data={watch('priceByTimeRangeHospitalization')}
            />
            <PriceRangeTable
              xs={xs}
              title={'Precio por Hora Recuperación'}
              updateRecoveryConfig={handleAddNewPriceByTimeRange('priceByTimeRangeRecovery')}
              data={watch('priceByTimeRangeRecovery')}
            />
          </>
        </Grid>
        {hasInvoiceService && (
          <>
            <Grid item xs={6}>
              <InputBasic
                label="Codigo SAT "
                placeholder="Escribe un codigo de SAT"
                {...register('codigoSAT')}
                error={!!errors.codigoSAT?.message}
                helperText={errors.codigoSAT?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputBasic
                label="Codigo SAT Recuperación"
                placeholder="Escribe un codigo de SAT para Recuperación"
                {...register('codigoSATRecuperacion')}
                error={!!errors.codigoSATRecuperacion?.message}
                helperText={errors.codigoSATRecuperacion?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputBasic
                label="Codigo Unidad Medida"
                placeholder="Escribe un codigo de Unidad de Medida"
                type="number"
                {...register('codigoUnidadMedida', {
                  valueAsNumber: true,
                })}
                error={!!errors.codigoUnidadMedida?.message}
                helperText={errors.codigoUnidadMedida?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputBasic
                label="Codigo Unidad Medida Recuperación"
                placeholder="Escribe un codigo de Unidad de Medida de Recuperación"
                type="number"
                {...register('codigoUnidadMedidaRecuperacion', {
                  valueAsNumber: true,
                })}
                error={!!errors.codigoUnidadMedidaRecuperacion?.message}
                helperText={errors.codigoUnidadMedidaRecuperacion?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBasic
                label="Tipo de Producto"
                placeholder="Seleccione un Tipo de Producto"
                value={watch('tipoProducto')}
                error={!!errors.tipoProducto}
                helperText={errors?.tipoProducto?.message}
                disabled
                options={Object.entries(ProductType)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([_key, value]) => ({
                    id: value,
                    tipo: productTypeLabel[value as keyof typeof productTypeLabel],
                  }))}
                uniqueProperty="id"
                displayProperty="tipo"
                {...register('tipoProducto')}
              />
            </Grid>
          </>
        )}
      </Grid>
    </ModalBasic>
  );
};

// interface InputsRoomHourCost {
//   inicio: string;
//   fin: string | null;
//   precio: string;
//   noneHour: boolean;
// }

interface RoomHourCostTableProps {
  title?: string;
  data: IRoomPriceRange[];
  xs: boolean;
  updateRecoveryConfig: (config: IRoomPriceRange[]) => void;
}

const PriceRangeTable = (props: RoomHourCostTableProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [configList, setConfigList] = useState<IRoomPriceRange[]>(sortByInicio(data));

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      horaInicio: '',
      horaFin: '',
      precio: '',
      noneHour: false,
    },
    resolver: open ? zodResolver(operatingRoomPriceRangeSchema) : undefined,
  });

  const handleAdd = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleSave: SubmitHandler<any> = (data) => {
    if (!open) return handleAdd();

    const newData = {
      horaInicio: data.horaInicio,
      horaFin: data.horaFin ? data.horaFin : null,
      precio: data.precio.toString(),
    };

    if (!validateConfig(configList, newData)) return;
    const config = [...configList, newData];
    setConfigList((prev) => sortByInicio([...prev, { ...newData, fin: newData.horaFin ? newData.horaFin : '' }]));
    props.updateRecoveryConfig(config);

    reset();

    if (data.horaFin) {
      setValue('horaInicio', data.horaFin);
    } else {
      setOpen(false);
    }
  };

  const handleDelete = (price: string) => {
    const config = configList.filter((d) => d.precio !== price);
    setConfigList((prev) => prev.filter((d) => d.precio !== price));
    props.updateRecoveryConfig(config);
  };

  const handleError = (err: any) => {
    console.log('err:', err);
  };

  useEffect(() => {
    if (watch('noneHour')) {
      setValue('fin', '');
    }
  }, [watch('noneHour')]);

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <Typography variant="h5">{props.title}</Typography>
      <Card sx={{ flex: 1 }}>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={HOUR_COST_TABLE_HEADERS} />
            <TableBody>
              {configList &&
                configList.map((d, n) => (
                  <TableRow key={n}>
                    <TableCell>{`${d.horaInicio} - ${!d.horaFin ? 'En adelante' : d.horaFin}`}</TableCell>
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
        {/* {!configList ||
          (configList.length === 0 && (
            <NoDataInTableInfo infoTitle="No hay precios agregados" sizeIcon={30} variantText="h4" />
          ))} */}
      </Card>
      <Box sx={{ mt: 1, display: 'flex' }}>
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Collapse in={open}>
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
                value={watch('horaInicio')}
                onChange={(e) => {
                  if (!isValidIntegerIncludeZero(e.target.value)) return;
                  setValue('horaInicio', e.target.value);
                }}
                error={!!errors.horaInicio?.message}
                helperText={errors.horaInicio?.message as any}
              />
              <TextField
                label="Fin"
                fullWidth
                value={watch('horaFin')}
                disabled={watch('noneHour')}
                onChange={(e) => {
                  if (!isValidInteger(e.target.value)) return;
                  setValue('horaFin', e.target.value);
                }}
                error={!!errors.horaFin?.message}
                helperText={errors.horaFin?.message as any}
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
                helperText={errors.precio?.message as any}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption">Sin hora de finalización</Typography>
              <Checkbox checked={watch('noneHour')} {...register('noneHour')} />
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
          <Box>
            <Button variant="contained" onClick={handleSubmit(handleSave, handleError)}>
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

function validateConfig(currentConfig: IRoomPriceRange[], newConfig: IRoomPriceRange): boolean {
  console.log('newConfig:', newConfig);
  for (const existingConfig of currentConfig) {
    if (existingConfig.horaFin === null) {
      if (newConfig.horaInicio >= existingConfig.horaInicio) {
        toast.warning('No se puede crear una configuración que comienza después de una configuración abierta.');
        return false;
      }
    } else {
      if (
        (newConfig.horaInicio >= existingConfig.horaInicio && newConfig.horaInicio < existingConfig.horaFin) ||
        (newConfig.horaFin !== null &&
          newConfig.horaFin > existingConfig.horaInicio &&
          newConfig.horaFin <= existingConfig.horaFin) ||
        (newConfig.horaInicio <= existingConfig.horaInicio &&
          (newConfig.horaFin === null || newConfig.horaFin >= existingConfig.horaFin))
      ) {
        toast.warning('El rango de horas está interfiere con una configuración existente.');
        return false;
      }
    }
  }

  if (currentConfig.some((d) => d.precio === newConfig.precio)) {
    toast.warning('Ya existe un precio con este valor.');
    return false;
  }

  return true;
}

function sortByInicio(array?: IRoomPriceRange[]) {
  if (!array) return [];
  return array.sort((a, b) => {
    return parseInt(a.horaInicio) - parseInt(b.horaInicio);
  });
}

export default OperatingRoomCategoriesModal;
