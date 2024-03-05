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
    event.stopPropagation();
    setTabValue(newValue);
  };

  useEffect(() => {
    switch (tabValue) {
      case 0:
        return navigate("ordenes-compra");
      case 1:
        return navigate("productos-solicitados-orden-compra");
      case 2:
        return navigate("productos-stock-bajo");
      default:
        break;
    }
  }, [tabValue]);

  return (
    <Box sx={{ width: "auto" }}>
      <AppBar
        position="static"
        sx={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          backgroundColor: "#046DBD",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab label="Ordenes de Compra" />
          <Tab label="Solicitudes en Proceso" />
          <Tab label="Alerta de Productos" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
