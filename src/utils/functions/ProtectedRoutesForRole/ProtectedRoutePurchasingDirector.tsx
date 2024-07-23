import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import { shallow } from 'zustand/shallow';
import { purchasingDirector } from '../../dataRoles';

interface ProtectedRoutesPurchasingDirectorProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export const ProtectedRoutePurchasingDirector = (props: ProtectedRoutesPurchasingDirectorProps) => {
  const { profile } = useAuthStore((state) => ({ profile: state.profile }), shallow);
  if (profile?.roles.some((role) => purchasingDirector.includes(role))) {
    return props.children ? <>{props.children}</> : <Outlet />;
  } else {
    return <Navigate to={'/'} />;
  }
};
