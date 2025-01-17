import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Menu,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IRecoveryRoom } from '../../../types/operatingRoomTypes';
import dayjs from 'dayjs';
import { SurgeryProceduresChip } from '../../Commons/SurgeryProceduresChip';
import { useRecoveryRoomsPaginationStore } from '../../../store/operatingRoom/recoveryRoomsPagination';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { HowToReg } from '@mui/icons-material';
import { modifyOperatingRoomRegister } from '../../../services/operatingRoom/operatingRoomRegisterService';
import { HistorialClinico } from '../../../types/admissionTypes';
import { ClinicalDataInfo } from './Modal/ClinicalDataInfo';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const HEADERS = ['Hora', 'Quirófano', 'Paciente', 'Cirugía', 'Cirujano', 'Datos Clínicos', 'Acciones'];

const useGetRecoveryRooms = () => {
  const fetch = useRecoveryRoomsPaginationStore((state) => state.fetchData);
  const data = useRecoveryRoomsPaginationStore((state) => state.data);
  const isLoading = useRecoveryRoomsPaginationStore((state) => state.loading);
  const search = useRecoveryRoomsPaginationStore((state) => state.search);
  const pageSize = useRecoveryRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useRecoveryRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useRecoveryRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useRecoveryRoomsPaginationStore((state) => state.setPageSize);
  const count = useRecoveryRoomsPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);

  return { data, isLoading, setPageIndex, setPageSize, count, pageIndex, pageSize };
};

export const RecoveryRoomsTable = () => {
  const { data, isLoading, count, pageIndex, setPageSize, setPageIndex, pageSize } = useGetRecoveryRooms();

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
          <TableHeaderComponent headers={HEADERS} />
          {data.length > 0 && (
            <>
              <TableBody>
                {data.map((d) => (
                  <RecoveryRoomsTableRow key={d.id} data={d} />
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
        {data.length < 1 && <NoDataInTableInfo infoTitle="No hay pacientes en recuperación" />}
      </TableContainer>
    </Card>
  );
};

const RecoveryRoomsTableRow = (props: { data?: IRecoveryRoom }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [openClinicalData, setOpenClinicalData] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const patientName =
    data?.paciente.nombre + ' ' + data?.paciente.apellidoPaterno + ' ' + data?.paciente.apellidoMaterno;

  const handleClick = (event: any) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <>
      <TableRow>
        <TableCell>{dayjs(data?.horaInicio).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>{data?.nombre}</TableCell>
        <TableCell>{patientName}</TableCell>
        <TableCell>
          <SurgeryProceduresChip surgeries={data?.procedimientos ?? []} />
        </TableCell>
        <TableCell>{data?.medico}</TableCell>
        <TableCell>
          <Button variant="outlined" size="small" onClick={() => setOpenClinicalData(true)}>
            Ver
          </Button>
        </TableCell>
        <TableCell>
          <Tooltip title="Dar de alta a paciente">
            <IconButton onClick={handleClick}>
              <HowToReg />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
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
        <DischargeDateSelector
          operatingRoomId={data?.id as string}
          recoveryStartTime={dayjs(data?.horaInicio).format('YYYY-MM-DDTHH:mm')}
        />
      </Menu>
      <Modal open={openClinicalData} onClose={() => setOpenClinicalData(false)}>
        <>
          <ClinicalDataInfo clinicalData={data?.datosClinicos as HistorialClinico} setOpen={setOpenClinicalData} />
        </>
      </Modal>
    </>
  );
};

const DischargeDateSelector = (props: { operatingRoomId: string; recoveryStartTime: string }) => {
  const [date, setDate] = useState<string>(props.recoveryStartTime);
  const [error, setError] = useState('');
  const refetch = useRecoveryRoomsPaginationStore((state) => state.fetchData);

  const handleAdd = async () => {
    if (!date) return setError('Selecciona una fecha');
    if (dayjs(date).isBefore(dayjs(props.recoveryStartTime).add(1, 'minutes')))
      return Swal.fire({
        title: 'Error',
        text: 'La fecha seleccionada es anterior o igual a la fecha de inicio de recuperación.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    withReactContent(Swal)
      .fire({
        title: 'Confirmar alta',
        html: `¿Estás seguro de dar de alta al paciente?</br></br> <b>El paciente sera dado de alta a las:</b></br><h1>${dayjs(date).format('DD/MM/YYYY - HH:mm')}</h1>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, dar de alta',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await modifyOperatingRoomRegister({
              id_RegistroQuirofano: props.operatingRoomId,
              horaFinRecuperacion: new Date(date),
            });
            Swal.fire({
              title: 'Alta exitosa',
              text: 'El paciente ha sido dado de alta.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            refetch();
          } catch (error: any) {
            console.log(error);
            if (error.response.status === 400)
              return Swal.fire({
                title: 'Error',
                text: error.response.data,
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            Swal.fire({
              title: 'Error',
              text: 'Hubo un error al dar de alta al paciente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        }
      });
  };

  return (
    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Stack spacing={0.5}>
        <Typography>Fecha de alta:</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Fecha y Hora"
            value={dayjs(date)}
            onChange={(newValue) => setDate(dayjs(newValue).format('YYYY-MM-DDTHH:mm'))}
            format="DD/MM/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error,
              },
            }}
          />
        </LocalizationProvider>
      </Stack>
      <Button variant="contained" size="small" onClick={handleAdd}>
        Seleccionar fecha
      </Button>
    </Box>
  );
};
