import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface ArticlesTableProps {
  articles: any[];
}

export const ArticlesTable = ({ articles }: ArticlesTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Articulo</TableCell>
          <TableCell align="center">Cantidad</TableCell>
          <TableCell align="center">Precio</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {articles?.map((article) => (
          <TableRow key={article.id_OrdenCompraArticulo}>
            <TableCell align="center">{article.nombre}</TableCell>
            <TableCell align="center">{article.cantidad}</TableCell>
            <TableCell align="center">{article.precioProveedor}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
