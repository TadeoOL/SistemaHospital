import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IRegisterRoom } from '../../../types/types';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
const HEADERS = ['Tipo de cuarto', 'Cuarto', 'Hora Inicio', 'Hora Fin', 'Acciones'];
interface RoomReservationTableProps {
  data: IRegisterRoom[];
}
interface RoomReservationTableBodyProps extends RoomReservationTableProps {}
interface RoomReservationTableRowProps {
  data: IRegisterRoom;
}

export const RoomReservationTable = (props: RoomReservationTableProps) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <RoomReservationTableBody data={props.data} />
        </Table>
      </TableContainer>
      {props.data.length < 1 && (
        <NoDataInTableInfo infoTitle="No hay cuartos registrados" sizeIcon={30} variantText="h4" />
      )}
    </Card>
  );
};

const RoomReservationTableBody = (props: RoomReservationTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((room) => (
        <RoomReservationTableRow data={room} />
      ))}
    </TableBody>
  );
};

const RoomReservationTableRow = (props: RoomReservationTableRowProps) => {
  const { data } = props;
  return (
    <TableRow>
      <TableCell>{data.tipoCuarto}</TableCell>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>{data.horaInicio.toLocaleDateString()}</TableCell>
      <TableCell>{data.horaFin.toLocaleDateString()}</TableCell>
    </TableRow>
  );
};
