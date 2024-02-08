import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { IPurchase } from "../../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPurchase } from "../../../../schema/schemas";
import { useGetArticles } from "../../../../hooks/useGetArticles";
import { useState } from "react";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, lg: 600 },
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

export const DirectlyPurchasedModal = () => {
  const { isLoadingArticles, articles } = useGetArticles();
  const [selectedArticle, setSelectedArticle] = useState("");

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

  if (isLoadingArticles)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={() => {}} title="Compra directa" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              select
              size="small"
              error={!!errors.id_articulo}
              helperText={errors?.id_articulo?.message}
              label="Selecciona un articulo"
              value={selectedArticle}
              {...register("id_articulo")}
            >
              {articles.map((article) => (
                <MenuItem
                  key={article.id}
                  value={article.id}
                  onClick={() => handleChange(article.id)}
                >
                  {article.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              size="small"
              error={!!errors.cantidad}
              helperText={errors?.cantidad?.message}
              label="cantidad"
              {...register("cantidad")}
            />
          </Stack>
          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button variant="outlined">Cancelar</Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
