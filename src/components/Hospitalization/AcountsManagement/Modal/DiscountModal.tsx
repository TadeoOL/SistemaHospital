import { Box, keyframes, Backdrop, Button, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { discountFormSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import { toast } from 'react-toastify';
import { DISCOUNT_TYPES, DiscountType, DiscountTypeKey } from '../../../../types/checkout/discountTypes';
import { applyDiscountPatientBill } from '../../../../services/checkout/patientAccount';
import { useGetPatientAccountDiscount } from '../../../../hooks/checkout/useGetPatientAccountDiscount';
import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';

interface DiscountFormData {
  Id_CuentaPaciente: string;
  MontoDescuento: string;
  MotivoDescuento: string;
  TipoDescuento: DiscountType;
}

const coinFlip = keyframes`
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
`;

const motion = keyframes`
  0%, 50%, 100% {
    transform: translateX(0) scale(1);
  }
  25% {
    transform: translateX(-100px) scale(0.3);
  }
  75% {
    transform: translateX(100px) scale(0.3);
  }
`;

const LoaderWrapper = styled(Box)(({ theme }: { theme: any }) => ({
  position: 'relative',
  fontSize: '48px',
  letterSpacing: '2px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: theme.palette.common.white,
  '&::before': {
    content: '"Generando descuento"',
    marginTop: '10px',
  },
  '&::after': {
    content: '""',
    width: '20px',
    height: '20px',
    backgroundColor: theme.palette.error.main,
    borderRadius: '50%',
    position: 'absolute',
    top: '70px',
    animation: `${motion} 3s ease-in-out infinite`,
  },
}));

const Coin = styled(Box)(() => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  textAlign: 'center',
  lineHeight: '48px',
  fontSize: '32px',
  fontWeight: 'bold',
  background: '#FFD700',
  color: '#DAA520',
  border: '4px double',
  boxSizing: 'border-box',
  boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, .1)',
  animation: `${coinFlip} 4s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
}));

export const DiscountModal = ({
  setOpen,
  Id_CuentaPaciente,
  onClose,
  open,
}: {
  setOpen: (open: boolean) => void;
  Id_CuentaPaciente: string;
  onClose: () => void;
  open: boolean;
}) => {
  const {
    isLoading,
    data: existingDiscount,
    refetch: refetchDiscount,
  } = useGetPatientAccountDiscount(Id_CuentaPaciente);

  const [isGeneratingDiscount, setIsGeneratingDiscount] = useState(false);

  const defaultValues = {
    Id_CuentaPaciente,
    TipoDescuento: DISCOUNT_TYPES.Porcentaje,
    MontoDescuento: '',
    MotivoDescuento: '',
  };

  const {
    formState: { errors },
    watch,
    setValue,
    register,
    handleSubmit,
  } = useForm<DiscountFormData>({
    defaultValues,
    values: {
      Id_CuentaPaciente,
      TipoDescuento:
        DISCOUNT_TYPES[existingDiscount?.tipoDescuento as keyof typeof DISCOUNT_TYPES] || DISCOUNT_TYPES.Porcentaje,
      MontoDescuento: Number(existingDiscount?.montoDescuento) > 0 ? existingDiscount?.montoDescuento.toString() : '',
      MotivoDescuento: existingDiscount?.motivoDescuento || '',
    },
    resolver: zodResolver(discountFormSchema),
  });

  const onSubmit = async (data: DiscountFormData) => {
    try {
      setIsGeneratingDiscount(true);
      await applyDiscountPatientBill({
        id: data.Id_CuentaPaciente,
        montoDescuento: Number(data.MontoDescuento),
        motivoDescuento: data.MotivoDescuento,
        tipoDescuento: data.TipoDescuento,
      });
      setOpen(false);
      toast.success('Descuento aplicado correctamente');
      refetchDiscount();
      onClose();
    } catch (error) {
      console.error('Error al aplicar el descuento:', error);
      toast.error('Error al aplicar el descuento');
    } finally {
      setIsGeneratingDiscount(false);
    }
  };

  const handleDiscountTypeChange = () => {
    const discountType = watch('TipoDescuento');
    setValue('MontoDescuento', '');
    console.log('discountType:', discountType);
  };

  useEffect(() => {
    handleDiscountTypeChange();
  }, [watch('TipoDescuento')]);

  const handleCancel = async () => {
    const data = watch();
    console.log('handleCancel:');
    try {
      setIsGeneratingDiscount(true);
      await applyDiscountPatientBill({
        id: data.Id_CuentaPaciente,
        montoDescuento: Number(0),
        motivoDescuento: data.MotivoDescuento,
        tipoDescuento: data.TipoDescuento,
      });
      setOpen(false);
      toast.success('Descuento eliminado correctamente');
      refetchDiscount();
    } catch (error) {
      console.error('Error al eliminar el descuento:', error);
      toast.error('Error al eliminar el descuento');
    } finally {
      setIsGeneratingDiscount(false);
    }
  };

  if (isLoading)
    return (
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
    );

  const actions = (
    <>
      <Button variant="outlined" color="error" onClick={handleCancel}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button variant="contained" type="submit" form="discount-form">
        {existingDiscount ? 'Actualizar' : 'Aplicar'}
      </Button>
    </>
  );

  return (
    <ModalBasic header={'Descuento'} isLoading={isLoading} onClose={onClose} open={open} actions={actions}>
      <Box
        component="form"
        id="discount-form"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          bgcolor: 'background.paper',
          minWidth: { xs: 380, sm: 550 },
        }}
      >
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <SelectBasic
              label="Tipo de descuento"
              value={watch('TipoDescuento')}
              {...register('TipoDescuento')}
              error={!!errors.TipoDescuento}
              helperText={errors.TipoDescuento?.message}
              select
              uniqueProperty="value"
              displayProperty="label"
              options={Object.keys(DISCOUNT_TYPES).map((tipo) => ({
                value: DISCOUNT_TYPES[tipo as DiscountTypeKey],
                label: tipo,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic
              value={watch('MontoDescuento')}
              label="Monto de descuento"
              {...register('MontoDescuento')}
              error={!!errors.MontoDescuento}
              helperText={errors.MontoDescuento?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic
              value={watch('MotivoDescuento')}
              label="Motivo del descuento"
              {...register('MotivoDescuento')}
              error={!!errors.MotivoDescuento}
              helperText={errors.MotivoDescuento?.message}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Backdrop open={isGeneratingDiscount}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Coin>$</Coin>
            <LoaderWrapper />
          </Box>
        </Backdrop>
      </Box>
    </ModalBasic>
  );
};
