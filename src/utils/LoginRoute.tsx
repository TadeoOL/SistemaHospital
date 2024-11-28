import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface IProtectedRoute {
  redirecTo?: string;
  children?: React.ReactNode;
}

export const LoginRoute: React.FC<IProtectedRoute> = ({ redirecTo = '/inicio', children }) => {
  const isAuth = useAuthStore((state) => state.isAuth);

  if (isAuth) return <Navigate to={redirecTo} />;

  return children ? <>{children}</> : <Outlet />;
};
