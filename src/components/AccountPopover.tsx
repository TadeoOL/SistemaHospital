import { useCallback } from "react";
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IAccountPopover {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}
export const AccountPopover = (props: IAccountPopover) => {
  const { anchorEl, onClose, open } = props;
  const navigate = useNavigate();

  const handleSignOut = useCallback(() => {
    onClose?.();
    navigate("/login");
  }, [onClose, navigate]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        {/* <Typography color="text.secondary" variant="body2">
          Anika Visser
        </Typography> */}
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};
