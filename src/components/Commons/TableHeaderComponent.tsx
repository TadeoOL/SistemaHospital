import { TableCell, TableHead, TableRow } from '@mui/material';

interface TableHeaderComponentProps {
  headers: string[];
}
export const TableHeaderComponent = (props: TableHeaderComponentProps) => {
  return (
    <TableHead>
      <TableRow>
        {props.headers.map((item, index) => {
          return <TableCell key={index}>{item}</TableCell>;
        })}
      </TableRow>
    </TableHead>
  );
};
