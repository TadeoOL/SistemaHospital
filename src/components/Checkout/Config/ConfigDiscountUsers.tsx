import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { isEqual } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { useGetDiscountConfig } from '../../../hooks/admission/useGetDiscountConfig';
import { useEffect, useRef, useState } from 'react';
import { modifyModuleConfig } from '../../../api/api.routes';
import { DiscountInputs } from './DiscountInputs';
import { DiscountUsersTable } from './DiscountUsersTable';
import { User } from '../../../hooks/useGetUsersBySearch';

interface Props {
  usersRes: User[];
  isLoadingUsers: boolean;
}
export const ConfigDiscountUsers = ({ usersRes, isLoadingUsers }: Props) => {
  const { data, isLoading } = useGetDiscountConfig();
  const [usersDiscount, setUsersDiscount] = useState<{ id: string; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const prevDataRef = useRef<typeof data>();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['discountConfig'] });
      toast.success('Descuentos actualizados correctamente');
    } catch (error) {
      console.log(error);
      toast.error('No se pudo actualizar los descuentos');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Configuración de descuentos</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DiscountInputs
                setUsersDiscount={setUsersDiscount}
                usersDiscount={usersDiscount}
                usersRes={usersRes}
                isLoadingUsers={isLoadingUsers}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DiscountUsersTable usersDiscount={usersDiscount} setUsersDiscount={setUsersDiscount} />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button variant="contained" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
