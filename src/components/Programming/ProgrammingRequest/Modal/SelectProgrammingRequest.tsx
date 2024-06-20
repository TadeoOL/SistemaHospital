import { Close, PersonAdd, PersonSearch } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ProgrammingRegisterModal } from './ProgrammingRegisterModal';
import { SearchUserModal } from './SearchUserModal';
import { useEffect } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

const typographyStyle = {
  fontSize: { xs: 14, md: 20 },
  fontWeight: 700,
  color: 'rgba(0, 0, 0, 0.54)',
};

const iconStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  height: { md: 80, xs: 25 },
  width: { md: 80, xs: 25 },
};

const cardStyle = {
  width: { md: '100%', xs: '50%' },
  height: { md: 200, xs: 75 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  boxShadow: '5px 5px 5px 5px rgba(0,0,0,.1)',
  m: 2,
  cursor: 'pointer',
  p: 4,
  transition: '0.15s ease-in-out',
  '&:hover': {
    transition: '0.15s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    cursor: 'pointer',
    transform: 'scale(1.05)',
    boxShadow: '7px 7px 7px 7px rgba(0,0,0,.1)',
  },
};
interface MainMenuProgrammingRequestProps {
  setOpen: Function;
  setValue: Function;
}

export const SelectProgrammingRequest = (props: { setOpen: Function; setValue: Function; value: number }) => {
  const VIEW: Record<number, JSX.Element> = {
    0: <MainMenuProgrammingRequest setOpen={props.setOpen} setValue={props.setValue} />,
    1: <ProgrammingRegisterModal setOpen={props.setOpen} />,
    2: <SearchUserModal setOpen={props.setOpen} setValue={props.setValue} />,
  };

  useEffect(() => {
    return () => props.setValue(0);
  }, []);

  return VIEW[props.value];
};

const MainMenuProgrammingRequest = (props: MainMenuProgrammingRequestProps) => {
  return (
    <Box sx={style}>
      <Stack sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Selecciona una opción</Typography>
          <IconButton onClick={() => props.setOpen(false)}>
            <Close sx={{ top: 'auto', left: 'auto' }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
          }}
        >
          <Box
            sx={cardStyle}
            onClick={() => {
              props.setValue(1);
            }}
          >
            <PersonAdd sx={iconStyle} />
            <Typography sx={typographyStyle}>Registro</Typography>
          </Box>
          <Box
            sx={cardStyle}
            onClick={() => {
              props.setValue(2);
            }}
          >
            <PersonSearch sx={iconStyle} />
            <Typography sx={typographyStyle}>Re-ingreso</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
