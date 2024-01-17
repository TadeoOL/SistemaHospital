import { Box } from "@mui/material";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderNavbar } from "../components/HeaderNavbar";

export const DashboardView = () => {
  return (
    <>
      <HeaderNavbar />
      <Box sx={{height:40}}/>
      <Box sx={{ display: "flex" }}>
        <SidebarNav />
        <h1>Dashboard</h1>
      </Box>
    </>
  );
};
