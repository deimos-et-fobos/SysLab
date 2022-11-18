import React from "react";
import Box from '@mui/material/Box';
import { indigo, teal } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import HomePage from "./HomePage";

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: indigo,
    background: {
      default: teal[50],
    },
    danger: { // red
      light: '#ef5350',
      main: '#d32f2f',
      dark: '#c62828',
      contrastText: '#fff',
    },
    neutral: { // grey
      light: '#838fa2',
      main: '#64748B',
      dark: '#465161',
      contrastText: '#fff',
    },
    menu: {
      top: '#00695f',
      side: '#009688',
    }
  },
});

export default function App(props) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default' }}>
        <HomePage {...props} />
      </Box>
    </ThemeProvider>
  )
}
