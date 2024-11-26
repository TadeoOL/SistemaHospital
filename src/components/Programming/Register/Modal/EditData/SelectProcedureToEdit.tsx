import { Add, Close } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { useState } from 'react';
import { useGetAllSurgeryProcedures } from '../../../../../hooks/programming/useGetAllSurgeryProcedure';
import { toast } from 'react-toastify';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import Swal from 'sweetalert2';
import { ISurgicalProcedure } from '@/types/admission/admissionTypes';
import { editProcedures } from '@/services/admission/admisionService';
import { usePatientEntryPaginationStore } from '@/store/admission/usePatientEntryPagination';

const HEADERS_TABLE = ['Nombre', 'Precio', 'Acciones'];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650, md: 900 },
};

interface SelectProcedureToEditProps {
  setOpen: Function;
  setValue: Function;
  patientAccountId: string;
  procedures?: ISurgicalProcedure[];
}

export const SelectProcedureToEdit = (props: SelectProcedureToEditProps) => {
  const { setOpen, procedures, patientAccountId } = props;
  const { data: proceduresRes, isLoadingProcedures } = useGetAllSurgeryProcedures();
  const refetch = usePatientEntryPaginationStore((state) => state.fetchData);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [selectedRow, setSelectedRow] = useState<any>(null);
  const [procedure, setProcedure] = useState<string>('');
  const [proceduresList, setProceduresList] = useState<ISurgicalProcedure[]>(procedures ?? []);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handle = (event: any) => {
    setProcedure(event.target.value as string);
  };

  const handleAddProcedure = () => {
    if (!procedure) return handleClose();
    if (proceduresList.flatMap((p) => p.id_Cirugia).includes(procedure)) return handleClose();
    const procedureFound = proceduresRes.find((p) => p.id_Cirugia === procedure);
    if (!procedureFound) return toast.error('Procedimiento no encontrado');
    console.log({ procedureFound });

    const newProceduresList = [...proceduresList, procedureFound];
    setProceduresList(newProceduresList);
    setProcedure('');
  };

  const handleSubmit = async () => {
    Swal.fire({
      title: 'Estás seguro?',
      text: '¿Estás seguro de que deseas agregar estos procedimientos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await editProcedures({
            id_CuentaPaciente: patientAccountId,
            id_Cirugias: proceduresList.flatMap((p) => p.id_Cirugia),
          });
          Swal.fire({
            title: 'Agregado!',
            text: 'Procedimientos agregados correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          });
          setOpen(false);
          refetch();
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudieron agregar los procedimientos',
            icon: 'error',
          });
          console.log(error);
        }
      }
    });
  };

  if (isLoadingProcedures)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <Box sx={style}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            p: 1,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Editar procedimientos</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ bgcolor: 'background.paper', display: 'flex', p: 3 }}>
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', rowGap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button startIcon={<Add />} variant="contained" onClick={handleClick}>
                Agregar
              </Button>
            </Box>
            <ProceduresTable procedures={proceduresList} setProcedures={setProceduresList} />
          </Box>
        </Box>
        <Box sx={{ bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={() => props.setValue(0)}>
            Regresar
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Aceptar
          </Button>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { sx: { p: 2, width: '250px' } } }}
      >
        {[
          <Typography key="title" variant="subtitle1" gutterBottom>
            Configurar Quirófano
          </Typography>,
          <Select key="select" value={procedure} onChange={(e) => handle(e)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="">
              <em>Seleccionar el procedimiento</em>
            </MenuItem>
            {proceduresRes.map((opRoom) => (
              <MenuItem key={opRoom.id_Cirugia} value={opRoom.id_Cirugia}>
                {opRoom.nombre}
              </MenuItem>
            ))}
          </Select>,
          <Button key="button" variant="contained" color="primary" fullWidth onClick={handleAddProcedure}>
            Aceptar
          </Button>,
        ]}
      </Menu>
    </>
  );
};

const ProceduresTable = (props: {
  procedures?: ISurgicalProcedure[];
  setProcedures: (procedures: ISurgicalProcedure[]) => void;
}) => {
  const { procedures, setProcedures } = props;
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS_TABLE} />
          <TableBody>
            {procedures?.map((procedure) => (
              <ProceduresTableRow
                key={procedure.id_Cirugia}
                procedure={procedure}
                setProcedures={setProcedures}
                procedures={procedures}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!procedures || procedures.length < 1) && (
        <NoDataInTableInfo infoTitle="No hay procedimientos" sizeIcon={20} variantText="h4" />
      )}
    </Card>
  );
};

const ProceduresTableRow = (props: {
  procedure: ISurgicalProcedure;
  setProcedures: (procedures: ISurgicalProcedure[]) => void;
  procedures: ISurgicalProcedure[];
}) => {
  const { procedure } = props;
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        props.setProcedures(props.procedures.filter((p) => p.id_Cirugia !== procedure.id_Cirugia));
        Swal.fire('Procedimiento eliminado', 'El procedimiento ha sido eliminado exitosamente', 'success');
      }
    });
  };
  return (
    <TableRow>
      <TableCell>{procedure.nombre}</TableCell>
      <TableCell>{procedure.precio}</TableCell>
      <TableCell>
        <Tooltip title="Eliminar">
          <IconButton onClick={handleDelete}>
            <Close />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
