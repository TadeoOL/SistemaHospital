import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotFoundLogo from '../assets/error-404.webp';
import { useNavigate } from 'react-router';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                mb: 3,
                textAlign: 'center',
              }}
            >
              <img
                alt="Under development"
                src={NotFoundLogo}
                style={{
                  display: 'inline-block',
                  maxWidth: '100%',
                  width: 400,
                }}
              />
            </Box>
            <Typography align="center" sx={{ mb: 3 }} variant="h3">
              404: The page you are looking for isn’t here
            </Typography>
            <Typography align="center" color="text.secondary" variant="body1">
              You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
            </Typography>
            <Button
              onClick={() => navigate('/')}
              startIcon={
                <SvgIcon fontSize="small">
                  <ArrowBackIcon />
                </SvgIcon>
              }
              sx={{ mt: 3 }}
              variant="contained"
            >
              Go back to dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};
