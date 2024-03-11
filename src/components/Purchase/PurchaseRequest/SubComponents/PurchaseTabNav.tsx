import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePurchaseRequestNav } from "../../../../store/purchaseStore/purchaseRequestNav";
import { shallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { getCountDashboard } from "../../../../api/api.routes";
import { usePurchaseOrderPagination } from "../../../../store/purchaseStore/purchaseOrderPagination";
import { usePurchaseOrderRequestPagination } from "../../../../store/purchaseStore/purchaseOrderRequestPagination";
import { useShallow } from "zustand/react/shallow";
import { useArticlesAlertPagination } from "../../../../store/purchaseStore/articlesAlertPagination";

export const PurchaseTabNav = () => {
  const { tabValue, setTabValue } = usePurchaseRequestNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );
  const dataPurchaseOrder = usePurchaseOrderPagination(
    useShallow((state) => state.data)
  );
  const dataPurchaseOrderRequest = usePurchaseOrderRequestPagination(
    useShallow((state) => state.data)
  );
  const dataPurchaseAuth = useArticlesAlertPagination(
    useShallow((state) => state.data)
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
  };

  useEffect(() => {
    dashboardCount();
  }, [dataPurchaseOrder, dataPurchaseOrderRequest, dataPurchaseAuth]);

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
        <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
          <Tab label={`Ordenes de Compra (${contadorOrden})`} />
          <Tab label={`Solicitudes en Proceso (${contadorSolicitud})`} />
          <Tab label={`Alertas de Producto (${contadorAlerta})`} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
