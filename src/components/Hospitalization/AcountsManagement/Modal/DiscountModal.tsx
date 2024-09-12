import { Box, keyframes, Backdrop, Button, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getPatientBillById, createDiscountPatientBill } from '../../../../services/hospitalization/patientBillService';
import { DISCOUNT_TYPES, DiscountType, DiscountTypeKey, IDiscount } from '../../../../types/hospitalizationTypes';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { discountFormSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import { toast } from 'react-toastify';

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

interface DiscountFormData {
  Id_CuentaPaciente: string;
  MontoDescuento: number;
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

const LoaderWrapper = styled(Box)(({ theme }) => ({
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

const useDiscountData = (Id_CuentaPaciente: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [existingDiscount, setExistingDiscount] = useState<IDiscount | null>(null);

  useEffect(() => {
    const fetchExistingDiscount = async () => {
      try {
        const discounts = await getPatientBillById(Id_CuentaPaciente);
        if (discounts) {
          setExistingDiscount(discounts);
        }
      } catch (error) {
        console.error('Error al obtener el descuento existente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingDiscount();
  }, [Id_CuentaPaciente]);

  return { isLoading, existingDiscount };
};

export const DiscountModal = ({
  setOpen,
  Id_CuentaPaciente,
}: {
  setOpen: (open: boolean) => void;
  Id_CuentaPaciente: string;
}) => {
  const { isLoading, existingDiscount } = useDiscountData(Id_CuentaPaciente);
  const [isGeneratingDiscount, setIsGeneratingDiscount] = useState(false);
  const { control, handleSubmit, reset } = useForm<DiscountFormData>({
    defaultValues: {
      Id_CuentaPaciente,
      MontoDescuento: existingDiscount?.montoDescuento || 0,
      MotivoDescuento: existingDiscount?.motivoDescuento || '',
      TipoDescuento: existingDiscount?.tipoDescuento
        ? DISCOUNT_TYPES[existingDiscount.tipoDescuento as keyof typeof DISCOUNT_TYPES] || DISCOUNT_TYPES.Porcentaje
        : DISCOUNT_TYPES.Porcentaje,
    },
    resolver: zodResolver(discountFormSchema),
  });

  useEffect(() => {
    if (existingDiscount) {
      reset({
        Id_CuentaPaciente,
        MontoDescuento: existingDiscount.montoDescuento,
        MotivoDescuento: existingDiscount.motivoDescuento || '',
        TipoDescuento: DISCOUNT_TYPES[existingDiscount.tipoDescuento as keyof typeof DISCOUNT_TYPES],
      });
    } else {
      reset({
        Id_CuentaPaciente,
        MontoDescuento: 0,
        MotivoDescuento: '',
        TipoDescuento: DISCOUNT_TYPES.Porcentaje as DiscountType,
      });
    }
  }, [existingDiscount, Id_CuentaPaciente, reset]);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      setIsGeneratingDiscount(true);
      await createDiscountPatientBill({
        id_CuentaPaciente: data.Id_CuentaPaciente,
        montoDescuento: data.MontoDescuento,
        motivoDescuento: data.MotivoDescuento,
        tipoDescuento: data.TipoDescuento,
      });
      setOpen(false);
      toast.success('Descuento aplicado correctamente');
    } catch (error) {
      console.error('Error al aplicar el descuento:', error);
      toast.error('Error al aplicar el descuento');
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
  return (
    <Box sx={style}>
      <HeaderModal title={existingDiscount ? 'Editar descuento' : 'Aplicar descuento'} setOpen={setOpen} />
      <Box
        component="form"
        id="discount-form"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        sx={{ display: 'flex', flexDirection: 'column', p: 2, bgcolor: 'background.paper' }}
      >
        <Controller
          name="MontoDescuento"
          control={control}
          rules={{
            required: 'Este campo es requerido',
            min: { value: 0, message: 'El monto debe ser mayor o igual a 0' },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Monto de descuento
              </Typography>
              <TextField
                {...field}
                type="number"
                inputProps={{ step: '0.01' }}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? null : parseFloat(value));
                }}
                error={!!error}
                helperText={error?.message}
              />
            </>
          )}
        />

        <Controller
          name="MotivoDescuento"
          control={control}
          render={({ field }) => (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Motivo del descuento
              </Typography>
              <TextField {...field} multiline rows={3} />
            </>
          )}
        />

        <Controller
          name="TipoDescuento"
          control={control}
          rules={{ required: 'Este campo es requerido' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Tipo de descuento
              </Typography>
              <TextField {...field} select error={!!error} helperText={error?.message}>
                {Object.keys(DISCOUNT_TYPES).map((tipo) => (
                  <MenuItem key={tipo} value={DISCOUNT_TYPES[tipo as DiscountTypeKey]}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        />
        <Backdrop open={isGeneratingDiscount}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Coin>$</Coin>
            <LoaderWrapper />
          </Box>
        </Backdrop>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper' }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" type="submit" form="discount-form">
          {existingDiscount ? 'Actualizar' : 'Aplicar'}
        </Button>
      </Box>
    </Box>
  );
};
