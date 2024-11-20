import { Box } from '@mui/material';

interface TableCardProps {
  children?: React.ReactNode;
}
export const TableCard = (props: TableCardProps) => {
  const { children } = props;
  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          overflowX: 'auto',
          bgcolor: 'white',
        }}
      >
        <Box
          sx={{
            minWidth: { xs: 950, xl: 0 },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};
