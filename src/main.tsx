import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/auth-provider.tsx';
import { AppSourceProvider } from './contexts/app-source-provider.tsx';
import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppSourceProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </AppSourceProvider>
    </AuthProvider>
  </StrictMode>,
);

