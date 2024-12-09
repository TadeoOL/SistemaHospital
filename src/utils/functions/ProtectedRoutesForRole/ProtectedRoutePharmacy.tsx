import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import { shallow } from 'zustand/shallow';
import { nurseRole, pharmacyManager } from '../../dataRoles';

interface ProtectedRoutesSupplyProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export const ProtectedRoutePharmacyDirector = (props: ProtectedRoutesSupplyProps) => {
  const { profile } = useAuthStore((state) => ({ profile: state.profile }), shallow);
  if (profile?.roles.some((role) => pharmacyManager.includes(role))) {
    return props.children ? <>{props.children}</> : <Outlet />;
  } else {
    return <Navigate to={'/'} />;
  }
};

export const ProtectedRoutePharmacyNurse = (props: ProtectedRoutesSupplyProps) => {
  const { profile } = useAuthStore((state) => ({ profile: state.profile }), shallow);
  if (profile?.roles.some((role) => nurseRole.includes(role))) {
    return props.children ? <>{props.children}</> : <Outlet />;
  } else {
    return <Navigate to={'/'} />;
  }
};

export const ProtectedRoutePharmacyManager = (props: ProtectedRoutesSupplyProps) => {
  const { profile } = useAuthStore((state) => ({ profile: state.profile }), shallow);
  if (profile?.roles.some((role) => pharmacyManager.includes(role))) {
    return props.children ? <>{props.children}</> : <Outlet />;
  } else {
    return <Navigate to={'/'} />;
  }
};
