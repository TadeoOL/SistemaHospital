import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { usePurchaseOrderRequestModals } from "../../../../../../store/purchaseStore/purchaseOrderRequestModals";
import { shallow } from "zustand/shallow";
import { useGetProvider } from "../../../../../../hooks/useGetProvider";

export const FillQuoteInformationModal = () => {
  const { step, setStep, providerSelected } = usePurchaseOrderRequestModals(
    (state) => ({
      step: state.step,
      setStep: state.setStep,
      providerSelected: state.providerSelected,
    }),
    shallow
  );
  const { isLoading, providerData } = useGetProvider(providerSelected);

  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  console.log({ providerData });

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  return (
    <Stack spacing={2} sx={{ mt: 4 }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            Información del proveedor
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Compañía: {providerData?.nombreCompania}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>
            Nombre contacto: {providerData?.nombreContacto}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Dirección: {providerData?.direccion}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Teléfono: {providerData?.telefono}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>
            Correo electrónico: {providerData?.correoElectronico}
          </Typography>
        </Grid>
      </Grid>
      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
        Productos solicitados
      </Typography>
      <Box sx={{ borderRadius: 2, boxShadow: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          mt: 10,
        }}
      >
        <Button variant="contained" onClick={() => handlePrevStep()}>
          Regresar
        </Button>
        <Button variant="contained" onClick={() => handleNextStep()}>
          Generar orden de compra
        </Button>
      </Box>
    </Stack>
  );
};
