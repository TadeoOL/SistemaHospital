import { MainCard, TablePaginated } from '@/common/components';
import { Grid, Typography } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import AuthorizationModal from '../components/AuthorizationModal';
import { getEmptyResponse } from '../../helpers/getEmptyResponse';
import { useNavigate } from 'react-router-dom';

const Banks = () => {
  const navigation = useNavigate();

  const handles = {
    navigateToAccountState: () => {
      navigation('/tesoreria/bancos/estado-de-cuenta');
    },
    navigateToPurchases: () => {
      navigation('/tesoreria/bancos/compras');
    },
  };

  const columns = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: 'Concepto',
    },
    {
      header: 'Cantidad',
      value: 'Cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'Fecha',
    },
  ];

  return (
    <>
      <Grid
        container
        sx={{
          pb: 2,
        }}
        spacing={2}
      >
        <Grid item xs={12} md={6}>
          <WidgetCard
            onClick={handles.navigateToAccountState}
            top="Estado de Cuenta"
            center="Saldo"
            bottom="$ 1,000.00"
            bottom2={<RemoveRedEyeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <WidgetCard
            onClick={handles.navigateToPurchases}
            top="Conciliacion de compras"
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
        <TablePaginated columns={columns} fetchData={getEmptyResponse} params={{}} />
      </MainCard>
      {/* <AuthorizationModal open={openAuthorizationModal} onClose={handles.closeAuthorizationModal} /> */}
    </>
  );
};

export default Banks;
