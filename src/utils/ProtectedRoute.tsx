import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { jwtDecode } from "jwt-decode";

interface IProtectedRoute {
  redirectTo?: string;
  children?: React.ReactNode;
}

const isTokenExpired = (token: any) => {
  if (!token || !token.exp) {
    return true;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return token.exp < currentTimeInSeconds;
};

export const ProtectedRoute: React.FC<IProtectedRoute> = ({
  redirectTo = "/login",
  children,
}) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const tokenInfo = jwtDecode(token);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token) {
        if (isTokenExpired(tokenInfo)) {
          logout();
          navigate(redirectTo);
        }
      }
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [token, location]);

  if (!isAuth) return <Navigate to={redirectTo} />;

  return children ? <>{children}</> : <Outlet />;
};
