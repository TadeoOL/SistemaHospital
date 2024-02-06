import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryTabNav } from "../../../store/purchaseStore/categoryTabNav";
import { shallow } from "zustand/shallow";

export const CategorysTabNav = () => {
  const navigate = useNavigate();
  const { tabValue, setTabValue } = useCategoryTabNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );

  useEffect(() => {
    switch (tabValue) {
      case 0:
        return navigate("categoria");
      case 1:
        return navigate("subcategoria");
      default:
        break;
    }
  }, [tabValue]);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      console.log({ newValue });
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
