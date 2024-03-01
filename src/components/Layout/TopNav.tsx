import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Avatar, Badge, Stack, SvgIcon, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
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
  // const TOP_NAV_HEIGHT = 64;

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
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{
            marginLeft: isOpen ? 19 : 0,
            transition: "margin-left 0.3s ease-in-out",
            justifyContent: "space-between",
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <IconButton onClick={toggleSidebar}>
              <SvgIcon fontSize="small">
                <MenuIcon />
              </SvgIcon>
              <IconButton sx={{ marginLeft: 1 }}>
                <img
                  src={homelogo}
                  alt="Company Logo"
                  width="154px"
                  height="30px"
                />
              </IconButton>
            </IconButton>

            {/* <Tooltip title="Search">
            <IconButton>
              <SvgIcon fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip> */}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ position: "absolute", right: 0, marginRight: 0 }}
          >
            <Tooltip title="Contacts">
              <IconButton>
                <SvgIcon fontSize="small">{/* <UsersIcon /> */}</SvgIcon>
              </IconButton>
            </Tooltip>
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
