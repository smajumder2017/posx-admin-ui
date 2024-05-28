import {
  IconApps,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const appSidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Shops',
    label: '',
    href: '/shops',
    icon: <IconApps size={18} />,
  },
  {
    title: 'Employees',
    label: '',
    href: '/employees',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
];
