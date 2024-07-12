import { Stack } from '@mui/material';
import { DailyOperating } from '../../components/OperatingRoom/DailyOperating/DailyOperating';
import { DailyOperatingTabs } from '../../components/OperatingRoom/DailyOperating/DailyOperatingTabs';
import { useDailyOperatingTabNavStore } from '../../store/operatingRoom/dailyOperatingTabNav';
import { DailyOperatingHistory } from '../../components/OperatingRoom/DailyOperating/DailyOperatingHistory';

const DailyOperatingView = () => {
  const tabValue = useDailyOperatingTabNavStore((state) => state.tabValue);
  const VIEW: Record<number, JSX.Element> = {
    0: <DailyOperating />,
    1: <DailyOperatingHistory />,
  };
  return (
    <Stack>
      <DailyOperatingTabs />
      {VIEW[tabValue]}
    </Stack>
  );
};
export default DailyOperatingView;
