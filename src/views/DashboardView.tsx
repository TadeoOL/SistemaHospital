import { Box } from "@mui/material";
import React from "react";
import { Layout } from "../components/Layout";

export const DashboardView: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ display: "flex", bgcolor: "lightgreen" }}>
        <h1>Dashboard</h1>
      </Box>
    </Layout>
  );
};
