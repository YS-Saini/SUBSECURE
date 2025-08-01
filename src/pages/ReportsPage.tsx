import React from 'react';
import { FileText, Download, TrendingUp } from 'lucide-react';

const ReportsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Safety Reports
        </h1>
        <p className="text-muted-foreground">
          Generate and review safety analytics, incident reports, and compliance documentation
        </p>
      </div>
      
      <div className="industrial-card p-8 text-center">
        <FileText className="w-16 h-16 text-primary mx-auto mb-4 glow-pulse" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Reports Module</h2>
        <p className="text-muted-foreground">
          Comprehensive reporting and analytics dashboard coming soon...
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;