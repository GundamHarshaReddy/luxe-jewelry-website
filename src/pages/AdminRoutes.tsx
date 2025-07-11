import React from 'react';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { AdminPanel } from '../components/admin/AdminPanel';

export const AdminRoutes: React.FC = () => {
  return (
    <AdminAuthProvider>
      <AdminPanel />
    </AdminAuthProvider>
  );
};
