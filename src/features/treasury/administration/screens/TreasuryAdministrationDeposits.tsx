import { MainCard, TablePaginated } from '@/common/components';
import { Typography } from '@mui/material';
import { getEmptyResponse } from '../../helpers/getEmptyResponse';

const TreasuryAdministrationDeposits = () => {
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
    <MainCard sx={{ mt: 2 }}>
      <Typography
        sx={{
          pb: 1,
        }}
        variant="subtitle1"
      >
        Depositos Pendientes
      </Typography>
      <TablePaginated columns={columns} fetchData={getEmptyResponse} params={{}} />
    </MainCard>
  );
};

export default TreasuryAdministrationDeposits;