import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Divider,
  Grid,
  IconButton,
  MenuItem,
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
  Tooltip,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { useDirectlyPurchaseRequestOrderStore as useDirectlyPurchaseRequestOrderStore } from "../../../../store/purchaseStore/directlyPurchaseRequestOrder";
import { useGetAlmacenes } from "../../../../hooks/useGetAlmacenes";
import {
  ArrowBack,
  ArrowForward,
  Cancel,
  Close,
  CloudUpload,
  Delete,
  Edit,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Save,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { useGetArticlesBySearch } from "../../../../hooks/useGetArticlesBySearch";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import {
  convertBase64,
  isValidFloat,
  isValidInteger,
} from "../../../../utils/functions/dataUtils";
import {
  addDirectlyPurchaseOrder,
  getPurchaseConfig,
} from "../../../../api/api.routes";
import { AlertConfigAmount } from "./RequestPurchasedOrderModal";
import {
  ManyProviders,
  SingleProvider,
} from "./SelectProviderForDirectlyPurchase";
import { useGetAllProviders } from "../../../../hooks/useGetAllProviders";
import { useDropzone } from "react-dropzone";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// import RequestPageIcon from "@mui/icons-material/RequestPage";

type Article = {
  id: string;
  nombre: string;
  precio: number;
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, sm: 550, md: 800, lg: 900 },
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: { xs: 600 },
};

const stepsArray = [
  {
    id: 1,
    title: "Seleccionar artículos",
  },
  {
    id: 2,
    title: "Subir PDF",
  },
  {
    id: 3,
    title: "Resumen",
  },
];

const stepsView = (step: number, setOpen: Function) => {
  switch (step) {
    case 0:
      return <BuildOrder setOpen={setOpen} />;
    case 1:
      return <StepTwo setOpen={setOpen} />;
    case 2:
      return <StepThree setOpen={setOpen} />;
  }
};

