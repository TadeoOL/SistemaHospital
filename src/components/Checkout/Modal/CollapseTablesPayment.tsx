import { Card, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const CollapseTablesPayment = () => {
  return <div>CollapseTablesForPayment</div>;
};

const TableForPayment = () => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeadPayment />
        </Table>
      </TableContainer>
    </Card>
  );
};

const TableHeadPayment = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Folio</TableCell>
        <TableCell>Modulo Proveniente</TableCell>
        <TableCell>Total</TableCell>
        <TableCell>IVA</TableCell>
        <TableCell>Tipo de Pago</TableCell>
        <TableCell>Paciente</TableCell>
      </TableRow>
    </TableHead>
  );
};
