import { Outlet, useParams } from 'react-router-dom';
import {
  // IconBrowserCheck,
  IconBuildingStore,
  IconCoinRupee,
  // IconExclamationCircle,
  IconMoped,
  // IconNotification,
  // IconPalette,
  // IconTool,
  // IconUser,
} from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import SidebarNav from './components/sidebar-nav';

export default function Settings() {
  const { shopId } = useParams<{ shopId: string }>();

  if (!shopId) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="sticky top-0 lg:w-1/5">
          <SidebarNav items={sidebarNavItems(shopId)} />
        </aside>
        <div className="w-full p-1 pr-4 lg:max-w-xl">
          <div className="pb-16">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

const sidebarNavItems = (shopId: string) => [
  {
    title: 'Shop Details',
    icon: <IconBuildingStore size={18} />,
    href: `/shop/${shopId}/restaurant/settings`,
  },
  {
    title: 'GST & Charges',
    icon: <IconCoinRupee size={18} />,
    href: `/shop/${shopId}/restaurant/settings/gstandcharges`,
  },
  {
    title: 'Delivery',
    icon: <IconMoped size={18} />,
    href: `/shop/${shopId}/restaurant/settings/delivery`,
  },
  // {
  //   title: 'Notifications',
  //   icon: <IconNotification size={18} />,
  //   href: '/settings/notifications',
  // },
  // {
  //   title: 'Display',
  //   icon: <IconBrowserCheck size={18} />,
  //   href: '/settings/display',
  // },
  // {
  //   title: 'Error Example',
  //   icon: <IconExclamationCircle size={18} />,
  //   href: '/settings/error-example',
  // },
];
