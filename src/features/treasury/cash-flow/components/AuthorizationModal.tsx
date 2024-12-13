import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';
import { Button, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { createAuthorization } from '../../services/treasury';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Props {
  //   itemId?: string;
  open: boolean;
  //   onSuccess: Function;
  onClose: Function;
}

export const addArticle = z.object({
  nombre: z.string().min(1, 'Escribe un nombre'),
  descripcion: z.string().nullable(),
});

interface IAuthorization {}

const AuthorizationModal = (props: Props) => {
  const { open, onClose } = props;

  const defaultValues = {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthorization>({
    defaultValues,
    resolver: zodResolver(addArticle),
  });

  const onSubmit = async (data: any) => {
    console.log('data:', data);
    await createAuthorization({});
  };

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button
        variant="contained"
        onClick={onSubmit}
        // onClick={handleSubmit(onSubmit, handleError)}
        startIcon={<SaveOutlinedIcon />}
      >
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic header="Nueva autorizacion" open={open} onClose={onClose} actions={actions}>
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            {/* <SelectBasic {...register('')} label="Seleccione el tipo de Autorizacion" /> */}
          </Grid>
          <Grid item xs={12} md={12}>
            {/* <InputBasic {...register('')} label="Cantidad" /> */}
          </Grid>
          <Grid item xs={12} md={12}>
            {/* <InputBasic {...register('')} label="Motivo" multiline maxRows={3} maxLength={200} /> */}
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default AuthorizationModal;
