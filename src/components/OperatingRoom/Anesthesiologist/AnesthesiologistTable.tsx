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
import { Delete, Edit } from '@mui/icons-material';
import { IAnesthesiologist } from '../../../types/hospitalizationTypes';
import { useEffect, useState } from 'react';
import { useAnesthesiologistPaginationStore } from '../../../store/hospitalization/anesthesiologistPagination';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import dayjs from 'dayjs';
import { AddAndEditAnesthesiologist } from './Modal/AddAndEditAnesthesiologist';
import Swal from 'sweetalert2';
import { disableAnesthesiologist } from '../../../services/operatingRoom/anesthesiologistService';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
const HEADERS = ['Nombre', 'Telefono', 'Correo electrónico', 'Fecha de nacimiento', 'Acciones'];
interface AnesthesiologistTableBodyProps {
  data: IAnesthesiologist[];
}
interface AnesthesiologistTableRowProps {
  data: IAnesthesiologist;
}

const useGetAnesthesiologistData = () => {
  const fetchData = useAnesthesiologistPaginationStore((state) => state.fetchData);
  const data = useAnesthesiologistPaginationStore((state) => state.data);
  const search = useAnesthesiologistPaginationStore((state) => state.search);
  const pageSize = useAnesthesiologistPaginationStore((state) => state.pageSize);
  const pageIndex = useAnesthesiologistPaginationStore((state) => state.pageIndex);
  const setPageIndex = useAnesthesiologistPaginationStore((state) => state.setPageIndex);
  const setPageSize = useAnesthesiologistPaginationStore((state) => state.setPageSize);
  const count = useAnesthesiologistPaginationStore((state) => state.count);
  const isLoading = useAnesthesiologistPaginationStore((state) => state.loading);
  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize]);
  return {
    data,
    pageIndex,
    setPageIndex,
    setPageSize,
    count,
    isLoading,
    pageSize,
  };
};

export const AnesthesiologistTable = () => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetAnesthesiologistData();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}>
        <CircularProgress size={35} />
      </Box>
    );
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <AnesthesiologistTableBody data={data} />
          {data.length > 0 && (
            <TableFooterComponent
              count={count}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              isLoading={isLoading}
            />
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay anestesiólogos registrados" />}
    </Card>
  );
};

const AnesthesiologistTableBody = (props: AnesthesiologistTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <AnesthesiologistTableRow key={a.id_Anestesiologo} data={a} />
      ))}
    </TableBody>
  );
};

const AnesthesiologistTableRow = (props: AnesthesiologistTableRowProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const refetch = useAnesthesiologistPaginationStore((state) => state.fetchData);

  const handleEdit = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deshabilitar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await disableAnesthesiologist(data.id_Anestesiologo);
          Swal.fire({
            title: 'Deshabilitado!',
            text: 'Anestesiologo deshabilitado',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
          refetch();
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error',
          });
          throw error;
        }
      }
    });
  };

  return (
    <>
      <TableRow>
        <TableCell>{data.nombre + ' ' + data.apellidoPaterno + ' ' + data.apellidoMaterno}</TableCell>
        <TableCell>{data.telefono}</TableCell>
        <TableCell>{data.email}</TableCell>
        <TableCell>{dayjs(data.fechaNacimiento).format('DD/MM/YYYY')}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Modificar">
              <IconButton onClick={handleEdit}>
                <Edit color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={handleDelete}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddAndEditAnesthesiologist setOpen={setOpen} anesthesiologist={data} />
        </>
      </Modal>
    </>
  );
};
