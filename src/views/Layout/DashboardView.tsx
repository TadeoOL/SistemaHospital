import { Box, Grid } from "@mui/material";
import React from "react";
import { SalesGraph } from "../../components/Dashboard/SalesGraph";
import { ModuleCards } from "../../components/Dashboard/ModuleCards";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SpaIcon from "@mui/icons-material/Spa";

export const DashboardView: React.FC = () => {
  return (
    <Box component="main" sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <ModuleCards
            title="Farmacia"
            value="$24k"
            icon={<LocalHospitalIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModuleCards
            title="Programacion"
            value="$8k"
            icon={<MonitorHeartIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModuleCards title="SAMII" value="$12k" icon={<SpaIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModuleCards
            title="Admision"
            value="$76k"
            icon={<SupervisorAccountIcon />}
          />
        </Grid>
        <Grid item xs={12}>
          <SalesGraph
            chartSeries={[
              {
                name: "This year",
                data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
              },
              {
                name: "Last year",
                data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
              },
            ]}
            sx={{ height: "100%" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
