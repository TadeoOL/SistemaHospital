import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthStore } from "../store/authentication";

interface IProtectedRoute {
  redirecTo?: string;
}

export const ProtectedRoute: React.FC<IProtectedRoute> = ({
  redirecTo = "/login",
}) => {
  const isAuth = useIsAuthStore((state) => state.isAuth);

  if (isAuth) {
    return <Outlet />;
  } else {
    return <Navigate to={redirecTo} />;
  }
};
