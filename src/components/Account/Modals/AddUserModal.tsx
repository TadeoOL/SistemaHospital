import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { HeaderModal } from "./SubComponents/HeaderModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema } from "../../../schema/schemas";
import { useForm } from "react-hook-form";
import { IAddUser } from "../../../types/types";
import { useCallback, useState } from "react";

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
  overflowY: "auto",
  maxHeight: { xs: 600 },
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

const scrollbarStyle = {
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

interface IAddUserModal {
  setOpen: Function;
}

const roles = ["ADMIN", "USUARIO", "FARMACIA", "PROGRAMACION"];

export const AddUserModal = (props: IAddUserModal) => {
  const { setOpen } = props;
  const [values, setValues] = useState([]);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setValues(typeof value === "string" ? value.split(",") : value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddUser>({
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      contraseña: "",
      nombreUsuario: "",
      roles: [],
    },
    resolver: zodResolver(userSettingsSchema),
  });

  return (
    <>
      <Box sx={style}>
        <HeaderModal setOpen={setOpen} title="Agregar nuevo usuario" />
        <Grid container spacing={3} sx={{ p: 6 }}>
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
              error={!!errors.contraseña}
              helperText={errors?.contraseña?.message}
              {...register("contraseña")}
              size="medium"
              label="Contraseña"
            />
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
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained">Guardar</Button>
        </Box>
      </Box>
    </>
  );
};
