import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Menu,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { IRoomInformation } from '../../../types/operatingRoomTypes';
import { useDailyOperatingRoomsPaginationStore } from '../../../store/operatingRoom/dailyOperatingRoomsPagination';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import dayjs from 'dayjs';
import { AddCircleOutline, CheckCircle, DoneAll, Info, VerifiedUser, Warning } from '@mui/icons-material';
import { FaNotesMedical } from 'react-icons/fa';
import { OptionsModal } from './Modal/OptionsModal';
import {
  createOperatingRoomRegister,
  modifyOperatingRoomRegister,
} from '../../../services/operatingRoom/operatingRoomRegisterService';
import { toast } from 'react-toastify';
import { SurgeryProceduresChip } from '../../Commons/SurgeryProceduresChip';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { StartRecoveryPhase } from './Modal/StartRecoveryPhase';

const TABLE_HEADERS = [
  'Estado',
  'Hora',
  'Quirófano',
  'Paciente',
  'Edad',
  'Cirugía',
  'Cirujano',
  'Anestesiólogo',
  'Tiempo estimado',
  'Acciones',
];

const useGetDailyOperatingRooms = () => {
  const fetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);
  const data = useDailyOperatingRoomsPaginationStore((state) => state.data);
  const isLoading = useDailyOperatingRoomsPaginationStore((state) => state.loading);
  const search = useDailyOperatingRoomsPaginationStore((state) => state.search);
  const pageSize = useDailyOperatingRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useDailyOperatingRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useDailyOperatingRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useDailyOperatingRoomsPaginationStore((state) => state.setPageSize);
  const count = useDailyOperatingRoomsPaginationStore((state) => state.count);
  const operatingRoomId = useDailyOperatingRoomsPaginationStore((state) => state.operatingRoomId);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex, operatingRoomId]);
  return { data, isLoading, setPageIndex, setPageSize, count, pageIndex, pageSize };
};

