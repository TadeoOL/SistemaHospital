import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  Modal,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { getProviderQuotePdf } from "../../../../../api/api.routes";
import { useDropzone } from "React-dropzone";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  width: 600,
};
type Provider = {
  id: string;
  proveedor: { id_Proveedor: string; nombre: string };
};

type ProviderQuoteModalProps = {
  idFolio: string;
  open: Function;
  providers: Provider[];
};

const renderStepForm = (
  step: number,
  providerData: Array<Provider & { pdf: string }> | undefined
) => {
  switch (step) {
    case 0:
      return <ProvidersQuotePdf providersData={providerData} />;
    case 1:
      return <h1>Rellenado de información</h1>;
    case 2:
      return <h1>Generador de orden de compra</h1>;
    default:
      break;
  }
};

const stepsForm = [
  {
    id: "1",
    title: "Cotización del proveedor",
  },
  {
    id: "2",
    title: "Relleno de información",
  },
  {
    id: "3",
    title: "Generar orden de compra",
  },
];

const useFetchPdfProviders = (providers: Provider[]) => {
  const [providersData, setProvidersData] =
    useState<Array<Provider & { pdf: string }>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const results = [];
      for (const provider of providers) {
        try {
          const pdf = await getProviderQuotePdf(provider.id);
          results.push({
            id: provider.id,
            proveedor: {
              id_Proveedor: provider.proveedor.id_Proveedor,
              nombre: provider.proveedor.nombre,
            },
            pdf: pdf ? pdf : null,
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      setProvidersData(results);
    };
    fetch();
  }, [providers]);

  return { providersData, isLoading };
};

export const ProviderQuoteModal = (props: ProviderQuoteModalProps) => {
  const { idFolio, open, providers } = props;
  const { providersData, isLoading } = useFetchPdfProviders(providers);
  const [step, setStep] = useState(0);

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal
        title={"Enviar orden de compra - Solicitud No. " + idFolio}
        setOpen={open}
      />
      <Stack
        sx={{
          px: 8,
          py: 3,
          bgcolor: "white",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Stepper activeStep={step}>
          {stepsForm.map((step) => (
            <Step key={step.id}>
              <StepLabel>
                {
                  <Typography fontSize={{ xs: 10, lg: 12 }} fontWeight={500}>
                    {step.title}
                  </Typography>
                }
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepForm(step, providersData)}
        {/* <Stack>
          <Button onClick={() => setStep((prev) => prev - 1)}>Atras</Button>
          <Button onClick={() => setStep((prev) => prev + 1)}>Siguiente</Button>
        </Stack> */}
      </Stack>
    </Box>
  );
};

const ProvidersQuotePdf = (props: {
  providersData: Array<Provider & { pdf: string }> | undefined;
}) => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({});
  const { providersData } = props;
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfOpen, setPdfOpen] = useState("");

  const files = acceptedFiles.map((file) => console.log(file));
  console.log("data en el pdf comp", providersData);

  return (
    <>
      <Stack sx={{ mt: 4 }}>
        {providersData?.map((provider) => (
          <Stack key={provider.id}>
            <Box
              sx={{ display: "flex", flex: 1, justifyContent: "space-between" }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {provider.pdf ? "Ver PDF" : " Subir PDF"}
              </Typography>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                Proveedor: {provider.proveedor.nombre}
              </Typography>
            </Box>
            {provider.pdf ? (
              <Button
                onClick={() => {
                  setPdfOpen(provider.pdf);
                  setViewPdf(true);
                }}
                variant="outlined"
                sx={{ p: 6 }}
              >
                {"Cotización - " + provider.proveedor.nombre}
              </Button>
            ) : (
              <Box
                sx={{
                  my: 2,
                  p: 4,
                  border: "1px black dashed",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps({ className: "dropzone" })}
              >
                <input {...getInputProps()} />
                <Typography>Aqui se subira el pdf</Typography>
              </Box>
            )}
          </Stack>
        ))}
      </Stack>
      <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end", mt: 4 }}>
        <Button variant="contained">Siguiente</Button>
      </Box>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            border: "none",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setViewPdf(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={() => setViewPdf(false)}
          >
            <Box
              sx={{
                display: "flex",
                flex: 10,
                mx: 7,
                mb: 3,
              }}
            >
              <iframe
                src={"data:application/pdf;base64," + pdfOpen}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>
          </ClickAwayListener>
        </Box>
      </Modal>
    </>
  );
};
