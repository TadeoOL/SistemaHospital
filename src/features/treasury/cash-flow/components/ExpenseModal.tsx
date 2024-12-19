import { InputBasic, ModalBasic } from '@/common/components';
import { Button, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Props {
  //   itemId?: string;
  open: boolean;
  //   onSuccess: Function;
  onClose: Function;
}

// crearSalidaMonetaria

interface ICashFlowExpense {
  cantidad: number;
  motivo: string;
  id_CajaRevolvente: string;
}

export const addCashFlowExpense = z.object({
  cantidad: z.string().min(1, { message: 'Campo requerido' }),
  motivo: z.string().min(1, { message: 'Campo requerido' }),
  id_CajaRevolvente: z.string().min(1, { message: 'Campo requerido' }),
});

const ExpenseModal = (props: Props) => {
  const { open, onClose } = props;

  const defaultValues = {};

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICashFlowExpense>({
    defaultValues,
    resolver: zodResolver(addCashFlowExpense),
  });

  //MovementArea.REVOLVENTE
  // TODO: terminar submit

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button
        variant="contained"
        // onClick={handleSubmit(onSubmit, handleError)}
        onClick={onClose as any}
        startIcon={<SaveOutlinedIcon />}
      >
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic header="Nuevo gasto" open={open} onClose={onClose} actions={actions}>
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <InputBasic label="Cantidad" {...register('id_CajaRevolvente')} />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic label="Motivo" {...register('motivo')} multiline maxRows={3} maxLength={200} />
          </Grid>
          {/* // TODO: Input de fotos aqui? */}
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default ExpenseModal;
