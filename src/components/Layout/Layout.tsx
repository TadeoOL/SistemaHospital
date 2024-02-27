import { styled, useTheme } from "@mui/material/styles";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useAppNavStore } from "../../store/appNav";

const SIDE_NAV_WIDTH = 110;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  [theme.breakpoints.up("xl")]: {
    marginLeft: 0,
  },
}));

const LayoutContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up("xl")]: {
    marginLeft: SIDE_NAV_WIDTH,
  },
}));

const FixedTopNav = styled(TopNav)(({ theme }) => ({
  position: "fixed",
  width: "100%",
  zIndex: theme.zIndex.drawer + 2, // Asegurémonos de que esté por encima del SideNav
}));

export const Layout: React.FC = () => {
  const theme = useTheme();
  const isOpen = useAppNavStore((state) => state.open);
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

  const SidebarContainer = styled("div")(({ theme }) => ({
    width: xlUp ? (isOpen ? SIDE_NAV_WIDTH : 0) : SIDE_NAV_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
  }));

  return (
    <>
      <FixedTopNav />
      <SidebarContainer theme={theme}>
        <SideNav />
      </SidebarContainer>
      <LayoutRoot>
        <LayoutContainer>{<Outlet />}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};
