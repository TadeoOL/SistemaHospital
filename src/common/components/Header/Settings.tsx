import { Box, Tooltip } from '@mui/material';
import IconButton from '@/components/@extended/IconButton';
import AnimateButton from '@/components/@extended/AnimateButton';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const navigate = useNavigate();

  const handleConfiguration = () => {
    navigate('/configuracion');
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="Configuración">
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: 'transparent' }}
          onClick={handleConfiguration}
          aria-label="settings toggler"
        >
          <AnimateButton type="rotate">
            <SettingOutlined />
          </AnimateButton>
        </IconButton>
      </Tooltip>
    </Box>
  );
};
