import { AddCircleOutlineRounded, Delete, RemoveCircleOutlineRounded } from '@mui/icons-material';
import { Box, Card, Divider, IconButton, Stack, Typography, alpha } from '@mui/material';
import { neutral } from '../../../theme/colors';

const items = [
  { id: '1', name: 'Burgir', price: '100', amount: 2 },
  { id: '2', name: 'Burgir', price: '100', amount: 2 },
  { id: '3', name: 'Burgir', price: '100', amount: 2 },
  { id: '4', name: 'Burgir', price: '100', amount: 2 },
  { id: '5', name: 'Burgir', price: '100', amount: 2 },
  { id: '6', name: 'Burgir', price: '100', amount: 2 },
  { id: '7', name: 'Burgir', price: '100', amount: 2 },
  { id: '8', name: 'Burgir', price: '100', amount: 2 },
  { id: '9', name: 'Burgir', price: '100', amount: 2 },
];

interface ResumeSaleProps {
  sx?: any;
}
interface CardItemsProps {
  id: string;
  name: string;
  price: string;
  amount: number;
}
interface AddAndRemoveButtonsProps {
  amount: number;
  id: string;
}
interface TotalPriceProps {}

export const ResumeSale = (props: ResumeSaleProps) => {
  return (
    <Stack sx={{ ...props.sx }}>
      <Typography variant="h3" sx={{ my: 2 }}>
        Orden Actual
      </Typography>
      <Stack sx={{ overflowY: 'auto' }}>
        <Stack spacing={2} sx={{ maxHeight: '500px', p: 1.5 }}>
          {items.map((item) => (
            <CardItems key={item.id} amount={item.amount} id={item.id} name={item.name} price={item.price} />
          ))}
        </Stack>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <TotalPrice />
    </Stack>
  );
};

const CardItems = (props: CardItemsProps) => {
  return (
    <Card sx={{ position: 'relative', p: 1, bgcolor: alpha(neutral[200], 0.45), overflow: 'visible' }}>
      <IconButton sx={{ position: 'absolute', top: -10, right: -10, zIndex: 100 }}>
        <Delete color="error" />
      </IconButton>
      <Stack sx={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{props.name}</Typography>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption">${props.price}</Typography>
          <AddAndRemoveButtons amount={props.amount} id={props.id} />
        </Box>
      </Stack>
    </Card>
  );
};

const AddAndRemoveButtons = (props: AddAndRemoveButtonsProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
      <IconButton>
        <RemoveCircleOutlineRounded />
      </IconButton>
      {props.amount}
      <IconButton sx={{ color: '#046DBD' }}>
        <AddCircleOutlineRounded />
      </IconButton>
    </Box>
  );
};

const TotalPrice = (props: TotalPriceProps) => {
  return (
    <Stack sx={{ marginTop: 'auto' }}>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
        <Typography variant="h5">Sub Total</Typography>
        <Typography>$123123</Typography>
      </Box>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
        <Typography variant="h5">IVA 16%</Typography>
        <Typography>$43</Typography>
      </Box>
      <Divider sx={{ my: 0.5 }} />
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
        <Typography variant="h5">Total</Typography>
        <Typography>$3231</Typography>
      </Box>
    </Stack>
  );
};
