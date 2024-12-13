import { Box, Button, CircularProgress, Grid, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useXRayPaginationStore } from '../../../../store/hospitalization/xrayPagination';
import { serviceSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import {
  createHospitalService,
  modifyHospitalService,
} from '../../../../services/hospitalServices/hospitalServicesService';
import { ServiceType } from '../../../../types/hospitalServices/hospitalServiceTypes';
import { IService } from '@/types/hospitalizationTypes';
import { ProductType, productTypeLabel } from '@/types/contpaqiTypes';
import { useApiConfigStore } from '@/store/apiConfig';
import { InputBasic, SelectBasic } from '@/common/components';
import { ContpaqiProductService } from '@/services/contpaqi/contpaqi.product.service';
import { InvoiceProductService } from '@/services/invoice/invoice.product.service';
import { useGetSizeUnit } from '@/hooks/contpaqi/useGetSizeUnit';

const REQUEST_TYPES = [
  {
    value: ServiceType.Laboratorio,
    label: 'Laboratorio',
  },
  {
    value: ServiceType.Radiografia,
    label: 'Radiografía',
  },
  {
    value: ServiceType.Ultrasonido,
    label: 'Ultra sonido',
  },
  {
    value: ServiceType.Electrocardiograma,
    label: 'Electrocardiograma',
  },
  {
    value: ServiceType.Cuidado_Neonatal,
    label: 'Cuidado Neonatal',
  },
  {
    value: ServiceType.Consulta_Medica,
    label: 'Consulta Medica',
  },
  {
    value: ServiceType.Otros,
    label: 'Otros',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
interface AddAndEditServiceProps {
  setOpen: Function;
  service?: IService;
}

interface Inputs {
  id?: string;
  name: string;
  price: number;
  type: number;
  description: string;
  autorization: boolean;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  tipoProducto?: number;
  codigoProducto?: string;
}
export const AddAndEditXRay = (props: AddAndEditServiceProps) => {
  const { service } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const hasInvoiceService = useApiConfigStore((state) => state.hasInvoiceService);
  const refetch = useXRayPaginationStore((state) => state.fetchData);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      id: service?.id_Servicio ?? '',
      description: service?.descripcion ?? '',
      name: service?.nombre ?? '',
      price: service?.precio ?? 0,
      type: service?.tipoServicio ?? 0,
      autorization: service?.requiereAutorizacion ?? false,
      codigoSAT: service?.codigoSAT ?? '',
      codigoUnidadMedida: service?.codigoUnidadMedida ?? 0,
      tipoProducto: ProductType.SERVICIO,
      codigoProducto: service?.codigoProducto ?? '',
    },
    resolver: zodResolver(serviceSchema(hasInvoiceService)),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const serviceData = {
        descripcion: data.description,
        nombre: data.name,
        precio: data.price,
        tipoServicio: data.type,
        requiereAutorizacion: data.autorization,
      };

      const handleInvoiceServices = async (id_Relacion: string, isModifying: boolean) => {
        if (hasInvoiceService) {
          const resInvoice = await InvoiceProductService.addProductToInvoice({
            id: service?.id_ProductoFactura || undefined,
            codigoSAT: data.codigoSAT || '',
            codigoUnidadMedida: data.codigoUnidadMedida?.toString() || '',
            codigoProducto: data.codigoProducto || '',
            id_Relacion,
            tipoProducto: data.tipoProducto || ProductType.SERVICIO,
          });

          const contpaqiData = {
            nombre: data.name,
            codigoContpaq: resInvoice.producto.codigoProducto ?? '',
            precioVenta: Number.isNaN(serviceData.precio) ? 0 : serviceData.precio,
            iva: service?.iva ?? false,
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

      if (service) {
        const res = await modifyHospitalService({ ...serviceData, id: data.id as string });
        await handleInvoiceServices(res.id, true);
      } else {
        const res = await createHospitalService(serviceData);
        await handleInvoiceServices(res.id, false);
      }

      toast.success(`Solicitud ${service ? 'modificado' : 'agregado'} correctamente`);
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error al ${service ? 'modificar' : 'agregar'} la solicitud.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={props.service ? 'Modificar la solicitud' : 'Agregar la solicitud'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ bgcolor: 'background.paper', p: 2, display: 'flex' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Nombre</Typography>
              <TextField
                label="Nombre..."
                fullWidth
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Precio</Typography>
              <TextField
                label="Precio..."
                type="number"
                fullWidth
                {...register('price')}
                error={!!errors.price?.message}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={6} display="flex" alignItems="center">
              <Typography>Requiere Autorización</Typography>
              <Switch
                {...register('autorization')}
                checked={watch('autorization')}
                onChange={(e) => setValue('autorization', e.target.checked)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Tipo de solicitud</Typography>
              <TextField
                label="Tipo..."
                select
                fullWidth
                value={watch('type')}
                onChange={(e) => setValue('type', parseInt(e.target.value))}
                error={!!errors.type?.message}
                helperText={errors.type?.message}
              >
                <MenuItem key={0} value={0} disabled>
                  Seleccionar
                </MenuItem>
                {REQUEST_TYPES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Descripción</Typography>
              <TextField label="Descripción..." multiline fullWidth {...register('description')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputBasic label="Codigo SAT" placeholder="Escribe un código SAT" fullWidth {...register('codigoSAT')} />
            </Grid>
            <Grid item xs={12} md={6}>
              {isLoadingConcepts ?
              (<CircularProgress size={15} />)
              :
              (<SelectBasic
                value={watch('codigoUnidadMedida')}
                label="Código Unidad de Medida"
                options={sizeUnit}
                uniqueProperty="id_UnidadMedida"
                displayProperty="nombre"
                placeholder="Seleccione una Unidad de Medida"
                helperText={errors?.codigoUnidadMedida?.message}
                error={!!errors.codigoUnidadMedida}
                {...register('codigoUnidadMedida')}
              />)}
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
          </Grid>
        </Box>
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            p: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button variant="outlined" color="error">
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={25} /> : 'Aceptar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
