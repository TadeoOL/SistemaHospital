import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePurchaseRequestNav } from "../../../../store/purchaseStore/purchaseRequestNav";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PurchaseTabNav = () => {
  const navigate = useNavigate();
  const { tabValue, setTabValue } = usePurchaseRequestNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    switch (tabValue) {
      case 0:
        return navigate("productos-stock-bajo");
      case 1:
        return navigate("productos-cotizados");
      case 2:
        return navigate("productos-comprados");
      default:
        break;
    }
  }, [tabValue]);

  return (
    <Box sx={{ width: "auto" }}>
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
          <Tab label="Alerta de productos" />
          <Tab label="Solicitud a proveedores" />
          <Tab label="Espera de autorización" />
          <Tab label="Orden de compra" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
