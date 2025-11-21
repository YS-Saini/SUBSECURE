import React from 'react';
import { Workers } from '@/components/Workers';

const WorkersPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Worker Management
        </h1>
        <p className="text-muted-foreground">
          Manage worker assignments, track locations, and monitor safety status
        </p>
      </div>
      <Workers />
    </div>
  );
};

export default WorkersPage;