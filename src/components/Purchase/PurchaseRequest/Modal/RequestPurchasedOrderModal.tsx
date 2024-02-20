import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Card,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  Paper,
  TablePagination,
  Chip,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { IArticle } from "../../../../types/types";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { SearchBar } from "../../../Inputs/SearchBar";
import { shallow } from "zustand/shallow";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useArticlePagination } from "../../../../store/purchaseStore/articlePagination";
import { useGetArticlesByIds } from "../../../../hooks/useGetArticlesByIds";
import { useArticlesAlertPagination } from "../../../../store/purchaseStore/articlesAlertPagination";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useGetAllProviders } from "../../../../hooks/useGetAllProviders";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  addPurchaseOrder,
  getPurchaseConfig,
} from "../../../../api/api.routes";
import { addArticlesPrice } from "../../../../utils/functions/dataUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, md: 600, lg: 800 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: { xs: 600 },
  overflowY: "auto",
};

const styleBar = {
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
    borderRadius: 10,
  },
};

const useGetAllArticles = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchArticles,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    handleChangeArticle,
    setSearch,
    cleanArticles,
  } = useArticlePagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchArticles: state.fetchArticles,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeArticle: state.handleChangeArticle,
      setSearch: state.setSearch,
      cleanArticles: state.cleanArticles,
    }),
    shallow
  );

  useEffect(() => {
    fetchArticles();
  }, [pageIndex, pageSize, search, enabled, handleChangeArticle]);

  return {
    isLoading,
    data: data as IArticle[],
    enabled,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    setSearch,
    cleanArticles,
  };
};

const AlertConfigAmount = (
  setStep: Function,
  step: number,
  setIsManyProviders: Function
) => {
  Swal.fire({
    icon: "warning",
    title: "Tu orden excede el limite de precio para compra directa!",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Mandar a autorización",
    customClass: {
      container: "swal-container",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      setIsManyProviders(false);
      setStep(step + 1);
    }
  });
};

const stepsForm = [
  {
    id: "step 1",
    title: "Solicitar orden de compra",
  },
  {
    id: "step 2",
    title: "Seleccionar proveedor",
  },
];
interface RequestPurchasedOrderModalProps {
  open: Function;
}

