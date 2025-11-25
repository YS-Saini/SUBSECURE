import React, { useState, useEffect } from 'react';
import { Users, Thermometer, AlertTriangle, Shield, Zap, Wind, Droplets } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { getNodesData, NodeData } from '@/api/nodeData';

// Extended interface with display properties
interface NodeDisplayData extends NodeData {
  x: number;
  y: number;
  name: string;
  parentId?: string;
  children?: string[];
}

// Static zone data structure matching original layout
interface ZoneData {
  id: string;
  name: string;
  workers: number;
  temperature: number;
  gasLevel: 'safe' | 'warning' | 'danger';
  x: number;
  y: number;
  parentId?: string;
  children?: string[];
  nodeData?: NodeData; // API data for this zone
}

// Map node IDs from API to zone IDs
const nodeToZoneMap: Record<string, string> = {
  '000': '0',
  '001': '1',
  '002': '2',
  '003': '3',
  '004': '4',
  '005': '5',
  '006': '6',
};

const zonePositions = [
  { id: '0', name: 'Main Entry Point', x: 50, y: 10, children: ['1'] },
  { id: '1', name: 'Primary Junction', x: 50, y: 35, parentId: '0', children: ['3', '2'] },
  { id: '3', name: 'North Tunnel', x: 30, y: 50, parentId: '1', children: ['6'] },
  { id: '2', name: 'South Tunnel', x: 70, y: 50, parentId: '1', children: ['4', '5'] },
  { id: '4', name: 'Deep Mine A', x: 80, y: 70, parentId: '2' },
  { id: '5', name: 'Deep Mine B', x: 60, y: 70, parentId: '2' },
  { id: '6', name: 'Ventilation Shaft', x: 20, y: 70, parentId: '3' },
];

const getStatusColor = (zone: ZoneData) => {
  if (zone.nodeData) {
    // Use API data to determine status
    if (zone.nodeData.worker_state === 1 || zone.nodeData.pm25 > 100) return 'status-danger';
    if (zone.nodeData.temperature > 35 || zone.nodeData.pm25 > 50) return 'status-warning';
    return 'status-safe';
  }
  // Fallback to static data
  switch (zone.gasLevel) {
    case 'safe': return 'status-safe';
    case 'warning': return 'status-warning';
    case 'danger': return 'status-danger';
    default: return 'status-safe';
  }
};

// Determine node status color based on data
const getNodeStatusColor = (node: NodeData): string => {
  if (node.worker_state === 1 || node.pm25 > 100) return 'status-danger';
  if (node.temperature > 35 || node.pm25 > 50) return 'status-warning';
  return 'status-safe';
};

