import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { neutral } from '../../theme/colors';
import { ICheckoutCloseHistory } from '../../types/types';
import { TableFooterComponent } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { formatDate } from '../../utils/pointOfSaleUtils';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCheckoutClosePaginationStore } from '../../store/checkout/checkoutClosePagination';

const headTitles = [
  'Usuario',
  'Dinero Inicial',
  'Debito',
  'Credito',
  'Transferencia',
  'Efectivo',
  'Total venta',
  'Dinero al corte',
  'Fecha del corte',
];

interface CheckoutTableProps {
  heads: string[];
}

interface CheckoutTableBodyProps {
  data: ICheckoutCloseHistory[];
}

interface CheckoutTableRowProps {
  data: ICheckoutCloseHistory;
}

export const CheckoutClosesTableComponent = () => {
  const fetchData = useCheckoutClosePaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutClosePaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutClosePaginationStore((state) => state.pageSize);
  const search = useCheckoutClosePaginationStore((state) => state.search);
  const count = useCheckoutClosePaginationStore((state) => state.count);
  const data = useCheckoutClosePaginationStore((state) => state.data);
  const setPageIndex = useCheckoutClosePaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutClosePaginationStore((state) => state.setPageSize);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, search, count]);

  return (
    <Card>
      <TableContainer>
        <Table>
          <CheckoutTableHeader heads={headTitles} />
          <CheckoutTableBody data={data} />
          {data.length > 0 && (
            <TableFooterComponent
              count={count}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
            />
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && (
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', p: 6, columnGap: 2 }}>
          <Info sx={{ color: neutral[400], width: 40, height: 40 }} />
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: neutral[400] }}>No hay ventas</Typography>
        </Box>
      )}
    </Card>
  );
};

const CheckoutTableHeader = (props: CheckoutTableProps) => {
  return (
    <TableHead>
      <TableRow>
        {props.heads.map((title, i) => (
          <TableCell key={i + title}>{title}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const CheckoutTableBody = (props: CheckoutTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((data) => (
        <CheckoutTableRow key={data.id_CajaPrincipal} data={data} />
      ))}
    </TableBody>
  );
};

const CheckoutTableRow: React.FC<CheckoutTableRowProps> = ({ data }) => {
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);

  const [hoveredRow, setHoveredRow] = useState('');

  const navigate = useNavigate();
  const setIdCheckoutAdRedirect = () => {
    setIdCaja(data.id_CajaPrincipal);
    navigate(`../ventas/corte-caja`);
  };

  return (
    <>
      <TableRow
        key={data.id_CajaPrincipal}
        style={{ cursor: 'pointer', backgroundColor: hoveredRow === data.id_CajaPrincipal ? 'lightgrey' : 'inherit' }}
        onMouseEnter={() => setHoveredRow(data.id_CajaPrincipal)}
        onMouseLeave={() => setHoveredRow('')}
        onClick={() => {
          setIdCheckoutAdRedirect();
        }}
      >
        <TableCell>{data.nombreUsuario}</TableCell>
        <TableCell>${data.dineroInicial}</TableCell>
        <TableCell>${data.debito}</TableCell>
        <TableCell>${data.credito}</TableCell>
        <TableCell>${data.transferencia}</TableCell>
        <TableCell>${data.efectivo}</TableCell>
        <TableCell>${data.ventaTotal}</TableCell>
        <TableCell>${data.dineroAlCorte}</TableCell>
        <TableCell>{formatDate(data.diaHoraCorte)}</TableCell>
      </TableRow>
    </>
  );
};
