import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IRoom } from '../../../types/types';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useEffect, useState } from 'react';
import { useRoomsPaginationStore } from '../../../store/programming/roomsPagination';
import { Delete, Edit } from '@mui/icons-material';
import { AddRoomModal } from './Modal/AddRoomModal';
import Swal from 'sweetalert2';
import { deleteRoom } from '../../../services/programming/roomsService';

const HEADERS = ['Nombre', 'Tipo de cuarto', 'Precio', 'Descripción', 'Acciones'];

interface TableRowRoomsProps {
  room: IRoom;
}
interface TableBodyRoomsProps {
  rooms: IRoom[];
}
const useGetData = () => {
  const fetchData = useRoomsPaginationStore((state) => state.fetchData);
  const data = useRoomsPaginationStore((state) => state.data);
  const search = useRoomsPaginationStore((state) => state.search);
  const pageSize = useRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useRoomsPaginationStore((state) => state.setPageSize);
  const count = useRoomsPaginationStore((state) => state.count);
  const isLoading = useRoomsPaginationStore((state) => state.loading);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize]);

  return {
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    count,
    isLoading,
  };
};

export const RoomsTable = () => {
  const { data, count, pageIndex, pageSize, setPageIndex, setPageSize, isLoading } = useGetData();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress size={30} />
      </Box>
    );
  return (
    <Card sx={{ ml: 2 }}>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <TableBodyRooms rooms={data} />
          {data.length > 0 && (
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
      {data.length < 1 && <NoDataInTableInfo infoTitle="No hay cuartos" />}
    </Card>
  );
};

const TableBodyRooms = (props: TableBodyRoomsProps) => {
  return (
    <TableBody>
      {props.rooms.map((room) => (
        <TableRowRooms key={room.id} room={room} />
      ))}
    </TableBody>
  );
};

const TableRowRooms = (props: TableRowRoomsProps) => {
  const { room } = props;
  const [open, setOpen] = useState(false);
  const refetch = useRoomsPaginationStore((state) => state.fetchData);

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRoom(room.id);
          refetch();
          Swal.fire({
            title: 'Eliminado!',
            text: `El cuarto se ha eliminado con éxito!`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error!',
            text: `No se pudo eliminar el cuarto`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    });
  };

  return (
    <>
      <TableRow>
        <TableCell>{room.nombre}</TableCell>
        <TableCell>{room.tipoCuarto}</TableCell>
        <TableCell>{room.precio}</TableCell>
        <TableCell>{room.descripcion}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <AddRoomModal setOpen={setOpen} editData={room} />
        </>
      </Modal>
    </>
  );
};
