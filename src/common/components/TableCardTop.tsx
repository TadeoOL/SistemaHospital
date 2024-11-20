import { Stack } from '@mui/material';

interface TableCardTopProps {
  children?: React.ReactNode;
}

export const TableTop = (props: TableCardTopProps) => {
  return (
    <>
      <Stack
        sx={{
          flexDirection: 'row',
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pb: 2,
          pt: 0,
        }}
      >
        <>{props.children}</>
      </Stack>
    </>
  );
};
