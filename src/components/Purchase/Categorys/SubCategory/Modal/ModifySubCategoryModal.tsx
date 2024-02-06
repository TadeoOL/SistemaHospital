import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSubCategory } from "../../../../../schema/schemas";
import { ICategory, ISubCategory } from "../../../../../types/types";
import { useState } from "react";
import { useGetCategories } from "../../../../../hooks/useGetCategorys";
import { toast } from "react-toastify";
import { modifySubCategory } from "../../../../../api/api.routes";
import { useSubCategoryPagination } from "../../../../../store/purchaseStore/subCategoryPagination";

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

interface IModifySubCategoryModal {
  data: any;
  open: Function;
}

export const ModifySubCategoryModal = (props: IModifySubCategoryModal) => {
  const { id, nombre, descripcion, categoria } = props.data ?? {};
  const [value, setValue] = useState(descripcion);
  const [category, setCategory] = useState(categoria.id);
  const { categories, isLoading } = useGetCategories();
  const { handleChangeSubCategory, setHandleChangeSubCategory } =
    useSubCategoryPagination((state) => ({
      handleChangeSubCategory: state.handleChangeSubCategory,
      setHandleChangeSubCategory: state.setHandleChangeSubCategory,
    }));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ISubCategory>({
    defaultValues: {
      id: id,
      nombre: nombre,
      descripcion: descripcion,
      categoryId: category,
    },
    resolver: zodResolver(addSubCategory),
  });

  const onSubmit: SubmitHandler<ISubCategory> = async (data) => {
    try {
      const idForm = getValues("id");
      await modifySubCategory({ ...data, id: idForm });
      toast.success("La sub categoría ha sido modificada con éxito!");
      props.open(false);
      setHandleChangeSubCategory(!handleChangeSubCategory);
    } catch (error) {
      console.log(error);
      toast.error("Error al modificar la sub categoría!");
    }
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCategory(value);
  };

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.open} title="Agregar sub categoría" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Nombre"
              {...register("nombre")}
            />
            <TextField
              fullWidth
              {...register("descripcion")}
              error={!!errors.descripcion}
              size="small"
              label="Descripción"
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
              onChange={handleChangeText}
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              fullWidth
              size="small"
              select
              label="Categoría"
              error={!!errors.categoryId}
              helperText={errors?.categoryId?.message}
              {...register("categoryId")}
              value={category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem value={category.id} key={category.id}>
                  {category.nombre}
                </MenuItem>
              ))}
            </TextField>
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
