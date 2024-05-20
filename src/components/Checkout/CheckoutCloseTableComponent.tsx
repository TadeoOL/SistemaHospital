import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { neutral } from '../../theme/colors';
import { ICheckoutCloseHistory } from '../../types/types';
import { TableFooterComponent } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { formatDate } from '../../utils/pointOfSaleUtils';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { useNavigate } from 'react-router-dom';

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

interface CheckoutClosesTableComponentProps {
  data: ICheckoutCloseHistory[];
}

interface CheckoutTableProps {
  heads: string[];
}

interface CheckoutTableBodyProps {
  data: ICheckoutCloseHistory[];
}

interface CheckoutTableRowProps {
  data: ICheckoutCloseHistory;
}

export const CheckoutClosesTableComponent = (props: CheckoutClosesTableComponentProps) => {
  const count = useCheckoutPaginationStore((state) => state.count);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutPaginationStore((state) => state.setPageSize);

  return (
    <Card>
      <TableContainer>
        <Table>
          <CheckoutTableHeader heads={headTitles} />
          <CheckoutTableBody data={props.data} />
          {props.data.length > 0 && (
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
      {props.data.length === 0 && (
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
  const navigate = useNavigate();
  /*const rejectRequest = () => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas cancelar este pase a caja?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return changePrincipalSellStatus({
            id_VentaPrincipal: data.id,
            estatus: 0,
            id_CajaPrincipal: checkoutId as string,
            tieneIva: false,
            tipoPago: data.tipoPago,
            montoPago: data.totalVenta,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetch();
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Pase a caja canceladd',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'No se cancelo el pase a caja',
            icon: 'info',
          });
        }
      });
  };*/
  const setIdCheckoutAdRedirect = () => {
    setIdCaja(data.id_CajaPrincipal);
    navigate(`../ventas/corte-caja`);
  };

  return (
    <>
      <TableRow
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
