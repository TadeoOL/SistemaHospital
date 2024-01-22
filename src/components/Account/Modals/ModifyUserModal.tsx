import { Box, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { IUser, IUserSettings } from "../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema } from "../../../schema/schemas";

interface IModifyUserModal {
  setOpen: Function;
  user: any;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flex: 1,
};

export const ModifyUserModal = (props: IModifyUserModal) => {
  const { user, setOpen } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserSettings>({
    defaultValues: {
      nombre: user?.nombre,
      apellidoPaterno: user?.apellidoPaterno,
      apellidoMaterno: user?.apellidoMaterno,
      email: user?.email,
      telefono: user?.telefono,
    },
    resolver: zodResolver(userSettingsSchema),
  });
  return (
    <Box sx={style}>
      <Stack>
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
          error={!!errors.telefono}
          helperText={errors?.telefono?.message}
          {...register("telefono")}
          size="medium"
          label="Telefono"
        />
      </Stack>
      <Typography>Modal modificacion user</Typography>
    </Box>
  );
};
