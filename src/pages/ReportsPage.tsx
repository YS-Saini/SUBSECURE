import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, RefreshCw, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { getNodeHistory, NodeHistory } from '@/api/nodeHistory';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ReportsPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<NodeHistory[]>([]);
  const [filteredData, setFilteredData] = useState<NodeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNode, setFilterNode] = useState<string>('all');

  useEffect(() => {
    fetchHistoryData();
  }, []);

  useEffect(() => {
    filterHistoryData();
  }, [historyData, searchTerm, filterNode]);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const data = await getNodeHistory();
      setHistoryData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to fetch history data from the backend.',
        variant: 'destructive',
      });
    }
  };

  const filterHistoryData = () => {
    let filtered = [...historyData];

    // Filter by node ID
    if (filterNode !== 'all') {
      filtered = filtered.filter(item => item.node_id === filterNode);
    }

    // Filter by search term (searches in node_id)
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.node_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const getUniqueNodeIds = () => {
    const nodeIds = new Set(historyData.map(item => item.node_id));
    return Array.from(nodeIds).sort();
  };

  const getStatusBadge = (workerState: number) => {
    if (workerState === 1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30">
          <AlertTriangle className="w-3 h-3 mr-1" />
          ALERT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success border border-success/30">
        Fine
      </span>
    );
  };

  const getPM25Badge = (pm25: number) => {
    if (pm25 > 100) {
      return <span className="font-medium text-destructive">{pm25}</span>;
    }
    if (pm25 > 50) {
      return <span className="font-medium text-warning">{pm25}</span>;
    }
    return <span className="font-medium text-success">{pm25}</span>;
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Node ID', 'Temperature', 'Humidity', 'PM2.5', 'Worker State', 'Worker Presence'];
    const csvData = filteredData.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.node_id,
      item.temperature,
      item.humidity,
      item.pm25,
      item.worker_state === 1 ? 'ALERT' : 'Fine',
      item.worker_presence === 1 ? 'Present' : 'Not Present'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `node_history_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading history data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-primary" />
          Node History Reports
        </h1>
        <p className="text-muted-foreground">
          Comprehensive historical data and analytics for all sensor nodes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-3xl font-bold text-foreground">{filteredData.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alert Events</p>
              <p className="text-3xl font-bold text-destructive">
                {filteredData.filter(d => d.worker_state === 1).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Nodes</p>
              <p className="text-3xl font-bold text-foreground">{getUniqueNodeIds().length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg PM2.5</p>
              <p className="text-3xl font-bold text-foreground">
                {filteredData.length > 0
                  ? Math.round(filteredData.reduce((sum, d) => sum + d.pm25, 0) / filteredData.length)
                  : 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="industrial-card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Search Node ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by node ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Filter by Node
            </label>
            <select
              value={filterNode}
              onChange={(e) => setFilterNode(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Nodes</option>
              {getUniqueNodeIds().map(nodeId => (
                <option key={nodeId} value={nodeId}>Node {nodeId}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={fetchHistoryData}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          <Button
            onClick={exportToCSV}
            className="gap-2"
            disabled={filteredData.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="industrial-card p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Historical Data Records</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                  <TableHead className="font-bold">Timestamp</TableHead>
                  <TableHead className="font-bold">Node ID</TableHead>
                  <TableHead className="font-bold text-center">Temp (°C)</TableHead>
                  <TableHead className="font-bold text-center">Humidity (%)</TableHead>
                  <TableHead className="font-bold text-center">PM2.5</TableHead>
                  <TableHead className="font-bold text-center">Worker State</TableHead>
                  <TableHead className="font-bold text-center">Worker Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No history records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-primary">{item.node_id}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={item.temperature > 35 ? 'text-warning font-medium' : ''}>
                          {item.temperature}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{item.humidity}</TableCell>
                      <TableCell className="text-center">
                        {getPM25Badge(item.pm25)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.worker_state)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${item.worker_presence === 1 ? 'text-success' : 'text-muted-foreground'}`}>
                          {item.worker_presence === 1 ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;