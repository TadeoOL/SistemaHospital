import { styled } from "@mui/material/styles";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Outlet } from "react-router-dom";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout: React.FC = () => {
  return (
    <>
      <TopNav />
      <SideNav />
      <LayoutRoot>
        <LayoutContainer>{<Outlet />}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};
