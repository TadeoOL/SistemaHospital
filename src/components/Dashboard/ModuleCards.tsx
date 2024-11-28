import { MainCard } from '@/common/components';
import { Avatar, Card, CardContent, SvgIcon, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

interface IModuleCards {
  sx?: any;
  value: string;
  title: string;
  icon: any;
}

export const ModuleCards = (props: IModuleCards) => {
  const { sx, value, title, icon } = props;

  return (
    <>
      <MainCard content={false}>
        <Box sx={{ p: 2.25 }}>
          <Stack spacing={0.5} direction="row" alignItems="flex-start" justifyContent="space-between">
            <Stack>
              <Typography variant="h6" color="text.secondary">
                {title.toUpperCase()}
              </Typography>
              <Stack direction="row" alignItems="center">
                <Typography variant="h4" color="inherit">
                  {value}
                </Typography>
              </Stack>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: 'error.main',
                height: 56,
                width: 56,
              }}
            >
              <SvgIcon>{icon}</SvgIcon>
            </Avatar>
          </Stack>
        </Box>
      </MainCard>
    </>
  );
};
