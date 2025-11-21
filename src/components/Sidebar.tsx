import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Activity, FileText, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Home', icon: Home, href: '/' },
  { title: 'Workers', icon: Users, href: '/workers' },
  { title: 'Sensors', icon: Activity, href: '/sensors' },
  { title: 'Reports', icon: FileText, href: '/reports' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-card to-background border-r border-border shadow-industrial">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-pulse">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              SUBSECURE
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Mining Safety Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group',
                isActive
                  ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )
            }
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Status Indicator */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="industrial-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success rounded-full status-active"></div>
            <div>
              <p className="text-xs font-medium text-foreground">System Status</p>
              <p className="text-xs text-success">All Systems Online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};