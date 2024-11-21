import { Box, IconButton, Modal, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ModalLoader } from './ModalLoader';

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
  open?: boolean;
  header?: string;
  children?: React.ReactNode;
  onClose?: Function;
  isLoading?: boolean;
}

export const ModalComponent = forwardRef(({ open, isLoading, header, children, onClose }: ModalFormProps, ref) => {
  const [innerOpen, setOpen] = useState(open || false);

  useEffect(() => {
    setOpen(open || false);
  }, [open]);

  useImperativeHandle(ref, () => ({
    setOpen,
  }));

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  if (isLoading) {
    return <ModalLoader />;
  }

  return (
    <Modal open={innerOpen || false} onClose={() => handleClose()}>
      <div>
        <Box sx={style}>
          <Header
            sx={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: { xs: 0, sm: 10 },
              p: 1,
            }}
          >
            <Typography fontWeight={500} fontSize={20} color="common.white">
              {header}
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
