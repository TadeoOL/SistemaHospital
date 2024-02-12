import { Box, Button, Stack, TextField } from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCategory } from "../../../../../schema/schemas";
import { ICategory } from "../../../../../types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { addNewCategory } from "../../../../../api/api.routes";
import { useCategoryPagination } from "../../../../../store/purchaseStore/categoryPagination";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400 },
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

interface IAddCategoryModal {
  open: Function;
}

export const AddCategoryModal = (props: IAddCategoryModal) => {
  const [value, setValue] = useState("");
  const { handleChangeCategory, setHandleChangeCategory } =
    useCategoryPagination((state) => ({
      setHandleChangeCategory: state.setHandleChangeCategory,
      handleChangeCategory: state.handleChangeCategory,
    }));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues: {
      id: "",
      nombre: "",
      descripcion: "",
    },
    resolver: zodResolver(addCategory),
  });

  const onSubmit: SubmitHandler<ICategory> = async (data) => {
    try {
      await addNewCategory(data);
      props.open(false);
      setHandleChangeCategory(!handleChangeCategory);
      toast.success("Categoría creada con éxito");
    } catch (error) {
      toast.error("Error al crear la categoría");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.open} title="Agregar categoría" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              error={!!errors.nombre}
              helperText={errors?.nombre?.message}
              size="small"
              label="Nombre"
              {...register("nombre")}
            />
            <TextField
              fullWidth
              error={!!errors.descripcion}
              size="small"
              label="Descripción"
              {...register("descripcion")}
              multiline
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
              maxRows={5}
              onChange={handleChange}
              inputProps={{ maxLength: 200 }}
            />
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              columnGap: 2,
              justifyContent: "space-between",
            }}
          >
            <Button variant="outlined" onClick={() => props.open(false)}>
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
