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
import { AddAndEditBiomedicalEquipment } from './Modal/AddAndEditBiomedicalEquipment';
import { useEffect, useState } from 'react';
import { IBiomedicalEquipment } from '../../../types/hospitalizationTypes';
import { useBiomedicalEquipmentPaginationStore } from '../../../store/hospitalization/biomedicalEquipmentPagination';
import Swal from 'sweetalert2';
import { disableBiomedicalEquipment } from '../../../services/hospitalization/biomedicalEquipmentService';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
const HEADERS = ['Nombre', 'Descripción', 'Precio', 'Acciones'];
interface BiomedicalEquipmentTableBodyProps {
  data: IBiomedicalEquipment[];
}
interface BiomedicalEquipmentTableRowProps {
  data: IBiomedicalEquipment;
}
const useGetBiomedicalEquipmentData = () => {
  const fetchData = useBiomedicalEquipmentPaginationStore((state) => state.fetchData);
  const data = useBiomedicalEquipmentPaginationStore((state) => state.data);
  const search = useBiomedicalEquipmentPaginationStore((state) => state.search);
  const pageSize = useBiomedicalEquipmentPaginationStore((state) => state.pageSize);
  const pageIndex = useBiomedicalEquipmentPaginationStore((state) => state.pageIndex);
  const setPageIndex = useBiomedicalEquipmentPaginationStore((state) => state.setPageIndex);
  const setPageSize = useBiomedicalEquipmentPaginationStore((state) => state.setPageSize);
  const count = useBiomedicalEquipmentPaginationStore((state) => state.count);
  const isLoading = useBiomedicalEquipmentPaginationStore((state) => state.loading);
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
export const BiomedicalEquipmentTable = () => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetBiomedicalEquipmentData();
  if (isLoading && data.length === 0)
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
          <BiomedicalEquipmentTableBody data={data} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay registros" />}
    </Card>
  );
};

const BiomedicalEquipmentTableBody = (props: BiomedicalEquipmentTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <BiomedicalEquipmentTableRow key={a.id} data={a} />
      ))}
    </TableBody>
  );
};

const BiomedicalEquipmentTableRow = (props: BiomedicalEquipmentTableRowProps) => {
  const [open, setOpen] = useState(false);
  const { data } = props;
  const refetch = useBiomedicalEquipmentPaginationStore((state) => state.fetchData);
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
      confirmButtonText: 'Si, eliminar',
      reverseButtons: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await disableBiomedicalEquipment(data.id);
          refetch();
          Swal.fire({
            title: 'Eliminado!',
            text: `El equipo biomédico se ha eliminado con éxito!`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal',
          });
        }
      }
    });
  };
  return (
    <>
      <TableRow>
        <TableCell>{data.nombre}</TableCell>
        <TableCell>{data.descripcion}</TableCell>
        <TableCell>${data.precio}</TableCell>
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
          <AddAndEditBiomedicalEquipment setOpen={setOpen} biomedicalEquipment={data} />
        </>
      </Modal>
    </>
  );
};
