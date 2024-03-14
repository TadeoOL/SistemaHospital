import { AuthorizationTabNav } from "../../components/Purchase/Authorization/AuthorizationTabNav";
import { useAuthorizationTabNav } from "../../store/purchaseStore/authorizationTabNav";
import { useShallow } from "zustand/react/shallow";
import { PurchaseAuthorization } from "../../components/Purchase/Authorization/Authorization/PurchaseAuthorization";
import { PurchaseHistoryAuthorization } from "../../components/Purchase/Authorization/AuthorizationHistory/PurchaseAuthorization";

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

export const PurchaseAuthorizationView = () => {
  return (
    <>
      <AuthorizationTabNav />
      {getTabView()}
    </>
  );
};
