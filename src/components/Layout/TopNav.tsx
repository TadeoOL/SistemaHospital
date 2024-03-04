import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  Avatar,
  Badge,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";
import { useAppNavStore } from "../../store/appNav";
import { AccountPopover } from "./AccountPopover";
import { useAuthStore } from "../../store/auth";
import homelogo from "../../assets/homeLogoHSB.svg";

export const TopNav: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => {
  const profile = useAuthStore((state) => state.profile);
  const isOpen = useAppNavStore((state) => state.open);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const SIDE_NAV_WIDTH = 80;
  const theme = useTheme();
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            xl: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            xl: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
          height: 60,
          alignItems: "center",
          display: "flex",
          flex: 1,
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            marginLeft: !xlUp && isOpen ? 29 : isOpen ? 19 : 0,
            transition: "margin-left 0.3s ease-in-out",
            justifyContent: "space-between",
            flexDirection: "row",
            display: "flex",
            flex: 1,
          }}
        >
          <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
            <IconButton size="small" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Box component="img" src={homelogo} sx={{ height: 30 }} />
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              columnGap: 2,
              mr: 2,
            }}
          >
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={4} color="success" variant="dot">
                  <SvgIcon fontSize="small">
                    <NotificationsActiveIcon />
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={handleOpen}
              ref={anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
              }}
              src={profile?.imagenURL}
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};
