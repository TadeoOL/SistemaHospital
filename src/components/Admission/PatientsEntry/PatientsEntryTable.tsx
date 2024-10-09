import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
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
import { IPatientRegisterPagination, Procedimiento } from '../../../types/admissionTypes';
import dayjs from 'dayjs';
import { DocumentScanner, Edit, MonetizationOn, Paid, Print, Visibility } from '@mui/icons-material';
import { PatientInfoModal } from '../../Programming/Register/Modal/PatientInfoModal';
import { SelectEditOptionModal } from '../../Programming/Register/Modal/SelectEditOptionModal';
import { PatientEntryAdvanceModal } from './Modal/PatientEntryAdvance';
import {
  generateAdmissionDoc,
  generateHospitalizationDoc,
  generateSurgeryDoc,
} from '../../Documents/AdmissionDocs/AdmissionDoc';

const headers = [
  'Clave paciente',
  'Nombre Paciente',
  'Procedimiento',
  'Cuartos/Quirófano',
  'Medico',
  'Fecha Ingreso',
  'Datos Paciente',
  'Datos Clínicos',
  'Acciones',
];

interface TableBodyPatientsEntryProps {
  data: IPatientRegisterPagination[];
}

interface TableRowPatientsEntryProps {
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
  const startDate = usePatientRegisterPaginationStore((state) => state.startDate);
  const endDate = usePatientRegisterPaginationStore((state) => state.endDate);
  const accountStatus = usePatientRegisterPaginationStore((state) => state.accountStatus);
  const clearData = usePatientRegisterPaginationStore((state) => state.clearData);

  useEffect(() => {
    fetchData();
    return () => {
      clearData();
    };
  }, [search, setPageIndex, setPageSize, startDate, endDate, pageIndex, pageSize, accountStatus]);
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
export const TablePatientsEntry = () => {
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
          <TableBodyPatientsEntry data={data} />
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

const TableBodyPatientsEntry = (props: TableBodyPatientsEntryProps) => {
  return (
    <>
      <TableBody>
        {props.data.map((item, index) => {
          return <TableRowPatientsEntry data={item} key={index} />;
        })}
      </TableBody>
    </>
  );
};

const TableRowPatientsEntry = (props: TableRowPatientsEntryProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState<string>();
  const [clinicalHistoryId, setClinicalHistoryId] = useState<string>();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdvance, setOpenAdvance] = useState(false);
  const [isAdvanceFlag, setIsAdvanceFlag] = useState(false);
  const [valueView, setValueView] = useState(0);
  const [registerRoomId, setRegisterRoomId] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!openEdit) setValueView(0);
  }, [openEdit]);

  return (
    <>
      <TableRow>
        <TableCell>{data.clavePaciente}</TableCell>
        <TableCell>{data.nombrePaciente}</TableCell>
        <TableCell>
          {data.procedimientos?.map((procedimiento: Procedimiento, index: number) => (
            <span key={index}>
              {procedimiento.nombre}
              {index < (data.procedimientos?.length || 0) - 1 && ', '}
            </span>
          ))}
        </TableCell>
        <TableCell>{data.cuartos}</TableCell>
        <TableCell>{data.medico}</TableCell>
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
            <Tooltip title="Editar">
              <IconButton onClick={() => setOpenEdit(true)}>
                <Edit color={data.faltanDatos ? 'warning' : undefined} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Imprimir Documentos">
              <>
                <IconButton onClick={handleClick} disabled={data.faltanDatos}>
                  <Print />
                </IconButton>
              </>
            </Tooltip>
            {!data.admitido && !data.faltanDatos && (
              <Tooltip title="Agregar anticipo">
                <IconButton
                  onClick={() => {
                    setIsAdvanceFlag(true);
                    setOpenAdvance(true);
                  }}
                >
                  <MonetizationOn />
                </IconButton>
              </Tooltip>
            )}
            {data.admitido && (
              <Tooltip title="Agregar Abono">
                <IconButton
                  onClick={() => {
                    setIsAdvanceFlag(false);
                    setOpenAdvance(true);
                  }}
                >
                  <Paid />
                </IconButton>
              </Tooltip>
            )}
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
            medic={{ id: data.id_Medico, nombre: data.medico }}
            procedures={data.procedimientos}
          />
        </>
      </Modal>
      <Modal open={openAdvance} onClose={() => setOpenAdvance(false)}>
        <>
          <PatientEntryAdvanceModal
            id_Registro={data.id}
            id_Paciente={data.id_Paciente}
            setOpen={setOpenAdvance}
            isEntryPayment={isAdvanceFlag}
          />
        </>
      </Modal>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            generateHospitalizationDoc(data.id);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DocumentScanner fontSize="small" />
          </ListItemIcon>
          Hospitalización
        </MenuItem>
        <MenuItem
          onClick={() => {
            generateAdmissionDoc(data.id);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DocumentScanner fontSize="small" />
          </ListItemIcon>
          Endopro
        </MenuItem>
        <MenuItem
          onClick={() => {
            generateSurgeryDoc(data.id);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DocumentScanner fontSize="small" />
          </ListItemIcon>
          Quirúrgico
        </MenuItem>
      </Menu>
    </>
  );
};
