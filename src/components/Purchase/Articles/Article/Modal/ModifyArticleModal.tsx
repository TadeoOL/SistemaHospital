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
import { addArticle } from "../../../../../schema/schemas";
import { IArticle, ISubCategory } from "../../../../../types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetSubCategories } from "../../../../../hooks/useGetSubCategories";
import { useArticlePagination } from "../../../../../store/purchaseStore/articlePagination";
import { getArticleById, modifyArticle } from "../../../../../api/api.routes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, md: 600 },
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
  articleId: string;
}

const useFetchArticle = (articleId: string) => {
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<IArticle | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingArticle(true);
      try {
        const data = await getArticleById(articleId);
        setArticle(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticle(false);
      }
    };
    fetchData();
  }, [articleId]);
  return { isLoadingArticle, article };
};

export const ModifyArticleModal = (props: IModifyCategoryModal) => {
  const { open, articleId } = props;
  const { isLoadingArticle, article } = useFetchArticle(articleId);
  const {
    id,
    codigoBarras,
    descripcion,
    id_subcategoria,
    nombre,
    stockAlerta,
    stockMinimo,
    unidadMedida,
    precioInventario,
  } = article ?? {};
  const { subCategories, isLoading } = useGetSubCategories();
  const [textValue, setTextValue] = useState("");
  const [subCategory, setSubCategory] = useState("");

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
  } = useForm<IArticle>({
    defaultValues: {
      id: id,
      nombre: nombre,
      descripcion: descripcion,
      codigoBarras: codigoBarras,
      id_subcategoria: id_subcategoria,
      stockAlerta: stockAlerta,
      stockMinimo: stockMinimo,
      unidadMedida: unidadMedida,
      precioInventario: precioInventario,
    },
    resolver: zodResolver(addArticle),
  });

  useEffect(() => {
    if (article) {
      const subCate = article.subCategoria as ISubCategory;
      if (textValue.trim() === "") setTextValue(article.descripcion);
      if (!subCategory) setSubCategory(subCate.id);
      setValue("id_subcategoria", subCate.id);
      Object.entries(article).forEach(([key, value]) => {
        if (key === "stockMinimo" || key === "stockAlerta") {
          setValue(key as keyof IArticle, String(value));
        } else {
          setValue(key as keyof IArticle, value);
        }
      });
    }
  }, [article, setValue]);

  const handleError = (err: any) => {
    console.log({ err });
  };
  const onSubmit: SubmitHandler<IArticle> = async (data) => {
    try {
      const idForm = getValues("id");
      console.log({ data });
      await modifyArticle({ ...data, id: idForm });
      setHandleChangeArticle(!handleChangeArticle);
      toast.success("Articulo modificado con éxito!");
      open(false);
    } catch (error) {
      toast.error("Error al modificar el articulo!");
    }
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSubCategory(value);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  if (isLoading || isLoadingArticle)
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
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
                size="small"
                label="Nombre"
                {...register("nombre")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.descripcion}
                size="small"
                label="Descripción"
                {...register("descripcion")}
                multiline
                onChange={handleChangeText}
                helperText={
                  <Box
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {errors
                        ? errors.descripcion
                          ? errors.descripcion.message
                          : null
                        : null}
                    </Box>
                    <Box>{`${textValue.length}/${200}`}</Box>
                  </Box>
                }
                maxRows={3}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.codigoBarras}
                helperText={errors?.codigoBarras?.message}
                size="small"
                label="Código de barras"
                {...register("codigoBarras")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.stockMinimo}
                helperText={errors?.stockMinimo?.message}
                size="small"
                label="Stock mínimo"
                {...register("stockMinimo")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.stockAlerta}
                helperText={errors?.stockAlerta?.message}
                size="small"
                label="Stock alerta"
                {...register("stockAlerta")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.precioInventario}
                helperText={errors?.precioInventario?.message}
                size="small"
                label="Precio estimado"
                {...register("precioInventario")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                error={!!errors.unidadMedida}
                helperText={errors?.unidadMedida?.message}
                size="small"
                label="Unidad de medida"
                {...register("unidadMedida")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Categoría"
                error={!!errors.id_subcategoria}
                helperText={errors?.id_subcategoria?.message}
                {...register("id_subcategoria")}
                value={subCategory}
                onChange={handleChange}
              >
                {subCategories.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.nombre}
                  </MenuItem>
                ))}
              </TextField>
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
