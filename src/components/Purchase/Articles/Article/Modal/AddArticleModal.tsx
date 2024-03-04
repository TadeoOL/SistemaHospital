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
import { IArticle } from "../../../../../types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetSubCategories } from "../../../../../hooks/useGetSubCategories";
import { useArticlePagination } from "../../../../../store/purchaseStore/articlePagination";
import { addNewArticle } from "../../../../../api/api.routes";

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

interface IAddArticleModal {
  open: Function;
}

export const AddArticleModal = (props: IAddArticleModal) => {
  const { open } = props;
  const { subCategories, isLoading } = useGetSubCategories();
  const [value, setValue] = useState("");
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
    formState: { errors },
  } = useForm<IArticle>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      codigoBarras: "",
      id_subcategoria: "",
      stockAlerta: 0,
      stockMinimo: 0,
      unidadMedida: "",
      precioInventario: 0,
    },
    resolver: zodResolver(addArticle),
  });

  const handleError = (err: any) => {
    console.log({ err });
  };
  const onSubmit: SubmitHandler<IArticle> = async (data) => {
    try {
      await addNewArticle(data);
      setHandleChangeArticle(!handleChangeArticle);
      toast.success("Articulo creado con éxito!");
      open(false);
    } catch (error) {
      toast.error("Error al crear el articulo!");
    }
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSubCategory(value);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  if (isLoading)
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
                    <Box>{`${value.length}/${200}`}</Box>
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
                label="Sub categoria"
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
