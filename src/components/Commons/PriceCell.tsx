import { Box, Typography } from '@mui/material';

interface PriceCellProps {
  originalPrice: number;
  discountedPrice?: number | null;
  variant?: 'default' | 'medium' | 'large';
}

export const PriceCell: React.FC<PriceCellProps> = ({ originalPrice, discountedPrice, variant = 'default' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'medium':
        return {
          container: { gap: 1 },
          original: { fontSize: '1rem' },
          discounted: { fontSize: '1.25rem' },
        };
      case 'large':
        return {
          container: { gap: 2 },
          original: { fontSize: '1.25rem' },
          discounted: { fontSize: '1.75rem' },
        };
      default:
        return {
          container: { gap: 0.5 },
          original: { fontSize: '0.75rem' },
          discounted: { fontSize: '0.875rem' },
        };
    }
  };

  const styles = getStyles();

  if (!discountedPrice) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ...styles.container }}>
        <Typography sx={{ fontWeight: 'bold', ...styles.discounted }}>${originalPrice.toFixed(2)}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...styles.container }}>
      { discountedPrice !== originalPrice && <Typography
        component="span"
        sx={{
          textDecoration: 'line-through',
          color: 'error.main',
          ...styles.original,
        }}
      >
        ${originalPrice.toFixed(2)}
      </Typography>}
      <Typography component="span" sx={{ fontWeight: 'bold', ...styles.discounted }}>
        ${discountedPrice.toFixed(2)}
      </Typography>
    </Box>
  );
};
