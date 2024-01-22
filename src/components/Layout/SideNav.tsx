import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import { Drawer, Stack, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import homeLogo from "../../assets/homeLogoHSB.svg";
import { useAppNavStore } from "../../store/appNav";
import { ModuleItems } from "../../utils/ModuleItems";
import { SideNavItems } from "./SideNavItems";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export const SideNav = () => {
  const theme = useTheme();
  const isOpen = useAppNavStore((state) => state.open);
  const setIsOpen = useAppNavStore((state) => state.setOpen);
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
          backgroundColor: "info.darkest",
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
