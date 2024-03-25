import { CircularProgress, Grid } from '@mui/material';
import React from 'react';
import { SalesGraph } from '../../components/Dashboard/SalesGraph';
import { ModuleCards } from '../../components/Dashboard/ModuleCards';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SpaIcon from '@mui/icons-material/Spa';
import { getDashboardComponentForRole } from '../../utils/getDashboardComponentForRole';
import { useAuthStore } from '../../store/auth';

const DashboardView: React.FC = () => {
  const profile = useAuthStore((state) => state.profile);

  if (profile) {
    const DashboardComponent = getDashboardComponentForRole(profile.roles);
    return <DashboardComponent />;
  } else {
    return <CircularProgress />;
  }
};

export const DashboardAdminView = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} lg={3}>
        <ModuleCards title="Farmacia" value="$24k" icon={<LocalHospitalIcon />} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <ModuleCards title="Programación" value="$8k" icon={<MonitorHeartIcon />} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <ModuleCards title="SAMII" value="$12k" icon={<SpaIcon />} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <ModuleCards title="Admisión" value="$76k" icon={<SupervisorAccountIcon />} />
      </Grid>
      <Grid item xs={12}>
        <SalesGraph
          chartSeries={[
            {
              name: 'This year',
              data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
            },
            {
              name: 'Last year',
              data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardView;
