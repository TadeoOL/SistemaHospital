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
import { SubmitHandler, useForm } from "react-hook-form";
import { addNewProviderSchema } from "../../../../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { BasicInfoForm } from "./Forms/BasicInfoForm";
import { useState } from "react";
import { FiscalForm } from "./Forms/FiscalForm";
import { CertificateForm } from "./Forms/CertificateForm";

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
  "Información general",
  "Información fiscal",
  "Certificaciones",
];

const renderStepForm = (step: number, errors: any, register: any) => {
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
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: any) => {
    if (step === stepsForm.length - 1) {
      try {
        console.log(data);
        // api para modificar proveedor
        toast.success("Proveedor modificado correctamente!");
      } catch (error) {
        console.log(error);
        toast.error("Error al modificar proveedor!");
      }
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={() => {}} title="Modificar proveedor" />
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ p: 4, rowGap: 4 }}>
            <Stepper activeStep={step}>
              {stepsForm.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    {
                      <Typography fontSize={lgUp ? 14 : 12} fontWeight={500}>
                        {label}
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
                onClick={() => {
                  step === 0
                    ? props.setOpen(false)
                    : setStep((prevStep) => prevStep - 1);
                }}
              >
                {step === 0 ? "Cancelar" : "Anterior"}
              </Button>
              <Button variant="contained" type="submit">
                {step === stepsForm.length - 1 ? "Guardar" : "Siguiente"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};
