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
import { IUpdateUsers } from "../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema } from "../../../schema/schemas";
import { HeaderModal } from "./SubComponents/HeaderModal";
import { useEffect, useState } from "react";
import { useUserPaginationStore } from "../../../store/userPagination";
import {
	AdminChangeUsersPassword,
	getRoles,
	updateUserData,
} from "../../../api/api.routes";
import { toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

interface IModifyUserModal {
	setOpen: Function;
	user: any;
}

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: 380, lg: 600 },
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

const handleChangePassword = (userId: string) => {
	let passwordInput: HTMLInputElement;
	let confirmPasswordInput: HTMLInputElement;
	let showPasswordCheckbox: HTMLInputElement;

	withReactContent(Swal).fire({
		icon: "warning",
		title: "Cambiar contraseña",
		html: `
    <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
    <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña">
    <div class="show-password-container">
      <input type="checkbox" id="showPassword">
      <label for="showPassword">Mostrar contraseña</label>
    </div>
`,
		confirmButtonText: "Cambiar",
		focusConfirm: false,
		didOpen: () => {
			const popup = withReactContent(Swal).getPopup()!;
			passwordInput = popup.querySelector("#password") as HTMLInputElement;
			confirmPasswordInput = popup.querySelector(
				"#confirmPassword"
			) as HTMLInputElement;
			showPasswordCheckbox = popup.querySelector(
				"#showPassword"
			) as HTMLInputElement;

			// Evento para cambiar entre el modo de contraseña y texto
			showPasswordCheckbox.addEventListener("change", () => {
				const type = showPasswordCheckbox.checked ? "text" : "password";
				passwordInput.type = type;
				confirmPasswordInput.type = type;
			});

			passwordInput.onkeyup = (event) =>
				event.key === "Enter" && withReactContent(Swal).clickConfirm();
			confirmPasswordInput.onkeyup = (event) =>
				event.key === "Enter" && withReactContent(Swal).clickConfirm();
		},
		preConfirm: async () => {
			const password = passwordInput.value;
			const confirmPassword = confirmPasswordInput.value;

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
					const res = await AdminChangeUsersPassword(
						userId,
						password,
						confirmPassword
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
							`La contraseña debe de tener al menos una Mayúscula y un Número`
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

export const ModifyUserModal = (props: IModifyUserModal) => {
	const { user, setOpen } = props;
	const [values, setValues] = useState<string[]>(user?.roles);
	const [isLoading, setIsLoading] = useState(false);
	const setNewUser = useUserPaginationStore((state) => state.setNewUser);
	const [roles, setRoles] = useState<string[]>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getRoles();
				setRoles(res);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

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
								placeholder="Nombre"
							/>
						</Grid>
						<Grid item xs={12} lg={6}>
							<TextField
								fullWidth
								error={!!errors.apellidoPaterno}
								helperText={errors?.apellidoPaterno?.message}
								{...register("apellidoPaterno")}
								size="medium"
								placeholder="Apellido paterno"
							/>
						</Grid>
						<Grid item xs={12} lg={6}>
							<TextField
								fullWidth
								error={!!errors.apellidoMaterno}
								helperText={errors?.apellidoMaterno?.message}
								{...register("apellidoMaterno")}
								size="medium"
								placeholder="Apellido materno"
							/>
						</Grid>
						<Grid item xs={12} lg={6}>
							<TextField
								fullWidth
								error={!!errors.email}
								helperText={errors?.email?.message}
								{...register("email")}
								size="medium"
								placeholder="Correo electrónico"
							/>
						</Grid>
						<Grid item xs={12} lg={6}>
							<TextField
								fullWidth
								error={!!errors.telefono}
								helperText={errors?.telefono?.message}
								{...register("telefono")}
								size="medium"
								placeholder="Telefono"
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
								placeholder="Nombre de usuario"
							/>
						</Grid>
						<Grid item xs={12} lg={6}>
							<TextField
								fullWidth
								placeholder="Selecciona el rol"
								name="Rol"
								onChange={handleChange}
								SelectProps={{
									multiple: true,
								}}
								required
								select
								value={values}
							>
								{roles?.map((option) => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} lg={6}>
							<Box>
								<Button
									onClick={() => {
										setOpen(false);
										handleChangePassword(user.id);
									}}
									variant="outlined"
								>
									Actualizar contraseña
								</Button>
							</Box>
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
							startIcon={<CancelIcon />}
							onClick={() => setOpen(false)}
							disabled={isLoading}
							color="error"
						>
							Cancelar
						</Button>
						<Button
							variant="contained"
							type="submit"
							disabled={isLoading}
							startIcon={<SaveOutlinedIcon />}
						>
							Guardar
						</Button>
					</Box>
				</Box>
			</form>
		</>
	);
};
