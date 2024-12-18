import { FullscreenLoader, MainCard, TablePaginated } from '@/common/components';
import { Grid, Typography } from '@mui/material';
import WidgetCard from '@/common/components/WidgetCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { BankService } from '../services/services.bank';
import { TablePaginatedColumn } from '@/types/tableComponentTypes';
import { IBank } from '../types/types.bank';
import { useGetBankFound } from '../hooks/useGetBankFound';

const Banks = () => {
  const navigation = useNavigate();
  const tableRef = useRef<IBank>(null);
  const { data: bankFound, isLoading: isLoadingBankFound } = useGetBankFound();

  const handles = {
    navigateToAccountState: () => {
      navigation('/tesoreria/bancos/estado-de-cuenta');
    },
    navigateToPurchases: () => {
      navigation('/tesoreria/bancos/compras');
    },
  };

  const columns: TablePaginatedColumn<IBank>[] = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Concepto',
      value: (row: IBank) => {
        return row.concepto ? row.concepto : 'N/A';
      },
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
    {
      header: 'Fecha Ingreso',
      value: 'fechaIngreso',
    },
  ];

  if (isLoadingBankFound) return <FullscreenLoader />;

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
            bottom={`$${bankFound?.saldoTotal.toString()}`}
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
        <TablePaginated ref={tableRef} columns={columns} fetchData={BankService.getBankPagination} params={{}} />
      </MainCard>
    </>
  );
};

export default Banks;
