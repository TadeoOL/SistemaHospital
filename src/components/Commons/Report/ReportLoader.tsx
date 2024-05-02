import { Box, Typography } from '@mui/material';
import './ReportLoader.css';

export const ReportLoader = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span className="loader" />;
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Cargando reportes...</Typography>
    </Box>
  );
};
