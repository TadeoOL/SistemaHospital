import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import {
  obtenerMensajes,
  crearMensaje,
  eliminarMensaje,
  editarMensaje,
} from "../../../../api/api.routes";
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
} from "@mui/material";

interface Mensaje {
  id_Mensaje: string;
  mensaje: string;
  modulo: string;
  habilitado: boolean;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380, sm: 500, md: 600 },
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: { xs: 600 },
  overflowY: "auto",
};

const styleBar = {
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
    borderRadius: 10,
  },
};

interface MensajeProps {
  open: Function;
}

const Mensaje = ({ open }: MensajeProps) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [mensajeIdToDelete, setMensajeIdToDelete] = useState("");
  const [selectedMensaje, setSelectedMensaje] = useState<Mensaje | null>(null);
  const [editingMessageId, setEditingMessageId] = useState("");
  const [editingMessageText, setEditingMessageText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await obtenerMensajes("Compras_AutorizacionCancelada");
        console.log(res);
        setMensajes(res);
      } catch (error: any) {
        console.error("Error al obtener los mensajes:", error);
        console.log("Código de estado HTTP:", error.response?.status);
      }
    };

    fetchData();
  }, []);

  const agregarNuevoMensaje = async () => {
    try {
      if (nuevoMensaje.trim() !== "") {
        await crearMensaje(nuevoMensaje);
        setNuevoMensaje("");
        const res = await obtenerMensajes("Compras_AutorizacionCancelada");
        setMensajes(res);
      } else {
        console.error("El nuevo mensaje no puede estar vacío.");
      }
    } catch (error) {
      console.error("Error al agregar el nuevo mensaje:", error);
    }
  };

  const eliminarMensajes = async (mensajeId: string) => {
    try {
      handleOpenDialog(mensajeId);
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };
  const handleOpenDialog = (mensajeId: string) => {
    setMensajeIdToDelete(mensajeId);
    setOpenDialog(true);
    const selected = mensajes.find(
      (mensaje) => mensaje.id_Mensaje === mensajeId
    );
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
      const res = await obtenerMensajes("Compras_AutorizacionCancelada");
      setMensajes(res);
    }
  };

  const toggleEditMode = (mensajeId: string, mensajeText: string) => {
    setEditingMessageId(mensajeId);
    setEditingMessageText(mensajeText);
  };

  const handleSaveEdit = async () => {
    try {
      await editarMensaje({
        mensajeId: editingMessageId,
        nuevoContenido: editingMessageText,
      });
      setEditingMessageId("");
      setEditingMessageText("");
      const res = await obtenerMensajes("Compras_AutorizacionCancelada");
      setMensajes(res);
    } catch (error) {
      console.error("Error al editar el mensaje:", error);
    }
  };

  return (
    <Box sx={{ ...style, ...styleBar }}>
      <HeaderModal setOpen={open} title="Mensaje personalizado" />
      <Box sx={{ p: 4, bgcolor: "background.paper" }}>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 2, borderRadius: 2, maxHeight: 250 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mensajes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mensajes.map((mensaje) => (
                <TableRow key={mensaje.id_Mensaje}>
                  <TableCell>
                    {editingMessageId === mensaje.id_Mensaje ? (
                      <TextField
                        value={editingMessageText}
                        onChange={(e) => setEditingMessageText(e.target.value)}
                      />
                    ) : (
                      mensaje.mensaje
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {editingMessageId === mensaje.id_Mensaje ? (
                      <IconButton onClick={handleSaveEdit}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() =>
                          toggleEditMode(mensaje.id_Mensaje, mensaje.mensaje)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => eliminarMensajes(mensaje.id_Mensaje)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ marginTop: "10%" }}>
            Crear un nuevo mensaje
          </Typography>
          <TextField
            label="Nuevo Mensaje"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            sx={{ mt: 2, marginLeft: "5px", marginTop: "25px" }}
            variant="contained"
            onClick={agregarNuevoMensaje}
          >
            Agregar nuevo mensaje
          </Button>
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          {selectedMensaje && (
            <Box>
              <Typography variant="body1">
                ¿Estás seguro de que deseas eliminar el siguiente mensaje?
              </Typography>
              <Typography
                variant="body2"
                style={{ marginTop: "1rem", marginLeft: "10px" }}
              >
                {selectedMensaje.mensaje}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Mensaje;
