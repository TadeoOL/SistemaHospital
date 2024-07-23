import { IconButton, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IHeaderModal {
  title: string;
  setOpen: Function;
}

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

export const HeaderModal = (props: IHeaderModal) => {
  const { title, setOpen } = props;

  return (
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
      <IconButton onClick={() => setOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Header>
  );
};
