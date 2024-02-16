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
  getArticlesByIds,
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
    title: "Tu orden excede el limite de precio para compra directa?",
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Mandar a autorización",
    denyButtonText: `Solicitar proveedores`,
    customClass: {
      container: "swal-container",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      setIsManyProviders(false);
      setStep(step + 1);
    } else if (result.isDenied) {
      setIsManyProviders(true);
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
  const { cleanArticles } = useArticlePagination();
  const {
    step,
    isAddingMoreArticles,
    setIsAddingMoreArticles,
    isManyProviders,
  } = useArticlesAlertPagination((state) => ({
    step: state.step,
    isAddingMoreArticles: state.isAddingMoreArticles,
    setIsAddingMoreArticles: state.setIsAddingMoreArticles,
    isManyProviders: state.isManyProviders,
  }));

  useEffect(() => {
    return () => {
      cleanArticles();
    };
  }, []);

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
  const {
    checkedArticles,
    setCheckedArticles,
    setStep,
    setHandleOpen,
    handleOpen,
    step,
    setIsManyProviders,
  } = useArticlesAlertPagination(
    (state) => ({
      checkedArticles: state.checkedArticles,
      setCheckedArticles: state.setCheckedArticles,
      setStep: state.setStep,
      setHandleOpen: state.setHandleOpen,
      handleOpen: state.handleOpen,
      step: state.step,
      setIsManyProviders: state.setIsManyProviders,
    }),
    shallow
  );
  const { articles, isLoadingArticles } = useGetArticlesByIds(checkedArticles);
  const handleDeleteArticle = (id: string) => () => {
    const articlesFiltered = checkedArticles.filter(
      (article) => article !== id
    );
    setCheckedArticles(articlesFiltered);
  };
  const [isLoading, setIsLoading] = useState(false);

  const simulateAsyncCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Llamada asincrónica completada");
      }, 2000);
    });
  };

  const handleNextStep = async () => {
    try {
      setIsLoading(true);
      const { cantidadOrdenDirecta } = await getPurchaseConfig();
      const articleData = await getArticlesByIds(checkedArticles);
      const sumaPrecios = addArticlesPrice(articleData);
      await simulateAsyncCall();
      console.log({ cantidadOrdenDirecta });
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
                  <TableCell>Precio estimado</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoadingArticles && articles.length > 0 ? (
                  articles.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.stockMinimo}</TableCell>
                      <TableCell>{item.precioInventario}</TableCell>
                      <TableCell>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={handleDeleteArticle(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : isLoadingArticles && articles.length === 0 ? (
                  <CircularProgress />
                ) : null}
              </TableBody>
            </Table>
            {articles.length === 0 && !isLoadingArticles && (
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
  } = useArticlesAlertPagination(
    (state) => ({
      checkedArticles: state.checkedArticles,
      setCheckedArticles: state.setCheckedArticles,
      setIsAddingMoreArticles: state.setIsAddingMoreArticles,
      isAddingMoreArticles: state.isAddingMoreArticles,
      articlesPurchased: state.articlesPurchased,
      setArticlesPurchased: state.setArticlesPurchased,
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
    return articlesAlreadyChecked.some((article) => article === id);
  };

  const handleIsArticleChecked = useCallback(
    (articleId: string) => {
      if (
        checkedArticles.some((article) => article === articleId) ||
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
      setArticlesId((prev) => [...prev, value]);
    } else {
      setArticlesId(articlesId.filter((item) => item !== value));
    }
  };

  const handleAddArticles = useCallback(() => {
    const missingQuantity = Object.keys(quantityArticles).some(
      (id) => !quantityArticles[id]?.cantidadComprar
    );
    console.log(missingQuantity);
    // if (!missingQuantity) return setShowError(true);
    const articlesPurchasedArray = Object.values(quantityArticles).map(
      (item) => ({
        id_articulo: item.id_articulo,
        cantidadComprar: parseInt(item.cantidadComprar),
        precioInventario: item.precioInventario,
      })
    );
    console.log({ articlesPurchasedArray });
    setArticlesPurchased([...articlesPurchased, ...articlesPurchasedArray]);
    setCheckedArticles([...checkedArticles, ...articlesId]);
    setIsAddingMoreArticles(!isAddingMoreArticles);
  }, [articlesId]);

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
                    <TableCell>Precio estimado</TableCell>
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
                                quantityArticles[item.id]?.cantidadComprar || ""
                              }
                              error={showError && !quantityArticles[item.id]}
                              helperText={
                                showError && !quantityArticles[item.id]
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
  const { setStep, step } = useArticlesAlertPagination((state) => ({
    setStep: state.setStep,
    step: state.step,
  }));
  const { isLoadingProviders, providers } = useGetAllProviders();
  const [selectedProvider, setSelectedProvider] = useState<string | string[]>(
    ""
  );

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
            onChange={(e) => {
              setSelectedProvider([e.target.value]);
            }}
          >
            {providers.map((provider) => (
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
