import {
  Box,
  Button,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
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
import { useState } from "react";
import { FiscalForm } from "./Forms/FiscalForm";
import { CertificateForm } from "./Forms/CertificateForm";
import { SuccessForm } from "./Forms/SuccessForm";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, lg: 600 },
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
      "email",
    ],
  },
  { id: "step 2", title: "Información fiscal" },
  { id: "step 3", title: "Certificaciones" },
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
    case 3:
      return <SuccessForm />;
    default:
      break;
  }
};

interface IModifyProviderModal {
  provider: IProvider | null;
  setOpen: Function;
}

export const ModifyProviderModal = (props: IModifyProviderModal) => {
  const {
    id,
    direccion,
    email,
    nombreCompania,
    nombreContacto,
    puesto,
    telefono,
    certificacionBP,
    certificacionCR,
    certificacionISO,
    rfc,
    numIdentificacionFiscal,
    tipoContribuyente,
    direccionFiscal,
    giroEmpresa,
  } = props.provider ?? {};

  const [step, setStep] = useState(0);
  const [disabledButtons, setDisabledButtons] = useState(false);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<IProvider>({
    defaultValues: {
      nombreCompania: nombreCompania,
      nombreContacto: nombreContacto,
      puesto: puesto,
      direccion: direccion,
      telefono: telefono,
      email: email,
      giroEmpresa: giroEmpresa,
      rfc: rfc,
      numIdentificacionFiscal: numIdentificacionFiscal,
      tipoContribuyente: tipoContribuyente,
      direccionFiscal: direccionFiscal,
      certificacionBP: certificacionBP,
      certificacionCR: certificacionCR,
      certificacionISO: certificacionISO,
    },
    resolver: zodResolver(addNewProviderSchema),
  });

  const onSubmit: SubmitHandler<IProvider> = async (data: IProvider) => {
    try {
      console.log(data);
      // api para modificar proveedor
      setDisabledButtons(true);
      toast.success("Proveedor modificado correctamente!");
      props.setOpen(false);
      Swal.fire({
        title: "Proveedor modificado!",
        text: "El proveedor ha sido modificado correctamente!",
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

  return (
    <Box sx={style}>
      <HeaderModal setOpen={() => {}} title="Modificar proveedor" />
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit, handleError)}>
          <Stack sx={{ p: 4, rowGap: 4 }}>
            <Stepper activeStep={step}>
              {stepsForm.map((step, index) => (
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
