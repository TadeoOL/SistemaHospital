import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  IconButton,
  Modal,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import {
  addProviderQuote,
  deleteProviderQuote,
  getProviderQuotePdf,
} from "../../../../../api/api.routes";
import { useDropzone } from "React-dropzone";
import {
  KeyboardArrowUp,
  CloudUpload,
  KeyboardArrowDown,
  Close,
  Delete,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { convertBase64 } from "../../../../../utils/functions/dataUtils";
import { usePurchaseOrderRequestModals } from "../../../../../store/purchaseStore/purchaseOrderRequestModals";
import { FillQuoteInformationModal } from "./Steps/FillQuoteInformationModal";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, md: 600, lg: 800 },
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
      return <FillQuoteInformationModal />;
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
  const step = usePurchaseOrderRequestModals(useShallow((state) => state.step));

  useEffect(() => {
    console.log("monte");
    return () => {
      console.log("desmonte");
      usePurchaseOrderRequestModals.setState({ step: 0 });
    };
  }, []);

  console.log({ providersData });

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
      </Stack>
    </Box>
  );
};

const ProvidersQuotePdf = (props: {
  providersData: Array<Provider & { pdf: string | null }> | undefined;
}) => {
  const { providersData } = props;
  const { step, setStep, providerSelected, setProviderSelected } =
    usePurchaseOrderRequestModals(
      (state) => ({
        step: state.step,
        setStep: state.setStep,
        providerSelected: state.providerSelected,
        setProviderSelected: state.setProviderSelected,
      }),
      shallow
    );
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfOpen, setPdfOpen] = useState("");
  const [providerQuoteRequest, setProviderQuoteRequest] = useState("");
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [providersClone, setProvidersClone] = useState<typeof providersData>(
    structuredClone(providersData)
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0)
        return toast.error("Error: Solo se puede adjuntar 1 archivo .pdf!");
      const base64 = await convertBase64(acceptedFiles[0]);
      const existingFile = providersClone?.find(
        (file) => file.id === providerQuoteRequest && file.pdf === null
      );
      if (existingFile) {
        try {
          await addProviderQuote(providerQuoteRequest, base64);
          setProvidersClone((prev) =>
            prev?.map((file) =>
              file.id === providerQuoteRequest && file.pdf === null
                ? { ...file, pdf: base64 }
                : file
            )
          );
          toast.success("Archivo subido con éxito!");
        } catch (error) {
          console.log(error);
          toast.error("Error al subir el documento pdf!");
        }
      }
    },
    [providerQuoteRequest, providersClone]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  console.log({ providersClone });
  const hasEmptyPdf = () => {
    if (!providersClone || providersClone.length === 0) return true;
    return providersClone.some((provider) => provider.pdf === null);
  };

  const handleNext = useCallback(() => {
    if (hasEmptyPdf())
      return toast.error(
        "Es necesario subir todas las cotizaciones antes de continuar!"
      );

    setStep(step + 1);
  }, [step]);

  const handleDeleteQuote = useCallback(async (idQuote: string) => {
    try {
      await deleteProviderQuote(idQuote);
      setProvidersClone((prev) =>
        prev?.map((file) =>
          file.id === idQuote ? { ...file, pdf: null } : file
        )
      );
      toast.success("Cotización eliminada con éxito!");
    } catch (error) {
      toast.error("Error al eliminar la cotización!");
      console.log(error);
    }
  }, []);

  return (
    <>
      <Stack sx={{ mt: 4 }}>
        {providersClone?.map((quoteRequest) => (
          <Stack key={quoteRequest.id}>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                bgcolor: "#EDEDED",
                p: 1,
                borderRadius: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {openCollapse[quoteRequest.id] ? (
                  <IconButton
                    onClick={() =>
                      setOpenCollapse({
                        [quoteRequest.id]: !openCollapse[quoteRequest.id],
                      })
                    }
                  >
                    <KeyboardArrowUp />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setOpenCollapse({
                        [quoteRequest.id]: !openCollapse[quoteRequest.id],
                      });
                      setProviderQuoteRequest(quoteRequest.id);
                      setProviderSelected(quoteRequest.proveedor.id_Proveedor);
                    }}
                  >
                    <KeyboardArrowDown />
                  </IconButton>
                )}
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                  {quoteRequest.pdf ? "Ver PDF" : " Subir PDF"}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                Proveedor: {quoteRequest.proveedor.nombre}
              </Typography>
            </Box>
            <Collapse in={openCollapse[quoteRequest.id]} sx={{ px: 2 }}>
              {quoteRequest.pdf ? (
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    p: 1,
                  }}
                >
                  <Button
                    onClick={() => {
                      setPdfOpen(quoteRequest.pdf as string);
                      setViewPdf(true);
                    }}
                    variant="outlined"
                    sx={{ p: 6 }}
                  >
                    {"Cotización - " + quoteRequest.proveedor.nombre}
                  </Button>
                  <Box>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteQuote(quoteRequest.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ) : (
                <Stack
                  sx={{
                    my: 1,
                    p: 4,
                    border: "1px #B4B4B8 dashed",
                    borderRadius: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  {...getRootProps({ className: "dropzone" })}
                >
                  <CloudUpload sx={{ width: 40, height: 40, color: "Gray" }} />
                  <input {...getInputProps()} />
                  <Typography
                    sx={{
                      color: "#B4B4B8",
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Arrastra y suelta tus archivos aquí para subirlos
                  </Typography>
                </Stack>
              )}
            </Collapse>
          </Stack>
        ))}
      </Stack>
      <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end", mt: 4 }}>
        <Button variant="contained" onClick={() => handleNext()}>
          Siguiente
        </Button>
      </Box>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <Stack
          sx={{
            display: "flex",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setViewPdf(false)}>
              <Close />
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
                src={pdfOpen}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>
          </ClickAwayListener>
        </Stack>
      </Modal>
    </>
  );
};
