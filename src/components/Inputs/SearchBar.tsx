import { Box, IconButton, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { Clear } from '@mui/icons-material';

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
    event.preventDefault();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchState(text);
    }, 350);

    return () => clearTimeout(timer);
  }, [text]);

  const handleClear = () => {
    setText('');
    searchState('');
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
          endAdornment: text && (
            <IconButton onClick={handleClear}>
              <Clear />
            </IconButton>
          ),
        }}
        sx={{ maxWidth: 500, backgroundColor: 'white' }}
      />
    </Box>
  );
};
