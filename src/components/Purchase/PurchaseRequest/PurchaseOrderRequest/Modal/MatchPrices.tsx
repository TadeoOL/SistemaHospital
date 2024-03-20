import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Modal,
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
import {
  addPurchaseOrder,
  getPurchaseOrderRequestPdf,
} from "../../../../../api/api.routes";
import { ViewPdf } from "../../../../Inputs/ViewPdf";
import { toast } from "react-toastify";
import { usePurchaseOrderRequestPagination } from "../../../../../store/purchaseStore/purchaseOrderRequestPagination";
import { usePurchaseOrderPagination } from "../../../../../store/purchaseStore/purchaseOrderPagination";
import { ArrowForward } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveAsOutlined";

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

const stepperViews = (
  step: number,
  data: IPurchaseAuthorization,
  open: Function
) => {
  switch (step) {
    case 0:
      return <FirstStep data={data} setOpen={open} />;
    case 1:
      return <SecondStep setOpen={open} />;
    default:
      break;
  }
};

const useGetPdf = (idQuote: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const setPdf = useDirectlyPurchaseRequestOrderStore(
    useShallow((state) => state.setPdf)
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPurchaseOrderRequestPdf(idQuote);
        setPdf(res.pdfBase64);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);
  return { isLoading };
};

export const MatchPrices = (props: {
  data: IPurchaseAuthorization | null;
  setOpen: Function;
}) => {
  const { data, setOpen } = props;
  const { isLoading } = useGetPdf(data ? data.id_SolicitudCompra : "");
  const step = useDirectlyPurchaseRequestOrderStore(
    useShallow((state) => state.step)
  );

  if (!data || isLoading)
    return (
      <Backdrop open>
        <CircularProgress size={40} />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal title="Selección de precios" setOpen={() => {}} />
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
        {stepperViews(step, data, setOpen)}
      </Stack>
    </Box>
  );
};

