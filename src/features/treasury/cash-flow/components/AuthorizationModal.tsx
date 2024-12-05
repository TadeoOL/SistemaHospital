import { InputBasic, ModalBasic, SelectBasic } from '@/common/components';
import { Button, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

interface Props {
  //   itemId?: string;
  open: boolean;
  //   onSuccess: Function;
  onClose: Function;
}

const AuthorizationModal = (props: Props) => {
  const { open, onClose } = props;

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
    <ModalBasic header="Nueva autorizacion" open={open} onClose={onClose} actions={actions}>
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <SelectBasic label="Seleccione el tipo de Autorizacion" />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic label="Cantidad" />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic label="Motivo" multiline maxRows={3} maxLength={200} />
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};

export default AuthorizationModal;
