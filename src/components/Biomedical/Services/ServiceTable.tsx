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
import { AddAndEditXRay } from './Modal/AddAndEditService';
import { useEffect, useState } from 'react';
import { IService, REQUEST_TYPES } from '../../../types/hospitalizationTypes';
import Swal from 'sweetalert2';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useXRayPaginationStore } from '../../../store/hospitalization/xrayPagination';
import { disableXRay } from '../../../services/hospitalization/xrayService';
const HEADERS = ['Nombre', 'Descripción', 'Precio', 'Tipo', 'Acciones'];
interface XRayTableBodyProps {
  data: IService[];
}
interface XRayTableRowProps {
  data: IService;
}
const useGetServicesData = () => {
  const fetchData = useXRayPaginationStore((state) => state.fetchData);
  const data = useXRayPaginationStore((state) => state.data);
  const search = useXRayPaginationStore((state) => state.search);
  const pageSize = useXRayPaginationStore((state) => state.pageSize);
  const pageIndex = useXRayPaginationStore((state) => state.pageIndex);
  const setPageIndex = useXRayPaginationStore((state) => state.setPageIndex);
  const setPageSize = useXRayPaginationStore((state) => state.setPageSize);
  const count = useXRayPaginationStore((state) => state.count);
  const isLoading = useXRayPaginationStore((state) => state.loading);
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
export const ServicesTable = () => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetServicesData();
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
          <XRayTableBody data={data} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay tipos de solicitudes" />}
    </Card>
  );
};

const XRayTableBody = (props: XRayTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <XRayTableRow key={a.id_Servicio} data={a} />
      ))}
    </TableBody>
  );
};

const XRayTableRow = (props: XRayTableRowProps) => {
  const [open, setOpen] = useState(false);
  const { data } = props;
  const refetch = useXRayPaginationStore((state) => state.fetchData);
  const handleEdit = () => {
    setOpen(true);
  };
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estas apunto de eliminar este tipo de solicitud',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      reverseButtons: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await disableXRay(data.id_Servicio);
          refetch();
          Swal.fire({
            title: 'Eliminado!',
            text: `El tipo de solicitud se ha eliminado con éxito!`,
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
        <TableCell>{REQUEST_TYPES[data.tipoServicio]}</TableCell>
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
          <AddAndEditXRay setOpen={setOpen} service={data} />
        </>
      </Modal>
    </>
  );
};
