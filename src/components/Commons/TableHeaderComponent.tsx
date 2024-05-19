import { TableCell, TableHead, TableRow } from '@mui/material';

interface TableHeaderComponentProps {
  Headers: string[];
}
export const TableHeaderComponent = (props: TableHeaderComponentProps) => {
  return (
    <TableHead>
      <TableRow>
        {props.Headers.map((item, index) => {
          return <TableCell key={index}>{item}</TableCell>;
        })}
      </TableRow>
    </TableHead>
  );
};
