import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
  changePurchaseStatus,
  deleteProviderQuote,
  getProviderQuotePdf,
} from "../../../../../api/api.routes";
import {
  KeyboardArrowUp,
  CloudUpload,
  KeyboardArrowDown,
  Delete,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { convertBase64 } from "../../../../../utils/functions/dataUtils";
import { usePurchaseOrderRequestModals } from "../../../../../store/purchaseStore/purchaseOrderRequestModals";
import { FillQuoteInformationModal } from "./Steps/FillQuoteInformationModal";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import { Provider } from "../../../../../types/types";
import { usePurchaseOrderRequestPagination } from "../../../../../store/purchaseStore/purchaseOrderRequestPagination";
import { useDropzone } from "react-dropzone";
import { OrderSummaryModal } from "./Steps/OrderSummaryModal";
import { ViewPdf } from "../../../../Inputs/ViewPdf";
import { useAuthStore } from "../../../../../store/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, sm: 600, md: 800, lg: 800 },
};

const styleBar = {
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
    borderRadius: 10,
  },
};

type ProviderQuoteModalProps = {
  idFolio: { folio: string; purchaseOrderId: string };
  open: Function;
  providers: Provider[];
};

const renderStepForm = (
  step: number,
  providers: Provider[],
  id: string,
  open: Function
) => {
  switch (step) {
    case 0:
      return (
        <ProvidersQuotePdf
          providers={providers}
          purchaseRequestId={id}
          setOpen={open}
        />
      );
    case 1:
      return <FillQuoteInformationModal />;
    case 2:
      return <OrderSummaryModal setOpen={open} />;
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
    useState<Array<Provider & { pdf: string | null }>>();
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
  const step = usePurchaseOrderRequestModals(useShallow((state) => state.step));

  if (!providers)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={{ ...style }}>
      <HeaderModal title={"Solicitud No. " + idFolio.folio} setOpen={open} />
      <Box sx={{ overflowY: "auto", ...styleBar }}>
        <Box sx={{ maxHeight: 500 }}>
          <Stack
            sx={{
              px: 8,
              py: 3,
              bgcolor: "white",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          >
            {providers.length > 1 ? null : (
              <Stepper activeStep={step}>
                {stepsForm.map((step) => (
                  <Step key={step.id}>
                    <StepLabel>
                      {
                        <Typography
                          fontSize={{ xs: 10, lg: 12 }}
                          fontWeight={500}
                        >
                          {step.title}
                        </Typography>
                      }
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
            {renderStepForm(step, providers, idFolio.purchaseOrderId, open)}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export const ProvidersQuotePdf = (props: {
  providers: Provider[];
  purchaseRequestId: string;
  setOpen: Function;
}) => {
  const { providers, purchaseRequestId, setOpen } = props;
  const { providersData, isLoading } = useFetchPdfProviders(providers);
  const { step, setStep, setProviderSelected } = usePurchaseOrderRequestModals(
    (state) => ({
      step: state.step,
      setStep: state.setStep,
      setProviderSelected: state.setProviderSelected,
    }),
    shallow
  );
  const isAdminPurchase = useAuthStore(
    useShallow((state) => state.isAdminPurchase)
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
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [isManyProviders, setIsManyProviders] = useState(false);

  useEffect(() => {
    if (!providersData) return;
    providersData.length > 1
      ? setIsManyProviders(true)
      : setIsManyProviders(false);
    setProvidersClone(providersData);
  }, [providersData]);

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
          setInputKey((prevKey) => prevKey + 1);
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

  const hasEmptyPdf = () => {
    if (!providersClone || providersClone.length === 0) return true;
    return providersClone.some((provider) => provider.pdf === null);
  };

  const handleNext = useCallback(() => {
    if (!providersClone) return;
    if (hasEmptyPdf())
      return toast.error(
        "Es necesario subir todas las cotizaciones antes de continuar!"
      );

    if (isManyProviders) {
      handleSendQuotes();
    } else {
      setProviderSelected(providersClone[0].proveedor.id_Proveedor);
      setStep(step + 1);
    }
  }, [step, providersClone]);

  const handleSendQuotes = async () => {
    setAsyncLoading(true);
    try {
      await changePurchaseStatus(purchaseRequestId, 5);
      toast.success("Cotizaciones enviadas correctamente!");
      usePurchaseOrderRequestPagination.getState().fetch();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al enviar las cotizaciones!");
    } finally {
      setAsyncLoading(false);
    }
  };

  const handleDeleteQuote = useCallback(
    async (idQuote: string) => {
      if (!providersClone) return;
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
    },
    [providersClone]
  );

  if (isLoading)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center", m: 4 }}>
        <CircularProgress />;
      </Box>
    );
  return (
    <>
      <Stack spacing={1} sx={{ mt: 4 }}>
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
                    onClick={() => {
                      setOpenCollapse({
                        [quoteRequest.id]: !openCollapse[quoteRequest.id],
                      });
                    }}
                  >
                    <KeyboardArrowUp />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      if (isAdminPurchase() && !quoteRequest.pdf) return;
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
                !isAdminPurchase() && (
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
                    <CloudUpload
                      sx={{ width: 40, height: 40, color: "Gray" }}
                    />
                    <input key={inputKey} {...getInputProps()} />
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
                )
              )}
            </Collapse>
          </Stack>
        ))}
      </Stack>
      <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => handleNext()}
          disabled={asyncLoading}
        >
          {isManyProviders ? "Enviar" : "Siguiente"}
        </Button>
      </Box>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <>
          <ViewPdf pdf={pdfOpen} setViewPdf={setViewPdf} />
        </>
      </Modal>
    </>
  );
};
