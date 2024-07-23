import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Box, Stack, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IWarehouse } from '../../../types/types';
import { getAllAlmacenes, modifyModuleConfig } from '../../../api/api.routes';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';

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
  const setWarehouseIdConfig = usePosTabNavStore((state) => state.setWarehouseId);
  const navigate = useNavigate();

  useEffect(() => {
    const showWelcomeModal = async () => {
      await MySwal.fire({
        icon: 'info',
        title: 'Bienvenido',
        html: <TextBody warehouses={almacenes} isLoading={isLoadingAlmacenes} warehouseError={warehouseError} />,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        preConfirm: () => {
          const input1 = document.getElementById('input1') as HTMLInputElement | null;
          return { warehouseId: input1?.value };
        },
      }).then(async (res) => {
        if (res.dismiss || res.isDenied) {
          return navigate('/');
        }
        if (res.isConfirmed && !res.value) {
          setWarehouseError(true);
          return;
        }
        if (res.isConfirmed) {
          if (res.value.warehouseId === '') {
            setWarehouseError(true);
            showWelcomeModal();
            return;
          }

          const object = { id_Almacen: res.value.warehouseId };
          try {
            await modifyModuleConfig(object, 'Farmacia');
            setWarehouseIdConfig(res.value.warehouseId);
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
  }, [almacenes, isLoadingAlmacenes, warehouseError]);

  return null;
};

interface TextBodyProps {
  warehouses: IWarehouse[];
  isLoading: boolean;
  warehouseError: boolean;
}
const TextBody = (props: TextBodyProps) => {
  const { warehouses, isLoading, warehouseError } = props;
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

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
        <Stack sx={{ alignItems: 'flex-start', display: 'flex' }}>
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
      </Box>
    </Stack>
  );
};
