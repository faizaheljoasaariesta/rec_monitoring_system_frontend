import { Home } from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

export const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
];
