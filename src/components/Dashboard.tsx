import React, { useState, useEffect } from 'react';
import { Users, Thermometer, AlertTriangle, Shield, Zap, HelpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

interface ZoneData {
  id: string;
  name: string;
  workers: number;
  temperature: number;
  gasLevel: 'safe' | 'warning' | 'danger';
  x: number;
  y: number;
}

interface SOSAlert {
  id: string;
  workerId: string;
  workerName: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'resolved';
}

const zoneData: ZoneData[] = [
  { id: 'A1', name: 'Zone A1', workers: 12, temperature: 24, gasLevel: 'safe', x: 15, y: 20 },
  { id: 'A2', name: 'Zone A2', workers: 8, temperature: 28, gasLevel: 'warning', x: 35, y: 25 },
  { id: 'B1', name: 'Zone B1', workers: 15, temperature: 22, gasLevel: 'safe', x: 55, y: 35 },
  { id: 'B2', name: 'Zone B2', workers: 6, temperature: 32, gasLevel: 'danger', x: 75, y: 40 },
  { id: 'C1', name: 'Zone C1', workers: 10, temperature: 26, gasLevel: 'safe', x: 25, y: 60 },
  { id: 'C2', name: 'Zone C2', workers: 4, temperature: 29, gasLevel: 'warning', x: 65, y: 65 },
];

const getStatusColor = (level: string) => {
  switch (level) {
    case 'safe': return 'status-safe';
    case 'warning': return 'status-warning';
    case 'danger': return 'status-danger';
    default: return 'status-safe';
  }
};

export const Dashboard: React.FC = () => {
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  // Simulate SOS alert monitoring (replace with actual API call)
  useEffect(() => {
    const simulateSOSAlert = () => {
      const newAlert: SOSAlert = {
        id: Math.random().toString(36).substr(2, 9),
        workerId: 'W-' + Math.floor(Math.random() * 100),
        workerName: 'John Smith',
        location: 'Zone B2',
        timestamp: new Date(),
        status: 'active'
      };
      
      setSosAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      
      toast({
        variant: "destructive",
        title: "🚨 SOS ALERT",
        description: `Worker ${newAlert.workerName} in ${newAlert.location} needs immediate assistance!`,
      });
    };

    // Simulate periodic SOS alerts for demo (remove in production)
    const interval = setInterval(simulateSOSAlert, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalWorkers = zoneData.reduce((sum, zone) => sum + zone.workers, 0);
  const dangerZones = zoneData.filter(zone => zone.gasLevel === 'danger').length;
  const avgTemperature = Math.round(zoneData.reduce((sum, zone) => sum + zone.temperature, 0) / zoneData.length);
  const activeSOS = sosAlerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Workers</p>
              <p className="text-3xl font-bold text-foreground">{totalWorkers}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Temperature</p>
              <p className="text-3xl font-bold text-foreground">{avgTemperature}°C</p>
            </div>
            <Thermometer className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alert Zones</p>
              <p className="text-3xl font-bold text-destructive">{dangerZones}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active SOS</p>
              <p className={`text-3xl font-bold ${activeSOS > 0 ? 'text-destructive animate-pulse' : 'text-success'}`}>
                {activeSOS}
              </p>
            </div>
            <HelpCircle className={`w-8 h-8 ${activeSOS > 0 ? 'text-destructive animate-pulse' : 'text-success'}`} />
          </div>
        </div>
      </div>

      {/* Mine Tunnel Map */}
      <div className="industrial-card p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-primary" />
          Underground Mine Layout - Real-time Monitoring
        </h2>
        
        <div className="relative bg-gradient-to-br from-muted to-card rounded-lg p-8 min-h-[500px] overflow-hidden">
          {/* Scan line animation */}
          <div className="absolute inset-0 scan-line opacity-50"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Zone markers */}
          {zoneData.map((zone) => (
            <div
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            >
              {/* Zone circle */}
              <div className={`w-16 h-16 rounded-full ${getStatusColor(zone.gasLevel)} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 glow-pulse`}>
                <span className="text-sm font-bold">{zone.id}</span>
              </div>
              
              {/* Zone info popup */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="industrial-card p-4 min-w-48">
                  <h3 className="font-bold text-foreground mb-2">{zone.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Workers:</span>
                      <span className="text-foreground font-medium">{zone.workers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="text-foreground font-medium">{zone.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Gas Level:</span>
                      <span className={`font-medium capitalize ${
                        zone.gasLevel === 'safe' ? 'text-success' :
                        zone.gasLevel === 'warning' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {zone.gasLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connection lines */}
              <svg className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <line x1="16" y1="16" x2="48" y2="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="16" y1="16" x2="16" y2="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Emergency Alerts */}
      {activeSOS > 0 && (
        <Alert variant="destructive" className="animate-pulse">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>🚨 EMERGENCY SOS ALERT</AlertTitle>
          <AlertDescription>
            {activeSOS} worker(s) in distress requiring immediate assistance. Check locations below.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Alerts */}
      <div className="industrial-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {/* SOS Alerts */}
          {sosAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-destructive/10 border-2 border-destructive/30 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-foreground">🚨 SOS - {alert.workerName} in {alert.location}</p>
                  <p className="text-sm text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                EMERGENCY
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">High Gas Level - Zone B2</p>
                <p className="text-sm text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
              CRITICAL
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Thermometer className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Temperature Rising - Zone A2</p>
                <p className="text-sm text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-xs font-medium">
              WARNING
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};