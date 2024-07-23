import { Outlet } from 'react-router-dom';
import { useGetPharmacyConfig } from '../hooks/useGetPharmacyConfig';
import LoadingView from '../views/LoadingView/LoadingView';
import { FirstTimePharmacy } from '../components/Pharmacy/Config/FirstTimePharmacy';
import { usePosTabNavStore } from '../store/pharmacy/pointOfSale/posTabNav';
import { useExistingArticleLotesPagination } from '../store/warehouseStore/existingArticleLotePagination';

interface PharmacyRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}
export const PharmacyRoute = (props: PharmacyRouteProps) => {
  const { children } = props;
  const { data, isLoading } = useGetPharmacyConfig();
  const setWarehouseIdConfig = usePosTabNavStore((state) => state.setWarehouseId);
  const setWarehouseId = useExistingArticleLotesPagination((state) => state.setWarehouseId);

  if (isLoading) return <LoadingView />;

  if (data.id_Almacen) {
    setWarehouseIdConfig(data.id_Almacen);
    setWarehouseId(data.id_Almacen);
    return children ? <>{children}</> : <Outlet />;
  } else {
    return <FirstTimePharmacy />;
  }
};
