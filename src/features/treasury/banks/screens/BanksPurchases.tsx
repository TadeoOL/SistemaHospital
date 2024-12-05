import { MainCard, TablePaginated } from '@/common/components';
import { Typography } from '@mui/material';
// import WidgetCard from '@/common/components/WidgetCard';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import AuthorizationModal from '../components/AuthorizationModal';
import { getEmptyResponse } from '../../helpers/getEmptyResponse';
// import { useNavigate } from 'react-router-dom';

const BanksPurchases = () => {
  // const navigation = useNavigate();

  // const handles = {
  //   accountState: () => {
  //     console.log('Estado de cuenta');
  //   },
  //   navigateToAccountState: () => {
  //     navigation('/tesoreria/bancos/estado-de-cuenta');
  //   },
  //   navigateToPurchases: () => {
  //     navigation('/tesoreria/bancos/compras');
  //   },
  // };

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
      <MainCard>
        <Typography
          sx={{
            pb: 1,
          }}
          variant="subtitle1"
        >
          Compras
        </Typography>
        <TablePaginated columns={columns} fetchData={getEmptyResponse} params={{}} />
      </MainCard>
    </>
  );
};

export default BanksPurchases;
