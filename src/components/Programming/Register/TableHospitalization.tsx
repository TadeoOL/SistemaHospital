import {
  Box,
  Button,
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
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useEffect, useState } from 'react';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { IPatientRegisterPagination } from '../../../types/admissionTypes';
import dayjs from 'dayjs';
import { Check, Close, Edit, Info } from '@mui/icons-material';
import { PatientInfoModal } from './Modal/PatientInfoModal';
import { SelectEditOptionModal } from './Modal/SelectEditOptionModal';
import Swal from 'sweetalert2';
import { deleteRegister } from '../../../services/programming/admissionRegisterService';

const headers = ['Clave paciente', 'Nombre Paciente', 'Fecha Ingreso', 'Datos Paciente', 'Datos Clinicos', 'Acciones'];

interface TableBodyHospitalizationProps {
  data: IPatientRegisterPagination[];
}

interface TableRowHospitalizationProps {
  data: IPatientRegisterPagination;
}

const useGetData = () => {
  const fetchData = usePatientRegisterPaginationStore((state) => state.fetchData);
  const data = usePatientRegisterPaginationStore((state) => state.data);
  const search = usePatientRegisterPaginationStore((state) => state.search);
  const pageSize = usePatientRegisterPaginationStore((state) => state.pageSize);
  const pageIndex = usePatientRegisterPaginationStore((state) => state.pageIndex);
  const setPageIndex = usePatientRegisterPaginationStore((state) => state.setPageIndex);
  const setPageSize = usePatientRegisterPaginationStore((state) => state.setPageSize);
  const count = usePatientRegisterPaginationStore((state) => state.count);
  const isLoading = usePatientRegisterPaginationStore((state) => state.loading);

  useEffect(() => {
    fetchData();
  }, [search, setPageIndex, setPageSize]);
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
export const TableHospitalization = () => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetData();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress size={30} />
      </Box>
    );
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={headers} />
          <TableBodyHospitalization data={data} />
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
      {data.length < 1 && <NoDataInTableInfo infoTitle="No hay pacientes registrados" />}
    </Card>
  );
};

const TableBodyHospitalization = (props: TableBodyHospitalizationProps) => {
  return (
    <>
      <TableBody>
        {props.data.map((item, index) => {
          return <TableRowHospitalization data={item} key={index} />;
        })}
      </TableBody>
    </>
  );
};

const TableRowHospitalization = (props: TableRowHospitalizationProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState<string>();
  const [clinicalHistoryId, setClinicalHistoryId] = useState<string>();
  const [openEdit, setOpenEdit] = useState(false);
  const [valueView, setValueView] = useState(0);
  const [registerRoomId, setRegisterRoomId] = useState('');
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el paciente?',
      text: 'Esta acción eliminará el paciente y todos sus registros dentro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteRegister(data.id);
          Swal.fire({
            title: 'Eliminado!',
            text: 'El paciente ha sido eliminado con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 1000,
            timerProgressBar: true,
          });
          refetch();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error!',
            text: 'Hubo un error al eliminar el paciente',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            timer: 1000,
            timerProgressBar: true,
          });
        }
      }
    });
  };

  useEffect(() => {
    if (!openEdit) setValueView(0);
  }, [openEdit]);

  return (
    <>
      <TableRow>
        <TableCell>{data.clavePaciente}</TableCell>
        <TableCell>{data.nombrePaciente}</TableCell>
        <TableCell>{dayjs(data.fechaIngreso).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(true);
              setPatientId(data.id_Paciente);
              setClinicalHistoryId(undefined);
            }}
          >
            Ver
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(true);
              setPatientId(undefined);
              setClinicalHistoryId(data.id_HistorialClinico);
            }}
          >
            Ver
          </Button>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {data.faltanDatos ? (
              <Tooltip title="Faltan datos por llenar">
                <Info color="warning" />
              </Tooltip>
            ) : (
              <Tooltip title="Aceptar">
                <IconButton>
                  <Check color="success" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Editar">
              <IconButton onClick={() => setOpenEdit(true)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rechazar">
              <IconButton onClick={handleDelete}>
                <Close color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <PatientInfoModal setOpen={setOpen} clinicalHistoryId={clinicalHistoryId} patientId={patientId} />
        </>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <>
          <SelectEditOptionModal
            setOpen={setOpenEdit}
            patientId={data.id_Paciente}
            clinicalHistoryId={data.id_HistorialClinico}
            setValue={setValueView}
            value={valueView}
            registerId={data.id}
            setRegisterRoomId={setRegisterRoomId}
            registerRoomId={registerRoomId}
          />
        </>
      </Modal>
    </>
  );
};
