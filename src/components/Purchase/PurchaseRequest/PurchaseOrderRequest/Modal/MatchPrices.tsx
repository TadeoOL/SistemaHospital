import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import {
  IPurchaseAuthorization,
  IRegisterOrderPurchase,
} from "../../../../../types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isValidFloat } from "../../../../../utils/functions/dataUtils";
import { useDirectlyPurchaseRequestOrderStore } from "../../../../../store/purchaseStore/directlyPurchaseRequestOrder";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";
import { useGetProvider } from "../../../../../hooks/useGetProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, sm: 600, md: 800, lg: 800 },
};

const stepsForm = [
  { id: 1, title: "Rellenar precios" },
  { id: 2, title: "Resumen" },
];

const stepperViews = (step: number, data: IPurchaseAuthorization) => {
  switch (step) {
    case 0:
      return <FirstStep data={data} />;
    case 1:
      return <SecondStep />;
    default:
      break;
  }
};

export const MatchPrices = (props: { data: IPurchaseAuthorization | null }) => {
  const { data } = props;
  const step = useDirectlyPurchaseRequestOrderStore(
    useShallow((state) => state.step)
  );

  if (!data)
    return (
      <Backdrop open>
        <CircularProgress size={40} />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal title="MAtch de precios tilin" setOpen={() => {}} />
      <Stack spacing={3} sx={{ bgcolor: "white", p: 4 }}>
        <Stepper activeStep={step}>
          {stepsForm.map((step) => (
            <Step key={step.id}>
              <StepLabel>
                {
                  <Typography fontSize={14} fontWeight={500}>
                    {step.title}
                  </Typography>
                }
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {stepperViews(step, data)}
      </Stack>
    </Box>
  );
};

const FirstStep = (props: { data: IPurchaseAuthorization }) => {
  const { data } = props;
  const { setStep, step, setRegisterOrder, setWarehouseSelected } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        setStep: state.setStep,
        step: state.step,
        setRegisterOrder: state.setRegisterOrder,
        setWarehouseSelected: state.setWarehouseSelected,
      }),
      shallow
    );
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const articles = data?.solicitudProveedor.flatMap(
    (p) => p.solicitudCompraArticulos
  );
  const disabledButton = Object.values(prices).some((a) => a.trim() === "");
  const totalPrice = useMemo(() => {
    return Object.values(prices).reduce((total, item) => {
      const totalPriceObject = parseFloat(item);
      return total + totalPriceObject || 0;
    }, 0);
  }, [prices]);

  useEffect(() => {
    if (!articles) return;
    const newPrices: typeof prices = {};
    for (const iterator of articles) {
      newPrices[iterator.articulo.id_Articulo] = "";
    }
    setPrices(newPrices);
  }, []);

  const handlePriceChange = useCallback((id: string, value: string) => {
    if (!isValidFloat(value)) return;
    setPrices((prevPrices) => {
      return { ...prevPrices, [id]: value };
    });
  }, []);

  const handleSubmit = () => {
    const warehouse =
      data.solicitudProveedor.length <= 1
        ? data.solicitudProveedor[0].almacen?.nombre
        : "";
    const objectPurchase: IRegisterOrderPurchase = {
      Id_SolicitudCompra: data.id_SolicitudCompra,
      OrdenCompra: data.solicitudProveedor.map((p) => {
        const providerId = p.proveedor.id_Proveedor;
        const articulos = p.solicitudCompraArticulos;
        return {
          Id_Proveedor: providerId,
          OrdenCompraArticulo: articulos.map((a) => {
            return {
              Id_Articulo: a.articulo.id_Articulo,
              Cantidad: a.cantidadCompra,
              precioProveedor: parseFloat(prices[a.articulo.id_Articulo]),
              nombre: a.articulo.nombre,
            };
          }),
        };
      }),
    };

    setWarehouseSelected(warehouse ? warehouse : "");
    setRegisterOrder(objectPurchase);
    setStep(step + 1);
  };

  return (
    <Box>
      <Typography>PDF -</Typography>
      <Box>
        <Button>Ver PDF</Button>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles?.map((a) => (
                <TableRow key={a.articulo.id_Articulo}>
                  <TableCell align="center">{a.articulo.nombre}</TableCell>
                  <TableCell align="center">
                    <TextField
                      label="Precio"
                      size="small"
                      value={prices[a.articulo.id_Articulo]}
                      onChange={(e) => {
                        handlePriceChange(
                          a.articulo.id_Articulo,
                          e.target.value
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          columnGap: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">Total de la orden:</Typography>
        <Typography variant="subtitle2">${totalPrice}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Button variant="outlined">Cancelar</Button>
        <Button
          variant="contained"
          disabled={disabledButton}
          onClick={() => handleSubmit()}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

const SecondStep = () => {
  const { registerOrder, setStep, step } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      registerOrder: state.registerOrder,
      warehouseSelected: state.warehouseSelected,
      provider: state.provider,
      step: state.step,
      setStep: state.setStep,
    }),
    shallow
  );
  const { isLoading, providerData } = useGetProvider(
    registerOrder?.OrdenCompra[0].Id_Proveedor as string
  );
  const articles = registerOrder?.OrdenCompra.flatMap(
    (p) => p.OrdenCompraArticulo
  );

  console.log({ registerOrder });

  if (isLoading)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <CircularProgress size={40} />
      </Box>
    );
  return (
    <Box>
      <Stack>
        <Typography variant="subtitle1">Información del proveedor</Typography>
        <Grid container spacing={2}>
          <Grid
            item
            container
            xs={12}
            md={6}
            lg={4}
            sx={{ alignItems: "center", columnGap: 1 }}
          >
            <Typography variant="subtitle2">Nombre contacto:</Typography>
            <Typography variant="subtitle2">
              {providerData?.nombreContacto}
            </Typography>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={6}
            lg={4}
            sx={{ alignItems: "center", columnGap: 1 }}
          >
            <Typography variant="subtitle2">Compañía:</Typography>
            <Typography variant="subtitle2">
              {providerData?.nombreCompania}
            </Typography>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={6}
            lg={4}
            sx={{ alignItems: "center", columnGap: 1 }}
          >
            <Typography variant="subtitle2">Teléfono:</Typography>
            <Typography variant="subtitle2">
              {providerData?.telefono}
            </Typography>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={6}
            lg={4}
            sx={{ alignItems: "center", columnGap: 1 }}
          >
            <Typography variant="subtitle2">RFC:</Typography>
            <Typography variant="subtitle2">{providerData?.rfc}</Typography>
          </Grid>
        </Grid>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1">Artículos</Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles?.map((a) => (
                <TableRow key={a.Id_Articulo}>
                  <TableCell>{a.nombre}</TableCell>
                  <TableCell>{a.Cantidad}</TableCell>
                  <TableCell>{a.precioProveedor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Button variant="outlined" onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained">Guardar</Button>
      </Box>
    </Box>
  );
};
