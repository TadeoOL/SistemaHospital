import { Avatar, Card, CardContent, SvgIcon, Typography } from '@mui/material';
import { Stack } from '@mui/system';

interface IModuleCards {
  sx?: any;
  value: string;
  title: string;
  icon: any;
}

export const ModuleCards = (props: IModuleCards) => {
  const { sx, value, title, icon } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
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
      </CardContent>
    </Card>
  );
};
