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
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";
import { useAppNavStore } from "../store/appNav";
import { AccountPopover } from "./AccountPopover";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

export const TopNav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const setIsOpen = useAppNavStore((state) => state.updateOpen);
  const isOpen = useAppNavStore((state) => state.dopen);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const SIDE_NAV_WIDTH = 280;
  const TOP_NAV_HEIGHT = 64;

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
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <SvgIcon fontSize="small">
                  <MenuIcon />
                </SvgIcon>
              </IconButton>
            )}
            {/* <Tooltip title="Search">
            <IconButton>
              <SvgIcon fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip> */}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
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
              src="https://scontent.fhmo6-1.fna.fbcdn.net/v/t39.30808-6/357450228_3523544011215527_1530865870225418180_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeG8YpH1idFJH9LefjczwJoqamPmEpT-c8VqY-YSlP5zxZ5x1STkcRlTusAmbvOn_Dg&_nc_ohc=eyOFIVGqebkAX-1blHh&_nc_ht=scontent.fhmo6-1.fna&oh=00_AfAIAuJvdGayqm-EjzGFr9WZPxxTOTsjyF_BENr4ISo90A&oe=65AF2FF7"
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
