import Tooltip from '@mui/material/Tooltip';
import IconButton from '@/components/@extended/IconButton';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import { MainCard } from '../MainCard';
import { useState } from 'react';
import SimpleBar from '../Drawer/DrawerContent/SimpleBar';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';

export const HelpSideBar = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <Tooltip title="Ayuda">
          <IconButton
            color="secondary"
            variant="light"
            sx={{ color: 'text.primary', bgcolor: 'transparent' }}
            aria-label="fullscreen toggler"
            onClick={handleToggle}
          >
            {<QuestionCircleOutlined />}
          </IconButton>
        </Tooltip>
      </Box>
      <Drawer
        sx={{ zIndex: 2001 }}
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 340,
          },
        }}
      >
        {open && (
          <MainCard
            title="Ayuda"
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': {
                color: 'background.paper',
                bgcolor: 'primary.main',
                '& .MuiTypography-root': { fontSize: '1rem' },
              },
            }}
            content={false}
            secondary={
              <IconButton shape="rounded" size="small" onClick={handleToggle} sx={{ color: 'background.paper' }}>
                <CloseCircleOutlined style={{ fontSize: '1.15rem' }} />
              </IconButton>
            }
          >
            <SimpleBar
              sx={{
                height: 'calc(100vh - 70px)',
                '& .simplebar-content': { display: 'flex', flexDirection: 'column' },
              }}
            >
              <Box
                sx={{
                  '& .MuiAccordion-root': {
                    borderColor: 'divider',
                    '& .MuiAccordionSummary-root': { bgcolor: 'transparent', flexDirection: 'row', pl: 1 },
                    '& .MuiAccordionDetails-root': { border: 'none' },
                    '& .Mui-expanded': { color: 'primary.main' },
                  },
                }}
              >
                {/* ayuda */}
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};
