import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { HeaderModal } from "./SubComponents/HeaderModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewUserSchema, userSettingsSchema } from "../../../schema/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddUser } from "../../../types/types";
import { useState } from "react";
import { registerNewUser } from "../../../api/api.routes";
import { toast } from "react-toastify";
import { useUserPaginationStore } from "../../../store/userPagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

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

const roles = ["ADMIN", "USER"];

export const AddUserModal = (props: IAddUserModal) => {
  const { setOpen } = props;
  const [values, setValues] = useState<string[]>([]);
  const setNewUser = useUserPaginationStore((state) => state.setNewUser);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

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
  } = useForm<IAddUser>({
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      imagenURL:
        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
      nombreUsuario: "",
      contrasena: "",
      confirmarContrasena: "",
      roles: [],
    },
    resolver: zodResolver(addNewUserSchema),
  });

  const onSubmit: SubmitHandler<IAddUser> = async (data) => {
    try {
      const imagenURL = getValues("imagenURL");
      const userData = {
        ...data,
        imagenURL,
      };
      setIsLoading(true);
      const user = await registerNewUser(userData);
      setNewUser(user);
      toast.success("Usuario agregado correctamente!");
      setValues([]);
      setOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Error al agregar nuevo usuario!");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setText(passwordValue);
  };

  return (
    <>
      <Box sx={{ ...style, ...scrollbarStyle }}>
        <HeaderModal setOpen={setOpen} title="Agregar nuevo usuario" />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ p: 6 }}>
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
                size="small"
                label="Nombre"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.apellidoPaterno}
                helperText={errors?.apellidoPaterno?.message}
                {...register("apellidoPaterno")}
                size="small"
                label="Apellido paterno"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.apellidoMaterno}
                helperText={errors?.apellidoMaterno?.message}
                {...register("apellidoMaterno")}
                size="small"
                label="Apellido materno"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                size="small"
                label="Correo electrónico"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.telefono}
                helperText={errors?.telefono?.message}
                {...register("telefono")}
                size="small"
                label="Telefono"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={700} fontSize={24}>
                Informacion de sesion
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.nombreUsuario}
                helperText={errors?.nombreUsuario?.message}
                {...register("nombreUsuario")}
                size="small"
                label="Nombre de usuario"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                error={!!errors.roles}
                helperText={errors?.roles?.message}
                label="Selecciona el rol"
                {...register("roles")}
                name="roles"
                size="small"
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
                type={showPassword ? "text" : "password"}
                fullWidth
                error={!!errors.contrasena}
                helperText={errors?.contrasena?.message}
                {...register("contrasena")}
                size="small"
                label="Contraseña"
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {text.trim() === "" ? null : (
                        <IconButton
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      )}
                      <Tooltip title="La contraseña debe contener al menos una letra mayúsculay un número">
                        <HelpOutlinedIcon />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                type={showPassword ? "text" : "password"}
                fullWidth
                error={!!errors.confirmarContrasena}
                helperText={errors?.confirmarContrasena?.message}
                {...register("confirmarContrasena")}
                size="small"
                label="Confirmar Contraseña"
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {text.trim() === "" ? null : (
                        <IconButton
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
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
        </form>
      </Box>
    </>
  );
};
