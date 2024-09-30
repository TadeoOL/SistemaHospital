import { Box, Button, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useGetAlmacenes } from '../../../hooks/useGetAlmacenes';
import { useState } from 'react';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';
import { modifyModuleConfig } from '../../../api/api.routes';
import { toast } from 'react-toastify';

export const PharmacyConfig = () => {
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const [warehouseError, setWarehouseError] = useState(false);
  const warehouseId = usePosTabNavStore((state) => state.warehouseId);
  const [warehouseSelected, setWarehouseSelected] = useState<string>(warehouseId);
  const setWarehouseId = usePosTabNavStore((state) => state.setWarehouseId);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!warehouseSelected) {
      setWarehouseError(true);
      return;
    }
    setIsLoading(true);
    try {
      const obj = {
        id_Almacen: warehouseSelected,
      };
      await modifyModuleConfig(obj, 'Farmacia');
      setWarehouseId(warehouseSelected);
      toast.success('Almacén configurado exitosamente!');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAlmacenes) return <CircularProgress />;
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
            setWarehouseError(false);
            setWarehouseSelected(e.target.value);
          }}
        >
          {almacenes.map((warehouse) => (
            <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
              {warehouse.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};
