import { Box, Card, Grid, Stack, Tooltip, Typography } from '@mui/material';
import AnimateButton from '../../@extended/AnimateButton';

const articles = [
  {
    id: '1',
    name: 'Paracetamol',
    description: 'Para los dolores',
    price: 50,
  },
  {
    id: '2',
    name: 'Paracetamol',
    description: 'Para los dolores',
    price: 50,
  },
  {
    id: '3',
    name: 'Paracetamol',
    description: 'Para los dolores',
    price: 50,
  },
  {
    id: '5',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '6',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '7',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '8',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '9',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '10',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '11',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '12',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '13',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '14',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '15',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '16',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '17',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
  {
    id: '18',
    name: 'Paracetamol',
    description: 'Para los dolores asdasdasda asdasda  asdasdsAASDASD asdasdasdsasd asdasdasdasdasdasdasdasd',
    price: 50,
  },
];

const scrollBar = {
  '&::-webkit-scrollbar': {
    width: '0.5em',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: '10px',
  },
};

interface ArticlesToSaleProps {
  sx?: any;
}

export const ArticlesToSale = (props: ArticlesToSaleProps) => {
  return (
    <Stack sx={{ overflowY: 'auto', ...props.sx, ...scrollBar }}>
      <Stack sx={{ maxHeight: 550 }}>
        <Typography variant="h5">Artículos</Typography>
        <Grid container spacing={2} sx={{ py: 2 }}>
          {articles.map((article) => (
            <Grid key={article.id} item xs={12} lg={3}>
              <AnimateButton>
                <Card
                  sx={{
                    p: 2,
                    height: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      cursor: 'pointer',
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                  onClick={() => {}}
                >
                  <Typography fontWeight={700} fontSize={24}>
                    {article.name}
                  </Typography>
                  {article.description.length > 100 ? (
                    <Tooltip title={article.description}>
                      <Typography>{article.description.substring(0, 80).concat('...')}</Typography>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption">{article.description}</Typography>
                  )}
                  <Box sx={{ marginTop: 'auto' }}>
                    <Typography variant="h5">Precio: ${article.price}</Typography>
                  </Box>
                </Card>
              </AnimateButton>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
