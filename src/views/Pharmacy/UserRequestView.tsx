import { Stack } from '@mui/material';
import { useUserRequestTabNavStore } from '../../store/pharmacy/userRequest/userRequestTabNav';
import { UserRequest } from '../../components/Pharmacy/UserRequest/UserRequest';
import { UserRequestTabs } from '../../components/Pharmacy/UserRequest/UserRequestTabs';

const returnSellHistoryView = (tab: number) => {
  switch (tab) {
    case 1:
      return <UserRequest />;
    default:
      break;
  }
};

const SellsHistoryView = () => {
  const tabValue = useUserRequestTabNavStore((state) => state.tabValue);
  return (
    <Stack>
      <UserRequestTabs />
      {returnSellHistoryView(tabValue)}
    </Stack>
  );
};

export default SellsHistoryView;
