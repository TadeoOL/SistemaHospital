import { Box, Dialog, IconButton, Modal, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ModalLoader } from './ModalLoader';
import DialogTitle from '@mui/material/DialogTitle';
import { CloseOutlined } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1.25),
    paddingRight: theme.spacing(2),
  },
}));

function BootstrapDialogTitle({ children, onClose, ...other }: any) {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          color="secondary"
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
          }}
        >
          <CloseOutlined />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
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

  if (open && isLoading) {
    return <ModalLoader />;
  }

  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" open={innerOpen || false} onClose={() => handleClose()}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {header}
      </BootstrapDialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <>{children}</>
      </DialogContent>
    </BootstrapDialog>
  );
});
