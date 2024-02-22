import { Box, Button, Stack, Typography } from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";

const style = {
  width: 600,
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  overflowY: "auto",
};

interface PurchaseOrderModaProps {
  idFolio: string;
  open: Function;
}

export const PurchaseOrderModal = (props: PurchaseOrderModaProps) => {
  const { idFolio, open } = props;
  return (
    <Box sx={style}>
      <HeaderModal
        title={"Enviar orden de compra - Solicitud No. " + idFolio}
        setOpen={open}
      />
      <Stack
        sx={{
          bgcolor: "white",
          px: 8,
          py: 2,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Typography>
          Seleccione los proveedores para enviarle la solicitud:
        </Typography>
        <Box>
          <Button>Select de proveedores</Button>
        </Box>
        <Stack
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Button variant="contained">Enviar por whatsapp</Button>
          <Button variant="contained">Enviar por correo</Button>
        </Stack>
        <Typography>Solicitud de orden de compra</Typography>
        <Button variant="contained">Descargar</Button>
        <Box
          sx={{ display: "flex", flex: 1, justifyContent: "flex-end", mt: 5 }}
        >
          <Button variant="contained">Aceptar</Button>
        </Box>
      </Stack>
    </Box>
  );
};
