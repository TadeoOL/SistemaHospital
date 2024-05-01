import { Stack } from '@mui/material';
import { useSellsHistoryTabNavStore } from '../../store/pharmacy/sellsHistory/sellsHistoryTabNav';
import { SellsHistoryTabs } from '../../components/Pharmacy/SellsHistory/SellsHistoryTabs';
import { CheckoutCloseHistory } from '../../components/Pharmacy/SellsHistory/CheckoutCloseHistory';
import { SellsHistory } from '../../components/Pharmacy/SellsHistory/SellsHistory';

const returnSellHistoryView = (tab: number) => {
  switch (tab) {
    case 1:
      return <CheckoutCloseHistory />;
    case 2:
      return <SellsHistory />;
    default:
      break;
  }
};

const SellsHistoryView = () => {
  const tabValue = useSellsHistoryTabNavStore((state) => state.tabValue);
  return (
    <Stack>
      <SellsHistoryTabs />
      {returnSellHistoryView(tabValue)}
    </Stack>
  );
};

export default SellsHistoryView;
