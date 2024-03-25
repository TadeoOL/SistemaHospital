import { Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

interface ISearchBar {
  searchState: Function;
  title: string;
  size?: 'small' | 'medium';
  sx?: any;
}
export const SearchBar = (props: ISearchBar) => {
  const { title, searchState, size, sx } = props;
  const [text, setText] = useState('');
  const handleChange = (event: any) => {
    setText(event.currentTarget.value);
    searchState(event.currentTarget.value);
    event.preventDefault();
  };

  return (
    <Box sx={{ px: 2, ...sx }}>
      <TextField
        fullWidth
        size={size ? size : 'medium'}
        placeholder={title}
        onChange={(e) => handleChange(e)}
        value={text}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        sx={{ maxWidth: 500 }}
      />
    </Box>
  );
};
