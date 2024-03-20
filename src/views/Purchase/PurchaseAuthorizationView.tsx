import { AuthorizationTabNav } from "../../components/Purchase/Authorization/AuthorizationTabNav";
import { useAuthorizationTabNav } from "../../store/purchaseStore/authorizationTabNav";
import { useShallow } from "zustand/react/shallow";
import { PurchaseHistoryAuthorization } from "../../components/Purchase/Authorization/AuthorizationHistory/PurchaseAuthorization";
import { PurchaseAuthorization } from "../../utils/LazyRoutes";

const getTabView = () => {
  const tabValue = useAuthorizationTabNav(
    useShallow((state) => state.tabValue)
  );

  switch (tabValue) {
    case 0:
      return <PurchaseAuthorization />;
    case 1:
      return <PurchaseHistoryAuthorization />;
  }
};

const PurchaseAuthorizationView = () => {
  return (
    <>
      <AuthorizationTabNav />
      {getTabView()}
    </>
  );
};
export default PurchaseAuthorizationView;
