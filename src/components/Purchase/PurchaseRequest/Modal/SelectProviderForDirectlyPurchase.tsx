import { useCallback, useEffect, useState } from "react";
import { useGetAllProviders } from "../../../../hooks/useGetAllProviders";
import { useDirectlyPurchaseRequestOrderStore } from "../../../../store/purchaseStore/directlyPurchaseRequestOrder";
import { toast } from "react-toastify";
import { shallow } from "zustand/shallow";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Cancel,
  Close,
  CloudUpload,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

import { useDropzone } from "react-dropzone";
import { convertBase64 } from "../../../../utils/functions/dataUtils";
import { Note } from "./Note";

export const SingleProvider = () => {
  const {
    step,
    setStep,
    pdf,
    setPdf,
    registerOrder,
    setProvider,
    provider,
    setNeedAuth,
  } = useDirectlyPurchaseRequestOrderStore((state) => ({
    step: state.step,
    setStep: state.setStep,
    pdf: state.pdf,
    setPdf: state.setPdf,
    registerOrder: state.registerOrder,
    setProvider: state.setProvider,
    provider: state.provider,
    setNeedAuth: state.setNeedAuth,
  }));

  const { isLoadingProviders, providers } = useGetAllProviders();
  const [error, setError] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string[] | string>(
    ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0)
        return toast.error("Error: Solo se puede adjuntar 1 archivo .pdf!");
      try {
        const base64 = await convertBase64(acceptedFiles[0]);
        setPdf(base64);
        toast.success("Archivo subido con éxito!");
      } catch (error) {
        console.log(error);
        toast.error("Error al subir el documento pdf!");
      }
    },
    [registerOrder]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (
      (selectedProvider.length === 0 && !provider) ||
      (provider instanceof Array && provider.length === 0)
    )
      return setError(true);
    setIsLoading(true);
    setNeedAuth(true);
    setIsLoading(false);
    setStep(step + 1);
  };
  const disableButton =
    pdf.trim() === "" ||
    !provider ||
    (provider instanceof Array && provider.length === 0);

  if (isLoadingProviders)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Stack spacing={4} sx={{ mt: 4 }}>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            Selecciona el proveedor:
          </Typography>
          <TextField
            fullWidth
            size="small"
            select
            label="Proveedor"
            value={
              selectedProvider ||
              (provider && !Array.isArray(provider) ? provider.id : "")
            }
            error={error && selectedProvider.length < 1}
            helperText={
              error && selectedProvider.length < 1
                ? "Selecciona un proveedor"
                : null
            }
            onChange={(e) => {
              setSelectedProvider([e.target.value]);
              const providerData = providers.find(
                (p) => p.id === e.target.value
              );
              if (!providerData) return;
              setProvider(providerData);
            }}
          >
            {providers?.map((provider) => (
              <MenuItem value={provider.id} key={provider.id}>
                {provider.nombreContacto + " - " + provider.nombreCompania}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack>
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
              {openCollapse ? (
                <IconButton
                  onClick={() => {
                    setOpenCollapse(!openCollapse);
                  }}
                >
                  <KeyboardArrowUp />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setOpenCollapse(!openCollapse);
                  }}
                >
                  <KeyboardArrowDown />
                </IconButton>
              )}
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {pdf ? "Ver PDF" : " Subir PDF"}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
              Proveedor:{" "}
              {provider && !Array.isArray(provider)
                ? `${provider.nombreContacto} - ${provider.nombreCompania}`
                : "Sin seleccionar"}
            </Typography>
          </Box>
          <Collapse in={openCollapse} sx={{ px: 2 }}>
            {pdf.trim() !== "" ? (
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
                    setViewPdf(true);
                  }}
                  variant="outlined"
                  sx={{ p: 6 }}
                >
                  {provider && !Array.isArray(provider)
                    ? `Cotización - ${provider.nombreContacto} - ${provider.nombreCompania}`
                    : `Cotización`}
                </Button>
                <Box>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => {
                        setPdf("");
                      }}
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
          <Box sx={{ mt: 1 }}>
            <Note />
          </Box>
        </Stack>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "sticky",
            bottom: 0,
            zIndex: 1,
            backgroundColor: "white",
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={isLoading}
            onClick={() => {
              setStep(step - 1);
            }}
          >
            Volver
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
            disabled={isLoading || disableButton}
          >
            Siguiente
          </Button>
        </Stack>
      </Stack>
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
              <embed
                src={pdf}
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

export const ManyProviders = () => {
  const { setStep, step, setProvider, provider, setIsManyProviders } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        setStep: state.setStep,
        step: state.step,
        setProvider: state.setProvider,
        provider: state.provider,
        setIsManyProviders: state.setIsManyProviders,
      }),
      shallow
    );
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [providerSelectedId, setProviderSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const providerName = (providerId: string) => {
    const providerRes = providers.find((item) => item.id === providerId);
    return providerRes?.nombreContacto + " - " + providerRes?.nombreCompania;
  };

  useEffect(() => {
    if (!provider) return;
    if (Array.isArray(provider) && provider.length === 0) return;
    if (provider instanceof Array) {
      const providersAlready = provider.flatMap((p) => p.id);
      setSelectedProvider(providersAlready);
    }
  }, [provider]);

  const handleDeleteProvider = (providerId: string) => {
    const provFilter = selectedProvider.filter((item) => item !== providerId);
    setSelectedProvider(provFilter);
  };

  const handleSubmit = async () => {
    if (selectedProvider.length === 0 || selectedProvider.length !== 3)
      return toast.error("Selecciona 3 proveedores");

    setIsLoading(true);
    const providersData = providers.filter((p) =>
      selectedProvider.some((sp) => p.id === sp)
    );
    setProvider(providersData);
    setIsManyProviders(true);
    setIsLoading(false);
    setStep(step + 1);
  };

  if (isLoadingProviders)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Stack sx={{ mt: 4 }}>
      <form noValidate onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            Selecciona los proveedores:
          </Typography>
          <TextField
            fullWidth
            size="small"
            select
            label="Proveedor"
            SelectProps={{
              multiple: true,
              renderValue: (selected: any) => {
                return (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {selected.map((value: string) => (
                      <Chip
                        key={value}
                        label={providerName(value)}
                        style={{ margin: 2 }}
                        onDelete={() => {
                          handleDeleteProvider(value);
                        }}
                        deleteIcon={
                          <Cancel
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                      />
                    ))}
                  </div>
                );
              },
            }}
            value={
              selectedProvider ||
              (provider &&
              (provider instanceof Array || Array.isArray(provider))
                ? provider.flatMap((p) => p.id)
                : [])
            }
            onChange={(e) => {
              if (
                selectedProvider.length === 3 &&
                selectedProvider.some((i) => i === providerSelectedId)
              ) {
                toast.warning("No puedes agregar mas de 3 proveedores");
              } else {
                setSelectedProvider([...e.target.value]);
              }
            }}
          >
            {providers.map((provider) => (
              <MenuItem
                value={provider.id}
                key={provider.id}
                onClick={() => setProviderSelectedId(provider.id)}
              >
                {provider.nombreContacto + " - " + provider.nombreCompania}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <Note />
          </Box>
        </Stack>
      </form>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          backgroundColor: "white",
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setStep(step - 1);
          }}
          disabled={isLoading}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit();
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={15} /> : "Siguiente"}
        </Button>
      </Stack>
    </Stack>
  );
};
