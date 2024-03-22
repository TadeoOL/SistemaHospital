import { Box, Card, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { useCategoryTabNav } from "../../../store/purchaseStore/categoryTabNav";
import { shallow } from "zustand/shallow";
import Category from "./Category/Category";
import SubCategory from "./SubCategory/SubCategory";

export const CategorysTabNav = () => {
	const { tabValue, setTabValue } = useCategoryTabNav(
		(state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
		shallow
	);

	const handleChange = useCallback(
		(event: React.SyntheticEvent, newValue: number) => {
			event.stopPropagation();
			setTabValue(newValue);
		},
		[]
	);

	const getTabView = () => {
		switch (tabValue) {
			case 0:
				return <Category />;
			case 1:
				return <SubCategory />;
		}
	};

	return (
		<Card>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
					<Tab label="Categoría" />
					<Tab label="SubCategoría" />
				</Tabs>
			</Box>
			{getTabView()}
		</Card>
	);
};
