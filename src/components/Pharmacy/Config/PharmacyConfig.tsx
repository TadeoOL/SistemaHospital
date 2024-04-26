import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useGetAlmacenes } from '../../../hooks/useGetAlmacenes';
import { useState } from 'react';

export const PharmacyConfig = () => {
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const [warehouseError, setWarehouseError] = useState(false);
  const [warehouseSelected, setWarehouseSelected] = useState();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 4,
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 4,
        maxWidth: '40%',
      }}
    >
      <Stack>
        <Typography>Configuracion del almacen:</Typography>
        <TextField
          select
          label="Almacén"
          size="small"
          error={warehouseError}
          helperText={warehouseError && 'Selecciona un almacén'}
          value={warehouseSelected}
          onChange={(e) => {
            // setWarehouseError(false);
            // setWarehouseSelected(e.target.value);
          }}
        >
          {almacenes.map((warehouse) => (
            <MenuItem key={warehouse.id} value={warehouse.id}>
              {warehouse.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack>
        <Typography>Factor de venta:</Typography>
        <TextField
          label="Escribe un factor de venta..."
          size="small"
          error={warehouseError}
          helperText={warehouseError && 'Selecciona un almacén'}
        />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained">Guardar</Button>
      </Box>
    </Box>
  );
};
