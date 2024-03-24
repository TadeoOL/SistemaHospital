import { Box, Button, Divider, Modal, Stack } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { useState } from "react";
import { SubCategoryTable } from "./SubCategoryTable";
import { AddSubCategoryModal } from "./Modal/AddSubCategoryModal";
import { useSubCategoryPagination } from "../../../../store/purchaseStore/subCategoryPagination";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const SubCategory = () => {
	const [open, setOpen] = useState(false);
	const { enabled, setSearch, setEnabled } = useSubCategoryPagination(
		(state) => ({
			enabled: state.enabled,
			setSearch: state.setSearch,
			setEnabled: state.setEnabled,
		})
	);

	return (
		<Box sx={{ pt: 2 }}>
			<Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
				<SearchBar
					title="Busca la sub categoría..."
					searchState={setSearch}
					sx={{ width: "30%" }}
				/>
				<Stack
					sx={{
						flexDirection: "row",
						display: "flex",
						flexGrow: 1,
						justifyContent: "space-between",
						alignItems: "center",
						p: 3,
					}}
				>
					<Divider sx={{ my: 1 }} />
					<Stack sx={{ flexDirection: "row", columnGap: 2 }}>
						<Button
							onClick={() => {
								setEnabled(!enabled);
							}}
							startIcon={<ClassOutlinedIcon />}
						>
							{enabled
								? "Mostrar sub categorías deshabilitadas"
								: "Mostrar sub categorías habilitados"}
						</Button>
						<Button
							variant="contained"
							startIcon={<AddCircleOutlinedIcon />}
							onClick={() => setOpen(!open)}
						>
							Agregar
						</Button>
					</Stack>
				</Stack>
			</Box>
			<SubCategoryTable />
			<Modal open={open} onClose={() => setOpen(false)}>
				<div>
					<AddSubCategoryModal open={setOpen} />
				</div>
			</Modal>
		</Box>
	);
};

export default SubCategory;
