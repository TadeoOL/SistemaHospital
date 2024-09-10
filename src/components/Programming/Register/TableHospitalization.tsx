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
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useEffect, useState } from 'react';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { IPatientRegisterPagination, Procedimiento } from '../../../types/admissionTypes';
import dayjs from 'dayjs';
import { Close, Edit, Visibility } from '@mui/icons-material';
import { PatientInfoModal } from './Modal/PatientInfoModal';
import { SelectEditOptionModal } from './Modal/SelectEditOptionModal';
import Swal from 'sweetalert2';
import { deleteRegister } from '../../../services/programming/admissionRegisterService';
import { BetterSortComponent } from '../../Commons/BetterSortComponent';

const columns = {
  clavePaciente: { label: 'Clave Paciente', sortKey: 'clavePaciente' },
  nombrePaciente: { label: 'Nombre Paciente', sortKey: 'nombrePaciente' },
  nombreDoctor: { label: 'Nombre Doctor', sortKey: 'nombreDoctor' },
  procedimientos: { label: 'Procedimientos' },
  fechaIngreso: { label: 'Fecha Ingreso', sortKey: 'fechaIngreso' },
  datosPaciente: { label: 'Datos Paciente', isAction: true },
  datosClinicos: { label: 'Datos Clinicos', isAction: true },
  acciones: { label: 'Acciones', isAction: true },
};

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
  const startDate = usePatientRegisterPaginationStore((state) => state.startDate);
  const endDate = usePatientRegisterPaginationStore((state) => state.endDate);
  const operatingRoomFilter = usePatientRegisterPaginationStore((state) => state.operatingRoomFilter);
  const sort = usePatientRegisterPaginationStore((state) => state.sort);
  const isLoading = usePatientRegisterPaginationStore((state) => state.loading);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize, startDate, endDate, operatingRoomFilter, sort]);
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
  const setSort = usePatientRegisterPaginationStore((state) => state.setSort);

  return (
    <Card>
      <TableContainer>
        <Table>
          <BetterSortComponent columns={columns} setSortFunction={setSort} />
          {!isLoading && <TableBodyHospitalization data={data} />}
          {data.length > 0 && !isLoading && (
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
      {isLoading && (
        <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {data.length < 1 && !isLoading && <NoDataInTableInfo infoTitle="No hay pacientes registrados" />}
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
        <TableCell>{data.medico}</TableCell>
        <TableCell>
          {data.procedimientos?.map((procedimiento: Procedimiento, index: number) => (
            <span key={index}>
              {procedimiento.nombre}
              {index < (data.procedimientos?.length || 0) - 1 && ', '}
            </span>
          ))}
        </TableCell>
        <TableCell>{dayjs(data.fechaIngreso).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell align="center">
          <Tooltip title="Ver datos generales">
            <IconButton
              onClick={() => {
                setOpen(true);
                setPatientId(data.id_Paciente);
                setClinicalHistoryId(undefined);
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Ver datos clínicos">
            <IconButton
              onClick={() => {
                setOpen(true);
                setPatientId(undefined);
                setClinicalHistoryId(data.id_HistorialClinico);
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* {data.faltanDatos ? (
              <Tooltip title="Faltan datos por llenar">
                <Info color="warning" />
              </Tooltip>
            ) : (
              <></>
            )} */}
            <Tooltip title="Editar">
              <IconButton onClick={() => setOpenEdit(true)}>
                <Edit color={data.faltanDatos ? 'warning' : undefined} />
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
            procedures={data.procedimientos}
            medic={{ id: data.id_Medico, nombre: data.medico }}
          />
        </>
      </Modal>
    </>
  );
};
