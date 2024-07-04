import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';

export const DailyOperatingTable = () => {
  const data: any[] = [];
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={[]} />
          <TableBody>
            {data.map((d) => (
              <DailyOperatingTableRow key={d.id} data={d} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay quirófanos registrados este dia" />}
    </Card>
  );
};

interface DailyOperatingTableRowProps {
  data: any;
}
const DailyOperatingTableRow = (props: DailyOperatingTableRowProps) => {
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
