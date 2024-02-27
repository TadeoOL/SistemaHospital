import { Box, Button, Stack, Typography } from "@mui/material";
import { Provider } from "../../../../types/types";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { ProvidersQuotePdf } from "../../PurchaseRequest/PurchaseOrderRequest/Modal/ProviderQuoteModal";
import { getProviderQuotePdf } from "../../../../api/api.routes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, md: 600, lg: 800 },
};

type MatchProvidersAndArticlesProps = {
  providers: Provider[];
  purchaseRequestId: string;
  setOpen: Function;
  folio: string;
};

export const MatchProvidersAndArticles = (
  props: MatchProvidersAndArticlesProps
) => {
  const { setOpen, providers, purchaseRequestId, folio } = props;

  const handleOpenPdf = async (quoteId: string) => {
    try {
      const pdfRes = await getProviderQuotePdf(quoteId);
      const pdfWindow = window.open("", "_blank");
      pdfWindow?.document.write(
        "<embed width='100%' height='100%' src='" + encodeURI(pdfRes) + "'/>"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title={folio} />
      <Stack
        sx={{
          px: 8,
          py: 3,
          bgcolor: "white",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            Cotización de proveedores
          </Typography>
          <Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
            {providers.map((p) => (
              <Button
                key={p.id}
                variant="contained"
                onClick={() => {
                  handleOpenPdf(p.id);
                }}
              >
                {p.proveedor.nombre}
              </Button>
            ))}
          </Box>
        </Stack>
        {/* <ProvidersQuotePdf
          providers={providers}
          purchaseRequestId={purchaseRequestId}
          setOpen={setOpen}
        /> */}
      </Stack>
    </Box>
  );
};
