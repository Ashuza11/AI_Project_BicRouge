import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastProvider } from './context/ToastContext';
import { UserProvider } from './context/UserContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import LanguageProvider from './components/LanguageProvider.jsx';
import i18n from './i18n'; 

// Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </UserProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </I18nextProvider>
);