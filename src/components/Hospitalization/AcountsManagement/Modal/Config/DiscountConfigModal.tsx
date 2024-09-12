import { Box, Button, CircularProgress, Grid } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { DiscountUsersTable } from './DiscountUsersTable';
import { DiscountInputs } from './DiscountInputs';
import { useEffect, useState, useRef } from 'react';
import { useGetDiscountConfig } from '../../../../../hooks/admission/useGetDiscountConfig';
import { modifyModuleConfig } from '../../../../../api/api.routes';
import { toast } from 'react-toastify';
import { isEqual } from 'lodash';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' },
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1200px',
  boxShadow: 24,
};

export const DiscountConfigModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { data, isLoading } = useGetDiscountConfig();
  const [usersDiscount, setUsersDiscount] = useState<{ id: string; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const prevDataRef = useRef<typeof data>();

  useEffect(() => {
    if (!isLoading && data && !isEqual(data, prevDataRef.current)) {
      setUsersDiscount(data);
      prevDataRef.current = data;
    }
  }, [isLoading, data]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await modifyModuleConfig(
        usersDiscount.map((user) => {
          return {
            id: user.id,
            nombre: user.name,
          };
        }),
        'Descuentos'
      );
      toast.success('Descuentos actualizados correctamente');
    } catch (error) {
      console.log(error);
      toast.error('No se pudo actualizar los descuentos');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={modalStyle}>
      <HeaderModal title="Configuración de descuentos" setOpen={setOpen} />
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          overflowY: 'auto',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DiscountInputs setUsersDiscount={setUsersDiscount} usersDiscount={usersDiscount} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DiscountUsersTable usersDiscount={usersDiscount} setUsersDiscount={setUsersDiscount} />
            </Grid>
          </Grid>
        )}
      </Box>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </Box>
    </Box>
  );
};
