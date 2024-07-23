import { Drawer, List, ListItem } from '@mui/material';
import { MensajeLogin } from '../Layout/Help/HelpMessage';

interface CustomSideBarProps {
  open: boolean;
  onClose: () => void;
}

const CustomSideBar: React.FC<CustomSideBarProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List sx={{ width: '616px' }}>
        <ListItem>
          <MensajeLogin />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default CustomSideBar;
