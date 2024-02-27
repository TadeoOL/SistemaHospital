import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { Close, Download } from "@mui/icons-material";
import { useState } from "react";
import { getPurchaseOrderRequestPdf } from "../../../../../api/api.routes";

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
  purchaseData: { folio: string; purchaseOrderId: string };
  open: Function;
}

export const PurchaseOrderModal = (props: PurchaseOrderModaProps) => {
  const { purchaseData, open } = props;
  const [viewPdf, setViewPdf] = useState(false);
  const [pdf, setPdf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pdfFetch = async () => {
    setIsLoading(true);
    try {
      const res = await getPurchaseOrderRequestPdf(
        purchaseData.purchaseOrderId
      );
      console.log({ res });
      setPdf(res[0].pdfBase64);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ pdf });
  return (
    <>
      <Box sx={style}>
        <HeaderModal
          title={"Enviar orden de compra - Solicitud No. " + purchaseData.folio}
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
          spacing={4}
        >
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Seleccione los proveedores para enviarle la solicitud
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
          </Stack>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Solicitud de orden de compra
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                pdfFetch();
                setViewPdf(true);
              }}
              sx={{ alignContent: "center", display: "flex" }}
            >
              {<Download />}
              Descargar
            </Button>
          </Stack>
          <Box
            sx={{ display: "flex", flex: 1, justifyContent: "flex-end", mt: 5 }}
          >
            <Button variant="contained">Aceptar</Button>
          </Box>
        </Stack>
      </Box>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        {!isLoading ? (
          <>
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
                    mx: 7,
                    mb: 3,
                    flex: 1,
                  }}
                >
                  <embed
                    src={"data:application/pdf;base64," + pdf}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </Box>
              </ClickAwayListener>
            </Stack>
          </>
        ) : (
          <Backdrop open>
            <CircularProgress />
          </Backdrop>
        )}
      </Modal>
    </>
  );
};
