// import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Box from '@mui/material/Box';

// project import
// import Search from './Search';
// import Message from './Message';
import Profile from './Profile';
import { Box } from '@mui/material';
import { HelpSideBar } from './HelpSideBar';
import FullScreen from './Fullscreen';
import { Notification } from './Notification';
import { Settings } from './Settings';
// import Localization from './Localization';
// import Notification from './Notification';
// import FullScreen from './FullScreen';
// import Customization from './Customization';
// import MobileSection from './MobileSection';
// import MegaMenuSection from './MegaMenuSection';

// import useConfig from 'hooks/useConfig';
// import { MenuOrientation } from 'config';
// import DrawerHeader from 'layout/Dashboard/Drawer/DrawerHeader';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  //   const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  //   const localization = useMemo(() => <Localization />, []);

  //   const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
      {/* {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />} */}
      {/* {!downLG && <Search />} */}
      {/* {!downLG && megaMenu} */}
      {/* {downLG && <Box sx={{ width: '100%', ml: 1 }} />} */}
      {/* {!downLG && localization} */}
      <Box sx={{ width: '100%', ml: 1 }} />

      {/* <Notification /> */}
      {/* <Message /> */}
      {!downLG && <HelpSideBar />}
      {!downLG && <Notification />}
      {!downLG && <FullScreen />}
      {!downLG && <Settings />}
      {!downLG && <Profile />}
      {/* {downLG && <MobileSection />} */}
    </>
  );
}
