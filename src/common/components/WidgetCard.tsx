import { MainCard } from './MainCard';
import { Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';

interface Props {
  top?: string;
  center?: string;
  bottom?: string;
  bottom2?: any;
  onClick?: () => void;
}

export default function WidgetCard({ top, center, bottom, bottom2, onClick }: Props) {
  return (
    <MainCard
      contentSX={{ height: '100%' }}
      sx={{
        height: '100%',
      }}
      {...(onClick && {
        onClick,
        sx: {
          cursor: 'pointer',
          height: '100%',
        },
      })}
    >
      <Stack sx={{ height: '100%' }} direction="row" spacing={1} alignItems="flex-end" justifyContent={'space-between'}>
        <Grid sx={{ height: '100%' }} container spacing={1.25} justifyContent={'space-between'}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent={'space-between'} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="subtitle1">{top}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Stack spacing={0.25}>
              <Typography variant="h5">{center}</Typography>
              <Typography variant="h5">{bottom}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Typography color="secondary">{bottom2}</Typography>
      </Stack>
    </MainCard>
  );
}
