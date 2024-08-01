import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createTheme } from '../src/theme/index.tsx';
import 'react-toastify/dist/ReactToastify.css';
import { IconContext } from 'react-icons/lib';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx'; // Importa los locales que necesites

const theme = createTheme();
const queryClient = new QueryClient();
dayjs.locale('es-mx');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: '20px', color: '#fff' }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </IconContext.Provider>
  </React.StrictMode>
);
