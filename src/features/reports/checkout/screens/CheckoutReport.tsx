import { TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import { useRef, useState } from 'react';
import { getCheckoutReport } from '../services/checkout';
import { IconButton } from '@mui/material';

const CheckoutReport = () => {
  const [search, setSearch] = useState('');

  const tableRef = useRef<any>();

  const columns: any[] = [
    {
      header: 'Usuario',
      value: 'usuario',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Dinero Inicial',
      value: 'dineroInicial',
      sort: true,
    },
    {
      header: 'Debito',
      value: 'debito',
      sort: true,
      width: '100px',
    },
    {
      header: 'Credito',
      value: 'credito',
      sort: true,
      width: '100px',
    },
    {
      header: 'Transferencia',
      value: 'transferencia',
      sort: true,
      width: '100px',
    },
    {
      header: 'Efectivo',
      value: 'efectivo',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Total venta',
      value: 'ventaTotal',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Dinero al corte',
      value: 'dineroAlCorte',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Fecha del corte',
      value: 'diaHoraCorte',
      sort: true,
      width: 'auto',
    },
  ];

  return (
    <>
      <TableTop>
        <SearchBar title="Busca corte de caja por nombre..." searchState={setSearch} sx={{ width: '30%' }} />

        <IconButton
          sx={{
            height: '40px',
          }}
          onClick={() => {
            console.log('generar reporte');
          }}
        >
          {/* <FilterListOff /> */}
        </IconButton>
      </TableTop>
      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={getCheckoutReport}
        params={{
          search,
          // id_AlmacenPrincipal: warehouseSelected || null,
          // id_Almacen: warehouseSelected || null,
          // Id_SubCategoria: subcategory || null,
          // habilitado: enabled,
        }}
      />
    </>
  );
};

export default CheckoutReport;
