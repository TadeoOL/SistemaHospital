import { TableCell, TableHead, TableRow } from '@mui/material';

interface TableHeaderComponentProps {
  headers: string[];
  align?: 'left' | 'center' | 'right';
}
export const TableHeaderComponent = (props: TableHeaderComponentProps) => {
  return (
    <TableHead>
      <TableRow>
        {props.headers.map((item, index) => {
          return (
            <TableCell key={index} align={props.align}>
              {item}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
