import { Box } from '@mui/material';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@/components/@extended/IconButton';
import BellOutlined from '@ant-design/icons/BellOutlined';

export const Notification = () => {
  const handleToggle = () => {};

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="Notificaciones">
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: 'transparent' }}
          aria-label="fullscreen toggler"
          onClick={handleToggle}
        >
          {<BellOutlined />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
