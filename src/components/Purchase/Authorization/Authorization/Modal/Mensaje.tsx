import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import { declinePurchaseAuthorization } from '../PurchaseAuthorizationTable';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { obtenerMensajes, crearMensaje, eliminarMensaje, editarMensaje } from '../../../../../api/api.routes';
import {
  Box,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Paper,
  Radio,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface Mensaje {
  id_Mensaje: string;
  mensaje: string;
  modulo: string;
  habilitado: boolean;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 500, md: 600 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 600 },
};

const styleBar = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
    borderRadius: 10,
  },
};

interface MensajeProps {
  open: Function;
  idSolicitudCompra: string;
}

const Mensaje = ({ open, idSolicitudCompra }: MensajeProps) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [mensajeIdToDelete, setMensajeIdToDelete] = useState('');
  const [selectedMensaje, setSelectedMensaje] = useState<Mensaje | null>(null);
  const [editingMessageId, setEditingMessageId] = useState('');
  const [editingMessageText, setEditingMessageText] = useState('');
  const [mostrarInput, setMostrarInput] = useState(false);
  const [selectedReason, setSelectedReason] = useState<Mensaje | null>(null);
  const [otroSelected, setOtroSelected] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await obtenerMensajes('Compras_AutorizacionCancelada');
        setMensajes(res);
      } catch (error: any) {
        console.error('Error al obtener los mensajes:', error);
        console.log('Código de estado HTTP:', error.response?.status);
      }
    };

    fetchData();
  }, []);

  const handleRechazarOrden = async () => {
    try {
      if (selectedReason) {
        if (nuevoMensaje.trim() !== '') {
          await crearMensaje(nuevoMensaje);
          setNuevoMensaje('');
        }
        await declinePurchaseAuthorization(idSolicitudCompra, selectedReason.mensaje);
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error al rechazar la orden:', error);
    }
  };

  const agregarNuevoMensaje = async () => {
    try {
      if (nuevoMensaje.trim() !== '') {
        await crearMensaje(nuevoMensaje);
        setNuevoMensaje('');
        const res = await obtenerMensajes('Compras_AutorizacionCancelada');
        setMensajes(res);
      } else {
        console.error('El nuevo mensaje no puede estar vacío.');
      }
    } catch (error) {
      console.error('Error al agregar el nuevo mensaje:', error);
    }
  };

  const eliminarMensajes = async (mensajeId: string) => {
    try {
      handleOpenDialog(mensajeId);
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error);
    }
  };
  const handleOpenDialog = (mensajeId: string) => {
    setMensajeIdToDelete(mensajeId);
    setOpenDialog(true);
    const selected = mensajes.find((mensaje) => mensaje.id_Mensaje === mensajeId);
    setSelectedMensaje(selected || null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMensaje(null);
  };

  const handleConfirmDelete = async () => {
    if (mensajeIdToDelete) {
      await eliminarMensaje(mensajeIdToDelete);
      handleCloseDialog();
      const res = await obtenerMensajes('Compras_AutorizacionCancelada');
      setMensajes(res);
    }
  };

  const toggleEditMode = (mensajeId: string, mensajeText: string) => {
    setEditingMessageId(mensajeId);
    setEditingMessageText(mensajeText);
  };

  const handleSaveEdit = async () => {
    try {
      if (editingMessageId !== '' && editingMessageText.trim() !== '') {
        await editarMensaje({
          id_Mensaje: editingMessageId,
          mensaje: editingMessageText,
          modulo: 'Compras_AutorizacionCancelada',
        });
        setEditingMessageId('');
        setEditingMessageText('');

        const res = await obtenerMensajes('Compras_AutorizacionCancelada');
        setMensajes(res);
      } else {
        console.error('Mensaje ID o contenido no válido para la edición.');
      }
    } catch (error: any) {
      console.error('Error al editar el mensaje:', error.response?.data || error.message);
    }
  };

  const handleCloseModal = () => {
    setOpenDialog(false);
    open(false);
  };

  const handleOtro = () => {
    setSelectedReason(null);
    setMostrarInput((prevMostrarInput) => !prevMostrarInput);
    setOtroSelected((prevOtroSelected) => !prevOtroSelected);
  };

  const handleAceptar = () => {
    handleRechazarOrden();
    agregarNuevoMensaje();
  };

  const handleSelectMessage = (mensaje: Mensaje) => {
    setOtroSelected(false);
    setMostrarInput(false);
    if (mensaje.id_Mensaje === 'otro') {
      setOtroSelected(!otroSelected);
      return;
    }
    setSelectedReason(mensaje === selectedReason ? null : mensaje);
  };

  return (
    <Box sx={{ ...style, zIndex: 9999 }}>
      <HeaderModal setOpen={open} title="Cancelar Solicitud" />
      <Box
        sx={{
          overflowY: 'auto',
          ...styleBar,
        }}
      >
        <Box
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningIcon
            sx={{
              color: '#FFA500',
              fontSize: 70,
              marginBottom: 4,
            }}
          />
          <>
            <Typography variant="h5">¿Deseas Cancelar la solicitud de compra?</Typography>
            <Typography variant="h6" sx={{ marginTop: 3 }}>
              Se cambiará el estatus de la solicitud de compra a orden cancelada!
            </Typography>
          </>
        </Box>

        <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ marginBottom: 3 }}>
            Motivo:{' '}
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2, maxHeight: 250 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3}>Mensajes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mensajes.map((mensaje) => (
                  <>
                    <TableRow
                      key={mensaje.id_Mensaje}
                      onClick={() => handleSelectMessage(mensaje)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: mensaje === selectedReason ? 'rgba(0,0,0,.2)' : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Radio checked={mensaje === selectedReason} onChange={() => handleSelectMessage(mensaje)} />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left', minWidth: 300 }}>
                        {editingMessageId === mensaje.id_Mensaje ? (
                          <TextField
                            value={editingMessageText}
                            onChange={(e) => setEditingMessageText(e.target.value)}
                            inputProps={{ style: { paddingTop: '10px' } }}
                          />
                        ) : (
                          mensaje.mensaje
                        )}
                      </TableCell>

                      <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {editingMessageId === mensaje.id_Mensaje ? (
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              handleSaveEdit();
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleEditMode(mensaje.id_Mensaje, mensaje.mensaje);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            eliminarMensajes(mensaje.id_Mensaje);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
                <TableRow onClick={handleOtro} sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Radio
                      checked={otroSelected}
                      sx={{
                        color: otroSelected ? '#0000FF' : undefined,
                      }}
                      onChange={() => {}}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', minWidth: 300 }}>Otro</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {mostrarInput && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'height 0.9s ease',
              }}
            >
              <TextField
                placeholder="Nuevo Mensaje"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <Button sx={{ mr: 2 }} onClick={handleCloseModal}>
              Salir
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAceptar}
              disabled={!selectedReason && !nuevoMensaje.trim()}
            >
              Aceptar
            </Button>
          </Box>
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ zIndex: 10000 }}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            {selectedMensaje && (
              <Box>
                <Typography variant="body1">¿Estás seguro de que deseas eliminar el siguiente mensaje?</Typography>
                <Typography variant="body2" style={{ marginTop: '1rem', marginLeft: '10px' }}>
                  {selectedMensaje.mensaje}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete}>Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Mensaje;
