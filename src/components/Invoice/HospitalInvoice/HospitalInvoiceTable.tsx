import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';

const TABLE_HEADERS = ['Clave Factura', 'Fecha Realizada', 'Acciones'];

export const HospitalInvoiceTable = () => {
  const data: any[] = [];
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          <TableBody>
            {data.map((d) => (
              <HospitalInvoiceTableRow data={d} key={d.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!data || data.length < 1) && <NoDataInTableInfo infoTitle="No hay facturas generadas" />}
    </Card>
  );
};
interface HospitalInvoiceTableRowProps {
  data: any;
}
const HospitalInvoiceTableRow = ({}: HospitalInvoiceTableRowProps) => {
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
