import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUser, IUserSettings } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema } from "../../schema/schemas";
import { useAuthStore } from "../../store/auth";
import { toast } from "react-toastify";
import {
  changeUserPassword,
  updateBasicUserInformation,
} from "../../api/api.routes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
import { convertBase64 } from "../../utils/functions/dataUtils";
// import { updateUserData } from "../../api/api.routes";

interface IUpdateUserData extends IUserSettings {
  id: string;
  imagen?: string;
}

const handleChangePassword = () => {
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;
  let showPasswordCheckbox: HTMLInputElement;
  let actualPasswordInput: HTMLInputElement;

  const CambioContrasena = (
    <div>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Stack>
          <TextField
            id="actualPassword"
            type="password"
            label="Contraseña Actual"
            margin="normal"
            size="small"
            required
          />
          <TextField
            id="password"
            type="password"
            label="Contraseña Nueva"
            margin="normal"
            size="small"
            required
          />

          <TextField
            id="confirmPassword"
            type="password"
            label="Confirmar contraseña"
            margin="normal"
            size="small"
            required
          />
          <Typography>
            <label htmlFor="showPassword">Mostrar contraseña</label>
            <Checkbox id="showPassword" />
          </Typography>
        </Stack>
      </Box>
    </div>
  );

  withReactContent(Swal).fire({
    title: "Cambiar contraseña",
    html: CambioContrasena,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Cambiar",
    focusConfirm: false,
    showCancelButton: true,
    reverseButtons: true,
    didOpen: () => {
      const popup = withReactContent(Swal).getPopup()!;
      passwordInput = popup.querySelector("#password") as HTMLInputElement;
      actualPasswordInput = popup.querySelector(
        "#actualPassword"
      ) as HTMLInputElement;
      confirmPasswordInput = popup.querySelector(
        "#confirmPassword"
      ) as HTMLInputElement;
      showPasswordCheckbox = popup.querySelector(
        "#showPassword"
      ) as HTMLInputElement;

      showPasswordCheckbox.addEventListener("change", () => {
        const type = showPasswordCheckbox.checked ? "text" : "password";
        passwordInput.type = type;
        confirmPasswordInput.type = type;
        actualPasswordInput.type = type;
      });

      passwordInput.onkeyup = (event) =>
        event.key === "Enter" && withReactContent(Swal).clickConfirm();
      confirmPasswordInput.onkeyup = (event) =>
        event.key === "Enter" && withReactContent(Swal).clickConfirm();
      actualPasswordInput.onkeyup = (event) =>
        event.key === "Enter" && withReactContent(Swal).clickConfirm();
    },
    preConfirm: async () => {
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const actualPassword = actualPasswordInput.value;

      if (!password || !confirmPassword) {
        withReactContent(Swal).showValidationMessage(
          `Por favor, escribe una contraseña y una confirmación de contraseña`
        );
      }

      if (password !== confirmPassword) {
        withReactContent(Swal).showValidationMessage(
          `Las contraseñas no coinciden`
        );
      }

      if (password === confirmPassword) {
        try {
          const res = await changeUserPassword(
            password,
            confirmPassword,
            actualPassword
          );
          withReactContent(Swal).fire({
            title: `Cambio realizado`,
            text: res,
            icon: "success",
          });
        } catch (error: any) {
          console.log(error.response);
          if (error.response.status === 400) {
            return withReactContent(Swal).showValidationMessage(
              error.response.data.message
            );
          } else {
            withReactContent(Swal).fire({
              title: `Error`,
              text: `Error al actualizar la contraseña, la contraseña debe de tener al menos una Mayúscula y un Número`,
              icon: "error",
            });
          }
        }
      }
    },
  });
};

export const AccountCard = () => {
  const user = useAuthStore((state) => state.profile);
  // const [disabledEdit, setDisabledEdit] = useState(true);
  const setProfile = useAuthStore((state) => state.setProfile);
  const [selectedImage, setSelectedImage] = useState(user?.imagenURL);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertBase64(file);
      setSelectedImage(base64);
      event.target.value = "";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateUserData>({
    defaultValues: {
      nombre: user?.nombre,
      apellidoPaterno: user?.apellidoPaterno,
      apellidoMaterno: user?.apellidoMaterno,
      email: user?.email,
      telefono: user?.telefono,
      imagen: selectedImage,
    },
    resolver: zodResolver(userSettingsSchema),
  });

  const onSubmit: SubmitHandler<IUpdateUserData> = async (data) => {
    try {
      const formattedData = { ...data, imagenURL: selectedImage };
      const user: IUser = await updateBasicUserInformation(formattedData);
      toast.success("Datos actualizados correctamente!");
      setProfile(user);
    } catch (error) {
      console.log(error);
      toast.error("Error al modificar los datos");
    }
  };
  const handleError = (error: any) => {
    console.log({ error });
  };
  return (
    <Box
      sx={{
        boxShadow: 10,
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Stack sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit, handleError)} noValidate>
          <Stack>
            <Typography fontSize={24} fontWeight={700}>
              Informacion del perfil
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={400}
              sx={{ color: "neutral.400" }}
            >
              Actualiza tu informacion de usuario
            </Typography>
          </Stack>
          <Stack
            spacing={4}
            sx={{
              p: 4,
              flexDirection: { xs: "column", md: "row" },
              display: "flex",
              width: 1,
              flex: 1,
              alignItems: { xs: "center" },
              justifyContent: "space-between",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                width: { md: "50%" },
                display: "flex",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Avatar
                src={selectedImage}
                sx={{
                  height: { xs: "154px", md: "220px" },
                  width: { xs: "154px", md: "220px" },
                }}
              />
              <Button component="label" variant="outlined">
                <input
                  type="file"
                  hidden
                  onChange={handleImageChange}
                  accept="image/png, image/jpg"
                />
                Cambiar foto de perfil
              </Button>
            </Stack>
            <Stack
              spacing={2}
              sx={{
                width: { md: "50%" },
                display: "flex",
                flex: 1,
                pr: { md: 8 },
              }}
            >
              <TextField
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
                {...register("nombre")}
                size="medium"
                label="Nombre"
              />
              <TextField
                error={!!errors.apellidoPaterno}
                helperText={errors?.apellidoPaterno?.message}
                {...register("apellidoPaterno")}
                size="medium"
                label="Apellido paterno"
              />
              <TextField
                error={!!errors.apellidoMaterno}
                helperText={errors?.apellidoMaterno?.message}
                {...register("apellidoMaterno")}
                size="medium"
                label="Apellido materno"
              />
              <TextField
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                size="medium"
                label="Correo electrónico"
              />
              <TextField
                //
                error={!!errors.telefono}
                helperText={errors?.telefono?.message}
                {...register("telefono")}
                size="medium"
                label="Teléfono"
              />
              <Box>
                <Button
                  onClick={() => {
                    handleChangePassword();
                  }}
                  variant="outlined"
                >
                  Actualizar contraseña
                </Button>
              </Box>
            </Stack>
          </Stack>
          <Box style={{ textAlign: "right" }}>
            <Button variant="contained" type="submit" size="small">
              Guardar cambios
            </Button>
          </Box>
        </form>
      </Stack>
    </Box>
  );
};
