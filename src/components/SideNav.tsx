import { useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Collapse,
  useMediaQuery,
  Typography,
  colors,
  Drawer,
  Stack,
  SvgIcon,
  IconButton,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useAppNavStore } from "../store/appNav";
import { ModuleItems } from "../utils/ModuleItems";
import { useLocation, useNavigate } from "react-router-dom";
import { SideNavItems } from "./SideNavItems";
import homeLogo from "../assets/homeLogoHSB.svg";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const SideNav = () => {
  const theme = useTheme();
  // const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const isOpen = useAppNavStore((state) => state.dopen);
  const setIsOpen = useAppNavStore((state) => state.updateOpen);
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant={lgUp ? "permanent" : "temporary"}
      anchor="left"
      onClose={() => {
        setIsOpen(false);
      }}
      open={lgUp ? true : isOpen}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
    >
      <DrawerHeader
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          component="img"
          sx={{
            p: 2,
            maxWidth: 180,
            transition:
              "background-color 0.3s ease-in-out, border-radius 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: 1,
              cursor: "pointer",
              transition:
                "background-color 0.3s ease-in-out, border-radius 0.3s ease-in-out",
            },
          }}
          src={homeLogo}
          onClick={() => navigate("/")}
        />
      </DrawerHeader>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {ModuleItems.map((item, i) => {
            const isActive = item.path === location.pathname ? true : false;
            return (
              <SideNavItems
                active={isActive}
                childrenItems={item.childrenItems}
                disabled={false}
                icon={item.icon}
                path={item.path}
                title={item.title}
                key={i}
              />
            );
          })}
        </Stack>
      </Box>
    </Drawer>
  );
};
