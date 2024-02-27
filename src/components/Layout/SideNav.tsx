import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import { Drawer, Stack, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import homeLogo from "../../assets/homeLogoHSB.svg";
import { useAppNavStore } from "../../store/appNav";
import { ModuleItems } from "../../utils/ModuleItems";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { useState } from "react";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface SideNavItemsProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  childrenItems?: ModuleItem[] | undefined;
  topLevel?: boolean;
}

interface ModuleItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  childrenItems?: ModuleItem[] | undefined;
}

export const SideNav = () => {
  const theme = useTheme();
  const isOpen = useAppNavStore((state) => state.open);
  const setIsOpen = useAppNavStore((state) => state.setOpen);
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const navigate = useNavigate();

  const SideNavItems: React.FC<SideNavItemsProps> = ({
    icon,
    title,
    path,
    childrenItems,
  }) => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const isActive = path === location.pathname;

    const handleClick = () => {
      if (childrenItems) {
        setOpen(!open);
        setIsOpen(!open);
      } else {
        setOpen(false);
        setIsOpen(false);
        navigate(path);
      }
    };

    const handleChildClick = (childPath: string) => {
      setOpen(false);
      setIsOpen(false);
      navigate(childPath);
    };

    return (
      <>
        <ListItemButton onClick={handleClick} selected={isActive}>
          <ListItemIcon>{icon}</ListItemIcon>
          {xlUp && <ListItemText primary={title} sx={{ display: "inline" }} />}
        </ListItemButton>
        {childrenItems && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {childrenItems.map((child, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleChildClick(child.path)}
                  selected={child.path === location.pathname}
                  sx={{ pl: 4, marginTop: 1, marginBottom: 1 }}
                >
                  <ListItemIcon>{child.icon}</ListItemIcon>
                  <ListItemText primary={child.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };
  return (
    <Drawer
      variant={xlUp ? "permanent" : "temporary"}
      anchor="left"
      onClose={() => {
        setIsOpen(false);
      }}
      open={xlUp ? true : isOpen}
      PaperProps={{
        sx: {
          backgroundColor: "#24282C",
          color: "common.white",
          width: xlUp ? (isOpen ? 230 : 80) : 230,
          transition: xlUp
            ? "width 0.3s ease-in-out"
            : "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
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
          // src={homeLogo}
          onClick={() => navigate("/")}
        />
      </DrawerHeader>
      <Divider sx={{ borderColor: "#24282C" }} />
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
          {ModuleItems.map((item, i) => (
            <SideNavItems
              key={i}
              icon={item.icon}
              title={item.title}
              path={item.path}
              childrenItems={item.childrenItems}
            />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
};
