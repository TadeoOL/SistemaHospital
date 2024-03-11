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
import { ISubCategory } from "../../../../../types/types";
import { useGetCategories } from "../../../../../hooks/useGetCategories";
import { useState } from "react";
import { toast } from "react-toastify";
import { addNewSubCategory } from "../../../../../api/api.routes";
import { useSubCategoryPagination } from "../../../../../store/purchaseStore/subCategoryPagination";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, lg: 600 },
  bgcolor: "background.paper",
  borderRadius: 8,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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

interface IAddSubCategoryModal {
  open: Function;
}

export const AddSubCategoryModal = (props: IAddSubCategoryModal) => {
  const { open } = props;
  const { categories, isLoading } = useGetCategories();
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const { handleChangeSubCategory, setHandleChangeSubCategory } =
    useSubCategoryPagination((state) => ({
      setHandleChangeSubCategory: state.setHandleChangeSubCategory,
      handleChangeSubCategory: state.handleChangeSubCategory,
    }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISubCategory>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_categoria: "",
    },
    resolver: zodResolver(addSubCategory),
  });

  const onSubmit: SubmitHandler<ISubCategory> = async (data) => {
    try {
      await addNewSubCategory(data);
      toast.success("Sub categoría agregada correctamente!");
      setHandleChangeSubCategory(!handleChangeSubCategory);
      open(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al agregar una nueva sub categoría!");
    }
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCategory(value);
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
      <HeaderModal setOpen={open} title="Agregar sub categoría" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              {...register("nombre")}
              error={!!errors.nombre}
              helperText={errors?.nombre?.message}
              size="small"
              label="Nombre"
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
                  <Box>{`${value.length}/${200}`}</Box>
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
              error={!!errors.id_categoria}
              helperText={errors?.id_categoria?.message}
              {...register("id_categoria")}
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
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => open(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              startIcon={<SaveOutlinedIcon />}
            >
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
