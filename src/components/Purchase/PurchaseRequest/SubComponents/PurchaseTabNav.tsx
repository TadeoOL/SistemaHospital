import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { usePurchaseRequestNav } from '../../../../store/purchaseStore/purchaseRequestNav';
import { shallow } from 'zustand/shallow';
import { getCountDashboard } from '../../../../api/api.routes';
import { usePurchaseOrderPagination } from '../../../../store/purchaseStore/purchaseOrderPagination';
import { usePurchaseOrderRequestPagination } from '../../../../store/purchaseStore/purchaseOrderRequestPagination';
import { useShallow } from 'zustand/react/shallow';
import { useArticlesAlertPagination } from '../../../../store/purchaseStore/articlesAlertPagination';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const PurchaseTabNav = () => {
  const { tabValue, setTabValue } = usePurchaseRequestNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );
  const dataPurchaseOrder = usePurchaseOrderPagination(useShallow((state) => state.data));
  const dataPurchaseOrderRequest = usePurchaseOrderRequestPagination(useShallow((state) => state.data));
  const dataPurchaseAuth = useArticlesAlertPagination(useShallow((state) => state.data));
  const [prevData, setPrevData] = useState({
    contadorOrdenCompra: 0,
    contadorSolicitudCompra: 0,
    contadorAlertaCompra: 0,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
  };

  const { data } = useQuery({
    queryKey: ['countDashboard', dataPurchaseOrder, dataPurchaseOrderRequest, dataPurchaseAuth],
    queryFn: async () => await getCountDashboard(),
  });

  useEffect(() => {
    if (data) {
      setPrevData(data);
    }
  }, [data]);

  const contadorOrden = prevData ? prevData.contadorOrdenCompra : 0;
  const contadorSolicitud = prevData ? prevData.contadorSolicitudCompra : 0;
  const contadorAlerta = prevData ? prevData.contadorAlertaCompra : 0;

  return (
    <Box sx={{ width: 'auto' }}>
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
