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
import { IMedic } from '../../../types/hospitalizationTypes';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useMedicPaginationStore } from '../../../store/hospitalization/medicPagination';
import { AddAndEditMedic } from './Modal/AddAndEditMedic';
import { disableMedic } from '../../../services/hospitalization/medicService';
const HEADERS = ['Nombre', 'Telefono', 'Correo electrónico', 'Fecha de nacimiento', 'Acciones'];
interface MedicTableBodyProps {
  data: IMedic[];
}
interface MedicTableRowProps {
  data: IMedic;
}

const useGetMedicData = () => {
  const fetchData = useMedicPaginationStore((state) => state.fetchData);
  const data = useMedicPaginationStore((state) => state.data);
  const search = useMedicPaginationStore((state) => state.search);
  const pageSize = useMedicPaginationStore((state) => state.pageSize);
  const pageIndex = useMedicPaginationStore((state) => state.pageIndex);
  const setPageIndex = useMedicPaginationStore((state) => state.setPageIndex);
  const setPageSize = useMedicPaginationStore((state) => state.setPageSize);
  const count = useMedicPaginationStore((state) => state.count);
  const isLoading = useMedicPaginationStore((state) => state.loading);
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

export const MedicTable = () => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetMedicData();

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
          <MedicTableBody data={data} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay medicos registrados" />}
    </Card>
  );
};

const MedicTableBody = (props: MedicTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <MedicTableRow key={a.id} data={a} />
      ))}
    </TableBody>
  );
};

const MedicTableRow = (props: MedicTableRowProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const refetch = useMedicPaginationStore((state) => state.fetchData);

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
          await disableMedic(data.id);
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
        <TableCell>{data.nombres + ' ' + data.apellidoPaterno + ' ' + data.apellidoMaterno}</TableCell>
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
          <AddAndEditMedic setOpen={setOpen} medic={data} />
        </>
      </Modal>
    </>
  );
};
