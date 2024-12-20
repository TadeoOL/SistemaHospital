import { MainCard, TablePaginated } from '@/common/components';
import { Grid, Typography } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from 'react';
import AuthorizationModal from '../components/AuthorizationModal';
import { useNavigate } from 'react-router-dom';
import { getPaginacionRevolventes } from '../services/cashflow';
import { useGetCashFlowFund } from '../hooks/useGetCashFlowFund';

const CashFlow = () => {
  const [openAuthorizationModal, setOpenAuthorizationModal] = useState(false);
  const navigation = useNavigate();

  const handles = {
    navigateToAccountState: () => {
      navigation('/tesoreria/revolvente/estado-de-cuenta');
    },
    navigateToBoxes: () => {
      navigation('/tesoreria/revolvente/cajas');
    },
    closeAuthorizationModal: () => {
      setOpenAuthorizationModal(false);
    },
    openAuthorizationModal: () => {
      setOpenAuthorizationModal(true);
    },
  };

  // formats date from 2024-12-12T10:26:48.5475394 to 12/12/2024 10:26:48
  const formatDate = (date: string) => {
    const [day, time] = date.split('T');
    const [year, month, day2] = day.split('-');
    const [time2] = time.split('.');
    return `${day2}/${month}/${year} ${time2}`;
  };

  const columns = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: 'concepto',
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: (row: any) => formatDate(row.fechaIngreso),
    },
  ];

  const { data } = useGetCashFlowFund();
  const { saldoTotal, cantidadVentas, cajasDisponibles } = data || {};

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <>
      {}
      <Grid
        container
        sx={{
          pb: 2,
        }}
        spacing={2}
      >
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.navigateToAccountState}
            top="Estado de Cuenta"
            center="Saldo"
            bottom={formatPrice(saldoTotal)}
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.navigateToBoxes}
            top="Gestion de Cajas"
            center="Cajas Actuales"
            bottom={cajasDisponibles}
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <WidgetCard
            onClick={handles.openAuthorizationModal}
            top="Autorizaciones Especiales"
            bottom="Nueva Autorizacion"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
      </Grid>
      <MainCard>
        <Typography
          sx={{
            pb: 1,
          }}
          variant="subtitle1"
        >
          Ultimos Movimientos
        </Typography>
        <TablePaginated columns={columns} fetchData={getPaginacionRevolventes} params={{}} />
      </MainCard>
      <AuthorizationModal open={openAuthorizationModal} onClose={handles.closeAuthorizationModal} />
    </>
  );
};

export default CashFlow;
