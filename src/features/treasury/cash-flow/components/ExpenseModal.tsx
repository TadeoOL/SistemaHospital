import { InputBasic, ModalBasic } from '@/common/components';
import { Button, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { crearSalidaMonetaria } from '../services/cashflow';
import { MovementArea } from '../../types/types.common';

interface Props {
  //   itemId?: string;
  open: boolean;
  //   onSuccess: Function;
  onClose: Function;
  id_CajaRevolvente?: string;
}

interface ICashFlowExpense {
  cantidad: number;
  motivo: string;
  id_CajaRevolvente: string;
}

export const addCashFlowExpense = z.object({
  cantidad: z.string().min(1, { message: 'Campo requerido' }),
  motivo: z.string().min(1, { message: 'Campo requerido' }),
});

const ExpenseModal = (props: Props) => {
  const { open, onClose, id_CajaRevolvente } = props;

  const defaultValues = {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICashFlowExpense>({
    defaultValues,
    resolver: zodResolver(addCashFlowExpense),
  });

  const onSubmit = async (data: ICashFlowExpense) => {
    try {
      await crearSalidaMonetaria({
        ...data,
        id_CajaRevolvente: id_CajaRevolvente,
        modulo: MovementArea.REVOLVENTE,
      });
      toast.success('Gasto creado correctamente');
      onClose();
    } catch (error) {
      console.log('error:', error);
      toast.error('Error al crear el gasto');
    }
  };

  const handleError = (error: any) => {
    console.log('error:', error);
  };

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button variant="contained" onClick={handleSubmit(onSubmit, handleError)} startIcon={<SaveOutlinedIcon />}>
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic header="Nuevo gasto" open={open} onClose={onClose} actions={actions}>
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <InputBasic
              label="Cantidad"
              {...register('cantidad')}
              helperText={errors.cantidad?.message}
              error={errors.cantidad}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic
              label="Motivo"
              {...register('motivo')}
              multiline
              maxRows={3}
              maxLength={200}
              helperText={errors.motivo?.message}
              error={errors.motivo}
            />
          </Grid>
          {/* // TODO: Input de fotos aqui? */}
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default ExpenseModal;
