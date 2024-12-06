import { Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import 'dayjs/locale/es-mx';
import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';
import { ICategoryNormalRoom } from '../interfaces/room-category.interface';
import { normalRoomCategorySchema } from '../schemas/normal-room-category.schemas';
import { modifyNormalRoomCategory, registerNormalRoomCategory } from '../services/normal-room-categories';
import { useApiConfigStore } from '@/store/apiConfig';
import { ProductType, productTypeLabel } from '@/types/contpaqiTypes';
import { ContpaqiProductService } from '@/services/contpaqi/contpaqi.product.service';
import { InvoiceProductService } from '@/services/invoice/invoice.product.service';
dayjs.locale('es-mx');

type Inputs = {
  name: string;
  description: string;
  intervaloReservacion: Dayjs | null;
  type: string;
  priceRoom: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  tipoProducto: number;
  codigoProducto?: string;
};

interface NormalRoomCategoriesModalProps {
  open: boolean;
  onSuccess: Function;
  onClose: Function;
  defaultData?: ICategoryNormalRoom | null;
}

export const NormalRoomCategoriesModal = (props: NormalRoomCategoriesModalProps) => {
  const { open, onClose, onSuccess, defaultData } = props;
  const apiUrl = useApiConfigStore((state) => state.apiUrl);
  const hasInvoiceService = !!apiUrl;

  const [isLoading, setIsLoading] = useState(false);
  const defaultValues = {
    name: '',
    description: '',
    intervaloReservacion: null,
    type: '0',
    priceRoom: '0',
    codigoSAT: '',
    codigoUnidadMedida: 0,
    tipoProducto: ProductType.TIPO_CUARTO,
    codigoProducto: '',
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(normalRoomCategorySchema(hasInvoiceService)),
    defaultValues: defaultValues,
  });

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
      type: defaultData.id_TipoCuarto ? '0' : '1',
      priceRoom: defaultData.precio?.toString(),
      codigoUnidadMedida: defaultData.codigoUnidadMedida ? defaultData.codigoUnidadMedida : 0,
      codigoSAT: defaultData.codigoSAT,
      codigoProducto: defaultData.codigoProducto,
      tipoProducto: defaultValues.tipoProducto,
    };

    reset(newValues);
  };

  useEffect(() => {
    loadForm();
  }, [defaultData?.id_TipoCuarto]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const roomCategoryData = {
        nombre: data.name,
        descripcion: data.description,
        intervaloReservacion: getDateOrNull(data.intervaloReservacion)?.format('HH:mm:00'),
        precio: parseFloat(data.priceRoom),
        codigoSAT: data.codigoSAT,
        codigoUnidadMedida: data.codigoUnidadMedida,
      };

      const handleInvoiceServices = async (id_Relacion: string, isModifying: boolean) => {
        if (hasInvoiceService) {
          const resInvoice = await InvoiceProductService.addProductToInvoice({
            id: defaultData?.id_ProductoFactura || undefined,
            codigoSAT: data.codigoSAT || '',
            codigoUnidadMedida: data.codigoUnidadMedida?.toString() || '',
            codigoProducto: data.codigoProducto || '',
            id_Relacion,
            tipoProducto: data.tipoProducto || ProductType.TIPO_CUARTO,
          });

          const contpaqiData = {
            nombre: data.name,
            codigoContpaq: resInvoice.producto.codigoProducto ?? '',
            precioVenta: roomCategoryData.precio,
            iva: defaultData?.iva ?? false,
            codigoSAT: data.codigoSAT ?? '',
            id_UnidadMedida: Number(data.codigoUnidadMedida) || 0,
          };

          if (isModifying) {
            await ContpaqiProductService.modifyProductToInvoiceService(contpaqiData);
          } else {
            await ContpaqiProductService.addProductToInvoiceService(contpaqiData);
          }
        }
      };

      if (!defaultData) {
        const res = await registerNormalRoomCategory(roomCategoryData);
        await handleInvoiceServices(res.id, false);
        toast.success('Categoría de espacio hospitalario dado de alta correctamente');
      } else {
        const res = await modifyNormalRoomCategory({
          ...roomCategoryData,
          id: defaultData.id_TipoCuarto as string,
        });
        await handleInvoiceServices(res.id, true);
        toast.success('Categoría de espacio hospitalario modificado correctamente');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        defaultData
          ? 'Error al modificar la categoría de espacio hospitalario'
          : 'Error al intentar dar de alta la categoría de espacio hospitalario'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', bgcolor: 'background.paper', p: 1 }}>
      <Button color="error" variant="outlined" disabled={isLoading}>
        Cancelar
      </Button>
      <Button variant="contained" type="submit" disabled={isLoading} form="form1">
        {isLoading ? <CircularProgress size={15} /> : defaultData ? 'Modificar' : 'Agregar'}
      </Button>
    </Box>
  );

  return (
    <ModalBasic
      isLoading={isLoading}
      open={open}
      header={defaultData ? 'Modificar categoria de cuarto hospitalario' : 'Agregar categoria de cuarto hospitalario'}
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
        <Grid item xs={12} md={6}>
          <InputBasic
            label="Precio del cuarto"
            placeholder="Escribe un precio..."
            fullWidth
            error={!!errors.priceRoom?.message}
            helperText={errors.priceRoom?.message}
            {...register('priceRoom')}
          />
        </Grid>

        {hasInvoiceService && (
          <>
            <Grid item xs={6}>
              <InputBasic
                placeholder="Escribe un código de SAT"
                label="Código de SAT"
                fullWidth
                error={!!errors.codigoSAT?.message}
                helperText={errors.codigoSAT?.message}
                {...register('codigoSAT')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputBasic
                fullWidth
                label="Unidad de Medida"
                type="number"
                placeholder="Escribe una unidad de medida"
                error={!!errors.codigoUnidadMedida}
                helperText={errors?.codigoUnidadMedida?.message}
                {...register('codigoUnidadMedida', {
                  valueAsNumber: true,
                })}
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
            <Grid item xs={12} md={6}>
              <InputBasic
                label="Código de Producto"
                placeholder="Escribe un código de producto"
                fullWidth
                disabled
                {...register('codigoProducto')}
              />
            </Grid>
          </>
        )}
      </Grid>
    </ModalBasic>
  );
};
