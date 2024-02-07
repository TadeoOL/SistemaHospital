import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addExistingArticle } from "../../../../../schema/schemas";
import { IExistingArticle } from "../../../../../types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useArticlePagination } from "../../../../../store/purchaseStore/articlePagination";
import {
  getExistingArticleById,
  modifyExistingArticle,
} from "../../../../../api/api.routes";
import { useGetArticles } from "../../../../../hooks/useGetArticles";
import { useGetAlmacenes } from "../../../../../hooks/useGetAlmacenes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, md: 600 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: 600,
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

interface IModifyCategoryModal {
  open: Function;
  existingArticleId: string;
}

const useFetchExistingArticle = (existingArticleId: string) => {
  const [isLoadingExistingArticle, setIsLoadingExistingArticle] =
    useState(true);
  const [existingArticle, setArticle] = useState<IExistingArticle | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingExistingArticle(true);
      try {
        const data = await getExistingArticleById(existingArticleId);
        setArticle(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingExistingArticle(false);
      }
    };
    fetchData();
  }, [existingArticleId]);
  return { isLoadingExistingArticle, existingArticle };
};

export const ModifyExistingArticleModal = (props: IModifyCategoryModal) => {
  const { open, existingArticleId } = props;
  const { isLoadingExistingArticle, existingArticle } =
    useFetchExistingArticle(existingArticleId);
  const {
    id,
    nombre,
    almacen,
    factor,
    fechaCaducidad,
    fechaCompra,
    precioCompra,
    precioVenta,
    cantidad,
  } = existingArticle ?? {};
  const [almacenState, setAlmacenState] = useState("");
  const [article, setArticle] = useState("");
  const { articles, isLoadingArticles } = useGetArticles();
  const { isLoadingAlmacenes, almacenes } = useGetAlmacenes();

  const { handleChangeArticle, setHandleChangeArticle } = useArticlePagination(
    (state) => ({
      setHandleChangeArticle: state.setHandleChangeArticle,
      handleChangeArticle: state.handleChangeArticle,
    })
  );

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IExistingArticle>({
    defaultValues: {
      id: id,
      nombre: nombre,
      fechaCaducidad: fechaCaducidad,
      fechaCompra: fechaCompra,
      factor: factor,
      precioVenta: precioVenta,
      precioCompra: precioCompra,
      almacen: almacen,
      cantidad: cantidad,
    },
    resolver: zodResolver(addExistingArticle),
  });

  useEffect(() => {
    if (existingArticle) {
      if (!almacenState) setAlmacenState(existingArticle.almacen.id);
      if (!article) setArticle(existingArticle.articulo.id);
      setValue("id_almacen", existingArticle.almacen.id);
      setValue("id_articulo", existingArticle.articulo.id);
      Object.entries(existingArticle).forEach(([key, value]) => {
        setValue(key as keyof IExistingArticle, String(value));
      });
    }
  }, [existingArticle, setValue]);

  const handleError = (err: any) => {
    console.log({ err });
  };
  const onSubmit: SubmitHandler<IExistingArticle> = async (data) => {
    console.log({ data });
    try {
      const idForm = getValues("id");
      await modifyExistingArticle({ ...data, id: idForm });
      setHandleChangeArticle(!handleChangeArticle);
      toast.success("Articulo existente modificado con éxito!");
      open(false);
    } catch (error) {
      toast.error("Error al modificar el articulo existente!");
    }
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setAlmacenState(value);
  };

  if (isLoadingExistingArticle || isLoadingArticles || isLoadingAlmacenes)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Agregar articulo" />
      <form noValidate onSubmit={handleSubmit(onSubmit, handleError)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Grid component="span" container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Articulo"
                error={!!errors.id_articulo}
                helperText={errors?.id_articulo?.message}
                {...register("id_articulo")}
                value={article}
                onChange={handleChange}
              >
                {articles.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.cantidad}
                size="small"
                label="Cantidad"
                {...register("cantidad")}
                helperText={errors.cantidad?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.precioCompra}
                helperText={errors?.precioCompra?.message}
                size="small"
                label="Precio de compra"
                {...register("precioCompra")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.precioVenta}
                helperText={errors?.precioVenta?.message}
                size="small"
                label="Precio de venta"
                {...register("precioVenta")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.fechaCompra}
                helperText={errors?.fechaCompra?.message}
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="Fecha de compra"
                {...register("fechaCompra")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.fechaCaducidad}
                helperText={errors?.fechaCaducidad?.message}
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="Fecha de caducidad"
                {...register("fechaCaducidad")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Categoría"
                error={!!errors.id_almacen}
                helperText={errors?.id_almacen?.message}
                {...register("id_almacen")}
                value={almacenState}
                onChange={handleChange}
              >
                {almacenes.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.factor}
                helperText={errors?.factor?.message}
                size="small"
                label="Factor"
                {...register("factor")}
              />
            </Grid>
          </Grid>
          <Stack
            sx={{
              flexDirection: "row",
              columnGap: 2,
              justifyContent: "space-between",
            }}
          >
            <Button variant="outlined" onClick={() => open(false)}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
