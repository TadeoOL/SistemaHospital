import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { useGetAllProviders } from "../../../../../hooks/useGetAllProviders";
import { useEffect, useState } from "react";
import { Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";
import { selectManyProvidersForTender } from "../../../../../api/api.routes";
import { usePurchaseOrderRequestPagination } from "../../../../../store/purchaseStore/purchaseOrderRequestPagination";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, md: 600, lg: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
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

interface AddMoreProvidersProps {
  setOpen: Function;
  requestPurchaseInfo: { folio: string; purchaseOrderId: string };
  providersData: any[];
}

export const AddMoreProviders = (props: AddMoreProvidersProps) => {
  const { setOpen, providersData, requestPurchaseInfo } = props;
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [providersClone, setProvidersClone] = useState(
    providersData.flatMap((p) => p.proveedor)
  );
  const [providerSelectedId, setProviderSelectedId] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const updateProvidersClone = () => {
    if (!providers || !providersData) return;
    const updatedProvidersClone = providersData
      .flatMap((p) => {
        const provider = providers.find(
          (provider) => provider.id === p.proveedor.id_Proveedor
        );
        if (provider) {
          return provider.id;
        }
        return null;
      })
      .filter(Boolean);
    setProvidersClone(updatedProvidersClone);
    setIsProcessing(false);
  };

  useEffect(() => {
    updateProvidersClone();
  }, [providers]);

  const handleDeleteProvider = (providerId: string) => {
    const provFilter = providersClone.filter((item) => item !== providerId);
    setProvidersClone(provFilter);
  };

  const providerName = (providerId: string) => {
    const providerRes = providers.find((item) => item.id === providerId);
    return providerRes?.nombreContacto + " - " + providerRes?.nombreCompania;
  };

  const handleSubmit = async () => {
    if (providersClone.length < 3)
      return toast.error("Selecciona al menos 3 proveedores para continuar!");
    setIsFetching(true);
    try {
      await selectManyProvidersForTender(
        requestPurchaseInfo.purchaseOrderId,
        providersClone
      );
      toast.success("Proveedores seleccionados correctamente!");
      setOpen(false);
      usePurchaseOrderRequestPagination.getState().fetch();
    } catch (error) {
      console.log(error);
      toast.error("Error al seleccionar los proveedores!");
    } finally {
      setIsFetching(false);
    }
  };

  if (isLoadingProviders || isProcessing)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={{ ...style, ...styleBar }}>
      <HeaderModal title="Seleccionar proveedores" setOpen={setOpen} />
      <Stack spacing={2} sx={{ bgcolor: "white", p: 4 }}>
        <Typography>Selecciona los proveedores:</Typography>
        <TextField
          size="small"
          select
          label="Proveedor"
          SelectProps={{
            multiple: true,
            renderValue: (selected: any) => (
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
            ),
          }}
          value={providersClone}
          onChange={(e) => {
            if (
              providersClone.length === 3 &&
              providersClone.some((i) => i === providerSelectedId)
            ) {
              toast.warning("No puedes agregar mas de 3 proveedores");
            } else {
              setProvidersClone([...e.target.value]);
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
        <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            disabled={isFetching}
          >
            {isFetching ? <CircularProgress size={18} /> : "Enviar"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
