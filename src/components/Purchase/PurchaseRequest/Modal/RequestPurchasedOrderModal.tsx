import {
  Backdrop,
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
  useTheme,
  useMediaQuery,
  Checkbox,
  Paper,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { IArticle, IPurchase } from "../../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPurchase } from "../../../../schema/schemas";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { SearchBar } from "../../../Inputs/SearchBar";
import { shallow } from "zustand/shallow";
import { useExistingArticlePagination } from "../../../../store/purchaseStore/existingArticlePagination";
import { useEffect, useState } from "react";
import { useArticlePagination } from "../../../../store/purchaseStore/articlePagination";
import { useGetArticlesByIds } from "../../../../hooks/useGetArticlesByIds";
import { useArticlesAlertPagination } from "../../../../store/purchaseStore/articlesAlertPagination";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

const Alert = () => {
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
    customClass: {
      container: "swal-container",
    },
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
};

const stepsForm = [
  {
    id: "step 1",
    title: "Solicitar orden de compra",
    fields: [
      "nombreCompania",
      "nombreContacto",
      "puesto",
      "direccion",
      "telefono",
      "correoElectronico",
    ],
  },
  {
    id: "step 2",
    title: "Seleccionar proveedor",
    fields: [
      "rfc",
      "nif",
      "giroEmpresa",
      "direccionFiscal",
      "tipoContribuyente",
    ],
  },
];
interface RequestPurchasedOrderModalProps {
  open: Function;
}
export const RequestPurchasedOrderModal = ({
  open,
}: RequestPurchasedOrderModalProps) => {
  const { cleanArticles } = useArticlePagination();
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedArticle, setSelectedArticle] = useState("");
  const [step, setStep] = useState(0);
  const [isAddingMoreArticles, setIsAddingMoreArticles] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPurchase>({
    defaultValues: {
      id_articulo: "",
      cantidad: 0,
    },
    resolver: zodResolver(addPurchase),
  });

  const onSubmit: SubmitHandler<IPurchase> = async (data) => {
    console.log({ data });
    try {
      toast.success("Categoría creada con éxito");
    } catch (error) {
      console.log(error);
      toast.error("Error al crear la categoría");
    }
  };

  const handleChange = (articleId: string) => {
    setSelectedArticle(articleId);
  };

  useEffect(() => {
    return () => {
      cleanArticles();
    };
  }, []);

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={() => {}}
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
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "sticky",
            bottom: 0,
            zIndex: 1,
            backgroundColor: "white",
            pb: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              !isAddingMoreArticles
                ? open(false)
                : setIsAddingMoreArticles(false)
            }
          >
            {!isAddingMoreArticles ? "Cancelar" : "Atrás"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!isAddingMoreArticles && step === 0) {
                Alert();
              } else if (isAddingMoreArticles && step === 0) {
                setTimeout(() => {
                  setIsAddingMoreArticles(false);
                }, 1000);
              } else {
                null;
              }
            }}
          >
            {!isAddingMoreArticles && step === 0
              ? "Siguiente"
              : isAddingMoreArticles && step === 0
              ? "Agregar artículos"
              : "Enviar solicitud"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const TableComponent = () => {
  const checkedArticles = useArticlesAlertPagination(
    (state) => state.checkedArticles
  );
  const { articles, isLoadingArticles } = useGetArticlesByIds(checkedArticles);
  return (
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
                <TableCell>{item.precioEstimado}</TableCell>
                <TableCell>
                  <Tooltip title="Eliminar">
                    <IconButton>
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
            No hay articulos agregados
          </Typography>
        </Paper>
      )}
    </Card>
  );
};

const AddMoreArticlesTable = () => {
  const { isLoading, data, setSearch } = useGetAllArticles();
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "start",
        justifyContent: "flex-start",
        overflowX: "auto",
        bgcolor: "white",
      }}
    >
      <SearchBar
        size="small"
        searchState={setSearch}
        title="Buscar articulo..."
      />
      <Card>
        <Table sx={{ minWidth: "700px" }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio estimado</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.stockMinimo}</TableCell>
                  <TableCell>{item.precioEstimado}</TableCell>
                  <TableCell>
                    <Tooltip title="Eliminar">
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <CircularProgress />
            )}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
};
