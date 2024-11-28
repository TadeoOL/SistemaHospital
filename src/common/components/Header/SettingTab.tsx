import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = '') => {
  //   setSelectedIndex(index);

  //   if (route && route !== '') {
  //     navigate(route);
  //   }
  // };

  useEffect(() => {
    const pathToIndex: { [key: string]: number } = {
      '/apps/profiles/account/settings': 1,
    };

    setSelectedIndex(pathToIndex[location.pathname] ?? undefined);
  }, [location.pathname]);

  const handleConfiguration = () => {
    navigate('/configuracion');
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* <Link underline="none" sx={{ color: 'inherit' }} target="_blank" href="https://codedthemes.support-hub.io/">
        <ListItemButton selected={selectedIndex === 0} onClick={(event: React.MouseEvent<HTMLDivElement>) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItemButton>
      </Link>
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => handleListItemClick(event, 1, '/apps/profiles/account/settings')}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Account Settings" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={(event: React.MouseEvent<HTMLDivElement>) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Privacy Center" />
      </ListItemButton>
      <Link underline="none" style={{ color: 'inherit' }} target="_blank" href="https://codedthemes.support-hub.io/">
        <ListItemButton selected={selectedIndex === 3} onClick={(event: React.MouseEvent<HTMLDivElement>) => handleListItemClick(event, 3)}>
          <ListItemIcon>
            <CommentOutlined />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItemButton>
      </Link> */}
      <ListItemButton selected={selectedIndex === 4} onClick={handleConfiguration}>
        <ListItemIcon>
          <UnorderedListOutlined />
        </ListItemIcon>
        <ListItemText primary="Configuracion" />
      </ListItemButton>
    </List>
  );
}
