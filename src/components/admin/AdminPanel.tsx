import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import AdminProducts from './AdminContent';
import AdminReviews from './AdminReviews';

export const AdminPanel: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Placeholder components for future implementation
  const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title} Coming Soon</h3>
        <p className="text-gray-500">This section is under development and will be available soon.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <PlaceholderComponent title="Orders" />;
      case 'customers':
        return <PlaceholderComponent title="Customers" />;
      case 'reviews':
        return <AdminReviews />;
      case 'analytics':
        return <PlaceholderComponent title="Analytics" />;
      case 'settings':
        return <PlaceholderComponent title="Settings" />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
