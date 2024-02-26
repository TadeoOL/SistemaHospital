import React, { useEffect, useState } from "react";
import axios from "axios";
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
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";

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

const styleInput = {
  paddingTop: "0.4rem",
  paddingBottom: "0.4rem",
};

interface MensajeProps {
  open: Function;
}

const Mensaje = ({ open }: MensajeProps) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.250.226.41:5000/api/Sistema/Mensajes/obtener-mensajes-alerta/Compras_AutorizacionCancelada"
        );
        console.log(response.data);
        setMensajes(response.data);
      } catch (error: any) {
        console.error("Error al obtener los mensajes:", error);
        console.log("Código de estado HTTP:", error.response?.status);
      }
    };
    fetchData();
  }, []);

  const crearMensaje = async () => {
    try {
      await axios.post(
        "http://192.250.226.41:5000/api/Sistema/Mensajes/crear-mensaje-alerta",
        { mensaje: nuevoMensaje }
      );
      const response = await axios.get(
        "http://192.250.226.41:5000/api/Sistema/Mensajes/obtener-mensajes-alerta/Compras_AutorizacionCancelada"
      );
      setMensajes(response.data);
      setNuevoMensaje("");
    } catch (error) {
      console.error("Error al crear el mensaje:", error);
    }
  };

  const editarMensaje = async (mensajeId: string) => {
    try {
      const mensajeAEditar = mensajes.find((mensaje) => mensaje === mensajeId);

      if (mensajeAEditar) {
        // mensajeAEditar.mensaje = "Nuevo contenido";

        await axios.put(
          `http://192.250.226.41:5000/api/Sistema/Mensajes/modificar-mensaje-alerta/${mensajeId}`,
          { nuevoContenido: "Nuevo contenido del mensaje" }
        );

        const response = await axios.get(
          "http://192.250.226.41:5000/api/Sistema/Mensajes/obtener-mensajes-alerta/Compras_AutorizacionCancelada"
        );
        setMensajes(response.data);
      }
    } catch (error) {
      console.error("Error al editar el mensaje:", error);
    }
  };

  const eliminarMensaje = async (mensajeId: string) => {
    try {
      await axios.delete(
        `http://192.250.226.41:5000/api/Sistema/Mensajes/eliminar-mensaje-alerta/${mensajeId}`
      );
      const response = await axios.get(
        "http://192.250.226.41:5000/api/Sistema/Mensajes/obtener-mensajes-alerta/Compras_AutorizacionCancelada"
      );
      setMensajes(response.data);
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
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
                <TableRow key={mensaje}>
                  <TableCell>{mensaje}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>test</TableCell>
                  <TableCell>
                    <IconButton onClick={() => editarMensaje(mensaje)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => eliminarMensaje(mensaje)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TextField
          label="Nuevo Mensaje"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          sx={{ mt: 2, marginLeft: "5px", marginTop: "25px" }}
          variant="contained"
          onClick={crearMensaje}
        >
          Agregar Mensaje
        </Button>
      </Box>
    </Box>
  );
};

export default Mensaje;
