import React from 'react';
import { Activity, Thermometer, Wind, Zap, AlertTriangle } from 'lucide-react';

const SensorsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sensor Network
        </h1>
        <p className="text-muted-foreground">
          Monitor environmental conditions and safety parameters across all zones
        </p>
      </div>
      
      <div className="industrial-card p-8 text-center">
        <Activity className="w-16 h-16 text-primary mx-auto mb-4 glow-pulse" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Sensors Module</h2>
        <p className="text-muted-foreground">
          Advanced sensor monitoring interface coming soon...
        </p>
      </div>
    </div>
  );
};

export default SensorsPage;