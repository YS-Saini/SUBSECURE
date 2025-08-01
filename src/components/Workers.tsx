import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Worker {
  id: string;
  name: string;
  role: string;
  location: string;
  status: 'active' | 'inactive';
  shiftTime: string;
}

const initialWorkers: Worker[] = [
  { id: 'W001', name: 'John Smith', role: 'Mining Engineer', location: 'Zone A1', status: 'active', shiftTime: '06:00 - 14:00' },
  { id: 'W002', name: 'Sarah Johnson', role: 'Safety Inspector', location: 'Zone B2', status: 'active', shiftTime: '06:00 - 14:00' },
  { id: 'W003', name: 'Mike Chen', role: 'Equipment Operator', location: 'Zone C1', status: 'active', shiftTime: '14:00 - 22:00' },
  { id: 'W004', name: 'Lisa Brown', role: 'Geologist', location: 'Zone A2', status: 'inactive', shiftTime: '22:00 - 06:00' },
  { id: 'W005', name: 'David Wilson', role: 'Mining Technician', location: 'Zone B1', status: 'active', shiftTime: '06:00 - 14:00' },
];

export const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    shiftTime: ''
  });

  const handleAddWorker = () => {
    const newWorker: Worker = {
      id: `W${String(workers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      role: formData.role,
      location: formData.location,
      status: 'active',
      shiftTime: formData.shiftTime
    };
    setWorkers([...workers, newWorker]);
    setFormData({ name: '', role: '', location: '', shiftTime: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditWorker = () => {
    if (editingWorker) {
      setWorkers(workers.map(worker => 
        worker.id === editingWorker.id 
          ? { ...editingWorker, ...formData }
          : worker
      ));
      setEditingWorker(null);
      setFormData({ name: '', role: '', location: '', shiftTime: '' });
    }
  };

  const handleDeleteWorker = (id: string) => {
    setWorkers(workers.filter(worker => worker.id !== id));
  };

  const openEditDialog = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      role: worker.role,
      location: worker.location,
      shiftTime: worker.shiftTime
    });
  };

  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const inactiveWorkers = workers.filter(w => w.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Workers</p>
              <p className="text-3xl font-bold text-foreground">{workers.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Workers</p>
              <p className="text-3xl font-bold text-success">{activeWorkers}</p>
            </div>
            <Shield className="w-8 h-8 text-success status-active" />
          </div>
        </div>
        
        <div className="industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Off Duty</p>
              <p className="text-3xl font-bold text-muted-foreground">{inactiveWorkers}</p>
            </div>
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="industrial-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Worker Management</h2>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Worker</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-foreground">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="Mining Engineer">Mining Engineer</SelectItem>
                      <SelectItem value="Safety Inspector">Safety Inspector</SelectItem>
                      <SelectItem value="Equipment Operator">Equipment Operator</SelectItem>
                      <SelectItem value="Geologist">Geologist</SelectItem>
                      <SelectItem value="Mining Technician">Mining Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-foreground">Zone</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="Zone A1">Zone A1</SelectItem>
                      <SelectItem value="Zone A2">Zone A2</SelectItem>
                      <SelectItem value="Zone B1">Zone B1</SelectItem>
                      <SelectItem value="Zone B2">Zone B2</SelectItem>
                      <SelectItem value="Zone C1">Zone C1</SelectItem>
                      <SelectItem value="Zone C2">Zone C2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shift" className="text-foreground">Shift Time</Label>
                  <Select value={formData.shiftTime} onValueChange={(value) => setFormData({ ...formData, shiftTime: value })}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="06:00 - 14:00">06:00 - 14:00 (Day Shift)</SelectItem>
                      <SelectItem value="14:00 - 22:00">14:00 - 22:00 (Evening Shift)</SelectItem>
                      <SelectItem value="22:00 - 06:00">22:00 - 06:00 (Night Shift)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddWorker} className="w-full btn-glow">
                  Add Worker
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Worker ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Shift</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-4 text-sm font-mono text-foreground">{worker.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-foreground">{worker.name}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{worker.role}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{worker.location}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      worker.status === 'active' ? 'status-safe' : 'bg-muted text-muted-foreground'
                    }`}>
                      {worker.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{worker.shiftTime}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Dialog open={editingWorker?.id === worker.id} onOpenChange={(open) => {
                        if (!open) setEditingWorker(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(worker)}
                            className="border-border hover:border-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Edit Worker</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name" className="text-foreground">Name</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-input border-border text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-role" className="text-foreground">Role</Label>
                              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger className="bg-input border-border text-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="Mining Engineer">Mining Engineer</SelectItem>
                                  <SelectItem value="Safety Inspector">Safety Inspector</SelectItem>
                                  <SelectItem value="Equipment Operator">Equipment Operator</SelectItem>
                                  <SelectItem value="Geologist">Geologist</SelectItem>
                                  <SelectItem value="Mining Technician">Mining Technician</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-location" className="text-foreground">Zone</Label>
                              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                                <SelectTrigger className="bg-input border-border text-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="Zone A1">Zone A1</SelectItem>
                                  <SelectItem value="Zone A2">Zone A2</SelectItem>
                                  <SelectItem value="Zone B1">Zone B1</SelectItem>
                                  <SelectItem value="Zone B2">Zone B2</SelectItem>
                                  <SelectItem value="Zone C1">Zone C1</SelectItem>
                                  <SelectItem value="Zone C2">Zone C2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-shift" className="text-foreground">Shift Time</Label>
                              <Select value={formData.shiftTime} onValueChange={(value) => setFormData({ ...formData, shiftTime: value })}>
                                <SelectTrigger className="bg-input border-border text-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="06:00 - 14:00">06:00 - 14:00 (Day Shift)</SelectItem>
                                  <SelectItem value="14:00 - 22:00">14:00 - 22:00 (Evening Shift)</SelectItem>
                                  <SelectItem value="22:00 - 06:00">22:00 - 06:00 (Night Shift)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleEditWorker} className="w-full btn-glow">
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWorker(worker.id)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};