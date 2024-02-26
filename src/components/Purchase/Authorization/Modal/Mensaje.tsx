import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
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

interface PurchaseConfigModalProps {
  open: Function;
}

const Mensaje = ({ open }: PurchaseConfigModalProps) => {
  return (
    <Box sx={{ ...style, ...styleBar }}>
      <HeaderModal setOpen={open} title="Configuración de compras" />
      <Stack sx={{ display: "flex", p: 4, bgcolor: "background.paper" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Mensajes</Typography>
      </Stack>
    </Box>
  );
};

export default Mensaje;
