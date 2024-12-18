import { Cancel, SaveOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';

interface AuthorizationModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const AuthorizationModalActions: React.FC<AuthorizationModalActionsProps> = ({ onCancel, onSubmit }) => (
  <>
    <Button variant="outlined" startIcon={<Cancel />} color="error" onClick={onCancel}>
      Cancelar
    </Button>
    <div className="col"></div>
    <Button variant="contained" startIcon={<SaveOutlined />} onClick={onSubmit}>
      Guardar
    </Button>
  </>
);

export default AuthorizationModalActions;
