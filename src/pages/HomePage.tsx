import React from 'react';
import { Dashboard } from '@/components/Dashboard';

const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mining Operations Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time monitoring and safety management for underground mining operations
        </p>
      </div>
      <Dashboard />
    </div>
  );
};

export default HomePage;