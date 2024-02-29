import {
  Backdrop,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { getProviderQuotePdf } from "../../../../api/api.routes";
import { useState } from "react";
import {
  ProvidersMatched,
  useMatchProvidersAndArticles,
} from "../../../../store/purchaseStore/matchProvidersAndArticles";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { PurchaseOrder } from "../../../../store/purchaseStore/matchProvidersAndArticles";
import { Info } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, sm: 600, md: 900, lg: 1200 },
};

type MatchProvidersAndArticlesProps = {
  setOpen: Function;
  folio: string;
};

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

export const MatchProvidersAndArticles = (
  props: MatchProvidersAndArticlesProps
) => {
  const { setOpen, folio } = props;
  const {
    purchaseRequestData,
    formattedData,
    setFormattedData,
    purchaseOrderMatched,
    setPurchaseOrderMatched,
  } = useMatchProvidersAndArticles(
    (state) => ({
      purchaseRequestData: state.purchaseRequestData,
      formattedData: state.formattedData,
      setFormattedData: state.setFormattedData,
      purchaseOrderMatched: state.purchaseOrderMatched,
      setPurchaseOrderMatched: state.setPurchaseOrderMatched,
    }),
    shallow
  );
  const [providers, setProviders] = useState<any[] | undefined>(
    purchaseRequestData?.solicitudProveedor
  );
  const [articles, setArticles] = useState<any[] | undefined>(
    purchaseRequestData?.solicitudCompraArticulo
  );
  const [providerSelected, setProviderSelected] = useState("");
  const [articlesChecked, setArticlesChecked] = useState<string[]>([]);

  const handleChange = (e: any) => {
    setProviderSelected(e.target.value);
  };

  const handleCheckArticle = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setArticlesChecked((prev) => [...prev, value]);
    } else {
      setArticlesChecked(articlesChecked.filter((a) => a !== value));
    }
  };

  const handleIsArticlesChecked = (articleId: string) => {
    return articlesChecked.some((a) => a === articleId);
  };

  const getProviderNameById = (providerId: string) => {
    const provider = purchaseRequestData?.solicitudProveedor.find(
      (p) => p.proveedor.id_Proveedor === providerId
    );
    return provider?.proveedor.nombre;
  };

  const getArticleNameById = (articleId: string) => {
    const article = purchaseRequestData?.solicitudCompraArticulo.find(
      (a) => a.articulo.id_Articulo === articleId
    );
    return article?.articulo.nombre;
  };

  const handleMatchArticlesAndProviders = () => {
    if (!providerSelected)
      return toast.error("Necesitas seleccionar un proveedor!");
    if (articlesChecked.length === 0)
      return toast.error("Necesitas seleccionar artículos!");

    const object = {
      providerId: providerSelected,
      article: articlesChecked.map((articleCheck) => {
        const art = articles?.find(
          (a) => a.articulo.id_Articulo === articleCheck
        );
        return {
          articleId: art ? art.articulo.id_Articulo : "",
          purchasePrice: art ? art.precioProveedor : 0,
          amount: art ? art.cantidadCompra : 0,
        };
      }),
    };

    console.log({ object });
    setPurchaseOrderMatched(
      !purchaseOrderMatched ? [object] : purchaseOrderMatched.concat(object)
    );
    setArticles((prevArticles) => {
      if (!prevArticles) return [];
      return prevArticles.filter(
        (a) =>
          !articlesChecked.some(
            (articleCheck) => articleCheck === a.articulo.id_Articulo
          )
      );
    });
    setProviders((prev) => {
      return prev?.filter((p) => p.proveedor.id_Proveedor !== providerSelected);
    });
    setArticlesChecked([]);
    setProviderSelected("");
  };

  const handleRemoveProvider = (providerId: string) => {
    if (!purchaseOrderMatched) return;
    const orderRemoved = purchaseOrderMatched.find(
      (p) => p.providerId === providerId
    );
    const articleArray = purchaseRequestData?.solicitudCompraArticulo.filter(
      (a) =>
        orderRemoved?.article.some(
          (artR) => artR.articleId === a.articulo.id_Articulo
        )
    );
    const provider = purchaseRequestData?.solicitudProveedor.find(
      (p) => p.proveedor.id_Proveedor === orderRemoved?.providerId
    );

    setArticles((prev) => {
      if (prev && articleArray) {
        return [...prev, ...articleArray];
      } else if (articleArray) {
        return [...articleArray];
      } else {
        return [];
      }
    });

    setProviders((prev) => {
      if (prev && provider) {
        return [...prev, provider];
      } else if (provider) {
        return [provider];
      } else {
        return [];
      }
    });

    setPurchaseOrderMatched(
      purchaseOrderMatched.filter((p) => p.providerId !== providerId)
    );
  };

  console.log({ providers });

  if (!purchaseRequestData)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title={folio} />
      <Box sx={{ overflowY: "auto" }}>
        <Box sx={{ maxHeight: { xs: 500, md: 550, lg: 580, xl: 800 } }}>
          <Stack
            sx={{
              px: 8,
              py: 3,
              bgcolor: "white",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              flexDirection: { md: "column", lg: "row" },
            }}
          >
            <Stack sx={{ display: "flex", flex: 1, overflowY: "auto" }}>
              <Stack spacing={2}>
                <Typography variant="h6">Cotización de proveedores</Typography>
                <Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
                  {purchaseRequestData.solicitudProveedor.map((p) => (
                    <Button
                      key={p.id}
                      size="small"
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
              <Divider sx={{ my: 1 }} />
              <Stack spacing={2}>
                <TextField
                  sx={{ maxWidth: 300 }}
                  size="small"
                  select
                  label="Proveedor"
                  value={providerSelected}
                  onChange={handleChange}
                >
                  {providers?.map((p) => (
                    <MenuItem
                      value={p.proveedor.id_Proveedor}
                      key={p.proveedor.id_Proveedor}
                    >
                      {p.proveedor.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <Card sx={{ overflowY: "auto" }}>
                  <TableContainer
                    sx={{ maxHeight: { xs: 200, sm: 240, md: 270, lg: 290 } }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Checkbox size="small" />
                          </TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Cantidad</TableCell>
                          <TableCell>Precio</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {articles?.map((i) => (
                          <TableRow key={i.articulo.id_Articulo}>
                            <TableCell>
                              <Checkbox
                                size="small"
                                value={i.articulo.id_Articulo}
                                onChange={handleCheckArticle}
                                checked={handleIsArticlesChecked(
                                  i.articulo.id_Articulo
                                )}
                              />
                            </TableCell>
                            <TableCell>{i.articulo.nombre}</TableCell>
                            <TableCell>{i.cantidadCompra}</TableCell>
                            <TableCell>{i.precioProveedor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "flex-end",
                  mt: 1,
                  alignItems: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  disabled={articles?.length === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMatchArticlesAndProviders();
                  }}
                >
                  Agregar artículos
                </Button>
              </Box>
            </Stack>
            <Divider
              orientation="vertical"
              flexItem
              variant="middle"
              sx={{ mx: 1 }}
            />
            <Stack sx={{ display: "flex", flex: 1 }}>
              <Typography variant="h6">Proveedores seleccionados</Typography>
              <Stack spacing={2}>
                {purchaseOrderMatched && purchaseOrderMatched.length > 0 ? (
                  purchaseOrderMatched.map((i) => (
                    <Stack key={i.providerId}>
                      <Stack
                        sx={{
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                          columnGap: 1,
                          justifyContent: "space-between",
                          flexDirection: "row",
                        }}
                      >
                        <Stack
                          sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            display: "flex",
                            flex: 1,
                            columnGap: 1,
                          }}
                        >
                          <Typography variant="overline">Proveedor:</Typography>
                          <Typography variant="subtitle2">
                            {getProviderNameById(i.providerId)}
                          </Typography>
                        </Stack>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProvider(i.providerId);
                          }}
                          sx={{ p: 0.5 }}
                        >
                          Quitar
                        </Button>
                      </Stack>
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
                              {i.article.map((a) => (
                                <TableRow key={a.articleId}>
                                  <TableCell>
                                    {getArticleNameById(a.articleId)}
                                  </TableCell>
                                  <TableCell>{a.amount}</TableCell>
                                  <TableCell>{a.purchasePrice}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Card>
                    </Stack>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flex: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      p: 4,
                    }}
                  >
                    <Info sx={{ width: 40, height: 40, color: "gray" }} />
                    <Typography variant="h5" color="gray">
                      No hay artículos seleccionados
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  disabled={!purchaseOrderMatched}
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Enviar
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
