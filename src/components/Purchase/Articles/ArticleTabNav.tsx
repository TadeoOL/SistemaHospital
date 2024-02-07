import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { useArticleTabNav } from "../../../store/purchaseStore/articleTabNav";

export const ArticleTabNav = () => {
  const navigate = useNavigate();
  const { tabValue, setTabValue } = useArticleTabNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );

  useEffect(() => {
    switch (tabValue) {
      case 0:
        return navigate("articulo");
      case 1:
        return navigate("articulo-existente");
      default:
        break;
    }
  }, [tabValue]);

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
          <Tab label="Articulo" />
          <Tab label="Articulo existente" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
