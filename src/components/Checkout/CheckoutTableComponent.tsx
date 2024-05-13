import { CheckCircle, Info, Visibility } from '@mui/icons-material';
import {
  Box,
  Card,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { neutral, success } from '../../theme/colors';
import { ICheckoutSell } from '../../types/types';
import { SellTableFooter } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { hashEstatusToString, hashPaymentsToString } from '../../utils/checkoutUtils';
import { CloseSaleModal } from './Modal/CloseSaleModal';
import { useState } from 'react';

const headTitles = ['Folio', 'Proveniente de', 'Paciente', 'Costo total', 'Tipo de pago', 'Estatus', 'Acciones'];

interface CheckoutTableComponentProps {
  data: ICheckoutSell[];
}

interface CheckoutTableProps {
  heads: string[];
}

interface CheckoutTableBodyProps {
  data: ICheckoutSell[];
}

interface CheckoutTableRowProps {
  data: ICheckoutSell;
}

export const CheckoutTableComponent = (props: CheckoutTableComponentProps) => {
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
            <SellTableFooter
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
        <CheckoutTableRow key={data.id_VentaPrincipal} data={data} />
      ))}
    </TableBody>
  );
};

const CheckoutTableRow = (props: CheckoutTableRowProps) => {
  const [open, setOpen] = useState(false);
  const { data } = props;

  return (
    <>
      <TableRow>
        <TableCell>{data.folio}</TableCell>
        <TableCell>{data.moduloProveniente}</TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>{data.totalVenta}</TableCell>
        <TableCell>{data.tipoPago ? hashPaymentsToString[data.tipoPago] : 'Sin tipo de pago'}</TableCell>
        <TableCell>{hashEstatusToString[data.estatus]}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {data.estatus === 1 && (
              <Tooltip title="Aceptar">
                <IconButton onClick={() => setOpen(true)}>
                  <CheckCircle sx={{ color: success.main }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Ver">
              <IconButton onClick={() => {}}>
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CloseSaleModal setOpen={setOpen} sellId={data.id_VentaPrincipal} totalAmount={data.totalVenta} />
        </>
      </Modal>
    </>
  );
};
