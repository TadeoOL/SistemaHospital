import {
	Backdrop,
	Box,
	Button,
	Card,
	CircularProgress,
	Stack,
	Step,
	StepLabel,
	Stepper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { IPurchaseAuthorization } from "../../../../../types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isValidFloat } from "../../../../../utils/functions/dataUtils";
import { useDirectlyPurchaseRequestOrderStore } from "../../../../../store/purchaseStore/directlyPurchaseRequestOrder";
import { useShallow } from "zustand/react/shallow";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	display: "flex",
	flexDirection: "column",
	transform: "translate(-50%, -50%)",
	width: { xs: 380, sm: 600, md: 800, lg: 800 },
};

const stepsForm = [
	{ id: 1, title: "Rellenar precios" },
	{ id: 2, title: "Resumen" },
];

const stepperViews = (step: number, data: IPurchaseAuthorization) => {
	switch (step) {
		case 0:
			return <FirstStep data={data} />;
		case 1:
			return <SecondStep />;
		default:
			break;
	}
};

export const MatchPrices = (props: { data: IPurchaseAuthorization | null }) => {
	const { data } = props;
	const step = useDirectlyPurchaseRequestOrderStore(
		useShallow((state) => state.step)
	);

	if (!data)
		return (
			<Backdrop open>
				<CircularProgress size={40} />
			</Backdrop>
		);
	return (
		<Box sx={style}>
			<HeaderModal title="MAtch de precios tilin" setOpen={() => {}} />
			<Stack spacing={3} sx={{ bgcolor: "white", p: 4 }}>
				<Stepper activeStep={step}>
					{stepsForm.map((step) => (
						<Step key={step.id}>
							<StepLabel>
								{
									<Typography fontSize={14} fontWeight={500}>
										{step.title}
									</Typography>
								}
							</StepLabel>
						</Step>
					))}
				</Stepper>
				{stepperViews(step, data)}
			</Stack>
		</Box>
	);
};

const FirstStep = (props: { data: IPurchaseAuthorization }) => {
	const { data } = props;
	// const { setStep, step,setRegisterOrder } = useDirectlyPurchaseRequestOrderStore(
	//   (state) => ({ setStep: state.setStep, step: state.step, setRegisterOrder:state.setRegisterOrder }),
	//   shallow
	// );
	const [prices, setPrices] = useState<{ [key: string]: string }>({});
	const articles = data?.solicitudProveedor.flatMap(
		(p) => p.solicitudCompraArticulos
	);
	const disabledButton = useMemo(
		() => Object.values(prices).some((a) => a.trim() === ""),
		[prices]
	);
	const totalPrice = useMemo(() => {
		return Object.values(prices).reduce((total, item) => {
			const totalPriceObject = parseFloat(item);
			return total + totalPriceObject || 0;
		}, 0);
	}, [prices]);

	useEffect(() => {
		if (!articles) return;
		for (const iterator of articles) {
			setPrices({ [iterator.articulo.id_Articulo]: "" });
		}
	}, []);

	const handlePriceChange = useCallback((id: string, value: string) => {
		if (!isValidFloat(value)) return;
		setPrices({ [id]: value });
	}, []);

	const handleSubmit = () => {
		// const objectPurchase: IRegisterOrderPurchase = {
		//   Id_SolicitudCompra: data.id_SolicitudCompra,
		//   OrdenCompraArticulo: data.solicitudProveedor.map(p=>{
		//     const providerId = p.proveedor.id_Proveedor
		//     return {
		//     }
		//   })
		// }
		// setStep(step + 1);
	};

	return (
		<Box>
			<Typography>PDF -</Typography>
			<Box>
				<Button>Ver PDF</Button>
			</Box>
			<Card>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">Nombre</TableCell>
								<TableCell align="center">Precio</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{articles?.map((a) => (
								<TableRow key={a.articulo.id_Articulo}>
									<TableCell align="center">{a.articulo.nombre}</TableCell>
									<TableCell align="center">
										<TextField
											label="Precio"
											size="small"
											value={prices[a.articulo.id_Articulo]}
											onChange={(e) => {
												handlePriceChange(
													a.articulo.id_Articulo,
													e.target.value
												);
											}}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>
			<Box
				sx={{
					display: "flex",
					flex: 1,
					justifyContent: "flex-end",
					columnGap: 1,
					alignItems: "center",
				}}
			>
				<Typography variant="subtitle1">Total de la orden:</Typography>
				<Typography variant="subtitle2">${totalPrice}</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					flex: 1,
					justifyContent: "space-between",
					mt: 4,
				}}
			>
				<Button variant="outlined">Cancelar</Button>
				<Button
					variant="contained"
					disabled={disabledButton}
					onClick={() => handleSubmit()}
				>
					Siguiente
				</Button>
			</Box>
		</Box>
	);
};

const SecondStep = () => {
	return <Box>segudno stepp</Box>;
};
