import { Box, Card, Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { useProgrammingRequestTabNavStore } from '../../../store/programming/programmingRequestTabNav';
import { ProgrammingRequest } from './ProgrammingRequest';

const TAB_VIEW: Record<string, JSX.Element> = {
  programmingCalendar: <h1>Calendar</h1>,
  programmingRequest: <ProgrammingRequest />,
};
export const ProgrammingRequestTabNav = () => {
  const tabValue = useProgrammingRequestTabNavStore((state) => state.tabValue);
  const setTabValue = useProgrammingRequestTabNavStore((state) => state.setTabValue);
  const handleChange = useCallback((_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  }, []);

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue !== '' ? tabValue : 'programmingCalendar'} onChange={handleChange} variant="fullWidth">
          <Tab label="Calendario de programación" value={'programmingCalendar'} />
          <Tab label="Solicitudes de programación" value={'programmingRequest'} />
        </Tabs>
      </Box>
      {TAB_VIEW[tabValue]}
    </Card>
  );
};
