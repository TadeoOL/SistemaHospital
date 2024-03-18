import {
  Backdrop,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
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
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import {
  getProviderQuotePdf,
  matchArticlesWithProviders,
} from "../../../../../api/api.routes";
import { useCallback, useState } from "react";
import { useMatchProvidersAndArticles } from "../../../../../store/purchaseStore/matchProvidersAndArticles";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { Delete, Info } from "@mui/icons-material";
import { usePurchaseAuthorizationPagination } from "../../../../../store/purchaseStore/purchaseAuthorizationPagination";

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
  const { purchaseRequestData, purchaseOrderMatched, setPurchaseOrderMatched } =
    useMatchProvidersAndArticles(
      (state) => ({
        purchaseRequestData: state.purchaseRequestData,
        purchaseOrderMatched: state.purchaseOrderMatched,
        setPurchaseOrderMatched: state.setPurchaseOrderMatched,
      }),
      shallow
    );
  const providers = purchaseRequestData
    ? purchaseRequestData.solicitudProveedor
    : [];
  const [articles, setArticles] = useState<any[] | undefined>(
    purchaseRequestData?.solicitudProveedor[0].solicitudCompraArticulos
  );
  const [providerSelected, setProviderSelected] = useState("");
  const [articlesChecked, setArticlesChecked] = useState<string[]>([]);

  const handleChange = useCallback((e: any) => {
    setProviderSelected(e.target.value);
  }, []);

  const handleCheckArticle = useCallback(
    (e: any) => {
      const { value, checked } = e.target;
      if (checked) {
        setArticlesChecked((prev) => [...prev, value]);
      } else {
        setArticlesChecked(articlesChecked.filter((a) => a !== value));
      }
    },
    [articlesChecked]
  );

  const handleIsArticlesChecked = useCallback(
    (articleId: string) => {
      return articlesChecked.some((a) => a === articleId);
    },
    [articlesChecked]
  );

  const getProviderNameById = useCallback(
    (providerId: string) => {
      if (!purchaseRequestData) return;
      const provider = purchaseRequestData.solicitudProveedor.find(
        (p) => p.proveedor.id_Proveedor === providerId
      );
      return provider ? provider.proveedor.nombre : "";
    },
    [purchaseRequestData]
  );

  const getArticleNameById = (articleId: string) => {
    if (!purchaseRequestData) return;
    const article =
      purchaseRequestData.solicitudProveedor[0].solicitudCompraArticulos.find(
        (a) => a.articulo.id_Articulo === articleId
      );
    return article ? article.articulo.nombre : "";
  };

  const handleMatchArticlesAndProviders = () => {
    if (!providerSelected)
      return toast.error("Necesitas seleccionar un proveedor!");
    if (articlesChecked.length === 0)
      return toast.error("Necesitas seleccionar artículos!");

    const prevMatched = purchaseOrderMatched ? purchaseOrderMatched : [];

    const isAlready = prevMatched.find(
      (o) => o.providerId === providerSelected
    );
    const articlesData = articlesChecked.map((articleCheck) => {
      const art = articles?.find(
        (a) => a.articulo.id_Articulo === articleCheck
      );
      return {
        articleId: art ? art.articulo.id_Articulo : "",
        purchasePrice: art ? art.precioProveedor : 0,
        amount: art ? art.cantidadCompra : 0,
      };
    });

    if (isAlready) {
      const modifying = {
        providerId: isAlready.providerId,
        article: [...isAlready.article, ...articlesData],
      };
      const prevFilter = prevMatched.filter(
        (p) => p.providerId !== modifying.providerId
      );

      setPurchaseOrderMatched([...prevFilter, modifying]);
    } else {
      const newObject = {
        providerId: providerSelected,
        article: articlesData,
      };

      const updatedMatched =
        !prevMatched || prevMatched.length === 0
          ? [newObject]
          : [
              ...prevMatched.filter(
                (obj) => obj.providerId !== providerSelected
              ),
              newObject,
            ];

      setPurchaseOrderMatched(updatedMatched);
    }

    setArticles((prevArticles) => {
      if (!prevArticles) return [];
      return prevArticles.filter(
        (a) =>
          !articlesChecked.some(
            (articleCheck) => articleCheck === a.articulo.id_Articulo
          )
      );
    });
    // setProviders((prev) => {
    //   return prev?.filter((p) => p.proveedor.id_Proveedor !== providerSelected);
    // });
    setArticlesChecked([]);
    setProviderSelected("");
  };

  const handleRemoveProvider = useCallback(
    (providerId: string) => {
      if (!purchaseOrderMatched) return;
      const orderRemoved = purchaseOrderMatched.find(
        (p) => p.providerId === providerId
      );
      const articleArray =
        purchaseRequestData?.solicitudProveedor[0].solicitudCompraArticulos.filter(
          (a) =>
            orderRemoved?.article.some(
              (artR) => artR.articleId === a.articulo.id_Articulo
            )
        );
      // const provider = purchaseRequestData?.solicitudProveedor.find(
      //   (p) => p.proveedor.id_Proveedor === orderRemoved?.providerId
      // );

      setArticles((prev) => {
        if (prev && articleArray) {
          return [...prev, ...articleArray];
        } else if (articleArray) {
          return [...articleArray];
        } else {
          return [];
        }
      });

      // setProviders((prev) => {
      //   if (prev && provider) {
      //     return [...prev, provider];
      //   } else if (provider) {
      //     return [provider];
      //   } else {
      //     return [];
      //   }
      // });

      setPurchaseOrderMatched(
        purchaseOrderMatched.filter((p) => p.providerId !== providerId)
      );
    },
    [purchaseOrderMatched, purchaseRequestData]
  );

  const handleRemoveArticleFromProvider = useCallback(
    (articleId: string) => {
      if (!purchaseRequestData) return;
      if (!purchaseOrderMatched) return;

      const article =
        purchaseRequestData.solicitudProveedor[0].solicitudCompraArticulos.find(
          (a) => a.articulo.id_Articulo === articleId
        );
      // const provider = purchaseRequestData?.solicitudProveedor.find(
      //   (p) => p.proveedor.id_Proveedor === providerId
      // );

      setArticles((prev) => {
        if (prev && article) {
          return [...prev, article];
        } else if (article) {
          return [article];
        } else {
          return [];
        }
      });

      // setProviders((prev) => {
      //   if (prev && provider) {
      //     return [...prev, provider];
      //   } else if (provider) {
      //     return [provider];
      //   } else {
      //     return [];
      //   }
      // });

      const updatedPurchaseOrderMatched = purchaseOrderMatched
        .map((p) => {
          const updatedArticle = p.article.filter(
            (a) => a.articleId !== articleId
          );
          if (updatedArticle.length === 0) {
            return null;
          }
          return {
            ...p,
            article: updatedArticle,
          };
        })
        .filter(
          (
            item
          ): item is {
            providerId: string;
            article: {
              articleId: string;
              purchasePrice: number;
              amount: number;
            }[];
          } => item !== null
        );

      setPurchaseOrderMatched(updatedPurchaseOrderMatched);
    },
    [purchaseRequestData, purchaseOrderMatched]
  );

  const handleSendAuth = useCallback(async () => {
    if (!purchaseOrderMatched) return;
    if (!purchaseRequestData) return;
    const ordenCompra = purchaseOrderMatched.map((item) => {
      const solicitudCompraProveedor =
        purchaseRequestData.solicitudProveedor.find((p) => {
          return p.proveedor.id_Proveedor === item.providerId;
        });

      return {
        Id: solicitudCompraProveedor ? solicitudCompraProveedor.id : "",
        Proveedor: {
          Id_Proveedor: item.providerId,
        },
        SolicitudCompraArticulos: item.article.map((article) => {
          return {
            Id_Articulo: article.articleId,
            CantidadCompra: article.amount,
            PrecioProveedor: article.purchasePrice,
          };
        }),
      };
    });
    const object = {
      Id_SolicitudCompra: purchaseRequestData.id_SolicitudCompra,
      SolicitudProveedores: ordenCompra,
    };
    try {
      await matchArticlesWithProviders(object);
      toast.success("Operación exitosa artículos agregados!");
      usePurchaseAuthorizationPagination
        .getState()
        .fetchPurchaseAuthorization();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al realizar la operación!");
    }
  }, [purchaseRequestData, purchaseOrderMatched]);

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
                  placeholder="Proveedor"
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
                            {/* <Checkbox size="small" /> */}
                          </TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Cantidad</TableCell>
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
                    <Stack key={i.providerId} spacing={1}>
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
                                <TableCell />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {i.article.map((a) => (
                                <TableRow key={a.articleId}>
                                  <TableCell>
                                    {getArticleNameById(a.articleId)}
                                  </TableCell>
                                  <TableCell>{a.amount}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() =>
                                        handleRemoveArticleFromProvider(
                                          a.articleId
                                        )
                                      }
                                    >
                                      <Delete />
                                    </IconButton>
                                  </TableCell>
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
                  disabled={
                    !purchaseOrderMatched || purchaseOrderMatched.length === 0
                  }
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleSendAuth()}
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
