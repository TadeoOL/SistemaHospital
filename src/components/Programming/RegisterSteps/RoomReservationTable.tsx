import { Box, Card, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IRegisterRoom } from '../../../types/types';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import dayjs from 'dayjs';
import { Delete } from '@mui/icons-material';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';

interface RoomReservationTableRowProps {
  data: IRegisterRoom;
  isOperatingRoomReservation?: boolean;
}
interface RoomReservationTableProps {
  isOperatingRoomReservation?: boolean;
}
const HEADERS_OPERATING_ROOM = ['Quirófano', 'Hora Inicio', 'Hora Fin', 'Acciones'];
const HEADERS = ['Cuarto', 'Hora Inicio', 'Hora Fin', 'Acciones'];

export const RoomReservationTable = ({ isOperatingRoomReservation }: RoomReservationTableProps) => {
  const roomsValues = useProgrammingRegisterStore((state) => state.roomValues);

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={isOperatingRoomReservation ? HEADERS_OPERATING_ROOM : HEADERS} />
          <RoomReservationTableBody />
        </Table>
      </TableContainer>
      {roomsValues.length < 1 && (
        <NoDataInTableInfo
          infoTitle={isOperatingRoomReservation ? 'No hay quirófanos registrados' : 'No hay cuartos registrados'}
          sizeIcon={30}
          variantText="h4"
        />
      )}
    </Card>
  );
};

const RoomReservationTableBody = () => {
  const roomsValues = useProgrammingRegisterStore((state) => state.roomValues);
  return (
    <TableBody>
      {roomsValues.map((room) => (
        <RoomReservationTableRow key={room.id} data={room} />
      ))}
    </TableBody>
  );
};

const RoomReservationTableRow = (props: RoomReservationTableRowProps) => {
  const { data } = props;
  const roomsValues = useProgrammingRegisterStore((state) => state.roomValues);
  const setRoomValues = useProgrammingRegisterStore((state) => state.setRoomValues);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  const events = useProgrammingRegisterStore((state) => state.events);

  const handleRemove = () => {
    setRoomValues(roomsValues.filter((room) => room.id !== data.id));
    setEvents(events.filter((e) => e.roomId !== data.id));
  };

  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>{dayjs(data.horaInicio).format('DD/MM/YYYY - HH:mm')}</TableCell>
      <TableCell>{dayjs(data.horaFin).format('DD/MM/YYYY - HH:mm')}</TableCell>
      <TableCell>
        <Box>
          <Tooltip title="Eliminar">
            <IconButton onClick={handleRemove}>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
