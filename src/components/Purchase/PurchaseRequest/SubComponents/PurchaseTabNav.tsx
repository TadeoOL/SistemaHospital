import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePurchaseRequestNav } from "../../../../store/purchaseStore/purchaseRequestNav";
import { shallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCountDashboard } from "../../../../api/api.routes";

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

  useEffect(() => {
    dashboardCount();
  }, []);
  

  const dashboardCount = async () => {
    try {
      const res = await getCountDashboard();
      countPills(res);
    } catch (error) {
      console.log(error);
    }
  };

  const [contadorOrden, setContadorOrden] = useState(0);
  const [contadorSolicitud, setContadorSolicitud] = useState(0);
  const [contadorAlerta, setContadorAlerta] = useState(0);
  
  // ...
  
  const countPills = async (ordenCompra: any) => {
    setContadorOrden(ordenCompra.contadorOrdenCompra || 0);
    setContadorSolicitud(ordenCompra.contadorSolicitudCompra || 0);
    setContadorAlerta(ordenCompra.contadorAlertaCompra || 0);
  };

  return (
    <Box sx={{ width: "auto" }}>
      <AppBar
        position="static"
        sx={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab
            label={`Ordenes de Compra (${contadorOrden})`}
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
            label={`Solicitudes en proceso (${contadorSolicitud})`}
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
          <Tab
            label={`Alertas de Producto (${contadorAlerta})`}
            sx={{
              borderTopRightRadius: 10,
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
