import { styled } from "@mui/material/styles";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Outlet } from "react-router-dom";
import { useAppNavStore } from "../../store/appNav";
import CustomBreadcrumb from "./CustomBreadcrumb";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  marginLeft: useAppNavStore((state) => state.open) ? SIDE_NAV_WIDTH : 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up("xl")]: {
    marginLeft: SIDE_NAV_WIDTH,
  },
}));

export const Layout: React.FC = () => {
  const isOpen = useAppNavStore((state) => state.open);
  const setIsOpen = useAppNavStore((state) => state.setOpen);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>(location.pathname);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <TopNav toggleSidebar={toggleSidebar} currentPage={currentPage} />
      <SideNav />
      <LayoutRoot>
        <LayoutContainer>
          {
            <>
              <CustomBreadcrumb />
              <Outlet />
            </>
          }
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
