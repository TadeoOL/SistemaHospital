import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { useCategoryTabNav } from "../../../store/purchaseStore/categoryTabNav";
import { shallow } from "zustand/shallow";

export const CategorysTabNav = () => {
  const { tabValue, setTabValue } = useCategoryTabNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  return (
    <Box>
      <AppBar
        position="static"
        sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab label="Categoría" />
          <Tab label="Sub categoría" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
