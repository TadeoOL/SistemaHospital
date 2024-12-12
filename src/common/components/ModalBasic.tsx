import { Box, Dialog, IconButton, styled } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FullscreenLoader } from './FullscreenLoader';
import DialogTitle from '@mui/material/DialogTitle';
import { CloseOutlined } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface ModalFormProps {
  open?: boolean;
  header?: string;
  children?: React.ReactNode;
  onClose?: Function;
  isLoading?: boolean;
  actions?: React.ReactNode;
  maxWidth?: any;
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
    <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: 20 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
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

export const ModalBasic = forwardRef(
  ({ open, isLoading, header, children, actions, onClose, maxWidth }: ModalFormProps, ref) => {
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

    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
      if (!innerOpen) {
        setShowLoader(false);
        return;
      }
      if (isLoading) {
        setShowLoader(true);
        return;
      }
      setTimeout(() => {
        setShowLoader(false);
      }, 200);
    }, [innerOpen, isLoading]);

    if (showLoader) {
      return <FullscreenLoader />;
    }

    return (
      <>
        <BootstrapDialog maxWidth={maxWidth} open={innerOpen || false} onClose={() => handleClose()}>
          <BootstrapDialogTitle onClose={handleClose}>{header}</BootstrapDialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <>{children}</>
          </DialogContent>
          <Box sx={{ pl: 2, pr: 1 }}>
            <DialogActions>{actions}</DialogActions>
          </Box>
        </BootstrapDialog>
      </>
    );
  }
);
