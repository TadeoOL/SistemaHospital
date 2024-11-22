import { Backdrop, CircularProgress } from '@mui/material';

export const FullscreenLoader = () => {
  return (
    <Backdrop sx={{ zIndex: 10000 }} open>
      <CircularProgress />
    </Backdrop>
  );
};
