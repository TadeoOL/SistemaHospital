import { Stack } from '@mui/material';
import { NurseRequestTable } from '../../components/Pharmacy/UserRequest/NurseRequestTable';
//import { useUserRequestTabNavStore } from '../../store/pharmacy/userRequest/userRequestTabNav';
/*
const returnSellHistoryView = (tab: number) => {
  switch (tab) {
    case 1:
      return <NurseRequestTable />;
    default:
      break;
  }
};*/

const NurseRequestView = () => {
  return (
    <Stack>
      <NurseRequestTable />
    </Stack>
  );
};

export default NurseRequestView;
