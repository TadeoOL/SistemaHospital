import { useEffect, useState } from 'react';
import { Grid, Button, Stepper, useMediaQuery, Typography, Stack } from '@mui/material';
import { ModalBasic } from '@/common/components/ModalBasic';
import CancelIcon from '@mui/icons-material/Cancel';
import { FieldErrors, SubmitHandler, useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useFetchProvider } from '../hooks/useFetchProvider';
import { addNewProvider, modifyProvider } from '../services/providers';
import { IProvider } from '../interfaces/providers.interface';
import { addNewProviderSchema } from '../schemas/providers.schema';
import { Step } from '@mui/material';
import { StepLabel } from '@mui/material';
import { useTheme } from '@mui/material';
import { BasicInfoForm } from './BasicInfoForm';
import { FiscalForm } from './FiscalForm';
import { CertificateForm } from './CertificateForm';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import { useGetProvider } from '@/hooks/useGetProvider';

interface ProvidersModalProps {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

const renderStepForm = (step: number, errors: FieldErrors<IProvider>, register: UseFormRegister<IProvider>, setValue: UseFormSetValue<IProvider>, providerType?: number) => {
  switch (step) {
    case 0:
      return <BasicInfoForm errors={errors} register={register} />;
    case 1:
      return <FiscalForm errors={errors} register={register} tipoContribuyente={providerType} />;
    case 2:
      return <CertificateForm errors={errors} register={register} setValue={setValue}/>;
    default:
      break;
  }
};

export const ProvidersModal = (props: ProvidersModalProps) => {
  const { open, onClose, onSuccess, itemId } = props;
  const { isLoading, providerData } = useGetProvider(props.itemId ?? '');
console.log("providerData",providerData);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const [step, setStep] = useState(0);

  const { subCategory, isLoadingSubCategory } = useFetchProvider(itemId);

  const defaultValues: any = providerData? 
  {
    nombreCompania: providerData?.nombreCompania,
    nombreContacto: providerData?.nombreContacto,
    puesto: providerData?.puesto,
    direccion: providerData?.direccion,
    telefono: providerData?.telefono,
    correoElectronico: providerData?.correoElectronico,
    giroEmpresa: providerData?.giroEmpresa,
    rfc: providerData?.rfc,
    tipoContribuyente: providerData?.tipoContribuyente,
    direccionFiscal: providerData?.direccionFiscal,
    urlCertificadoBP: providerData?.urlCertificadoBP ?? '',
    urlCertificadoCR: providerData?.urlCertificadoCR ?? '',
    urlCertificadoISO9001: providerData?.urlCertificadoISO9001 ?? '',
  }
  : {
    id: '',
  };

  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<IProvider>({
    defaultValues,
    values:
      isLoadingSubCategory || !subCategory
        ? defaultValues
        : {
            ...subCategory,
            id_categoria: (subCategory as any)?.categoria?.id_Categoria,
          },
    resolver: zodResolver(addNewProviderSchema),
  });

  useEffect(() => {
    clearErrors();
  }, [open]);

  const handleError = (err: any) => {
    console.log({ err });
  };

  const onSubmit: SubmitHandler<IProvider> = async (data) => {
    try {
      data.id = itemId || undefined;
      console.log('data:', data);
      if (!itemId) {
        const res = await addNewProvider(data);
        console.log('res:', res);
        toast.success('Articulo creado con éxito!');
      } else {
        const res = await modifyProvider(data);
        console.log('res:', res);
        toast.success('Articulo modificado con éxito!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.log('error:', error);
      toast.error('Error al crear el articulo!');
    }
  };

  const stepsForm = [
    {
      id: 'step 1',
      title: 'Información general',
      fields: ['nombreCompania', 'nombreContacto', 'puesto', 'direccion', 'telefono', 'correoElectronico'],
    },
    {
      id: 'step 2',
      title: 'Información fiscal',
      fields: ['rfc', 'nif', 'giroEmpresa', 'direccionFiscal', 'tipoContribuyente'],
    },
    {
      id: 'step 3',
      title: 'Certificaciones',
      fields: ['urlCertificadoBP', 'urlCertificadoCR', 'urlCertificadoISO9001'],
    },
  ];
  type ProviderFields = keyof IProvider;
  const nextStep = async () => {
    const fields = stepsForm[step].fields;
    const outputs = await trigger(fields as ProviderFields[], {
      shouldFocus: true,
    });

    if (!outputs) return;
    if (step === stepsForm.length - 1) {
      handleSubmit(onSubmit, handleError)();
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prev = () => {
    if (step === 0) {
      onClose();
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <ModalBasic
      isLoading={!!itemId && isLoadingSubCategory || isLoading}
      open={open}
      header={itemId ? 'Modificar proveedor' : 'Agregar proveedor'}
      onClose={onClose}
    >
      <form noValidate>
        <Grid
          component="span"
          container
          spacing={1}
          sx={{
            p: 2,
          }}
        >
          <Grid item sx={{ pb: 3 }} xs={12} md={12}>
            <Stepper activeStep={step}>
              {stepsForm.map((step) => (
                <Step key={step.id}>
                  <StepLabel>
                    {
                      <Typography fontSize={lgUp ? 14 : 12} fontWeight={500}>
                        {step.title}
                      </Typography>
                    }
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          {renderStepForm(step, errors, register, setValue, providerData?.tipoContribuyente)}

          {/* <Grid item xs={12} md={6}>
            <InputBasic
              label="Nombre"
              placeholder="Nombre"
              error={!!errors.nombre}
              helperText={errors?.nombre?.message}
              {...register('nombre')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputBasic
              label="Descripción"
              placeholder="Descripción"
              error={!!errors.descripcion}
              helperText={errors?.descripcion?.message}
              {...register('descripcion')}
              multiline
              maxRows={3}
              maxLength={200}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectBasic
              value={watch('id_categoria')}
              label="Categoria"
              options={categories}
              uniqueProperty="id_Categoria"
              displayProperty="nombre"
              error={!!errors.id_categoria}
              helperText={errors?.id_categoria?.message}
              {...register('id_categoria')}
            />
          </Grid> */}
          {/* 
          <Grid item xs={12} md={12}>
            <FormControlLabel
              sx={{ ml: 0 }}
              control={
                <Checkbox
                  checked={iva}
                  {...register('iva')}
                  onChange={() => {
                    setIva(!iva);
                  }}
                />
              }
              label="IVA"
              labelPlacement="start"
            />
          </Grid> */}
          {/* <TextField
              select
              label="Almacén"
              size="small"
              error={warehouseError}
              helperText={warehouseError && 'Selecciona un almacén'}
              value={warehouseSelected}
            >
              {almacenes.map((warehouse) => (
                <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
                  {warehouse.nombre}
                </MenuItem>
              ))}
            </TextField> */}
        </Grid>

        <Stack
          sx={{
            flexDirection: 'row',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Button variant="outlined" color="error" onClick={prev}>
            {step === 0 ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CancelIcon />
                <span>Cancelar</span>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowBackIcon />
                <span>Anterior</span>
              </Stack>
            )}
          </Button>
          <Button variant="contained" onClick={nextStep}>
            {step === stepsForm.length - 1 ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Guardar</span>
                <SaveIcon />
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Siguiente</span>
                <ArrowForwardIcon />
              </Stack>
            )}
          </Button>
        </Stack>
      </form>
    </ModalBasic>
  );
};
