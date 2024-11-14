import { Box, Paper, Typography } from '@mui/material';
import { IPatientKardex } from '../../../types/nursing/nursingTypes';

interface StatCardProps {
  value: number;
  label: string;
  gradient: string;
}

const StatCard = ({ value, label, gradient }: StatCardProps) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      textAlign: 'center',
      background: gradient,
      borderRadius: 2,
      color: '#fff',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-3px)',
      },
    }}
  >
    <Typography variant="h4">{value}</Typography>
    <Typography>{label}</Typography>
  </Paper>
);

interface KardexStatsProps {
  data: IPatientKardex[] | undefined;
}

export const KardexStats = ({ data }: KardexStatsProps) => {
  const totalKardex = data?.length || 0;
  const totalMedicamentos = data?.reduce((acc, curr) => acc + curr.medicamentos.length, 0) || 0;
  const totalServicios = data?.reduce((acc, curr) => acc + curr.servicios.length, 0) || 0;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr',
        },
        gap: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 2 },
      }}
    >
      <StatCard value={totalKardex} label="Total Kardex" gradient="linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)" />
      <StatCard
        value={totalMedicamentos}
        label="Total Medicamentos"
        gradient="linear-gradient(135deg, #1976d2 0%, #2196f3 100%)"
      />
      <StatCard
        value={totalServicios}
        label="Total Servicios"
        gradient="linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)"
      />
    </Box>
  );
};
