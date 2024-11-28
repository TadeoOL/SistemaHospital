import { useState, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { styled, useTheme, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// project import
import Avatar from './Avatar';
// import useAuth from '@/hooks/useAuth';

// assets
import RightOutlined from '@ant-design/icons/RightOutlined';
import avatar1 from '@/assets/profile.svg';
import { useLayoutStore } from '../stores/layoutStore';
import { useAuthStore } from '@/store/auth';
import { toast } from 'react-toastify';

interface ExpandMoreProps extends IconButtonProps {
  theme: Theme;
  expand: boolean;
  drawerOpen: boolean;
}

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'expand' && prop !== 'drawerOpen',
})(({ theme, expand, drawerOpen }: ExpandMoreProps) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
  marginLeft: 'auto',
  color: theme.palette.secondary.dark,
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  ...(!drawerOpen && {
    opacity: 0,
    width: 50,
    height: 50,
  }),
}));

// ==============================|| DRAWER - USER ||============================== //

export default function NavUser() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { drawerOpen } = useLayoutStore((s) => ({
    drawerOpen: s.drawerOpen,
  }));

  const { logout, profile } = useAuthStore((state) => ({
    logout: state.logout,
    profile: state.profile,
  }));

  const fullName = !profile ? null : `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`;
  const role = (() => {
    if (!profile) return null;
    if (profile.roles.includes('ADMIN')) return 'Administrador';
  })();

  // const { logout, user } = useAuth();
  const handleLogout = async () => {
    try {
      toast.success('Saliste de la sesion exitosamente!');
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid', borderTopColor: 'divider' }}>
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMore
              theme={theme}
              expand={open}
              drawerOpen={drawerOpen}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              aria-label="show more"
            >
              <RightOutlined style={{ fontSize: '0.625rem' }} />
            </ExpandMore>
          }
          sx={{ '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? -20 : -16 } }}
        >
          <ListItemAvatar>
            <Avatar alt="Avatar" src={avatar1} sx={{ ...(drawerOpen && { width: 46, height: 46 }) }} />
          </ListItemAvatar>
          <ListItemText primary={fullName} secondary={role} />
        </ListItem>
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout}>Cerrar sesion</MenuItem>
        {/* <MenuItem component={Link} to="/apps/profiles/user/personal" onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/apps/profiles/account/my-account" onClick={handleClose}>
          My account
        </MenuItem> */}
      </Menu>
    </Box>
  );
}
