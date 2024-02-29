import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import { Drawer, Stack, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Plug from "../../assets/Plug.svg";
import { useAppNavStore } from "../../store/appNav";
import { ModuleItems } from "../../utils/ModuleItems";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
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
  const SelectedOptionColor = "#2196f3";

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
      <List component="div" disablePadding>
        {open && (
          <ListItemButton
            sx={{
              "&.Mui-selected": { backgroundColor: SelectedOptionColor },
              pl: 2,
              mt: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary="Catálogos"
              sx={{ fontWeight: 600, display: "inline" }}
            />
          </ListItemButton>
        )}
        <ListItemButton
          onClick={handleClick}
          selected={isActive}
          sx={{
            "&.Mui-selected": { backgroundColor: SelectedOptionColor },
            pl: 2,
            mt: 1,
            mb: 1,
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            primary={title}
            sx={{
              fontWeight: 600,
              display: xlUp ? "inline" : "inline",
            }}
          />
        </ListItemButton>

        {open && (
          <>
            <ListItemButton
              onClick={() => handleChildClick(path)}
              selected={isActive}
              sx={{ pl: 4, mt: 1, mb: 1 }}
            >
              <ListItemText primary={title} sx={{ fontWeight: 600 }} />
            </ListItemButton>

            {childrenItems && (
              <>
                {childrenItems.map((child, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleChildClick(child.path)}
                    selected={child.path === location.pathname}
                    sx={{ pl: 4, mt: 1, mb: 1 }}
                  >
                    <ListItemIcon>{child.icon}</ListItemIcon>
                    <ListItemText primary={child.title} />
                  </ListItemButton>
                ))}
              </>
            )}
          </>
        )}
      </List>
    );
  };

  return (
    <Drawer
      variant={xlUp ? "permanent" : isOpen ? "permanent" : "temporary"}
      anchor="left"
      onClose={() => {}}
      PaperProps={{
        sx: {
          backgroundColor: "#24282C",
          color: "common.white",
          width: isOpen ? 230 : 80,
          transition: "width 0.3s ease-in-out",
        },
      }}
    >
      <DrawerHeader
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          sx={{
            p: 2,
            width: "140px",
            maxHeight: 100,
            objectFit: "contain",
            filter: "invert(1)",
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
          src={Plug}
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
