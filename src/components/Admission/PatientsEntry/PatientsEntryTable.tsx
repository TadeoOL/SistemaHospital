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
  Typography,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CheckCircleOutline, DocumentScanner, Edit, InfoOutlined, Paid, Print, Visibility } from '@mui/icons-material';
import { PatientInfoModal } from '../../Programming/Register/Modal/PatientInfoModal';
import { SelectEditOptionModal } from '../../Programming/Register/Modal/SelectEditOptionModal';
import { PatientEntryAdvanceModal } from './Modal/PatientEntryAdvance';
import {
  generateAdmissionDoc,
  generateHospitalizationDoc,
  generateSurgeryDoc,
} from '../../Documents/AdmissionDocs/AdmissionDoc';
import { IPatientRegisterPagination } from '../../../types/admission/admissionTypes';
import { usePatientEntryPaginationStore } from '../../../store/admission/usePatientEntryPagination';
import { GenericChip } from '../../Commons/GenericChip';
import { PatientAccountStatus } from '../../../types/checkout/patientAccountTypes';
import { EditPersonalInfoModal } from '../../Programming/Register/Modal/EditData/EditPersonalInfoModal';

const headers = [
  'Clave paciente',
  'Nombre Paciente',
  'Procedimiento',
  'Cuartos/Quirófano',
  'Medico',
  'Fecha Ingreso',
  'Información Paciente',
  'Acciones',
];

interface TableBodyPatientsEntryProps {
  data: IPatientRegisterPagination[];
}

interface TableRowPatientsEntryProps {
  data: IPatientRegisterPagination;
}

const useGetData = () => {
  const fetchData = usePatientEntryPaginationStore((state) => state.fetchData);
  const data = usePatientEntryPaginationStore((state) => state.data);
  const search = usePatientEntryPaginationStore((state) => state.search);
  const pageSize = usePatientEntryPaginationStore((state) => state.pageSize);
  const pageIndex = usePatientEntryPaginationStore((state) => state.pageIndex);
  const setPageIndex = usePatientEntryPaginationStore((state) => state.setPageIndex);
  const setPageSize = usePatientEntryPaginationStore((state) => state.setPageSize);
  const count = usePatientEntryPaginationStore((state) => state.count);
  const isLoading = usePatientEntryPaginationStore((state) => state.loading);
  const startDate = usePatientEntryPaginationStore((state) => state.startDate);
  const endDate = usePatientEntryPaginationStore((state) => state.endDate);
  const status = usePatientEntryPaginationStore((state) => state.status);
  useEffect(() => {
    fetchData();
  }, [search, setPageIndex, setPageSize, startDate, endDate, pageIndex, pageSize, status]);
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
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdvance, setOpenAdvance] = useState(false);
  const [isAdvanceFlag, setIsAdvanceFlag] = useState(false);
  const [valueView, setValueView] = useState(0);
  const [registerRoomId, setRegisterRoomId] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [openAdmit, setOpenAdmit] = useState(false);
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
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {data.estatus <= PatientAccountStatus.Scheduled ? (
              <Tooltip title="Sin admitir admitido">
                <InfoOutlined color="primary" sx={{ fontSize: 18 }} />
              </Tooltip>
            ) : (
              <Tooltip title="Admitido">
                <CheckCircleOutline color="success" sx={{ fontSize: 18 }} />
              </Tooltip>
            )}
            <Typography variant="body2">{data.clavePaciente || 'Sin definir'}</Typography>
          </Box>
        </TableCell>
        <TableCell>{data.nombrePaciente || 'Sin definir'}</TableCell>
        <TableCell>
          <GenericChip
            data={data.cirugias?.map((cirugia) => ({ id: cirugia.id_Cirugia, nombre: cirugia.nombre || '' })) || []}
          />
        </TableCell>
        <TableCell>
          <GenericChip
            label="Sin espacios"
            data={data.espaciosHospitalarios?.map((espacio, i) => ({ id: i.toString(), nombre: espacio || '' })) || []}
          />
        </TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>{dayjs(data.fechaProgramacion).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>
          <Tooltip title="Ver datos">
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
            {(() => {
              if (data.estatus === PatientAccountStatus.Admitted) {
                return (
                  <>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => setOpenEdit(true)}>
                        <Edit color={data.admitido ? 'warning' : undefined} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Imprimir Documentos">
                      <IconButton onClick={handleClick} disabled={data.admitido}>
                        <Print />
                      </IconButton>
                    </Tooltip>
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
                  </>
                );
              }

              if (data.estatus === PatientAccountStatus.Scheduled) {
                return (
                  <Tooltip title="Admitir">
                    <IconButton onClick={() => setOpenAdmit(true)}>
                      <CheckCircleOutline color="success" />
                    </IconButton>
                  </Tooltip>
                );
              }

              // Default case for other statuses
              return (
                <Tooltip title="Imprimir Documentos">
                  <IconButton onClick={handleClick} disabled={data.admitido}>
                    <Print />
                  </IconButton>
                </Tooltip>
              );
            })()}
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
            patientAccountId={data.id_CuentaPaciente ?? ''}
            setRegisterRoomId={setRegisterRoomId}
            registerRoomId={registerRoomId}
            medic={{ id: data.id_Medico, nombre: data.medico }}
            procedures={data.cirugias}
            id_IngresoPaciente={data.id_IngresoPaciente}
          />
        </>
      </Modal>
      <Modal open={openAdvance} onClose={() => setOpenAdvance(false)}>
        <>
          <PatientEntryAdvanceModal
            id_CuentaPaciente={data.id_CuentaPaciente ?? ''}
            setOpen={setOpenAdvance}
            isEntryPayment={isAdvanceFlag}
          />
        </>
      </Modal>
      <Modal open={openAdmit} onClose={() => setOpenAdmit(false)}>
        <>
          <EditPersonalInfoModal setOpen={setOpenAdmit} id_IngresoPaciente={data.id_IngresoPaciente} admit />
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
            generateHospitalizationDoc(data.id_IngresoPaciente);
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
            generateAdmissionDoc(data.id_IngresoPaciente);
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
            generateSurgeryDoc(data.id_IngresoPaciente);
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
