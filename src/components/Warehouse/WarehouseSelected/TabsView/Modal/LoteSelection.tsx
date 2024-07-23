import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface LoteSelectionProps {
  lotes: { stock: number; fechaCaducidad: string; Id_ArticuloExistente: string }[];
  articleName: string;
  setOpen: Function;
  open: boolean;
  addFunction: Function;
  editing?: boolean;
  selectedLotes?: { stock: number; fechaCaducidad: string; Id_ArticuloExistente: string }[];
  setEditing?: Function;
}

interface LoteRowProps {
  lote: any;
  quantity: number;
  handleQuantityChange: (Id_ArticuloExistente: string, value: number) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 600, md: 800 },
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
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
  },
};

export const LoteSelection = (props: LoteSelectionProps) => {
  const [quantities, setQuantities] = useState<{ [Id_ArticuloExistente: string]: number }>({});

  useEffect(() => {
    console.log(props.selectedLotes);
    if (props.editing && props.selectedLotes) {
      const initialQuantities = props.selectedLotes.reduce(
        (acc, lote) => {
          acc[lote.Id_ArticuloExistente] = lote.stock;
          return acc;
        },
        {} as { [id: string]: number }
      );
      setQuantities(initialQuantities);
    }
  }, [props.editing, props.selectedLotes]);

  const handleQuantityChange = (Id_ArticuloExistente: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [Id_ArticuloExistente]: value }));
  };

  const handleConfirm = () => {
    console.log('los lotes del articulo', props.lotes);
    const selectedLotes = props.lotes
      .filter((lote) => quantities[lote.Id_ArticuloExistente] > 0)
      .map((lote) => ({
        ...lote,
        stock: quantities[lote.Id_ArticuloExistente],
      }));
    console.log('id de lote y cuanto se le va restar', quantities);
    console.log('lotes seleccionados', selectedLotes);
    props.addFunction(selectedLotes, props.editing);
    props.setOpen(false);
  };
  return (
    <Box sx={{ ...style }}>
      <HeaderModal setOpen={props.setOpen} title="Selección de lote" />
      <Box sx={{ overflowY: 'auto', ...styleBar, bgcolor: 'background.paper', p: 2 }}>
        <Typography>{props.articleName}</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stock disponible</TableCell>
                <TableCell>Fecha de caducidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.lotes.map((lote) => (
                <LoteRow
                  key={lote.Id_ArticuloExistente}
                  lote={lote}
                  quantity={quantities[lote.Id_ArticuloExistente] || 0}
                  handleQuantityChange={handleQuantityChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            padding: 1,
            px: 2,
          }}
        >
          <Button onClick={handleConfirm} variant="contained">
            Confirmar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const LoteRow = (props: LoteRowProps) => {
  const { lote, quantity, handleQuantityChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(lote.stock, Number(e.target.value)));
    handleQuantityChange(lote.Id_ArticuloExistente, value);
  };

  return (
    <TableRow>
      <TableCell>{lote.stock}</TableCell>
      <TableCell>{lote.fechaCaducidad}</TableCell>
      <TableCell>
        <TextField
          type="number"
          placeholder="Cantidad"
          inputProps={{ className: 'tableCell', min: 0, max: lote.stock }}
          value={quantity}
          onChange={handleChange}
        />
      </TableCell>
    </TableRow>
  );
};
