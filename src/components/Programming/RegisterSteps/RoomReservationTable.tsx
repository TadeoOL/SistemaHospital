import { Box, Card, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IRegisterRoom } from '../../../types/types';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import dayjs from 'dayjs';
import { Delete } from '@mui/icons-material';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
const HEADERS = ['Cuarto', 'Precio', 'Hora Inicio', 'Hora Fin', 'Acciones'];
interface RoomReservationTableRowProps {
  data: IRegisterRoom;
}

export const RoomReservationTable = () => {
  const roomsValues = useProgrammingRegisterStore((state) => state.roomValues);
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <RoomReservationTableBody />
        </Table>
      </TableContainer>
      {roomsValues.length < 1 && (
        <NoDataInTableInfo infoTitle="No hay cuartos registrados" sizeIcon={30} variantText="h4" />
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
      <TableCell>{data.precio}</TableCell>
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
