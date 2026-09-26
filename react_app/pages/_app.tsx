import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useEffect, useMemo } from 'react'; 
import '../styles/globals.css';


import { ThemeProvider as CustomThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent({ Component, pageProps }: AppProps) {
  const { theme } = useTheme();
  const mode = theme === 'highContrast' ? 'dark' : 'light';

  useEffect(() => {
    document.body.classList.remove('default-theme', 'highContrast-theme');

    if (theme === 'highContrast') {
      document.body.classList.add('highContrast-theme');
    } else {
      document.body.classList.add('default-theme');
    }
  }, [theme]);


  const muiTheme = useMemo(
    () =>
      createTheme({
        typography: {
          allVariants: {
            fontFamily: 'Inter',
          },
        },
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

export default function App(props: AppProps) {
  const { session } = props.pageProps;

  return (
    <SessionProvider session={session}>
      <CustomThemeProvider>
        <AppContent {...props} />
      </CustomThemeProvider>
    </SessionProvider>
  );
}