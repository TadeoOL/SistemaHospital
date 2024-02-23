import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { IProvider } from "../../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { addNewProviderSchema } from "../../../../schema/schemas";
import { BasicInfoForm } from "./Forms/BasicInfoForm";
import { CertificateForm } from "./Forms/CertificateForm";
import { useState } from "react";
import { FiscalForm } from "./Forms/FiscalForm";
import { addNewProvider } from "../../../../api/api.routes";
import { useProviderPagination } from "../../../../store/purchaseStore/providerPagination";
import Swal from "sweetalert2";
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
  register: UseFormRegister<IProvider>
) => {
  switch (step) {
    case 0:
      return <BasicInfoForm errors={errors} register={register} />;
    case 1:
      return <FiscalForm errors={errors} register={register} />;
    case 2:
      return <CertificateForm errors={errors} register={register} />;
    default:
      break;
  }
};

interface IAddProviderModal {
  setOpen: Function;
}

export const AddProviderModal = (props: IAddProviderModal) => {
  const [step, setStep] = useState(0);
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
  } = useForm<IProvider>({
    defaultValues: {
      nombreCompania: "",
      nombreContacto: "",
      puesto: "",
      direccion: "",
      telefono: "",
      correoElectronico: "",
      giroEmpresa: "",
      rfc: "",
      nif: "",
      tipoContribuyente: 0,
      direccionFiscal: "",
      urlCertificadoBP: "",
      urlCertificadoCR: "",
      urlCertificadoISO9001: "",
    },
    resolver: zodResolver(addNewProviderSchema),
  });

  const onSubmit: SubmitHandler<IProvider> = async (data) => {
    try {
      await addNewProvider(data);
      setHandleChangeProvider(!handleChangeProvider);
      props.setOpen(false);
      Swal.fire({
        title: "Proveedor registrado!",
        text: "El proveedor ha sido registrado correctamente!",
        icon: "success",
      });
      toast.success("Proveedor registrado correctamente!");
    } catch (error) {
      console.log(error);
      toast.error("Error al agregar nuevo proveedor!");
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

  const prev = () => {
    if (step === 0) {
      props.setOpen(false);
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <Box sx={{ ...style }}>
      <HeaderModal title="Agregar proveedor" setOpen={props.setOpen} />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 2, px: 4 }}>
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
            {renderStepForm(step, errors, register)}
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Button variant="outlined" onClick={prev}>
              {step === 0 ? "Cancelar" : "Anterior"}
            </Button>
            <Button variant="contained" onClick={nextStep}>
              {step === stepsForm.length - 1 ? "Guardar" : "Siguiente"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