export const Dashboard: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch node data on component mount and set up auto-refresh
  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNodes = async () => {
    try {
      const apiData = await getNodesData();
      setNodes(apiData);
      
      // Merge API data with zone positions
      const mergedZones = zonePositions.map(zone => {
        const nodeData = apiData.find(node => nodeToZoneMap[node.node_id] === zone.id);
        return {
          ...zone,
          workers: nodeData?.worker_presence || 0,
          temperature: nodeData?.temperature || 22,
          gasLevel: 'safe' as const,
          nodeData: nodeData,
        };
      });
      
      setZoneData(mergedZones);
      setLoading(false);
    } catch (err) {
      // Use static positions without API data
      const staticZones = zonePositions.map(zone => ({
        ...zone,
        workers: 0,
        temperature: 22,
        gasLevel: 'safe' as const,
      }));
      setZoneData(staticZones);
      setLoading(false);
      toast({
        title: 'Connection Error',
        description: 'Failed to fetch sensor data from the backend.',
        variant: 'destructive',
      });
    }
  };

  // Calculate statistics from merged zone data
  const totalWorkers = zoneData.reduce((sum, zone) => sum + zone.workers, 0);
  const dangerZones = zoneData.filter(zone => {
    if (zone.nodeData) {
      return zone.nodeData.worker_state === 1 || zone.nodeData.pm25 > 100;
    }
    return zone.gasLevel === 'danger';
  }).length;
  const avgTemperature = zoneData.length > 0 
    ? Math.round(zoneData.reduce((sum, zone) => sum + zone.temperature, 0) / zoneData.length)
    : 0;
  const alertNodes = nodes.filter(n => n.worker_state === 1).length;

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
              <p className="text-sm text-muted-foreground">Worker Alerts</p>
              <p className={`text-3xl font-bold ${alertNodes > 0 ? 'text-destructive animate-pulse' : 'text-success'}`}>
                {alertNodes}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${alertNodes > 0 ? 'text-destructive animate-pulse' : 'text-success'}`} />
          </div>
        </div>
      </div>

      {/* Mine Tunnel Map */}
      <div className="industrial-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Zap className="w-10 h-10 mr-3 text-primary" />
          Underground Mine Layout - Real-time Monitoring
        </h2>
        
        <div className="relative bg-gradient-to-br from-muted to-card rounded-lg p-8 min-h-[500px] ">
          {/* Scan line animation */}
          {/* <div className="absolute inset-0 scan-line opacity-50 overflow-hidden"></div> */}
          
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
          
          {/* Connection lines - draw tree structure */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {zoneData.map((zone) => {
              if (zone.parentId) {
                const parent = zoneData.find(z => z.id === zone.parentId);
                if (parent) {
                  return (
                    <line
                      key={`line-${zone.id}`}
                      x1={`${parent.x}%`}
                      y1={`${parent.y}%`}
                      x2={`${zone.x}%`}
                      y2={`${zone.y}%`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="6,6"
                      className="opacity-40"
                    />
                  );
                }
              }
              return null;
            })}
          </svg>
          
          {/* Zone markers */}
          {zoneData.map((zone) => (
            <div
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            >
              {/* Zone circle */}
              <div className={`w-16 h-16 rounded-full ${getStatusColor(zone)} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 border-4 border-background`}>
                <span className="text-sm font-bold text-background">{zone.id}</span>
              </div>
              
              {/* Worker presence indicator */}
              {zone.nodeData?.worker_presence === 1 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {/* Alert indicator */}
              {zone.nodeData?.worker_state === 1 && (
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-destructive rounded-full border-2 border-background flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-destructive-foreground" />
                </div>
              )}
              
              {/* Zone info popup */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="industrial-card p-4 min-w-56">
                  <h3 className="font-bold text-foreground mb-2">{zone.name}</h3>
                  <div className="space-y-1 text-sm">
                    {zone.nodeData ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            Temperature:
                          </span>
                          <span className="text-foreground font-medium">{zone.nodeData.temperature}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            Humidity:
                          </span>
                          <span className="text-foreground font-medium">{zone.nodeData.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Wind className="w-3 h-3" />
                            PM2.5:
                          </span>
                          <span className={`font-medium ${
                            zone.nodeData.pm25 > 100 ? 'text-destructive' :
                            zone.nodeData.pm25 > 50 ? 'text-warning' : 'text-success'
                          }`}>
                            {zone.nodeData.pm25} μg/m³
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Worker Present:</span>
                          <span className={`font-medium ${zone.nodeData.worker_presence === 1 ? 'text-success' : 'text-muted-foreground'}`}>
                            {zone.nodeData.worker_presence === 1 ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Worker State:</span>
                          <span className={`font-medium ${zone.nodeData.worker_state === 1 ? 'text-destructive' : 'text-success'}`}>
                            {zone.nodeData.worker_state === 1 ? 'ALERT' : 'Fine'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="text-muted-foreground text-xs">Last Update:</span>
                          <span className="text-foreground text-xs">
                            {new Date(zone.nodeData.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Workers:</span>
                          <span className="text-foreground font-medium">{zone.workers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="text-foreground font-medium">{zone.temperature}°C</span>
                        </div>
                      </>
                    )}
                    {zone.children && zone.children.length > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-border">
                        <span className="text-muted-foreground text-xs">Connected to:</span>
                        <span className="text-foreground text-xs font-medium">{zone.children.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worker Emergency Alerts */}
      {alertNodes > 0 && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>🚨 WORKER ALERT</AlertTitle>
          <AlertDescription>
            {alertNodes} worker(s) in alert state requiring immediate attention. Check locations below.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Alerts */}
      <div className="industrial-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Alerts & Warnings</h3>
        <div className="space-y-3">
          {/* Worker Alert Nodes */}
          {nodes.filter(n => n.worker_state === 1).map((node) => (
            <div key={`alert-${node.node_id}`} className="flex items-center justify-between p-3 bg-destructive/10 border-2 border-destructive/30 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-foreground">🚨 Worker Alert - Node {node.node_id}</p>
                  <p className="text-sm text-muted-foreground">{new Date(node.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                EMERGENCY
              </div>
            </div>
          ))}
          
          {/* High PM2.5 Alerts */}
          {nodes.filter(n => n.pm25 > 100).map((node) => (
            <div key={`pm25-${node.node_id}`} className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wind className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-foreground">High PM2.5 Level - Node {node.node_id}</p>
                  <p className="text-sm text-muted-foreground">{node.pm25} μg/m³</p>
                </div>
              </div>
              <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                CRITICAL
              </div>
            </div>
          ))}
          
          {/* High Temperature Warnings */}
          {nodes.filter(n => n.temperature > 35 && n.worker_state !== 1).map((node) => (
            <div key={`temp-${node.node_id}`} className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Thermometer className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-foreground">High Temperature - Node {node.node_id}</p>
                  <p className="text-sm text-muted-foreground">{node.temperature}°C</p>
                </div>
              </div>
              <div className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-xs font-medium">
                WARNING
              </div>
            </div>
          ))}

          {/* No alerts message */}
          {nodes.filter(n => n.worker_state === 1).length === 0 && 
           nodes.filter(n => n.pm25 > 100).length === 0 && 
           nodes.filter(n => n.temperature > 35).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 text-success" />
              <p className="text-lg font-medium">All Systems Normal</p>
              <p className="text-sm">No active alerts or warnings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};