// material-ui
// import { Theme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import NavUser from './NavUser';
// import NavCard from './NavCard';
import Navigation from './Navigation';
// import { useLayoutStore } from '../stores/layoutStore';
import SimpleBar from './SimpleBar';
import 'simplebar-react/dist/simplebar.min.css';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  // const { drawerOpen } = useLayoutStore((s) => ({
  //   drawerOpen: s.drawerOpen,
  // }));

  // const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column', height: '100%' } }}>
        <Navigation />
        {/* {drawerOpen && !downLG && <NavCard />} */}
      </SimpleBar>
      <NavUser />
    </>
  );
}
