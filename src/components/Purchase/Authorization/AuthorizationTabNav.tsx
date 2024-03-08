import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useCallback } from "react";
import { useAuthorizationTabNav } from "../../../store/purchaseStore/authorizationTabNav";
import { shallow } from "zustand/shallow";

export const AuthorizationTabNav = () => {
  const { tabValue, setTabValue } = useAuthorizationTabNav(
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
    <Box sx={{ width: "auto" }}>
      <AppBar
        position="static"
        sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
      >
        <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
          <Tab label="Autorizaciones" />
          <Tab label="Historial de Autorizaciones" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
