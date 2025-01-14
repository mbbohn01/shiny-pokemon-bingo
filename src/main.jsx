import '@mantine/core/styles.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <MantineProvider withGlobalStyles withNormalizeCSS
  theme = {{fontFamily: 'Inter, Verdana'}}
  >  <StrictMode>
      <App />
    </StrictMode>
  </MantineProvider>,
);
