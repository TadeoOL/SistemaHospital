import { MainCard, TablePaginated } from '@/common/components';
import { IconButton, Tooltip, Typography } from '@mui/material';
// import WidgetCard from '@/common/components/WidgetCard';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import AuthorizationModal from '../components/AuthorizationModal';
import { BankService } from '../services/services.bank';
import { useRef } from 'react';
import { IBankPurchasesPending } from '../types/types.bank';
import { NestedTable, TablePaginatedColumn } from '@/types/tableComponentTypes';
import { CheckCircleRounded } from '@mui/icons-material';
import { useBankPurchases } from '../hooks/useBankPurchases';
// import { useNavigate } from 'react-router-dom';

const BanksPurchases = () => {
  const tableRef = useRef<IBankPurchasesPending>(null);
  const [state, handlers] = useBankPurchases();

  const nestedTable: NestedTable<IBankPurchasesPending> = {
    ordenCompraArticulos: {
      title: 'Artículos',
      columns: [
        { header: 'Artículo', value: 'nombre' },
        { header: 'Cantidad', value: 'cantidad' },
        { header: 'Precio Proveedor', value: 'precioProveedor' },
      ],
    },
  };
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

  const columns: TablePaginatedColumn<IBankPurchasesPending>[] = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Usuario',
      value: 'usuario',
    },
    {
      header: 'Proveedor',
      value: 'proveedor',
    },
    {
      header: 'Precio Total',
      value: 'precioTotalOrden',
    },
    {
      header: 'Fecha Ingreso',
      value: 'fechaCreacion',
    },
    {
      header: 'Acciones',
      value: (row) => {
        return (
          <Tooltip title="Autorizar">
            <IconButton
              onClick={() => {
                handlers.approveBankPurchase(row.id_MovimientoTesoreria);
              }}
            >
              <CheckCircleRounded color="success" />
            </IconButton>
          </Tooltip>
        );
      },
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
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={BankService.getBankPurchasesPending}
          params={{
            refresh: state.refresh,
          }}
          nestedTable={nestedTable}
        />
      </MainCard>
    </>
  );
};

export default BanksPurchases;
