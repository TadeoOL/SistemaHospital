import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import {
  Collapse,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Plug from "../../assets/Plug.svg";
import { useAppNavStore } from "../../store/appNav";
import { ModuleItems } from "../../utils/ModuleItems";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import { useAuthStore } from "../../store/auth";
import { useShallow } from "zustand/react/shallow";
import { IModuleItems } from "../../types/types";

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
  children?: IModuleItems[];
  topLevel?: boolean;
}

export const SideNav = () => {
  const theme = useTheme();
  const isOpen = useAppNavStore(useShallow((state) => state.open));
  const setIsOpen = useAppNavStore(useShallow((state) => state.setOpen));
  const xlUp = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();
  const SelectedOptionColor = "#9ca1a5";
  const profile = useAuthStore(useShallow((state) => state.profile));
  const [selectedTopLevel, setSelectedTopLevel] = useState<string | null>(null);
  const [childOpen, setChildOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) setChildOpen(false);
  }, [isOpen]);

  const SideNavItems: React.FC<SideNavItemsProps> = ({
    icon,
    title,
    path,
    children,
  }) => {
    const location = useLocation();
    const isActive = children
      ? children.some((child) => child.path === location.pathname)
      : path === location.pathname;

    const handleClick = () => {
      if (isActive && !children) return;
      if (!children) {
        setSelectedTopLevel(selectedTopLevel === title ? null : title);
        setIsOpen(false);
        navigate(path);
      } else {
        if (isOpen) {
          setChildOpen(!childOpen);
        } else {
          setIsOpen(true);
          setChildOpen(!childOpen);
        }
      }
    };

    return (
      <>
        <ListItemButton
          onClick={handleClick}
          selected={isActive}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "#046DBD",
              width: isOpen ? "100%" : "40px",
            },
            "&:hover": {
              backgroundColor: "#373b3e",
              opacity: 10,
              width: isOpen ? "100%" : "40px",
            },
            "&.Mui-selected:hover": { backgroundColor: SelectedOptionColor },
            borderRadius: 1,
            mb: 1,
            p: 1,
          }}
        >
          <ListItemIcon sx={{ mr: 1 }}>{icon}</ListItemIcon>
          {isOpen ? (
            <Typography
              variant="body1"
              sx={{
                display: "inline",
              }}
            >
              {title}
            </Typography>
          ) : null}
        </ListItemButton>
        {children && (
          <Collapse in={childOpen} unmountOnExit>
            {children.map((childItem) => {
              const pathSplit = location.pathname.split("/");
              const childSplit = childItem.path.split("/");
              const isActive = pathSplit.includes(childSplit[2]);
              return (
                <>
                  <ListItemButton
                    onClick={() => {
                      setIsOpen(false);
                      navigate(childItem.path);
                    }}
                    selected={isActive}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "rgba(4, 109, 189, 0.7)",
                        opacity: 1,
                      },
                      "&:hover": {
                        backgroundColor: "#373b3e",
                        opacity: 1,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: SelectedOptionColor,
                      },
                      borderRadius: 1,
                      mb: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    <ListItemIcon sx={{ mr: 1 }}>{childItem.icon}</ListItemIcon>
                    {isOpen ? (
                      <Typography
                        variant="body1"
                        sx={{
                          display: "inline",
                        }}
                      >
                        {childItem.title}
                      </Typography>
                    ) : null}
                  </ListItemButton>
                </>
              );
            })}
          </Collapse>
        )}
      </>
    );
  };

  const filteredItems = ModuleItems.filter((item) => {
    const isMainDashboard =
      item.mainDashboard &&
      profile?.roles.some((role) => {
        if (item.mainDashboard) {
          return item.mainDashboard.includes(role);
        }
        return false;
      });
    const hideCatalogsForAbastecimiento =
      item.title === "Catálogos" && profile?.roles.includes("DIRECTORCOMPRAS");

    return (
      !isMainDashboard &&
      !hideCatalogsForAbastecimiento &&
      (!item.protectedRoles ||
        item.protectedRoles.some((role) => profile?.roles.includes(role)))
    );
  });

  return (
    <>
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}
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
            transition: "width 0.2s ease-in-out",
            borderRight: isOpen ? "none" : "1px solid transparent",
            overflowX: "hidden",
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
              {filteredItems.map((item, i) => (
                <React.Fragment key={`${item.path}-${i}`}>
                  <SideNavItems
                    icon={item.icon}
                    title={item.title}
                    path={item.path}
                    children={item.children}
                  />
                </React.Fragment>
              ))}
            </List>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
