import { useState } from "react";
import { useGetAllProviders } from "../../../../hooks/useGetAllProviders";
import { useDirectlyPurchaseRequestOrderStore } from "../../../../store/purchaseStore/directlyPurchaseRequestOrder";
import { toast } from "react-toastify";
import { addPurchaseRequest } from "../../../../api/api.routes";
import { shallow } from "zustand/shallow";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

import { usePurchaseOrderRequestPagination } from "../../../../store/purchaseStore/purchaseOrderRequestPagination";
import { usePurchaseOrderPagination } from "../../../../store/purchaseStore/purchaseOrderPagination";

export const SingleProvider = (props: { setOpen: Function }) => {
  const { articles, warehouseSelected, totalAmountRequest, step, setStep } =
    useDirectlyPurchaseRequestOrderStore((state) => ({
      articles: state.articles,
      warehouseSelected: state.warehouseSelected,
      totalAmountRequest: state.totalAmountRequest,
      step: state.step,
      setStep: state.setStep,
    }));
  const refetchTableOrderRequest = usePurchaseOrderRequestPagination(
    (state) => state.fetch
  );
  const refetchTableOrder = usePurchaseOrderPagination((state) => state.fetch);
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [error, setError] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string[] | string>(
    ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (selectedProvider.length === 0) return setError(true);
    const objectToPurchase = {
      id_proveedor: selectedProvider,
      Articulos: articles.map((a) => {
        return {
          Id_Articulo: a.id,
          CantidadCompra: a.amount,
        };
      }),
      id_almacen: warehouseSelected,
      PrecioTotalInventario: totalAmountRequest,
    };
    try {
      await addPurchaseRequest(
        objectToPurchase.id_proveedor as string[],
        objectToPurchase.Articulos,
        objectToPurchase.id_almacen,
        objectToPurchase.PrecioTotalInventario
      );
      toast.success("Orden de compra exitosa!");
      props.setOpen(false);
      refetchTableOrderRequest();
      refetchTableOrder();
    } catch (error) {
      toast.error("Error al ordenar la compra!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProviders)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Stack>
      <form>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            Selecciona el proveedor:
          </Typography>
          <TextField
            fullWidth
            size="small"
            select
            label="Proveedor"
            value={selectedProvider}
            error={error && selectedProvider.length < 1}
            helperText={
              error && selectedProvider.length < 1
                ? "Selecciona un proveedor"
                : null
            }
            onChange={(e) => {
              setSelectedProvider([e.target.value]);
            }}
          >
            {providers?.map((provider) => (
              <MenuItem value={provider.id} key={provider.id}>
                {provider.nombreContacto + " - " + provider.nombreCompania}
              </MenuItem>
            ))}
          </TextField>
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
          disabled={isLoading}
        >
          Enviar solicitud
        </Button>
      </Stack>
    </Stack>
  );
};

export const ManyProviders = (props: { setOpen: Function }) => {
  const { articles, warehouseSelected, totalAmountRequest, setStep, step } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        articles: state.articles,
        warehouseSelected: state.warehouseSelected,
        totalAmountRequest: state.totalAmountRequest,
        setStep: state.setStep,
        step: state.step,
      }),
      shallow
    );
  const refetchTableOrderRequest = usePurchaseOrderRequestPagination(
    (state) => state.fetch
  );
  const refetchTableOrder = usePurchaseOrderPagination((state) => state.fetch);
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [providerSelectedId, setProviderSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const providerName = (providerId: string) => {
    const providerRes = providers.find((item) => item.id === providerId);
    return providerRes?.nombreContacto + " - " + providerRes?.nombreCompania;
  };

  const handleDeleteProvider = (providerId: string) => {
    const provFilter = selectedProvider.filter((item) => item !== providerId);
    setSelectedProvider(provFilter);
  };

  const handleSubmit = async () => {
    if (selectedProvider.length === 0 || selectedProvider.length !== 3)
      return toast.error("Selecciona 3 proveedores");

    setIsLoading(true);
    const objectToPurchase = {
      id_proveedor: selectedProvider,
      Articulos: articles.map((a) => {
        return { Id_Articulo: a.id, CantidadCompra: a.amount };
      }),
      id_almacen: warehouseSelected,
      PrecioTotalInventario: totalAmountRequest,
    };

    try {
      await addPurchaseRequest(
        objectToPurchase.id_proveedor as string[],
        objectToPurchase.Articulos,
        objectToPurchase.id_almacen,
        objectToPurchase.PrecioTotalInventario
      );
      toast.success("Orden de compra exitosa!");
      props.setOpen(false);
      refetchTableOrderRequest();
      refetchTableOrder();
    } catch (error) {
      toast.error("Error al ordenar la compra!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProviders)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Stack>
      <form noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
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
            value={selectedProvider}
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
          {isLoading ? <CircularProgress size={15} /> : "Enviar solicitud"}
        </Button>
      </Stack>
    </Stack>
  );
};
