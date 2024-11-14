import { Box, Button, Container } from '@mui/material';
import { PatientKardex } from '../../components/Nursing/PatientKardex/PatientKardex';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const PatientKardexView = () => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined">
          Regresar
        </Button>
      </Box>
      <PatientKardex />
    </Container>
  );
};

export default PatientKardexView;
