import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface ISearchBar {
  searchState: Function;
  title: string;
}
export const SearchBar = (props: ISearchBar) => {
  const { title, searchState } = props;
  const [text, setText] = useState("");
  const handleChange = (event: any) => {
    setText(event.currentTarget.value);
    searchState(event.currentTarget.value);
    event.preventDefault();
  };

  return (
    <Box sx={{ px: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder={title}
        onChange={(e) => handleChange(e)}
        value={text}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
    </Box>
  );
};
