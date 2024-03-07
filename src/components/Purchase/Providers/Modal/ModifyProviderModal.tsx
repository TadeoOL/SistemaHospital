import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IProvider } from "../../../../types/types";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { addNewProviderSchema } from "../../../../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { BasicInfoForm } from "./Forms/BasicInfoForm";
import { useEffect, useState } from "react";
import { FiscalForm } from "./Forms/FiscalForm";
import { CertificateForm } from "./Forms/CertificateForm";
import Swal from "sweetalert2";
import { modifyProvider } from "../../../../api/api.routes";
import { useProviderPagination } from "../../../../store/purchaseStore/providerPagination";
import { useGetProvider } from "../../../../hooks/useGetProvider";
import { shallow } from "zustand/shallow";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, lg: 600 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: 600,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
  },
};

const stepsForm = [
  {
    id: "step 1",
    title: "Información general",
    fields: [
      "nombreCompania",
      "nombreContacto",
      "puesto",
      "direccion",
      "telefono",
      "correoElectronico",
    ],
  },
  {
    id: "step 2",
    title: "Información fiscal",
    fields: [
      "rfc",
      "nif",
      "giroEmpresa",
      "direccionFiscal",
      "tipoContribuyente",
    ],
  },
  {
    id: "step 3",
    title: "Certificaciones",
    fields: ["urlCertificadoBP", "urlCertificadoCR", "urlCertificadoISO9001"],
  },
];

const renderStepForm = (
  step: number,
  errors: FieldErrors<IProvider>,
  register: UseFormRegister<IProvider>,
  tipoContribuyente: number
) => {
  switch (step) {
    case 0:
      return <BasicInfoForm errors={errors} register={register} />;
    case 1:
      return (
        <FiscalForm
          errors={errors}
          register={register}
          tipoContribuyente={tipoContribuyente}
        />
      );
    case 2:
      return <CertificateForm errors={errors} register={register} />;
    default:
      break;
  }
};

interface IModifyProviderModal {
  providerId: string;
  setOpen: Function;
}

export const ModifyProviderModal = (props: IModifyProviderModal) => {
  const { isLoading, providerData } = useGetProvider(props.providerId);
  const [step, setStep] = useState(0);
  const [disabledButtons, setDisabledButtons] = useState(false);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { handleChangeProvider, setHandleChangeProvider } =
    useProviderPagination(
      (state) => ({
        handleChangeProvider: state.handleChangeProvider,
        setHandleChangeProvider: state.setHandleChangeProvider,
      }),
      shallow
    );

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<IProvider>({
    defaultValues: {
      nombreCompania: providerData?.nombreCompania,
      nombreContacto: providerData?.nombreContacto,
      puesto: providerData?.puesto,
      direccion: providerData?.direccion,
      telefono: providerData?.telefono,
      correoElectronico: providerData?.correoElectronico,
      giroEmpresa: providerData?.giroEmpresa,
      rfc: providerData?.rfc,
      nif: providerData?.nif,
      tipoContribuyente: providerData?.tipoContribuyente,
      direccionFiscal: providerData?.direccionFiscal,
      urlCertificadoBP: providerData?.urlCertificadoBP,
      urlCertificadoCR: providerData?.urlCertificadoCR,
      urlCertificadoISO9001: providerData?.urlCertificadoISO9001,
    },
    resolver: zodResolver(addNewProviderSchema),
  });

  useEffect(() => {
    if (providerData) {
      Object.entries(providerData).forEach(([key, value]) => {
        setValue(key as keyof IProvider, value);
      });
    }
  }, [providerData, setValue]);

  const onSubmit: SubmitHandler<IProvider> = async (data: IProvider) => {
    try {
      await modifyProvider({
        ...data,
        id: providerData ? providerData.id : "",
      });
      setDisabledButtons(true);
      setHandleChangeProvider(!handleChangeProvider);
      toast.success("Proveedor modificado correctamente!");
      props.setOpen(false);
      Swal.fire({
        title: "Operación Exitosa",
        text: "El proveedor ha sido modificado correctamente.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al modificar proveedor!");
    }
  };

  type ProviderFields = keyof IProvider;
  const nextStep = async () => {
    const fields = stepsForm[step].fields;
    const outputs = await trigger(fields as ProviderFields[], {
      shouldFocus: true,
    });
    if (!outputs) return;
    if (step === stepsForm.length - 1) {
      handleSubmit(onSubmit)();
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleError = (err: any) => {
    console.log({ err });
  };

  if (isLoading || !providerData)
    return (
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Modificar proveedor" />
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit, handleError)}>
          <Stack sx={{ p: 2, px: 4, rowGap: 4 }}>
            <Stack spacing={2} sx={{ pr: 2 }}>
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
              {renderStepForm(
                step,
                errors,
                register,
                providerData.tipoContribuyente
              )}
            </Stack>
            <Stack
              sx={{
                flexDirection: "row",
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                position: "sticky",
              }}
            >
              <Button
                variant="outlined"
                disabled={disabledButtons}
                onClick={() => {
                  step === 0
                    ? props.setOpen(false)
                    : setStep((prevStep) => prevStep - 1);
                }}
              >
                {step === 0 ? "Cancelar" : "Anterior"}
              </Button>
              <Button
                variant="contained"
                onClick={nextStep}
                disabled={disabledButtons}
              >
                {step === stepsForm.length - 1 ? "Guardar" : "Siguiente"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};
