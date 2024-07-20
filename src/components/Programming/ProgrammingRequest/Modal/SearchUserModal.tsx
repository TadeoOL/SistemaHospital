import { Box, Button } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { SearchBar } from '../../../Inputs/SearchBar';
import { ProgrammingRequestTable } from '../ProgrammingRequestTable';
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
interface SearchUserModalProps {
  setOpen: Function;
  setValue: Function;
}
export const SearchUserModal = (props: SearchUserModalProps) => {
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Buscar usuario" />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <SearchBar searchState={() => {}} title="Buscar usuario..." />
        <ProgrammingRequestTable />
        <Box>
          <Button variant="contained" onClick={() => props.setValue(0)}>
            Regresar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
