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
      event.stopPropagation();
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
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab
            label="Categoría"
            sx={{
              borderTopLeftRadius: 10,
              "&.Mui-selected": {
                backgroundColor: "#046DBD",
                color: "#FFFFFF",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#046DBD",
              },
              "&:not(.Mui-selected)": {
                backgroundColor: "#FFFFFF",
                color: "#000000",
              },
            }}
          />
          <Tab
            label="Sub Categoría"
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#046DBD",
                color: "#FFFFFF",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#046DBD",
              },
              "&:not(.Mui-selected)": {
                backgroundColor: "#FFFFFF",
                color: "#000000",
              },
            }}
          />
        </Tabs>
      </AppBar>
    </Box>
  );
};
