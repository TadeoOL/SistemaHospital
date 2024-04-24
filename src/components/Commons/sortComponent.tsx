import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box } from '@mui/material';
import { useState } from 'react';

interface SortComponentProps {
  tableCellLabel: string;
  headerName: string;
  setSortFunction: Function;
}

export const SortComponent = (props: SortComponentProps) => {
  const { tableCellLabel, headerName, setSortFunction } = props;
  const [sortDirection, setSortDirection] = useState(''); // Estado local para la dirección de ordenamiento

  const handleSortClick = () => {
    if (sortDirection === 'asc') {
      setSortFunction(`${headerName}Desc`);
      setSortDirection('desc');
    } else {
      setSortFunction(`${headerName}Asc`);
      setSortDirection('asc');
    }
  };

  return (
    <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
      {tableCellLabel}
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1, cursor: 'pointer' }}>
        <ArrowDropUpIcon onClick={handleSortClick} sx={{ mb: '-10px' }} />
        <ArrowDropDownIcon onClick={handleSortClick} />
      </Box>
    </Box>
  );
};
