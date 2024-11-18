import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { useEffect } from 'react';
import { useAssignedRoomsPaginationStore } from '../../../store/nursing/assignedRoomsPagination';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { IAssignedRoomsPagination } from '../../../types/nursing/nursingTypes';
import { MedicalInformationOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TABLE_HEADERS = ['Paciente', 'Cuarto', 'Medico', 'Acciones'];

const useGetAssignedRooms = () => {
  const fetch = useAssignedRoomsPaginationStore((state) => state.fetchData);
  const data = useAssignedRoomsPaginationStore((state) => state.data);
  const isLoading = useAssignedRoomsPaginationStore((state) => state.loading);
  const search = useAssignedRoomsPaginationStore((state) => state.search);
  const pageSize = useAssignedRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useAssignedRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useAssignedRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useAssignedRoomsPaginationStore((state) => state.setPageSize);
  const count = useAssignedRoomsPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);
  return { data, isLoading, pageSize, pageIndex, count, setPageIndex, setPageSize };
};

export const AssignedRoomsTable = () => {
  const { data, isLoading, pageSize, pageIndex, count, setPageIndex, setPageSize } = useGetAssignedRooms();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
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
                  <AssignedRoomsTableRow data={d} key={d.id_IngresoPaciente} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay cuartos asignados" />}
    </Card>
  );
};

const AssignedRoomsTableRow = (props: { data: IAssignedRoomsPagination }) => {
  const { data } = props;
  // const [open, setOpen] = useState(false);
  console.log(data);

  const navigate = useNavigate();

  const handleNavigateToPatientKardex = () => {
    navigate(`/enfermeria/kardex-paciente/${data.id_IngresoPaciente}`, {
      state: {
        nombrePaciente: data.nombrePaciente,
        nombreCuarto: data.nombreCuarto,
        medico: data.medico,
        edad: data.edad.toString(),
        genero: data.genero,
        motivoIngreso: data.motivoIngreso,
        tipoSangre: data.tipoSangre,
        alergias: data.alergias,
        comentarios: data.comentarios,
        diagnosticoIngreso: data.diagnosticoIngreso,
      },
    });
  };

  return (
    <>
      <TableRow>
        <TableCell>{data.nombrePaciente}</TableCell>
        <TableCell>{data.nombreCuarto}</TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>
          <>
            <Tooltip title="Kardex del paciente">
              <IconButton onClick={handleNavigateToPatientKardex}>
                <MedicalInformationOutlined />
              </IconButton>
            </Tooltip>
          </>
        </TableCell>
      </TableRow>
      {/* <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <AllSurgeryInfoModal setOpen={setOpen} roomId={data.id_Cuarto} isHospitalizationRoom={true} />
        </>
      </Modal> */}
    </>
  );
};
