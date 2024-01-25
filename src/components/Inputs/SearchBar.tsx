import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useUserPaginationStore } from "../../store/userPagination";

export const SearchBar = () => {
  const [text, setText] = useState("");
  const search = useUserPaginationStore((state) => state.searchPagination);
  const handleChange = (event: any) => {
    setText(event.currentTarget.value);
    search(event.currentTarget.value);
    event.preventDefault();
  };

  return (
    <Box sx={{ px: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="Busca al usuario..."
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
