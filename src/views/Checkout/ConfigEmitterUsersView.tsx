import { Container } from '@mui/material';
import { ConfigEmitterUsers } from '../../components/Checkout/Config/ConfigEmitterUsers';
import { ConfigDiscountUsers } from '../../components/Checkout/Config/ConfigDiscountUsers';
import { useGetUsersBySearch } from '../../hooks/useGetUsersBySearch';

const ConfigEmitterUsersView = () => {
  const { usersRes, isLoadingUsers } = useGetUsersBySearch();
  return (
    <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ConfigEmitterUsers usersRes={usersRes} />
      <ConfigDiscountUsers usersRes={usersRes} isLoadingUsers={isLoadingUsers} />
    </Container>
  );
};
export default ConfigEmitterUsersView;
