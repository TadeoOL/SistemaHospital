import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box } from '@mui/material';

export const sortComponent = (tableCellLabel: string, headerName: string, setSortFunction: Function) => {
  return (
    <Box sx={{ flexDirection: 'row', display: 'flex' }}>
      {tableCellLabel}
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
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
    </Box>
  );
};
