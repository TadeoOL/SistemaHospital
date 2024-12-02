// ==============================|| OVERRIDES - TYPOGRAPHY ||============================== //

export default function Typography() {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 12,
        },
        root: {
          '&.textoTachado': {
            position: 'relative',
            display: 'inline-block',
            color: 'red',
          },
          '&.textoTachado::after': {
            content: "''",
            position: 'absolute',
            bottom: '0.7em',
            left: '-40%',
            width: '190%',
            borderBottom: '1px solid red',
            transform: 'rotate(-60deg)',
          },
        },
      },
    },
  };
}
