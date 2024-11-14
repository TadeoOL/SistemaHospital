import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

interface KardexHeaderProps {
  onCreateClick: () => void;
}

export const KardexHeader = ({ onCreateClick }: KardexHeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      gap: 2,
      mb: 2,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        flexGrow: 1,
        textAlign: 'center',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
      }}
    >
      Kardex del Paciente
    </Typography>
    <Button
      variant="outlined"
      startIcon={<Add />}
      onClick={onCreateClick}
      sx={{
        bgcolor: 'background.paper',
        color: 'primary.main',
        borderColor: 'primary.main',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2,
          bgcolor: 'background.paper',
          borderColor: 'primary.main',
          color: 'primary.main',
        },
        '&:active': {
          transform: 'translateY(0) scale(0.97)',
        },
        alignSelf: { xs: 'flex-end', sm: 'center' },
      }}
    >
      Nuevo Kardex
    </Button>
  </Box>
);
