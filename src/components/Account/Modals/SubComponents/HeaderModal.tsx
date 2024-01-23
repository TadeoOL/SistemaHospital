import { Box, IconButton, Typography, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IHeaderModal {
  title: string;
  setOpen: Function;
}

const Header = styled("div")(() => ({
  width: "100%",
  display: "flex",
  flex: 1,
  justifyContent: "space-between",
  alignItems: "baseline",
  position: "sticky",
  top: 0, // Sticky at the top
  zIndex: 100, // Ensuring it's on top
  background: "rgba(255, 255, 255, 0.9)", // Background color
  borderBottom: "1px solid #ccc", // Border for separation
  backdropFilter: "blur(10px)", // Adding a blur effect for transparency
}));

export const HeaderModal = (props: IHeaderModal) => {
  const { title, setOpen } = props;

  return (
    <Header
      sx={{
        bgcolor: "neutral.700",
        borderTopLeftRadius: 15,
        borderTopRightRadius: { xs: 0, lg: 15 },
        p: 1,
      }}
    >
      <Typography fontWeight={500} fontSize={20} color="common.white">
        {title}
      </Typography>
      <IconButton onClick={() => setOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Header>
  );
};
