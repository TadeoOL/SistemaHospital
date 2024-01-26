import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUpdateUsers, IUserSettings } from "../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema } from "../../../schema/schemas";
import { HeaderModal } from "./SubComponents/HeaderModal";
import { useState } from "react";
import { useUserPaginationStore } from "../../../store/userPagination";
import { updateUserData } from "../../../api/api.routes";
import { toast } from "react-toastify";

interface IModifyUserModal {
  setOpen: Function;
  user: any;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, lg: 600 },
  bgcolor: "background.paper",
  borderRadius: 2,
  /* borderTopRightRadius: { lg: 24, xs: 0 },
  borderBottomRightRadius: { lg: 24, xs: 0 },
  borderBottomLeftRadius: 24,
  borderTopLeftRadius: 24, */
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

const roles = ["ADMIN", "USER", "FARMACIA", "PROGRAMACION"];

export const ModifyUserModal = (props: IModifyUserModal) => {
  const { user, setOpen } = props;
  const [values, setValues] = useState<string[]>(user?.roles);
  const [isLoading, setIsLoading] = useState(false);
  const setNewUser = useUserPaginationStore((state) => state.setNewUser);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setValues(typeof value === "string" ? value.split(",") : value);
  };

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateUsers>({
    defaultValues: {
      nombre: user?.nombre,
      apellidoPaterno: user?.apellidoPaterno,
      apellidoMaterno: user?.apellidoMaterno,
      email: user?.email,
      telefono: user?.telefono,
      roles: user?.roles,
      nombreUsuario: user?.nombreUsuario,
    },
    resolver: zodResolver(userSettingsSchema),
  });
  console.log({ user });
  const onSubmit: SubmitHandler<IUpdateUsers> = async (data) => {
    const nombreUsuario = getValues("nombreUsuario");
    try {
      setIsLoading(true);
      const userData = {
        ...data,
        id: user?.id,
        roles: values,
        nombreUsuario,
      };
      const userRes: any = await updateUserData(userData);
      setNewUser(userRes);
      toast.success("Usuario modificado correctamente!");
      setValues([]);
      setOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Error al modificar al usuario!");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={style}>
          <HeaderModal setOpen={setOpen} title="Modificacion de usuario" />
          <Grid container spacing={3} sx={{ p: 4 }}>
            <Grid item xs={12}>
              <Typography fontWeight={700} fontSize={24}>
                Informacion basica
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
                {...register("nombre")}
                size="medium"
                label="Nombre"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.apellidoPaterno}
                helperText={errors?.apellidoPaterno?.message}
                {...register("apellidoPaterno")}
                size="medium"
                label="Apellido paterno"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.apellidoMaterno}
                helperText={errors?.apellidoMaterno?.message}
                {...register("apellidoMaterno")}
                size="medium"
                label="Apellido materno"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                size="medium"
                label="Correo electrónico"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.telefono}
                helperText={errors?.telefono?.message}
                {...register("telefono")}
                size="medium"
                label="Telefono"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography fontSize={24} fontWeight={700}>
                Informacion del sistema
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.nombreUsuario}
                helperText={errors?.nombreUsuario?.message}
                {...register("nombreUsuario")}
                size="medium"
                label="Nombre de usuario"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label="Selecciona el rol"
                name="Rol"
                onChange={handleChange}
                SelectProps={{
                  multiple: true,
                }}
                required
                select
                value={values}
              >
                {roles.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Box
            sx={{
              justifyContent: "space-between",
              display: "flex",
              flex: 1,
              p: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              Guardar
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};
