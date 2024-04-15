import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box } from '@mui/material';

export const sortComponent = (headerName: string, setSortFunction: Function) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1, bgcolor: 'red' }}>
      <ArrowDropUpIcon
        onClick={() => {
          setSortFunction(`${headerName}Asc`);
        }}
      />
      <ArrowDropDownIcon
        onClick={() => {
          setSortFunction(`${headerName}Desc`);
        }}
      />
    </Box>
  );
};