const FirstStep = (props: {
  data: IPurchaseAuthorization;
  setOpen: Function;
}) => {
  const { data } = props;
  const {
    setStep,
    step,
    setRegisterOrder,
    setWarehouseSelected,
    articlesData,
    setArticlesData,
    setTotalAmountRequest,
    pdf,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      setStep: state.setStep,
      step: state.step,
      setRegisterOrder: state.setRegisterOrder,
      setWarehouseSelected: state.setWarehouseSelected,
      articlesData: state.articles,
      setArticlesData: state.setArticles,
      setTotalAmountRequest: state.setTotalAmountRequest,
      pdf: state.pdf,
    }),
    shallow
  );
  const [viewPdf, setViewPdf] = useState(false);
  const [prices, setPrices] = useState<{
    [key: string]: { price: string; amount: number };
  }>({});
  const disabledButton = Object.values(prices).some(
    (a) => a.price.trim() === "" || parseFloat(a.price) === 0
  );
  const totalPrice = useMemo(() => {
    return Object.values(prices).reduce((total, item) => {
      const totalPriceObject = parseFloat(item.price) * item.amount;
      return total + totalPriceObject || 0;
    }, 0);
  }, [prices]);
  const providerName = data.solicitudProveedor[0].proveedor.nombre;

  useEffect(() => {
    if (!articlesData) return;
    const newPrices: typeof prices = {};
    for (const iterator of articlesData) {
      newPrices[iterator.id] = {
        price: iterator.price.toString() || "",
        amount: iterator.amount || 0,
      };
    }
    setPrices(newPrices);
  }, []);

  const handlePriceChange = useCallback((id: string, value: string) => {
    if (!isValidFloat(value)) return;
    setPrices((prevPrices) => {
      const existingItem = prevPrices[id];
      if (!existingItem) return prevPrices;
      const updatedItem = {
        ...existingItem,
        price: value,
      };
      return { ...prevPrices, [id]: updatedItem };
    });
  }, []);

  const handleSubmit = () => {
    const warehouse = data.almacen?.nombre;
    const articles = data.solicitudProveedor
      .flatMap((p) => p.solicitudCompraArticulos)
      .map((a) => {
        return {
          Id_Articulo: a.articulo.id_Articulo,
          Cantidad: a.cantidadCompra,
          precioProveedor: parseFloat(prices[a.articulo.id_Articulo].price),
          nombre: a.articulo.nombre,
        };
      });

    const objectPurchase: IRegisterOrderPurchase = {
      Id_SolicitudCompra: data.id_SolicitudCompra,
      OrdenCompra: data.solicitudProveedor.map((p) => {
        const providerId = p.proveedor.id_Proveedor;
        return {
          Id_Proveedor: providerId,
          OrdenCompraArticulo: articles,
        };
      }),
    };

    setWarehouseSelected(warehouse ? warehouse : "");
    setRegisterOrder(objectPurchase);
    setTotalAmountRequest(totalPrice);
    setArticlesData(
      articles.map((a) => {
        return {
          id: a.Id_Articulo,
          name: a.nombre,
          amount: a.Cantidad,
          price: a.precioProveedor,
        };
      })
    );
    setStep(step + 1);
  };

  return (
    <>
      <Box>
        <Stack sx={{ display: "flex", flex: 1, alignItems: "start", mb: 2 }}>
          <Typography variant="subtitle2">PDF - {providerName}</Typography>
          <Box>
            <Button onClick={() => setViewPdf(true)}>Ver PDF</Button>
          </Box>
        </Stack>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell>Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articlesData?.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell align="center">{a.name}</TableCell>
                    <TableCell align="center">{a.amount}</TableCell>
                    <TableCell>
                      <TextField
                        label="Precio"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={
                          Object.values(prices).length > 0
                            ? prices[a.id].price
                            : "" || ""
                        }
                        onChange={(e) => {
                          handlePriceChange(a.id, e.target.value);
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
          <Typography variant="subtitle2">Total de la orden:</Typography>
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
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => props.setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={disabledButton}
            endIcon={<ArrowForward />}
            onClick={() => handleSubmit()}
          >
            Siguiente
          </Button>
        </Box>
      </Box>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <>
          <ViewPdf pdf={pdf} setViewPdf={setViewPdf} />
        </>
      </Modal>
    </>
  );
};

const SecondStep = (props: { setOpen: Function }) => {
  const {
    registerOrder,
    setStep,
    step,
    warehouseSelected,
    articles,
    totalAmountRequest,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      registerOrder: state.registerOrder,
      warehouseSelected: state.warehouseSelected,
      provider: state.provider,
      step: state.step,
      setStep: state.setStep,
      articles: state.articles,
      totalAmountRequest: state.totalAmountRequest,
    }),
    shallow
  );
  const { isLoading, providerData } = useGetProvider(
    registerOrder?.OrdenCompra[0].Id_Proveedor as string
  );

  const handleSubmit = async () => {
    if (!registerOrder) return;
    const modifiedPurchaseOrder = registerOrder.OrdenCompra.map((o) => ({
      ...o,
      OrdenCompraArticulo: o.OrdenCompraArticulo.map((a) => {
        const { nombre, ...rest } = a;
        return rest;
      }),
    }));
    const object = {
      Id_SolicitudCompra: registerOrder.Id_SolicitudCompra,
      OrdenCompra: modifiedPurchaseOrder,
    };

    try {
      await addPurchaseOrder(object);
      toast.success("Orden creada con éxito!");
      usePurchaseOrderRequestPagination.getState().fetch();
      usePurchaseOrderPagination.getState().fetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al crear la orden!");
    }
  };

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
      <Stack>
        <Typography variant="subtitle1">Información de almacén</Typography>
        <Box sx={{ display: "flex", flex: 1, columnGap: 1 }}>
          <Typography variant="subtitle2">Nombre:</Typography>
          <Typography variant="subtitle2">{warehouseSelected}</Typography>
        </Box>
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
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.amount}</TableCell>
                  <TableCell>{a.price}</TableCell>
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
        }}
      >
        <Typography variant="subtitle2">Total de la orden:</Typography>
        <Typography variant="subtitle2">${totalAmountRequest}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => setStep(step - 1)}
        >
          Regresar
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={() => handleSubmit()}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
};
