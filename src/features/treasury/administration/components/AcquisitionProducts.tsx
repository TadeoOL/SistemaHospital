import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FundProjectionScreenOutlined from '@ant-design/icons/FundProjectionScreenOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import { MainCard } from '@/common/components';
import Avatar from '@/common/components/Drawer/DrawerContent/Avatar';
import AcquisitionChart from './AcquisitionGraph';

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

export default function AcquisitionProducts() {
  return (
    <MainCard content={false} title="Acquisition Products">
      <Stack>
        <Box>
          <AcquisitionChart />
        </Box>

        <List
          component="nav"
          sx={{
            p: 0,
            '& .MuiListItemButton-root': {
              py: 1.5,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
            },
          }}
        >
          <ListItemButton divider>
            <ListItemAvatar>
              <Avatar sx={{ color: 'grey.900', bgcolor: 'grey.200' }}>
                <FundProjectionScreenOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1">Top Channels</Typography>}
              secondary="Today, 2:00 AM"
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="subtitle1" noWrap>
                  + $1,430
                </Typography>
                <Typography variant="h6" color="secondary" noWrap>
                  35%
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemAvatar>
              <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                <FileTextOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="subtitle1">Top Pages</Typography>} secondary="Today 6:00 AM" />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="subtitle1" noWrap>
                  - $1430
                </Typography>
                <Typography variant="h6" color="secondary" noWrap>
                  35%
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
        </List>
      </Stack>
    </MainCard>
  );
}
