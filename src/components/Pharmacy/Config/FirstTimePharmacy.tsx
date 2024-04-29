import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Box, Stack, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IWarehouse } from '../../../types/types';
import { getAllAlmacenes } from '../../../api/api.routes';
import { createPharmacyConfig } from '../../../services/pharmacy/configService';
import { isValidFloat } from '../../../utils/functions/dataUtils';

const useGetAlmacenes = () => {
  const [almacenes, setAlmacenes] = useState<IWarehouse[]>([]);
  const [isLoadingAlmacenes, setIsLoadingAlmacenes] = useState(false);
  const [errorAlmacenes, setErrorAlmacenes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingAlmacenes(true);
      try {
        const res = await getAllAlmacenes();
        console.log(res);
        setAlmacenes(res);
        setIsLoadingAlmacenes(false);
        setErrorAlmacenes(false);
      } catch (error) {
        setIsLoadingAlmacenes(false);
        setErrorAlmacenes(true);
      }
    };
    fetchData();
  }, []);
  return {
    almacenes,
    isLoadingAlmacenes,
    errorAlmacenes,
  };
};
const MySwal = withReactContent(Swal);

export const FirstTimePharmacy = () => {
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const [warehouseError, setWarehouseError] = useState(false);
  const [factorError, setFactorError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const showWelcomeModal = async () => {
      await MySwal.fire({
        icon: 'info',
        title: 'Bienvenido',
        html: (
          <TextBody
            warehouses={almacenes}
            isLoading={isLoadingAlmacenes}
            warehouseError={warehouseError}
            factorError={factorError}
          />
        ),
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const input1 = document.getElementById('input1') as HTMLInputElement | null;
          const input2 = document.getElementById('input2') as HTMLInputElement | null;
          return { warehouseId: input1?.value, factor: input2?.value };
        },
      }).then(async (res) => {
        if (res.dismiss || res.isDenied) {
          return navigate('/');
        }
        if (res.isConfirmed && !res.value) {
          console.log(res.value);
          setWarehouseError(true);
          setFactorError(true);
          return;
        }
        if (res.isConfirmed) {
          console.log(res.value);
          if (res.value.warehouseId === '') {
            setWarehouseError(true);
          }
          if (res.value.factor === '') {
            showWelcomeModal();
            return setFactorError(true);
          }
          if (!isValidFloat(res.value.factor)) {
            showWelcomeModal();
            return setFactorError(true);
          }
          const object = { id_Almacen: res.value.warehouseId, factorVenta: res.value.factor };
          try {
            await createPharmacyConfig(object);
            Swal.fire({
              icon: 'success',
              title: 'Éxito!',
              text: 'Se ha creado la configuración correctamente!',
            }).then(() => {
              window.location.reload();
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha generado un error al crear la configuración!',
            }).then(() => {
              navigate('/');
            });
          }
        }
      });
    };

    if (!isLoadingAlmacenes && almacenes.length > 0) {
      setTimeout(() => {
        showWelcomeModal();
      }, 0);
    }
  }, [almacenes, isLoadingAlmacenes, warehouseError, factorError]);

  return null;
};

interface TextBodyProps {
  warehouses: IWarehouse[];
  isLoading: boolean;
  warehouseError: boolean;
  factorError: boolean;
}
const TextBody = (props: TextBodyProps) => {
  const { warehouses, isLoading, factorError, warehouseError } = props;
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  console.log({ warehouses });
  console.log({ isLoading });

  if (isLoading || isLoading === undefined)
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4, justifyContent: 'center' }}>
        <CircularProgress />;
      </Box>
    );
  return (
    <Stack spacing={3}>
      <Box>
        <Typography>Bienvenido al modulo de farmacia</Typography>
        <Typography>
          Ya que esta es tu primera vez entrando al modulo de farmacia se necesitan realizar unas pequeñas
          configuraciones para poder comenzar a trabajar en el modulo.
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'error.main' }}>
          Alerta: En caso de no realizar la configuración no tendrá acceso al modulo.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <Stack sx={{ alignItems: 'start' }}>
          <Typography>Selecciona un almacén</Typography>
          <TextField
            select
            label="Almacén"
            size="small"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            fullWidth
            inputProps={{ id: 'input1' }}
            error={warehouseError}
            helperText={warehouseError && 'Selecciona un almacén'}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.id} value={warehouse.id}>
                {warehouse.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack sx={{ alignItems: 'start' }}>
          <Typography>Escribe un factor de venta</Typography>
          <TextField
            placeholder="Factor de venta..."
            size="small"
            fullWidth
            inputProps={{ id: 'input2' }}
            error={factorError}
            helperText={factorError && 'Escribe un factor de venta'}
          />
        </Stack>
      </Box>
    </Stack>
  );
};