export const DirectlyPurchaseOrder = (props: { setOpen: Function }) => {
  const { step, isDirectlyPurchase } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      step: state.step,
      isDirectlyPurchase: state.isDirectlyPurchase,
    })
  );

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={() => {
          props.setOpen();
        }}
        title="Solicitud de compra directa"
      />
      <Stack sx={{ p: 4, bgcolor: "white", overflowY: "auto" }}>
        {isDirectlyPurchase && (
          <Stepper activeStep={step}>
            {stepsArray.map((s) => (
              <Step key={s.id}>
                <StepLabel>{s.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        {stepsView(step, props.setOpen)}
      </Stack>
    </Box>
  );
};

const BuildOrder = (props: { setOpen: Function }) => {
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const { articlesRes, isLoadingArticles } = useGetArticlesBySearch();
  const {
    warehouseSelected,
    setWarehouseSelected,
    setArticles,
    articles,
    setArticlesFetched,
    articlesFetched,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      warehouseSelected: state.warehouseSelected,
      setWarehouseSelected: state.setWarehouseSelected,
      setArticles: state.setArticles,
      articles: state.articles,
      setArticlesFetched: state.setArticlesFetched,
      articlesFetched: state.articlesFetched,
    }),
    shallow
  );
  const [articleSelected, setArticleSelected] = useState<Article | null>(null);
  const [amountText, setAmountText] = useState("");
  const [warehouseError, setWarehouseError] = useState(false);

  useEffect(() => {
    setArticlesFetched(articlesRes);
    setArticlesFetched(
      articlesRes.filter((a) => {
        return !articles.some((ar) => ar.id === a.id);
      })
    );
  }, [articlesRes]);

  const handleAddArticles = () => {
    if (!articleSelected) return;
    const objectArticle = {
      id: articleSelected.id,
      name: articleSelected.nombre,
      amount: parseFloat(amountText),
      price: articleSelected.precio,
    };
    const objectFiltered = articlesFetched.filter(
      (a) => a.id !== objectArticle.id
    );
    setArticlesFetched(objectFiltered);
    setArticles([...articles, objectArticle]);
    setArticleSelected(null);
    setAmountText("");
  };

  const OPTIONS_LIMIT = 5;
  const filterOptions = createFilterOptions<Article>({
    limit: OPTIONS_LIMIT,
  });

  if (isLoadingAlmacenes || isLoadingArticles)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center", p: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  return (
    <Stack sx={{ display: "flex", flex: 1, mt: 2 }}>
      <Stack sx={{ display: "flex", flex: 1, maxWidth: 300 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Almacén</Typography>
        <TextField
          select
          size="small"
          error={warehouseError}
          helperText={warehouseError && "Selecciona un almacén"}
          value={warehouseSelected}
          onChange={(e) => {
            setWarehouseError(false);
            setWarehouseSelected(e.target.value);
          }}
        >
          {almacenes.map((warehouse) => (
            <MenuItem key={warehouse.id} value={warehouse.id}>
              {warehouse.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          columnGap: 2,
          flexDirection: { xs: "column", sm: "row" },
          rowGap: { xs: 2, sm: 0 },
        }}
      >
        <Stack sx={{ display: "flex", flex: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
            Articulo
          </Typography>
          <Autocomplete
            disablePortal
            size="small"
            fullWidth
            filterOptions={filterOptions}
            onChange={(e, val) => {
              e.stopPropagation();
              setArticleSelected(val);
            }}
            getOptionLabel={(option) => option.nombre}
            options={articlesFetched}
            value={articleSelected}
            renderInput={(params) => (
              <TextField {...params} label="Artículos" />
            )}
          />
        </Stack>
        <Stack sx={{ display: "flex", flex: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
            Cantidad
          </Typography>
          <TextField
            size="small"
            fullWidth
            label="Cantidad"
            value={amountText}
            onChange={(e) => {
              if (!isValidInteger(e.target.value)) return;
              setAmountText(e.target.value);
            }}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          size="medium"
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleAddArticles()}
        >
          Agregar
        </Button>
      </Box>
      <ArticlesTable
        setWarehouseError={setWarehouseError}
        setOpen={props.setOpen}
      />
    </Stack>
  );
};

const ArticlesTable = (props: {
  setWarehouseError: Function;
  setOpen: Function;
}) => {
  const {
    articles,
    articlesFetched,
    setArticlesFetched,
    setArticles,
    step,
    setStep,
    setIsManyProviders,
    setIsDirectlyPurchase,
    setTotalAmountRequest,
    warehouseSelected,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      articles: state.articles,
      articlesFetched: state.articlesFetched,
      setArticlesFetched: state.setArticlesFetched,
      setArticles: state.setArticles,
      step: state.step,
      setStep: state.setStep,
      setIsManyProviders: state.setIsManyProviders,
      setIsDirectlyPurchase: state.setIsDirectlyPurchase,
      setTotalAmountRequest: state.setTotalAmountRequest,
      warehouseSelected: state.warehouseSelected,
    }),
    shallow
  );
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<any>({});
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [priceErrors, setPriceErrors] = useState<string[]>([]);
  const [isChargingPrices, setIsChargingPrices] = useState(true);

  const addPrices = () => {
    const newPrices: any = {};
    articles.forEach((article) => {
      if (article.price) {
        newPrices[article.id] = article.price.toString();
      }
    });
    setPrices(newPrices);
    setIsChargingPrices(false);
  };

  useEffect(() => {
    addPrices();
  }, [step]);

  useEffect(() => {
    articles.forEach((article) => {
      const articleHasPrice = Object.keys(prices).some((p) => p === article.id);

      if (articleHasPrice) {
        const articleId = article.id;
        const priceValue = prices[articleId];
        console.log({ priceValue });

        if (priceValue.trim() !== "" && parseFloat(priceValue) > 0) {
          setPriceErrors((prev) => prev.filter((id) => id !== article.id));
        } else {
          if (!priceErrors.includes(article.id)) {
            setPriceErrors((prev) => [...prev, article.id]);
          }
        }
      } else {
        if (!priceErrors.includes(article.id)) {
          setPriceErrors((prev) => [...prev, article.id]);
        }
      }
    });
  }, [articles, prices]);

  const totalValue = () => {
    const totalPrice = articles.reduce((total, item) => {
      const totalPriceObject = item.amount * parseFloat(prices[item.id]) || 0;
      return total + totalPriceObject;
    }, 0);
    return totalPrice;
  };

  const toggleEdit = (id: string) => {
    const newEditingIds = new Set(editingIds);
    if (newEditingIds.has(id)) {
      newEditingIds.delete(id);
    } else {
      newEditingIds.add(id);
    }
    setEditingIds(newEditingIds);
  };

  const handleDeleteArticle = (id: string) => {
    const articlesFiltered = articles.filter((a) => a.id !== id);
    const articleToAdd = articles.find((a) => a.id === id);
    const articleToAddModified = articleToAdd
      ? {
          id: articleToAdd.id,
          nombre: articleToAdd.name,
          precio: articleToAdd.price,
        }
      : null;
    if (articleToAddModified) {
      setArticlesFetched([...articlesFetched, articleToAddModified]);
    }
    setArticles(articlesFiltered);
  };

  const handleSaveQuantity = (id: string, newQuantity: string) => {
    if (!newQuantity || parseFloat(newQuantity) <= 0)
      return toast.warning("Escribe una cantidad valida!");
    const updatedArticles = articles.map((article) => {
      if (article.id === id) {
        return { ...article, amount: parseFloat(newQuantity) };
      }
      return article;
    });
    setArticles(updatedArticles);
  };

  const handlePriceChange = (id: string, value: string) => {
    if (!isValidFloat(value)) return;
    if (parseFloat(value) <= 0 || !value) {
      setPrices({ ...prices, [id]: value });
      return setPriceErrors((prev) => [...prev, id]);
    }
    if (priceErrors.some((p) => p === id))
      setPriceErrors(priceErrors.filter((p) => p !== id));
    setPrices({ ...prices, [id]: value });
  };

  const handleNextStep = async () => {
    const hasErrors = Object.values(priceErrors).some((error) => error);
    if (hasErrors) return;
    if (warehouseSelected.trim() === "") {
      props.setWarehouseError(true);
      return toast.error("Selecciona un almacén!");
    }
    const totalPrice = totalValue();
    const articleData = articles.map((article) => ({
      id: article.id,
      name: article.name,
      amount: article.amount,
      price: parseFloat(prices[article.id]) || article.price,
    }));
    setArticles(articleData);
    setTotalAmountRequest(totalPrice);
    try {
      const { cantidadOrdenDirecta, cantidadLicitacionDirecta } =
        await getPurchaseConfig();
      if (totalPrice >= cantidadLicitacionDirecta) {
        AlertConfigAmount(setStep, step, setIsManyProviders, true);
        setIsDirectlyPurchase(false);
        console.log("A licitacion de uña");
      } else if (totalPrice >= cantidadOrdenDirecta) {
        AlertConfigAmount(setStep, step, setIsManyProviders, false);
        setIsDirectlyPurchase(false);
      } else {
        setIsDirectlyPurchase(true);
        setStep(step + 1);
        console.log("Compra directa y pal siguiente paso");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al generar la compra");
    }

    console.log("Datos del artículo:", articleData);
  };

  if (isChargingPrices)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Card sx={{ mt: 4, overflowX: "auto" }}>
        <TableContainer sx={{ minWidth: 380 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre Articulo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .slice()
                .reverse()
                .map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>
                      {editingIds.has(a.id) ? (
                        <TextField
                          label="Cantidad"
                          size="small"
                          InputLabelProps={{ style: { fontSize: 12 } }}
                          value={quantity[a.id] || ""}
                          onChange={(e) => {
                            setQuantity({
                              ...quantity,
                              [a.id]: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        a.amount
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        label="Precio"
                        size="small"
                        InputLabelProps={{ style: { fontSize: 12 } }}
                        value={prices[a.id] || ""}
                        onChange={(e) => {
                          handlePriceChange(a.id, e.target.value);
                        }}
                        error={priceErrors.some((e) => e === a.id)}
                        helperText={
                          priceErrors.some((e) => e === a.id) &&
                          "Agrega el precio"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <>
                        <Tooltip
                          title={editingIds.has(a.id) ? "Guardar" : "Editar"}
                        >
                          <IconButton
                            onClick={() => {
                              if (editingIds.has(a.id)) {
                                handleSaveQuantity(a.id, quantity[a.id]);
                                toggleEdit(a.id);
                              } else {
                                toggleEdit(a.id);
                              }
                            }}
                          >
                            {editingIds.has(a.id) ? <Save /> : <Edit />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDeleteArticle(a.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {articles.length === 0 && (
          <Box
            sx={{ display: "flex", flex: 1, justifyContent: "center", py: 2 }}
          >
            <Info sx={{ width: 20, height: 20, color: "gray", opacity: 0.6 }} />
            <Typography variant="h6" sx={{ color: "gray", opacity: 0.6 }}>
              No hay artículos seleccionados
            </Typography>
          </Box>
        )}
      </Card>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          columnGap: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          Total de la orden:
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          ${totalValue()}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          mt: 2,
          bottom: 0,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Cancel />}
          color="error"
          onClick={() => props.setOpen(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          disabled={
            editingIds.size > 0 ||
            articles.length === 0 ||
            priceErrors.length > 0
          }
          onClick={() => handleNextStep()}
        >
          Siguiente
        </Button>
      </Box>
    </>
  );
};

const StepTwo = (props: { setOpen: Function }) => {
  const { isDirectlyPurchase, isManyProviders } =
    useDirectlyPurchaseRequestOrderStore((state) => ({
      isManyProviders: state.isManyProviders,
      isDirectlyPurchase: state.isDirectlyPurchase,
    }));

  if (isDirectlyPurchase) {
    return <SelectProviderAndUploadPDF />;
  } else if (isManyProviders) {
    return <ManyProviders setOpen={props.setOpen} />;
  } else {
    return <SingleProvider setOpen={props.setOpen} />;
  }
};

const SelectProviderAndUploadPDF = () => {
  const { providers, isLoadingProviders } = useGetAllProviders();
  const { step, setStep, pdf, setPdf, setProvider, provider } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        step: state.step,
        setStep: state.setStep,
        pdf: state.pdf,
        setPdf: state.setPdf,
        provider: state.provider,
        setProvider: state.setProvider,
      }),
      shallow
    );
  const [viewPdf, setViewPdf] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [providerSelected, setProviderSelected] = useState("");
  const [providerError, setProviderError] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0)
      return toast.error("Error: Solo se puede adjuntar 1 archivo .pdf!");
    try {
      const base64 = await convertBase64(acceptedFiles[0]);
      toast.success("Archivo subido con éxito!");
      setInputKey((prevKey) => prevKey + 1);
      setPdf(base64);
    } catch (error) {
      console.log(error);
      toast.error("Error al subir el documento pdf!");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleSelectProvider = (e: any) => {
    setProviderError(false);
    setProviderSelected(e.target.value);
    const providerData = providers.find((p) => p.id === e.target.value);
    if (providerData) {
      setProvider(providerData);
    }
  };

  const handleNext = () => {
    if (!provider) {
      setProviderError(true);
      return toast.error("Necesitas seleccionar a un proveedor!");
    }
    setStep(step + 1);
  };

  if (isLoadingProviders)
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center", py: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  return (
    <>
      <Stack sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Selecciona el proveedor:</Typography>
        <TextField
          select
          size="small"
          label="Proveedores"
          value={providerSelected}
          onChange={handleSelectProvider}
          error={providerError}
          helperText={providerError && "Selecciona un proveedor"}
        >
          {providers.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nombreContacto} - {p.nombreCompania}
            </MenuItem>
          ))}
        </TextField>
        <Stack spacing={1} sx={{ mt: 4 }}>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                bgcolor: "#EDEDED",
                p: 1,
                borderRadius: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {openCollapse ? (
                  <IconButton
                    onClick={() => {
                      setOpenCollapse(!openCollapse);
                    }}
                  >
                    <KeyboardArrowUp />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setOpenCollapse(!openCollapse);
                    }}
                  >
                    <KeyboardArrowDown />
                  </IconButton>
                )}
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                  {pdf ? "Ver PDF" : " Subir PDF"}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                Proveedor:{" "}
                {provider
                  ? `${provider.nombreContacto} - ${provider.nombreCompania}`
                  : "Sin seleccionar"}
              </Typography>
            </Box>
            <Collapse in={openCollapse} sx={{ px: 2 }}>
              {pdf.trim() !== "" ? (
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    p: 1,
                  }}
                >
                  <Button
                    onClick={() => {
                      setViewPdf(true);
                    }}
                    variant="outlined"
                    sx={{ p: 6 }}
                  >
                    {provider
                      ? `Cotización - ${provider.nombreContacto} - ${provider.nombreCompania}`
                      : `Cotización`}
                  </Button>
                  <Box>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          setPdf("");
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ) : (
                <Stack
                  sx={{
                    my: 1,
                    p: 4,
                    border: "1px #B4B4B8 dashed",
                    borderRadius: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  {...getRootProps({ className: "dropzone" })}
                >
                  <CloudUpload sx={{ width: 40, height: 40, color: "Gray" }} />
                  <input key={inputKey} {...getInputProps()} />
                  <Typography
                    sx={{
                      color: "#B4B4B8",
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Arrastra y suelta tus archivos aquí para subirlos
                  </Typography>
                </Stack>
              )}
            </Collapse>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            mt: 2,
            bottom: 0,
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => setStep(step - 1)}
          >
            Regresar
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => handleNext()}
          >
            Siguiente
          </Button>
        </Box>
      </Stack>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
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
                flex: 10,
                mx: 7,
                mb: 3,
              }}
            >
              <embed
                src={pdf}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>
          </ClickAwayListener>
        </Stack>
      </Modal>
    </>
  );
};

const StepThree = (props: { setOpen: Function }) => {
  const {
    provider,
    articles,
    step,
    setStep,
    totalAmountRequest,
    warehouseSelected,
  } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      provider: state.provider,
      articles: state.articles,
      step: state.step,
      setStep: state.setStep,
      totalAmountRequest: state.totalAmountRequest,
      warehouseSelected: state.warehouseSelected,
    }),
    shallow
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!provider) return;
    setIsLoading(true);
    const object = {
      Id_Proveedor: provider.id,
      Id_Almacen: warehouseSelected,
      PrecioTotalOrden: totalAmountRequest,
      OrdenCompraArticulo: articles.map((a) => {
        return {
          Id_Articulo: a.id,
          Cantidad: a.amount,
          PrecioProveedor: a.price,
        };
      }),
    };

    try {
      await addDirectlyPurchaseOrder(object);
      toast.success("Orden de compra realizada con éxito!");
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al realizar la compra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <Typography variant="h6">Resumen de la compra</Typography>
      </Box>
      <Stack>
        <Typography variant="subtitle1">Información del proveedor</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4} spacing={1}>
            <Typography variant="subtitle2">Nombre contacto:</Typography>
            <Typography>{provider?.nombreContacto}</Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4} spacing={1}>
            <Typography variant="subtitle2">Compañía:</Typography>
            <Typography>{provider?.nombreCompania}</Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4} spacing={1}>
            <Typography variant="subtitle2">Teléfono:</Typography>
            <Typography>{provider?.telefono}</Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4} spacing={1}>
            <Typography variant="subtitle2">RFC:</Typography>
            <Typography>{provider?.rfc}</Typography>
          </Grid>
        </Grid>
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
                {articles.map((a) => (
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
          <Typography variant="subtitle2">Total de la orden: </Typography>
          <Typography>${totalAmountRequest}</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          mt: 2,
          bottom: 0,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => setStep(step - 1)}
        >
          Regresar
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={18} /> : "Generar compra"}
        </Button>
      </Box>
    </Stack>
  );
};