export const RequestPurchasedOrderModal = ({
  open,
}: RequestPurchasedOrderModalProps) => {
  const {
    step,
    isAddingMoreArticles,
    setIsAddingMoreArticles,
    isManyProviders,
  } = useArticlesAlertPagination(
    (state) => ({
      step: state.step,
      isAddingMoreArticles: state.isAddingMoreArticles,
      setIsAddingMoreArticles: state.setIsAddingMoreArticles,
      isManyProviders: state.isManyProviders,
    }),
    shallow
  );

  return (
    <Box sx={{ ...style, ...styleBar }}>
      <HeaderModal
        setOpen={open}
        title={
          step === 0 ? "Solicitar de orden de compra" : "Seleccionar proveedor"
        }
      />
      <Stack spacing={4} sx={{ p: 3, px: 6 }}>
        <Stepper activeStep={step}>
          {stepsForm.map((step) => (
            <Step key={step.id}>
              <StepLabel>
                {
                  <Typography fontSize={{ lg: 14, xs: 12 }} fontWeight={500}>
                    {step.title}
                  </Typography>
                }
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {step === 0 ? (
          <>
            <Stack
              sx={{
                columnGap: 2,
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                flexDirection: { md: "row", xs: "column" },
                alignItems: "center",
              }}
            >
              <Typography fontSize={20} fontWeight={700}>
                {!isAddingMoreArticles
                  ? "Productos seleccionados"
                  : "Todos los productos"}
              </Typography>
              <Button
                disabled={isAddingMoreArticles}
                variant="contained"
                onClick={() => setIsAddingMoreArticles(!isAddingMoreArticles)}
              >
                Agregar mas productos
              </Button>
            </Stack>
            <Box>
              {!isAddingMoreArticles ? (
                <TableComponent />
              ) : (
                <AddMoreArticlesTable />
              )}
            </Box>
          </>
        ) : isManyProviders ? (
          <SelectManyProviders />
        ) : (
          <SelectSingleProvider />
        )}
      </Stack>
    </Box>
  );
};

const TableComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    setStep,
    setHandleOpen,
    handleOpen,
    step,
    setIsManyProviders,
    warehouseSelected,
    articlesPurchased,
  } = useArticlesAlertPagination(
    (state) => ({
      setStep: state.setStep,
      setHandleOpen: state.setHandleOpen,
      handleOpen: state.handleOpen,
      step: state.step,
      setIsManyProviders: state.setIsManyProviders,
      warehouseSelected: state.warehouseSelected,
      setArticlesPurchased: state.setArticlesPurchased,
      articlesPurchased: state.articlesPurchased,
    }),
    shallow
  );

  const { checkedArticles: articlesWare } =
    useArticlesAlertPagination.getState();

  const [checkedArticles, setCheckedArticles] = useState(
    articlesWare.filter((i) => i.idAlmacen === warehouseSelected)
  );

  const { articles, isLoadingArticles } = useGetArticlesByIds(
    checkedArticles.flatMap((article) => article.idArticulo)
  );

  const handleDeleteArticle = (id: string) => () => {
    const articlesFiltered = checkedArticles.filter(
      (article) => article.idArticulo !== id
    );
    setCheckedArticles(articlesFiltered);
    useArticlesAlertPagination.setState({ checkedArticles: articlesFiltered });
    useArticlesAlertPagination.setState({
      articlesPurchased: articlesPurchased.filter((i) => i.id_articulo !== id),
    });
  };

  const simulateAsyncCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Llamada asincronía completada");
      }, 2000);
    });
  };

  const handleNextStep = async () => {
    try {
      setIsLoading(true);
      const { cantidadOrdenDirecta } = await getPurchaseConfig();
      const sumaPrecios = addArticlesPrice(articlesPurchased);
      await simulateAsyncCall();
      if (sumaPrecios >= cantidadOrdenDirecta) {
        AlertConfigAmount(setStep, step, setIsManyProviders);
      } else {
        setStep(step + 1);
        setIsManyProviders(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const articleName = (articleId: string) => {
    const article = articles.find((i) => i.id === articleId);
    return article ? article.nombre : "";
  };

  return (
    <>
      <Box sx={{ overflowY: "auto" }}>
        <Box maxHeight={"300px"}>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio inventario</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoadingArticles && articlesPurchased.length > 0 ? (
                  articlesPurchased.map((item) => (
                    <TableRow key={item.id_articulo}>
                      <TableCell>{articleName(item.id_articulo)}</TableCell>
                      <TableCell>{item.cantidadComprar}</TableCell>
                      <TableCell>{item.precioInventario}</TableCell>
                      <TableCell>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={handleDeleteArticle(item.id_articulo)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : isLoadingArticles && articlesPurchased.length === 0 ? (
                  <CircularProgress />
                ) : null}
              </TableBody>
            </Table>
            {articlesPurchased.length === 0 && !isLoadingArticles && (
              <Paper
                sx={{
                  columnGap: 2,
                  p: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  display: "flex",
                }}
              >
                <ErrorOutlineIcon
                  sx={{ color: "neutral.400", width: 35, height: 35 }}
                />
                <Typography
                  sx={{ color: "neutral.400", fontWeight: 500, fontSize: 20 }}
                >
                  No hay artículos agregados
                </Typography>
              </Paper>
            )}
          </Card>
        </Box>
      </Box>
      <Stack
        sx={{
          mt: 4,
          display: "flex",
          flex: 1,
          alignItems: "end",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          Total precio estimado: ${addArticlesPrice(articlesPurchased)}.
        </Typography>
        <Typography sx={{ fontSize: 10 }}>
          Nota: El precio del proveedor puede variar con respecto al precio de
          inventario.
        </Typography>
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          backgroundColor: "white",
          pb: 1,
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          disabled={isLoading}
          onClick={() => {
            setHandleOpen(!handleOpen);
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={() => {
            checkedArticles.length > 0
              ? handleNextStep()
              : toast.error("No has seleccionado ningún articulo!");
          }}
        >
          {!isLoading ? "Siguiente" : <CircularProgress size={15} />}
        </Button>
      </Stack>
    </>
  );
};

const AddMoreArticlesTable = () => {
  const {
    isLoading,
    data,
    setSearch,
    count,
    pageIndex,
    pageSize,
    setPageSize,
    setPageIndex,
  } = useGetAllArticles();
  const {
    checkedArticles,
    setCheckedArticles,
    setIsAddingMoreArticles,
    isAddingMoreArticles,
    articlesPurchased,
    setArticlesPurchased,
    warehouseSelected,
  } = useArticlesAlertPagination(
    (state) => ({
      checkedArticles: state.checkedArticles,
      setCheckedArticles: state.setCheckedArticles,
      setIsAddingMoreArticles: state.setIsAddingMoreArticles,
      isAddingMoreArticles: state.isAddingMoreArticles,
      articlesPurchased: state.articlesPurchased,
      setArticlesPurchased: state.setArticlesPurchased,
      warehouseSelected: state.warehouseSelected,
    }),
    shallow
  );

  const [showError, setShowError] = useState(false);
  const [articlesId, setArticlesId] = useState<string[]>([]);
  const [quantityArticles, setQuantityArticles] = useState<{
    [key: string]: {
      id_articulo: string;
      cantidadComprar: string;
      precioInventario: number;
    };
  }>({});
  const articlesAlreadyChecked = useMemo(() => {
    return checkedArticles;
  }, []);

  const handleArticlesSelected = (id: string) => {
    return articlesAlreadyChecked.some(
      (article) =>
        article.idArticulo === id && article.idAlmacen === warehouseSelected
    );
  };

  const handleIsArticleChecked = useCallback(
    (articleId: string) => {
      if (
        checkedArticles.some(
          (article) =>
            article.idArticulo === articleId &&
            article.idAlmacen === warehouseSelected
        ) ||
        articlesId.some((article) => article === articleId)
      ) {
        return true;
      } else {
        return false;
      }
    },
    [checkedArticles, articlesId]
  );

  const handlePageChange = useCallback((event: any, value: any) => {
    setPageIndex(value);
  }, []);

  const handleArticleChecked = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setQuantityArticles((prev) => ({
        ...prev,
        [value]: {
          id_articulo: value,
          cantidadComprar: "",
          precioInventario: 0,
        },
      }));
      setArticlesId((prev) => [...prev, value]);
    } else {
      const { [value]: removedItem, ...rest } = quantityArticles;
      setQuantityArticles(rest);
      setArticlesId(articlesId.filter((item) => item !== value));
    }
  };

  const handleAddArticles = () => {
    const missingQuantity = Object.keys(quantityArticles).some((id) => {
      return quantityArticles[id].cantidadComprar.trim() === "";
    });
    if (missingQuantity) return setShowError(true);
    const articlesPurchasedArray = Object.values(quantityArticles).map(
      (item) => ({
        id_articulo: item.id_articulo,
        cantidadComprar: parseInt(item.cantidadComprar),
        precioInventario: item.precioInventario,
      })
    );
    console.log({ articlesPurchasedArray });
    const articleToChecked = Object.values(quantityArticles).map((i) => ({
      idArticulo: i.id_articulo,
      idAlmacen: warehouseSelected,
    }));
    setArticlesPurchased([...articlesPurchased, ...articlesPurchasedArray]);
    setCheckedArticles([...checkedArticles, ...articleToChecked]);
    setIsAddingMoreArticles(!isAddingMoreArticles);
  };

  const handleCantidadChange = (
    id: string,
    cantidad: string,
    precio: number
  ) => {
    console.log({ precio });
    setQuantityArticles((prevState) => ({
      ...prevState,
      [id]: {
        id_articulo: id,
        cantidadComprar: cantidad,
        precioInventario: precio,
      },
    }));
  };

  console.log({ quantityArticles });

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          alignItems: "start",
          justifyContent: "flex-start",
          bgcolor: "white",
          overflowY: "auto",
        }}
      >
        <SearchBar
          size="small"
          searchState={setSearch}
          title="Buscar articulo..."
        />
        <Box sx={{ overflowX: "auto", p: 1 }}>
          <Box sx={{ minWidth: "700px", maxHeight: "300px" }}>
            <Card>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio inventario</TableCell>
                  </TableRow>
                </TableHead>
                {!isLoading && data.length > 0 ? (
                  <TableBody>
                    {data.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          bgcolor: handleArticlesSelected(item.id)
                            ? "#F5F7F8"
                            : null,
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            value={item.id}
                            checked={handleIsArticleChecked(item.id)}
                            disabled={handleArticlesSelected(item.id)}
                            onChange={handleArticleChecked}
                          />
                        </TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>
                          {handleIsArticleChecked(item.id) &&
                          !handleArticlesSelected(item.id) ? (
                            <TextField
                              label="Cantidad a comprar"
                              value={
                                quantityArticles[item.id].cantidadComprar || ""
                              }
                              error={
                                showError &&
                                quantityArticles[
                                  item.id
                                ].cantidadComprar.trim() === ""
                              }
                              helperText={
                                showError &&
                                quantityArticles[
                                  item.id
                                ].cantidadComprar.trim() === ""
                                  ? "Debe agregar una cantidad"
                                  : null
                              }
                              onChange={(e) =>
                                handleCantidadChange(
                                  item.id,
                                  e.target.value,
                                  item.precioInventario
                                )
                              }
                            />
                          ) : (
                            item.stockMinimo
                          )}
                        </TableCell>
                        <TableCell>{item.precioInventario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : data.length === 0 ? (
                  <Typography>No hay productos para mostrar</Typography>
                ) : (
                  <CircularProgress />
                )}
              </Table>
              <TablePagination
                component="div"
                count={count}
                onPageChange={handlePageChange}
                onRowsPerPageChange={(e: any) => {
                  setPageSize(e.target.value);
                }}
                page={pageIndex}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </Card>
          </Box>
        </Box>
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          backgroundColor: "white",
          pb: 1,
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsAddingMoreArticles(!isAddingMoreArticles);
          }}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddArticles();
          }}
        >
          Agregar artículos
        </Button>
      </Stack>
    </>
  );
};

const SelectManyProviders = () => {
  const { setStep, step, checkedArticles } = useArticlesAlertPagination(
    (state) => ({
      setStep: state.setStep,
      step: state.step,
      checkedArticles: state.checkedArticles,
    })
  );
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [providerSelectedId, setProviderSelectedId] = useState("");

  const providerName = (providerId: string) => {
    const providerRes = providers.find((item) => item.id === providerId);
    return providerRes?.nombreContacto + " - " + providerRes?.nombreCompania;
  };

  const handleDeleteProvider = (providerId: string) => {
    const provFilter = selectedProvider.filter((item) => item !== providerId);
    setSelectedProvider(provFilter);
  };

  const handleSubmit = () => {
    if (selectedProvider.length === 0 || selectedProvider.length !== 3)
      return toast.error("Selecciona 3 proveedores");
    if (checkedArticles.length === 0)
      return toast.error("Error, no hay artículos seleccionados!");
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
                        <CancelIcon
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
              console.log({ e });
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
        >
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setStep(step + 1);
          }}
        >
          Enviar solicitud
        </Button>
      </Stack>
    </Stack>
  );
};

const SelectSingleProvider = () => {
  const {
    setStep,
    step,
    warehouseSelected,
    articlesPurchased,
    checkedArticles,
    fetchArticlesAlert,
  } = useArticlesAlertPagination(
    (state) => ({
      setStep: state.setStep,
      step: state.step,
      warehouseSelected: state.warehouseSelected,
      articlesPurchased: state.articlesPurchased,
      checkedArticles: state.checkedArticles,
      fetchArticlesAlert: state.fetchArticlesAlert,
    }),
    shallow
  );
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [error, setError] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (selectedProvider.length === 0) return setError(true);
    const objectToPurchase = {
      id_proveedor: selectedProvider,
      Articulos: articlesPurchased.map((article) => {
        const matchingCheckedArticle = checkedArticles.find(
          (checkedArticle) => {
            return (
              checkedArticle.idAlmacen === warehouseSelected &&
              checkedArticle.idArticulo === article.id_articulo
            );
          }
        );
        const idAlertaCompra = matchingCheckedArticle?.idAlerta;

        return {
          Id_Articulo: article.id_articulo,
          CantidadCompra: article.cantidadComprar,
          Id_AlertaCompra: idAlertaCompra !== undefined ? idAlertaCompra : null,
        };
      }),
      id_almacen: warehouseSelected,
      PrecioTotalInventario: addArticlesPrice(articlesPurchased),
    };
    try {
      await addPurchaseOrder(
        objectToPurchase.id_proveedor,
        objectToPurchase.Articulos,
        objectToPurchase.id_almacen,
        objectToPurchase.PrecioTotalInventario
      );
      toast.success("Orden de compra exitosa!");
      useArticlesAlertPagination.setState({ handleOpen: false });
      fetchArticlesAlert();
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
            error={error && selectedProvider.trim() === ""}
            helperText={
              error && selectedProvider.trim() === ""
                ? "Selecciona un proveedor"
                : null
            }
            onChange={(e) => {
              setSelectedProvider(e.target.value);
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
