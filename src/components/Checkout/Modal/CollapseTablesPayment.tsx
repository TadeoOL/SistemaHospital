import { Cancel, CheckCircle, ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import {
  Box,
  Card,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useState } from 'react';
import { SaleResume } from '../../../services/checkout/checkoutService';
import { hashPaymentsToString } from '../../../utils/checkoutUtils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[200]}`, 1),
    fontWeight: 'bold',
    fontSize: 12,
    height: 2,
    ':last-child': {
      borderTopRightRadius: 10,
    },
    ':first-of-type': {
      borderTopLeftRadius: 10,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
  },
  [`&.${tableCellClasses.root}`]: {
    width: '16.66%',
    height: '10%',
  },
}));

interface TableBodyPaymentProps {
  data: SaleResume[];
}
interface TableForPaymentProps {
  data: SaleResume[];
}
interface CollapseTablesPaymentProps {
  paymentType: string;
  data: SaleResume[];
}

export const CollapseTablesPayment = (props: CollapseTablesPaymentProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  return (
    <>
      <Card sx={{ display: 'flex', flex: 1, p: 1, alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse(!openCollapse)}>
          {openCollapse ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Typography sx={{ fontSize: 17, fontWeight: 500 }}>{props.paymentType}</Typography>
      </Card>
      <Collapse in={openCollapse}>
        <TableForPayment data={props.data} />
      </Collapse>
    </>
  );
};

const TableForPayment = (props: TableForPaymentProps) => {
  return (
    <Card sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHeadPayment />
          <TableBodyPayment data={props.data} />
        </Table>
      </TableContainer>
      {props.data.length < 1 && (
        <Box sx={{ display: 'flex', flex: 1, p: 3, alignItems: 'center', justifyContent: 'center' }}>
          <Info sx={{ width: 30, height: 30, color: 'gray' }} />
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: 'gray' }}>No hay ventas</Typography>
        </Box>
      )}
    </Card>
  );
};

const TableHeadPayment = () => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell>Folio</StyledTableCell>
        <StyledTableCell>Paciente</StyledTableCell>
        <StyledTableCell>Modulo Proveniente</StyledTableCell>
        <StyledTableCell>Tipo de Pago</StyledTableCell>
        <StyledTableCell>IVA</StyledTableCell>
        <StyledTableCell>Total</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const TableBodyPayment = (props: TableBodyPaymentProps) => {
  return (
    <TableBody>
      {props.data.map((sell) => (
        <TableRow key={sell.folio}>
          <StyledTableCell>{sell.folio}</StyledTableCell>
          <StyledTableCell>{sell.paciente}</StyledTableCell>
          <StyledTableCell>{sell.moduloProveniente}</StyledTableCell>
          <StyledTableCell>{hashPaymentsToString[sell.tipoPago]}</StyledTableCell>
          <StyledTableCell>
            {sell.tieneIVA ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </StyledTableCell>
          <StyledTableCell>{sell.totalVenta}</StyledTableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
