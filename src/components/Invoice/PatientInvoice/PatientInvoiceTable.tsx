import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';

const TABLE_HEADERS = ['Clave Paciente', 'Nombre', 'Medico', 'Procedimientos', 'Acciones'];

export const PatientInvoiceTable = () => {
  const data: any[] = [];

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          <TableBody>
            {data.map((d) => (
              <PatientInvoiceTableRow data={d} key={d.id} />
            ))}
          </TableBody>
          {data && data.length > 0 && (
            <TableFooterComponent count={0} pageIndex={1} pageSize={5} setPageIndex={() => {}} setPageSize={() => {}} />
          )}
        </Table>
      </TableContainer>
      {(!data || data.length < 1) && <NoDataInTableInfo infoTitle="No hay pacientes" />}
    </Card>
  );
};
interface PatientInvoiceTableRowProps {
  data: any;
}
const PatientInvoiceTableRow = ({ data }: PatientInvoiceTableRowProps) => {
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
