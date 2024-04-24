import {
  Box,
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 800, lg: 900 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

// const scrollBarStyle = {
//   '&::-webkit-scrollbar': {
//     width: '0.4em',
//   },
//   '&::-webkit-scrollbar-track': {
//     boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
//     webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: 'rgba(0,0,0,.1)',
//     outline: '1px solid slategrey',
//   },
// };

const articles = [{ id: 1, nombre: 'pene', cantidad: 2, codigoBarras: '12312', fechaCaducidad: '12-12-2090' }];
interface CloseSaleRegisterModalProps {
  setOpen: Function;
}
export const CloseSaleRegisterModal = (props: CloseSaleRegisterModalProps) => {
  return (
    <Box sx={style}>
      <HeaderModal title="Cierre de caja" setOpen={props.setOpen} />
      <Stack sx={{ bgcolor: 'background.paper', p: 4 }}>
        <Typography>Artículos vendidos</Typography>
        <ArticlesSoldTable articles={articles} />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          px: 4,
          py: 2,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained">Aceptar</Button>
      </Box>
    </Box>
  );
};

interface ArticlesSoldTableProps {
  articles: any[];
}
const ArticlesSoldTable = (props: ArticlesSoldTableProps) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <ArticlesSoldTableHead />
          <ArticlesSoldTableBody articles={props.articles} />
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={3}
        onPageChange={() => {}}
        onRowsPerPageChange={(e: any) => {}}
        page={1}
        rowsPerPage={2}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
      />
    </Card>
  );
};

const ArticlesSoldTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Nombre</TableCell>
        <TableCell>Cantidad</TableCell>
        <TableCell>Codigo de barras</TableCell>
        <TableCell>Fecha de caducidad</TableCell>
      </TableRow>
    </TableHead>
  );
};
interface ArticlesSoldTableBodyProps {
  articles: any[];
}
const ArticlesSoldTableBody = (props: ArticlesSoldTableBodyProps) => {
  return (
    <TableBody>
      {props.articles.map((article) => (
        <ArticlesSoldRow key={article.id} article={article} />
      ))}
    </TableBody>
  );
};

interface ArticlesSoldRowProps {
  article: any;
}
const ArticlesSoldRow = (props: ArticlesSoldRowProps) => {
  const { article } = props;
  return (
    <TableRow>
      <TableCell>{article.nombre}</TableCell>
      <TableCell>{article.cantidad}</TableCell>
      <TableCell>{article.codigoBarras}</TableCell>
      <TableCell>{article.fechaCaducidad}</TableCell>
    </TableRow>
  );
};
