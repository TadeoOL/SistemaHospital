import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useGetSells } from '../../../hooks/useGetSells';
import { IArticleSell, ISell } from '../../../types/types';
import { Cancel, CheckCircle, ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { error, success } from '../../../theme/colors';
import { changeSellStatus } from '../../../services/pharmacy/pointOfSaleService';
import { toast } from 'react-toastify';
import { usePosSellsDataStore } from '../../../store/pharmacy/pointOfSale/posSellsData';
import { getSellType } from '../../../utils/pointOfSaleUtils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 0.8),
    fontWeight: 'bold',
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
  },
  [`&.${tableCellClasses.root}`]: {
    width: '33.33%',
  },
}));

interface SellsTableProps {
  sells: ISell[];
}

interface SellTableBodyProps {
  sells: ISell[];
}

interface SellRowProps {
  sell: ISell;
}

interface ArticlesSoldTableProps {
  articles: IArticleSell[];
}

interface ArticlesSoldTableBodyProps {
  articles: IArticleSell[];
}

interface ArticlesSoldTableRowProps {
  article: IArticleSell;
}

export const AuthArticlesSold = () => {
  const sellStates = [1];
  const { sells, isLoading } = useGetSells(sellStates);

  if (isLoading)
    return (
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          p: 4,
          alignItems: 'center',
          columnGap: 1.5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4">Cargando ventas...</Typography>
        <CircularProgress size={30} />
      </Box>
    );
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 4 }}>
      <SellsTable sells={sells as ISell[]} />
    </Box>
  );
};

const SellsTable = (props: SellsTableProps) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <SellTableHead />
          <SellTableBody sells={props.sells} />
        </Table>
      </TableContainer>
      {props.sells.length === 0 && (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1, p: 6, color: 'gray' }}
        >
          <Info sx={{ width: 50, height: 50 }} />
          <Typography variant="h2">No hay ventas</Typography>
        </Box>
      )}
    </Card>
  );
};

const SellTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Folio</TableCell>
        <TableCell>Tipo de pago</TableCell>
        <TableCell>Total</TableCell>
        <TableCell>Autorización</TableCell>
      </TableRow>
    </TableHead>
  );
};

const SellTableBody = (props: SellTableBodyProps) => {
  return (
    <TableBody>
      {props.sells.map((sell) => (
        <SellRow sell={sell} key={sell.id} />
      ))}
    </TableBody>
  );
};

const SellRow = (props: SellRowProps) => {
  const refetch = usePosSellsDataStore((state) => state.fetchSells);
  const { sell } = props;
  const [open, setOpen] = useState(false);

  const handleChangeStatus = useCallback(async (value: number) => {
    try {
      await changeSellStatus(sell.id, value);
      toast.success(`Venta ${value === 0 ? 'cancelada' : 'aceptada'} con éxito!`);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(`Error al ${value === 0 ? 'cancelar' : 'aceptar'} la venta`);
    }
  }, []);
  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 0.5 }}>
            <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
            {sell.folio}
          </Box>
        </TableCell>
        <TableCell>{getSellType(sell.tipoPago)}</TableCell>
        <TableCell>{sell.totalVenta}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Aceptar">
              <IconButton onClick={() => handleChangeStatus(2)}>
                <CheckCircle sx={{ color: success.main }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancelar">
              <IconButton onClick={() => handleChangeStatus(0)}>
                <Cancel sx={{ color: error.main }} />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0 }}>
          <Collapse in={open} unmountOnExit>
            <ArticlesSoldTable articles={sell.articulosVendidos} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ArticlesSoldTable = (props: ArticlesSoldTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>Nombre</StyledTableCell>
          <StyledTableCell>Cantidad</StyledTableCell>
          <StyledTableCell>precioUnitario</StyledTableCell>
        </TableRow>
      </TableHead>
      <ArticlesSoldTableBody articles={props.articles} />
    </Table>
  );
};

const ArticlesSoldTableBody = (props: ArticlesSoldTableBodyProps) => {
  return (
    <TableBody>
      {props.articles.map((article) => (
        <ArticlesSoldTableRow key={article.id} article={article} />
      ))}
    </TableBody>
  );
};

const ArticlesSoldTableRow = (props: ArticlesSoldTableRowProps) => {
  const { article } = props;
  return (
    <TableRow>
      <StyledTableCell>{article.nombre}</StyledTableCell>
      <StyledTableCell>{article.cantidad}</StyledTableCell>
      <StyledTableCell>{article.precioUnitario}</StyledTableCell>
    </TableRow>
  );
};
