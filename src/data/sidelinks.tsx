import {
  IconApps,
  IconChecklist,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconSettings,
  IconMenuDeep,
  IconUserShield,
  IconUsers,
} from '@tabler/icons-react';
import { MdOutlineFastfood, MdOutlineMenuBook } from 'react-icons/md';

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks = (shopId: string, shopType: string): SideLink[] => {
  if (shopType === 'restaurant') {
    const baseRoute = `/shop/${shopId}/${shopType}`;
    return [
      {
        title: 'Dashboard',
        label: '',
        href: baseRoute,
        icon: <IconLayoutDashboard size={18} />,
      },
      {
        title: 'Orders',
        label: '',
        href: `${baseRoute}/orders`,
        icon: <IconChecklist size={18} />,
      },
      {
        title: 'Menu',
        label: '',
        href: '',
        icon: <MdOutlineMenuBook size={18} />,
        sub: [
          {
            title: 'Categories & Cusines',
            label: '',
            href: `${baseRoute}/menu-categories`,
            icon: <MdOutlineFastfood size={18} />,
          },
          {
            title: 'Menu Items',
            label: '',
            href: `${baseRoute}/menu-items`,
            icon: <IconMenuDeep size={18} />,
          },
        ],
      },

      {
        title: 'Inventory',
        label: '',
        href: '',
        icon: <IconUserShield size={18} />,
        sub: [
          {
            title: 'Sign In (email + password)',
            label: '',
            href: '/sign-in',
            icon: <IconHexagonNumber1 size={18} />,
          },
          {
            title: 'Sign In (Box)',
            label: '',
            href: '/sign-in-2',
            icon: <IconHexagonNumber2 size={18} />,
          },
          {
            title: 'Sign Up',
            label: '',
            href: '/sign-up',
            icon: <IconHexagonNumber3 size={18} />,
          },
          {
            title: 'Forgot Password',
            label: '',
            href: '/forgot-password',
            icon: <IconHexagonNumber4 size={18} />,
          },
          {
            title: 'OTP',
            label: '',
            href: '/otp',
            icon: <IconHexagonNumber5 size={18} />,
          },
        ],
      },
      {
        title: 'Users',
        label: '',
        href: `${baseRoute}/users`,
        icon: <IconUsers size={18} />,
      },
      {
        title: 'Attendance',
        label: '',
        href: `${baseRoute}/attendance`,
        icon: <IconApps size={18} />,
      },
      // {
      //   title: 'Requests',
      //   label: '10',
      //   href: '/requests',
      //   icon: <IconRouteAltLeft size={18} />,
      //   sub: [
      //     {
      //       title: 'Trucks',
      //       label: '9',
      //       href: '/trucks',
      //       icon: <IconTruck size={18} />,
      //     },
      //     {
      //       title: 'Cargos',
      //       label: '',
      //       href: '/cargos',
      //       icon: <IconBoxSeam size={18} />,
      //     },
      //   ],
      // },
      // {
      //   title: 'Analysis',
      //   label: '',
      //   href: '/analysis',
      //   icon: <IconChartHistogram size={18} />,
      // },
      // {
      //   title: 'Extra Components',
      //   label: '',
      //   href: '/extra-components',
      //   icon: <IconComponents size={18} />,
      // },
      // {
      //   title: 'Error Pages',
      //   label: '',
      //   href: '',
      //   icon: <IconExclamationCircle size={18} />,
      //   sub: [
      //     {
      //       title: 'Not Found',
      //       label: '',
      //       href: '/404',
      //       icon: <IconError404 size={18} />,
      //     },
      //     {
      //       title: 'Internal Server Error',
      //       label: '',
      //       href: '/500',
      //       icon: <IconServerOff size={18} />,
      //     },
      //     {
      //       title: 'Maintenance Error',
      //       label: '',
      //       href: '/503',
      //       icon: <IconBarrierBlock size={18} />,
      //     },
      //   ],
      // },
      {
        title: 'Settings',
        label: '',
        href: `${baseRoute}/settings`,
        icon: <IconSettings size={18} />,
      },
    ];
  }
  return [];
};
