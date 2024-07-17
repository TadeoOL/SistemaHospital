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
import { ISurgeryProcedure } from '../../../types/types';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useSurgeryProcedurePaginationStore } from '../../../store/programming/surgeryProcedurePagination';
import { useEffect, useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { deleteSurgeryProcedure } from '../../../services/programming/surgeryProcedureService';
import { AddSurgeryProcedureModal } from './Modal/AddSurgeryProcedureModal';

const HEADERS = [
  'Nombre',
  'Duración de Hospitalización',
  'Duración de Crujía',
  'Precio Crujía',
  'Descripción',
  'Acciones',
];

interface TableRowSurgeryProcedureProps {
  surgeryProcedure: ISurgeryProcedure;
}
interface TableBodySurgeryProcedureProps {
  surgeryProcedures: ISurgeryProcedure[];
}

const useGetData = () => {
  const fetchData = useSurgeryProcedurePaginationStore((state) => state.fetchData);
  const data = useSurgeryProcedurePaginationStore((state) => state.data);
  const search = useSurgeryProcedurePaginationStore((state) => state.search);
  const pageSize = useSurgeryProcedurePaginationStore((state) => state.pageSize);
  const pageIndex = useSurgeryProcedurePaginationStore((state) => state.pageIndex);
  const setPageIndex = useSurgeryProcedurePaginationStore((state) => state.setPageIndex);
  const setPageSize = useSurgeryProcedurePaginationStore((state) => state.setPageSize);
  const count = useSurgeryProcedurePaginationStore((state) => state.count);
  const isLoading = useSurgeryProcedurePaginationStore((state) => state.loading);

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

export const SurgeryProcedureTable = () => {
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
          <TableBodySurgeryProcedure surgeryProcedures={data} />
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
      {data.length < 1 && <NoDataInTableInfo infoTitle="No hay procedimientos" />}
    </Card>
  );
};

const TableBodySurgeryProcedure = (props: TableBodySurgeryProcedureProps) => {
  return (
    <TableBody>
      {props.surgeryProcedures.map((surgeryProcedure) => (
        <TableRowSurgeryProcedure key={surgeryProcedure.id} surgeryProcedure={surgeryProcedure} />
      ))}
    </TableBody>
  );
};

const TableRowSurgeryProcedure = (props: TableRowSurgeryProcedureProps) => {
  const { surgeryProcedure } = props;
  const [open, setOpen] = useState(false);
  const refetch = useSurgeryProcedurePaginationStore((state) => state.fetchData);

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
          await deleteSurgeryProcedure(surgeryProcedure.id);
          refetch();
          Swal.fire({
            title: 'Eliminado!',
            text: `El procedimiento se ha eliminado con éxito!`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error!',
            text: `No se pudo eliminar el procedimiento`,
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
        <TableCell>{surgeryProcedure.nombre}</TableCell>
        <TableCell>{surgeryProcedure.duracionHospitalizacion}</TableCell>
        <TableCell>{surgeryProcedure.duracionCirujia}</TableCell>
        <TableCell>{surgeryProcedure.precioCirujia ? `$${surgeryProcedure.precioCirujia}` : 'Sin precio'}</TableCell>
        <TableCell>{surgeryProcedure.descripcion}</TableCell>
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddSurgeryProcedureModal setOpen={setOpen} editData={surgeryProcedure} />
        </>
      </Modal>
    </>
  );
};
