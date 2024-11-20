import { Backdrop, Box, CircularProgress, IconButton, Modal, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useImperativeHandle, useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 600 },

  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
};

const style2 = {
  bgcolor: 'background.paper',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

const Header = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'baseline',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  background: 'rgba(255, 255, 255, 0.9)',
}));

interface ModalFormProps {
  title?: string;
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  setOpen: (open: boolean) => void;
}

export const ModalComponent = forwardRef(({ title, open, setOpen, children, onClose }: ModalFormProps, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    setIsLoading,
  }));

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Modal open={open || false} onClose={() => handleClose()}>
      <div>
        <Box sx={style}>
          <Header
            sx={{
              bgcolor: 'neutral.700',
              borderTopLeftRadius: 10,
              borderTopRightRadius: { xs: 0, sm: 10 },
              p: 1,
            }}
          >
            <Typography fontWeight={500} fontSize={20} color="common.white">
              {title}
            </Typography>
            <IconButton onClick={() => setOpen && setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Header>
          <Box sx={style2}>
            <>{children}</>
          </Box>
        </Box>
      </div>
    </Modal>
  );
});