export const DailyOperatingTable = () => {
  const { data, isLoading, count, setPageIndex, setPageSize, pageIndex, pageSize } = useGetDailyOperatingRooms();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          {data.length > 0 && (
            <>
              <TableBody>
                {data.map((d) => (
                  <DailyOperatingTableRow key={d.id} data={d} />
                ))}
              </TableBody>
              <TableFooterComponent
                count={count}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                isLoading={isLoading}
              />
            </>
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay quirófanos registrados este dia" />}
    </Card>
  );
};

interface DailyOperatingTableRowProps {
  data: IRoomInformation;
}
const DailyOperatingTableRow = (props: DailyOperatingTableRowProps) => {
  const { data } = props;
  const refetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);
  const [open, setOpen] = useState(false);
  const [openRecoveryPhase, setOpenRecoveryPhase] = useState(false);
  const theme = useTheme();
  const patientName =
    data.paciente?.nombre + ' ' + data.paciente?.apellidoPaterno + ' ' + data.paciente?.apellidoMaterno;
  const medicName = data.medico?.nombres + ' ' + data.medico?.apellidoPaterno + ' ' + data.medico?.apellidoMaterno;
  const anesthesiologistName =
    data.anestesiologo?.nombres + ' ' + data.anestesiologo?.apellidoPaterno + ' ' + data.anestesiologo?.apellidoMaterno;

  const diffHours = dayjs(data.horaFin).diff(data.horaInicio, 'hour');
  const diffMinutes = dayjs(data.horaFin).diff(data.horaInicio, 'minute') % 60;

  const formattedDiff = `${diffHours} horas y ${diffMinutes} minutos`;
  const validateData = (): boolean => {
    return (
      !!data.medico &&
      !!data.anestesiologo &&
      !!data.procedimientos &&
      data.procedimientos.length > 0 &&
      !!data.enfermeros &&
      data.enfermeros.length > 0 &&
      dayjs(data.horaFin).isAfter(dayjs(data.horaInicio))
    );
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [anchorElEnd, setAnchorElEnd] = useState<null | HTMLElement>(null);
  const openMenuEnd = Boolean(anchorElEnd);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseEnd = () => {
    setAnchorElEnd(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickEnd = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElEnd(event.currentTarget);
  };

  const [startOperatingRoom, setStartOperatingRoom] = useState<string>(
    dayjs(data.horaInicio).format('YYYY-MM-DDTHH:mm')
  );
  const [endOperatingRoom, setEndOperatingRoom] = useState<string>(dayjs(data.horaFin).format('YYYY-MM-DDTHH:mm'));

  const handleAddStartOperatingRoom = async () => {
    await createOperatingRoomRegister({
      id_RegistroCuarto: data.id,
      horaInicio: new Date(startOperatingRoom),
    });
    toast.success('Hora de inicio registrada con éxito!');
    refetch();
    handleClose();
  };

  const handleModifyOperatingRoom = async () => {
    await modifyOperatingRoomRegister({
      id_RegistroQuirofano: data.registroQuirofano?.id as string,
      horaFin: new Date(endOperatingRoom),
    });
    toast.success('Hora de inicio registrada con éxito!');
    refetch();
    handleCloseEnd();
  };

  return (
    <>
      <TableRow sx={{ backgroundColor: validateData() ? 'white' : theme.palette.warning.light }}>
        <TableCell>
          {validateData() && !data.registroQuirofano ? (
            <Tooltip title="Datos correctos">
              <CheckCircle color="success" />
            </Tooltip>
          ) : data.registroQuirofano && !data.registroQuirofano.horaFin ? (
            <Tooltip title="Es necesario cerrar el quirófano">
              <Info color="warning" />
            </Tooltip>
          ) : data.registroQuirofano && data.registroQuirofano.horaInicioRecuperacion ? (
            <Tooltip title="Cirugía finalizada">
              <VerifiedUser color="success" />
            </Tooltip>
          ) : data.registroQuirofano &&
            !data.registroQuirofano.horaInicioRecuperacion &&
            data.registroQuirofano.horaFin ? (
            <Tooltip title="Comenzar recuperación">
              <Info color="warning" />
            </Tooltip>
          ) : (
            <Tooltip title="Faltan datos por asignar">
              <Warning color="error" />
            </Tooltip>
          )}
        </TableCell>
        <TableCell>{dayjs(data.horaInicio).format('HH:mm')}</TableCell>
        <TableCell>{data.nombre}</TableCell>
        <TableCell>{patientName}</TableCell>
        <TableCell>{data.paciente?.edad ?? 'No hay registro'}</TableCell>
        <TableCell>
          <SurgeryProceduresChip surgeries={data.procedimientos ?? []} />
        </TableCell>
        <TableCell>{data.medico ? medicName : 'Sin asignar'}</TableCell>
        <TableCell>{data.anestesiologo ? anesthesiologistName : 'Sin asignar'}</TableCell>
        <TableCell>{formattedDiff}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!data.registroQuirofano && validateData() && (
              <Tooltip title="Comenzar cirugía">
                <IconButton onClick={handleClick}>
                  <AddCircleOutline style={{ color: '#686D76' }} />
                </IconButton>
              </Tooltip>
            )}
            {!data.registroQuirofano && (
              <Tooltip title={`${!validateData() ? 'Agregar datos' : 'Modificar datos'}`}>
                <IconButton onClick={() => setOpen(true)}>
                  <FaNotesMedical style={{ color: '#686D76' }} />
                </IconButton>
              </Tooltip>
            )}
            {data.registroQuirofano && !data.registroQuirofano.horaFin && (
              <Tooltip title="Cerrar cirugía">
                <IconButton onClick={handleClickEnd}>
                  <DoneAll style={{ color: 'red' }} />
                </IconButton>
              </Tooltip>
            )}
            {data.registroQuirofano &&
              !data.registroQuirofano.horaInicioRecuperacion &&
              data.registroQuirofano.horaFin && (
                <Tooltip title="Comenzar recuperación">
                  <IconButton onClick={() => setOpenRecoveryPhase(true)}>
                    <FaHandHoldingMedical style={{ color: '#686D76' }} />
                  </IconButton>
                </Tooltip>
              )}
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <OptionsModal
            setOpen={setOpen}
            registerRoomId={data.id}
            medical={
              data.medico && {
                id: data.medico.id,
                nombre: medicName,
              }
            }
            nurses={data.enfermeros}
            anesthesiologist={
              data.anestesiologo && {
                id: data.anestesiologo.id,
                nombre: anesthesiologistName,
              }
            }
          />
        </>
      </Modal>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              borderRadius: 4,
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
      >
        <Box sx={{ padding: '10px', width: '250px' }}>
          <Typography>Asignar fecha de inicio</Typography>
          <TextField
            type="datetime-local"
            InputProps={{
              inputProps: {},
            }}
            value={startOperatingRoom}
            onChange={(e) => {
              setStartOperatingRoom(e.target.value);
            }}
            fullWidth
          />
          <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleAddStartOperatingRoom}>
            Agregar
          </Button>
        </Box>
      </Menu>
      <Menu
        anchorEl={anchorElEnd}
        open={openMenuEnd}
        onClose={handleCloseEnd}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              borderRadius: 4,
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
      >
        <Box sx={{ padding: '10px', width: '250px' }}>
          <Typography>Asignar fecha de finalización</Typography>
          <TextField
            type="datetime-local"
            value={endOperatingRoom}
            onChange={(e) => {
              setEndOperatingRoom(e.target.value);
            }}
            fullWidth
          />
          <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleModifyOperatingRoom}>
            Agregar
          </Button>
        </Box>
      </Menu>
      <Modal open={openRecoveryPhase} onClose={() => setOpenRecoveryPhase(false)}>
        <>
          <StartRecoveryPhase setOpen={setOpenRecoveryPhase} operatingRoomId={data.registroQuirofano?.id as string} />
        </>
      </Modal>
    </>
  );
};
