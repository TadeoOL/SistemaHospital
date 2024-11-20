import { Stack } from '@mui/material';

interface TableCardTopProps {
  children?: React.ReactNode;
}

export const TableCardTop = (props: TableCardTopProps) => {
  return (
    <>
      <Stack
        sx={{
          flexDirection: 'row',
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          pt: 3,
        }}
      >
        {props.children}
      </Stack>
    </>
  );
};
