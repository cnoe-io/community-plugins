import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { queryClient } from './api';
import { Overview } from './pages/overview';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* myPlugin.routes.root will take the user to this page */}
        <Route path="/" element={<Overview />} />
      </Routes>
    </QueryClientProvider>
  );
};
