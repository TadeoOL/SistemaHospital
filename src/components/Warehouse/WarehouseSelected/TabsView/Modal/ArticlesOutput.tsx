import {
  Box,
  Card,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380 },
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

interface ArticlesOutputProps {
  setOpen: Function;
}
const articles = [{ id: 1, nombre: 'aaa', cantidad: 22 }];
export const ArticlesOutput = (props: ArticlesOutputProps) => {
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Salida de artículos" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Stack spacing={2}>
          <Stack>
            <Typography>Búsqueda de artículos</Typography>
            <TextField placeholder="Artículos" />
          </Stack>
          <Stack>
            <Typography>Cantidad</Typography>
            <TextField placeholder="Cantidad" />
          </Stack>
          <ArticlesTable articles={articles} />
        </Stack>
      </Box>
    </Box>
  );
};
interface ArticlesTableProps {
  articles: any[];
}
const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles }) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del articulo</TableCell>
              <TableCell>Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <ArticlesTableRow articles={articles} />
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

interface ArticlesTableRowProps {
  articles: any[];
}
const ArticlesTableRow: React.FC<ArticlesTableRowProps> = ({ articles }) => {
  return (
    <React.Fragment>
      {articles.map((a) => (
        <React.Fragment key={a.id}>
          <TableRow>
            <TableCell>{a.nombre}</TableCell>
            <TableCell>{a.cantidad}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} sx={{ padding: 0 }}>
              <NestedArticlesTable articles={articles} open={true} />
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
interface NestedArticlesTableProps {
  articles: any[];
  open: boolean;
}
const NestedArticlesTable: React.FC<NestedArticlesTableProps> = ({ open }) => {
  return (
    <Collapse in={open}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={'50%'}>Cantidad</TableCell>
            <TableCell width={'50%'}>Fecha de Caducidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell width={'50%'}>1</TableCell>
            <TableCell width={'50%'}>24-12-2025</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Collapse>
  );
};
