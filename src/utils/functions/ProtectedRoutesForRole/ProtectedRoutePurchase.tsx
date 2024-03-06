import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { shallow } from "zustand/shallow";
import { purchaseRoles } from "../../dataRoles";

interface ProtectedRoutePurchaseProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export const ProtectedRoutePurchase = (props: ProtectedRoutePurchaseProps) => {
  const { profile } = useAuthStore(
    (state) => ({ profile: state.profile }),
    shallow
  );
  if (profile?.roles.some((role) => purchaseRoles.includes(role))) {
    return props.children ? <>{props.children}</> : <Outlet />;
  } else {
    return <Navigate to={"/"} />;
  }
};
