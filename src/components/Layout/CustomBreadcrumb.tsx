import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const CustomBreadcrumb = () => {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: 10 }}>
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center", color: "#24282c" }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: "18px" }} fontSize="inherit" />
          Módulo
        </Link>
        <Typography
          sx={{ display: "flex", alignItems: "center", color: "#24282c" }}
          color="text.primary"
        >
          <GrainIcon sx={{ mr: 0.5, fontSize: "18px" }} fontSize="inherit" />
          Procesos
        </Typography>
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumb;
