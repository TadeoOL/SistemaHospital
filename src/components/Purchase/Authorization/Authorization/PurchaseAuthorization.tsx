import { Box, Divider, IconButton, MenuItem, TextField } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";
import { FilterListOff } from "@mui/icons-material";
import { usePurchaseOrderRequestPagination } from "../../../../store/purchaseStore/purchaseOrderRequestPagination";
import { StatusPurchaseRequest } from "../../../../types/types";
import { usePurchaseAuthorizationPagination } from "../../../../store/purchaseStore/purchaseAuthorizationPagination";
import { useMemo } from "react";

const PurchaseAuthorization = () => {
	const {
		setSearch,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		setStatus,
		status,
	} = usePurchaseAuthorizationPagination((state) => ({
		setSearch: state.setSearch,
		startDate: state.startDate,
		endDate: state.endDate,
		setStartDate: state.setStartDate,
		setEndDate: state.setEndDate,
		status: state.status,
		setStatus: state.setStatus,
	}));

	const values = useMemo(() => {
		const statusPurchaseOrderValues: string[] = [];

		for (const value in StatusPurchaseRequest) {
			if (!isNaN(Number(StatusPurchaseRequest[value]))) {
				statusPurchaseOrderValues.push(StatusPurchaseRequest[value]);
			}
		}
		return statusPurchaseOrderValues;
	}, []);

	return (
		<Box sx={{ pt: 2 }}>
			<Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
				<SearchBar
					title="Buscar solicitud de compra..."
					searchState={setSearch}
					sx={{ display: "flex", flex: 2 }}
				/>
				<Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
					<TextField
						label="Fecha inicio"
						size="small"
						type="date"
						value={startDate}
						InputLabelProps={{ shrink: true }}
						onChange={(e) => {
							setStartDate(e.target.value);
						}}
					/>
					<TextField
						label=" Fecha final"
						size="small"
						type="date"
						value={endDate}
						InputLabelProps={{ shrink: true }}
						onChange={(e) => {
							setEndDate(e.target.value);
						}}
					/>
				</Box>
				<Box sx={{ display: "flex", flex: 1 }}>
					<TextField
						select
						label="Estatus"
						size="small"
						defaultValue={-1}
						fullWidth
						value={status}
						onChange={(e) => {
							const { value } = e.target;
							setStatus(value);
						}}
					>
						{values.map((v: any) => (
							<MenuItem key={v} value={v}>
								{StatusPurchaseRequest[v]}
							</MenuItem>
						))}
					</TextField>
				</Box>
				<Box>
					<IconButton
						onClick={() =>
							usePurchaseOrderRequestPagination.getState().clearFilters()
						}
					>
						<FilterListOff />
					</IconButton>
				</Box>
			</Box>
			<Divider sx={{ my: 1 }} />
			<PurchaseAuthorizationTable />
		</Box>
	);
};
export default PurchaseAuthorization;
