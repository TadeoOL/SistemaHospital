import { AccountCard } from '../components/Account/AccountCard';
import { AccountAdminUsers } from '../components/Account/AccountAdminUsers';
import { useAuthStore } from '../store/auth';

const AccountView = () => {
  const user = useAuthStore((state) => state.profile);
  const isAdmin = user?.roles.find((role) => role === 'ADMIN');
  return (
    <>
      <AccountCard />
      {isAdmin ? <AccountAdminUsers /> : null}
    </>
  );
};
export default AccountView;
