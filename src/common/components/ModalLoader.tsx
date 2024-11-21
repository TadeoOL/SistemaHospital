import { Backdrop, CircularProgress } from '@mui/material';

export const ModalLoader = () => {
  return (
    <Backdrop sx={{ zIndex: 10000 }} open>
      <CircularProgress />
    </Backdrop>
  );
};
