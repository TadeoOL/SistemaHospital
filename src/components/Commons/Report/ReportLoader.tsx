import { Box, Typography } from '@mui/material';
import './ReportLoader.css';

interface ReportLoaderProps {
  title?: string;
}
export const ReportLoader = ({ title }: ReportLoaderProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span className="loader" />;
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'white' }}>
        {title ? title : 'Cargando reportes...'}
      </Typography>
    </Box>
  );
};
