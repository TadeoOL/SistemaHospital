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
import { Close, Edit, Visibility } from '@mui/icons-material';
import { PatientInfoModal } from './Modal/PatientInfoModal';
import { SelectEditOptionModal } from './Modal/SelectEditOptionModal';
import Swal from 'sweetalert2';
import { deleteRegister } from '../../../services/programming/admissionRegisterService';
import { BetterSortComponent } from '../../Commons/BetterSortComponent';
import { GenericChip } from '@/components/Commons/GenericChip';
import { IRegisterPagination } from '@/types/programming/registerTypes';

const columns = {
  clavePaciente: { label: 'Clave Paciente', sortKey: 'clavePaciente' },
  nombrePaciente: { label: 'Nombre Paciente', sortKey: 'nombrePaciente' },
  nombreDoctor: { label: 'Nombre Doctor', sortKey: 'nombreDoctor' },
  nombreEspacioHospitalario: { label: 'Espacio hospitalario' },
  procedimientos: { label: 'Procedimientos' },
  fechaProgramadaIngreso: { label: 'Fecha Ingreso', sortKey: 'fechaProgramadaIngreso' },
  datosPaciente: { label: 'Datos Paciente', isAction: true },
  acciones: { label: 'Acciones', isAction: true },
};

interface TableBodyHospitalizationProps {
  data: IRegisterPagination[];
}

interface TableRowHospitalizationProps {
  data: IRegisterPagination;
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
  const spaceId = usePatientRegisterPaginationStore((state) => state.spaceId);
  const sort = usePatientRegisterPaginationStore((state) => state.sort);
  const isLoading = usePatientRegisterPaginationStore((state) => state.loading);
  const hospitalSpaceType = usePatientRegisterPaginationStore((state) => state.hospitalSpaceType);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize, startDate, endDate, spaceId, sort, hospitalSpaceType]);
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
          await deleteRegister(data.id_IngresoPaciente);
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
        <TableCell>{data.nombrePaciente || 'Sin definir'}</TableCell>
        <TableCell>{data.medico || 'Sin definir'}</TableCell>
        <TableCell>{data.nombreEspacioHospitalario || 'Sin definir'}</TableCell>
        <TableCell>
          <GenericChip
            data={
              data.cirugias?.map((cirugia) => ({
                id: cirugia.id_Cirugia,
                nombre: cirugia.nombre,
              })) || []
            }
          />
        </TableCell>
        <TableCell>{data.fechaProgramadaIngreso}</TableCell>
        <TableCell align="center">
          <Tooltip title="Ver datos generales">
            <IconButton
              onClick={() => {
                setOpen(true);
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
          <PatientInfoModal setOpen={setOpen} id_IngresoPaciente={data.id_IngresoPaciente} />
        </>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <>
          <SelectEditOptionModal
            setOpen={setOpenEdit}
            patientId={data.id_Paciente}
            clinicalHistoryId={data.id_IngresoPaciente}
            setValue={setValueView}
            value={valueView}
            patientAccountId={data.id_CuentaPaciente || ''}
            setRegisterRoomId={setRegisterRoomId}
            registerRoomId={registerRoomId}
            id_IngresoPaciente={data.id_IngresoPaciente}
            procedures={data.cirugias}
            medic={{ id: data.id_Medico, nombre: data.medico }}
            isProgramming={true}
          />
        </>
      </Modal>
    </>
  );
};
