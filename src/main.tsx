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
import ThemeCustomization from './themes/index.tsx';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// apex-chart
// import 'assets/third-party/apex-chart.css';
// import 'assets/third-party/react-table.css';

// map
// import 'mapbox-gl/dist/mapbox-gl.css';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

const theme = createTheme();
const queryClient = new QueryClient();
dayjs.locale('es-mx');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: '20px', color: '#fff' }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ThemeCustomization>
            <App />
          </ThemeCustomization>
        </ThemeProvider>
      </QueryClientProvider>
    </IconContext.Provider>
  </React.StrictMode>
);
