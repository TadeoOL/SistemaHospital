import { Box, Button, Stack, TextField } from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCategory } from "../../../../../schema/schemas";
import { ICategory } from "../../../../../types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { modifyCategory } from "../../../../../api/api.routes";
import { useCategoryPagination } from "../../../../../store/purchaseStore/categoryPagination";

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

interface IModifyCategoryModal {
  data: ICategory | null;
  open: Function;
}

export const ModifySubCategoryModal = (props: IModifyCategoryModal) => {
  const { nombre, descripcion, id } = props.data ?? {};
  const [value, setValue] = useState(descripcion);
  const { handleChangeCategory, setHandleChangeCategory } =
    useCategoryPagination((state) => ({
      handleChangeCategory: state.handleChangeCategory,
      setHandleChangeCategory: state.setHandleChangeCategory,
    }));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues: {
      id: id,
      nombre: nombre,
      descripcion: descripcion,
    },
    resolver: zodResolver(addCategory),
  });

  const onSubmit: SubmitHandler<ICategory> = async (data) => {
    try {
      const idForm = getValues("id");
      await modifyCategory({ ...data, id: idForm });
      toast.success("Categoría modificada con éxito!");
      setHandleChangeCategory(!handleChangeCategory);
      props.open(false);
    } catch (error) {
      toast.error("Error al modificar la categoría");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.open} title="Modificar categoría" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              {...register("nombre")}
              size="small"
              label="Nombre"
              error={!!errors.nombre}
            />
            <TextField
              fullWidth
              {...register("descripcion")}
              size="small"
              label="Descripción"
              error={!!errors.descripcion}
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
                  <Box>{`${value?.length}/${200}`}</Box>
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
