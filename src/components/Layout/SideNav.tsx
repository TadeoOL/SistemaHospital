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
  childrenItems?: string[] | undefined;
  topLevel?: boolean;
}

export const SideNav = () => {
  const theme = useTheme();
  const isOpen = useAppNavStore((state) => state.open);
  const setIsOpen = useAppNavStore((state) => state.setOpen);
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const navigate = useNavigate();
  const SelectedOptionColor = "#9ca1a5";

  const SideNavItems: React.FC<SideNavItemsProps> = ({
    icon,
    title,
    path,
    childrenItems,
  }) => {
    const location = useLocation();
    const isActive = childrenItems
      ? childrenItems.some((c) => c === location.pathname.split("/")[3])
      : path === location.pathname;

    const handleClick = () => {
      if (isActive) return;
      setIsOpen(false);
      navigate(path);
    };

    return (
      <ListItemButton
        onClick={handleClick}
        selected={isActive}
        sx={{
          "&.Mui-selected": { backgroundColor: SelectedOptionColor },
          "&:hover": { backgroundColor: "#373b3e", opacity: 2 },
          "&.Mui-selected:hover": { backgroundColor: SelectedOptionColor },
          borderRadius: 1,
          mb: 1,
          p: 1,
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {isOpen ? (
          <ListItemText
            primary={title}
            sx={{
              fontWeight: 600,
              display: "inline",
            }}
          />
        ) : null}
      </ListItemButton>
    );
  };

  return (
    <Drawer
      variant={xlUp ? "permanent" : isOpen ? "permanent" : "temporary"}
      anchor="left"
      onClose={() => {
        setIsOpen(false);
      }}
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
      <Divider sx={{ borderColor: "gray", my: 1 }} />
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
          <List component="div" disablePadding>
            {ModuleItems.map((item, i) => (
              <SideNavItems
                key={i}
                icon={item.icon}
                title={item.title}
                path={item.path}
                childrenItems={item.childrenItems}
              />
            ))}
          </List>
        </Stack>
      </Box>
    </Drawer>
  );
};
