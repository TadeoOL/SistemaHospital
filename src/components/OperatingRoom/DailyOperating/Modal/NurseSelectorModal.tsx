import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Add, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useGetAllNursesUsers } from '../../../../hooks/hospitalization/useGetAllNurse';
import { NoDataInTableInfo } from '../../../Commons/NoDataInTableInfo';
import { toast } from 'react-toastify';
import { modifyOperatingRoom } from '../../../../services/programming/admissionRegisterService';
import { useDailyOperatingRoomsPaginationStore } from '../../../../store/operatingRoom/dailyOperatingRoomsPagination';

interface NurseSelectorModalProps {
  setOption: (value: number) => void;
  registerRoomId: string;
  nurses: { id_Enfermero: string; nombre: string }[];
  setOpen: (value: boolean) => void;
}
export const NurseSelectorModal = (props: NurseSelectorModalProps) => {
  const [nurses, setNurses] = useState<{ id_Enfermero: string; nombre: string }[]>(props.nurses);
  const refetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);

  const handleSubmit = async () => {
    try {
      await modifyOperatingRoom({
        id_RegistroCuarto: props.registerRoomId,
        enfermeros: JSON.stringify(nurses),
      });
      toast.success('Enfermeros modificados correctamente');
      props.setOption(0);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error('Error al modificar a los enfermeros');
    }
  };

  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Modificar enfermeros de quirófano" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <SelectedNursesTable nurses={nurses} setNurses={setNurses} />
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => props.setOption(0)} variant="outlined">
          Regresar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Aceptar
        </Button>
      </Box>
    </>
  );
};
interface SelectedNursesTableProps {
  nurses: { id_Enfermero: string; nombre: string }[];
  setNurses: (value: { id_Enfermero: string; nombre: string }[]) => void;
}
const SelectedNursesTable = (props: SelectedNursesTableProps) => {
  const { nurses, setNurses } = props;
  const { isLoadingNursesUsers, nursesUsersData } = useGetAllNursesUsers();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [selectedNurse, setSelectedNurse] = useState<{ id_Enfermero: string; nombre: string } | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNurse = () => {
    if (selectedNurse && !nurses.some((n) => n.id_Enfermero === selectedNurse.id_Enfermero)) {
      setNurses([...nurses, selectedNurse]);
    }
    setSelectedNurse(null);
    handleClose();
  };

  const handleRemoveNurse = (nurseId: string) => {
    setNurses(nurses.filter((n) => n.id_Enfermero !== nurseId));
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ border: '1px solid #E0E0E0 ', borderRadius: '10px', overflow: 'hidden' }}>
      <Box
        sx={{
          backgroundColor: '#e0e0e0',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Enfermeros de quirófano</Typography>
        <Button variant="contained" size="small" startIcon={<Add />} onClick={handleClick}>
          Agregar enfermero
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
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
          <Box sx={{ padding: '16px', width: '200px' }}>
            <Typography variant="h6" sx={{ marginBottom: '8px' }}>
              Agregar enfermero
            </Typography>
            <Autocomplete
              loading={isLoadingNursesUsers}
              options={nursesUsersData}
              noOptionsText="No se encontraron enfermeros"
              getOptionLabel={(option) => option.nombre}
              isOptionEqualToValue={(option, value) => option.id_Enfermero === value.id_Enfermero}
              renderInput={(params) => <TextField {...params} placeholder="Enfermeros" />}
              onChange={(_, value) => setSelectedNurse(value)}
              value={selectedNurse}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleAddNurse} style={{ marginTop: '8px' }}>
              Agregar
            </Button>
          </Box>
        </Menu>
      </Box>
      <Table>
        <TableHead sx={{ backgroundColor: 'background.paper' }}>
          <TableRow>
            <TableCell align="center">Nombre</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        {nurses.length > 0 ? (
          <TableBody>
            {nurses.map((nurse) => (
              <TableRow key={nurse.id_Enfermero}>
                <TableCell align="center">{nurse.nombre}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Remover">
                    <IconButton onClick={() => handleRemoveNurse(nurse.id_Enfermero)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableCell colSpan={2}>
            <NoDataInTableInfo infoTitle="No hay enfermeros seleccionados" sizeIcon={40} variantText="h4" />
          </TableCell>
        )}
      </Table>
    </Box>
  );
};
