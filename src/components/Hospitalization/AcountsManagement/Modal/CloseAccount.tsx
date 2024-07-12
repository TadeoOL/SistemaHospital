import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IBiomedicalEquipment } from '../../../../types/hospitalizationTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { biomedicalEquipmentSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import { toast } from 'react-toastify';
import {
  createBiomedicalEquipment,
  modifyBiomedicalEquipment,
} from '../../../../services/hospitalization/biomedicalEquipmentService';
import { useState } from 'react';
import { useBiomedicalEquipmentPaginationStore } from '../../../../store/hospitalization/biomedicalEquipmentPagination';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
interface CloseAccountModalProps {
  setOpen: Function;
  id_Cuenta: string;
  id_Paciente: string;
}

export const CloseAccountModal = (props: CloseAccountModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useBiomedicalEquipmentPaginationStore((state) => state.fetchData);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      /*console.log(biomedicalEquipment);
      biomedicalEquipment
        ? await modifyBiomedicalEquipment({
            id: data.id as string,
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
          })
        : await createBiomedicalEquipment({
            descripcion: data.description,
            nombre: data.name,
            precio: data.price,
          });*/
      toast.success(`Equipo biomédico correctamente`);
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error al  equipo biomédico.`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={'Cierre de cuenta'} />
      <Box sx={{ bgcolor: 'background.paper', p: 2, display: 'flex' }}></Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error">
          Cancelar
        </Button>
        <Button variant="contained" type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress size={25} /> : 'Aceptar'}
        </Button>
      </Box>
    </Box>
  );
};
