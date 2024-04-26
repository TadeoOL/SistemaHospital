import { Navigate, Outlet } from 'react-router-dom';
import { useGetPharmacyConfig } from '../hooks/useGetPharmacyConfig';
import LoadingView from '../views/LoadingView/LoadingView';
import { FirstTimePharmacy } from '../components/Pharmacy/Config/FirstTimePharmacy';

interface PharmacyRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}
export const PharmacyRoute = (props: PharmacyRouteProps) => {
  const { children } = props;
  const { data, isLoading } = useGetPharmacyConfig();
  if (isLoading) return <LoadingView />;

  if (data.id) {
    return children ? <>{children}</> : <Outlet />;
  } else {
    return <FirstTimePharmacy />;
  }
};
