import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import MaintenanceError from './pages/errors/maintenance-error';
import ShopLayout from './pages/shop/layout';
import AuthWrapper from '@/components/wrappers/auth-wrapper';
import AppLayout from '@/components/app-shell';
const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  // {
  //   path: '/sign-in-2',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-in-2')).default,
  //   }),
  // },
  // {
  //   path: '/sign-up',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-up')).default,
  //   }),
  // },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },

  // restaurant routes
  {
    path: '/shop/:shopId/restaurant',
    element: (
      <AuthWrapper>
        <ShopLayout />
      </AuthWrapper>
    ),

    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/shop/restaurant/dashboard'))
            .default,
        }),
      },
      {
        path: 'orders',
        lazy: async () => ({
          Component: (await import('@/pages/shop/restaurant/orders')).default,
        }),
      },
      {
        path: 'menu-categories',
        lazy: async () => ({
          Component: (
            await import('@/pages/shop/restaurant/menu/menu-category')
          ).default,
        }),
      },
      {
        path: 'menu-items',
        lazy: async () => ({
          Component: (await import('@/pages/shop/restaurant/menu/menu-items'))
            .default,
        }),
      },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/pages/shop/restaurant/users')).default,
        }),
      },
      {
        path: 'attendance',
        lazy: async () => ({
          Component: (await import('@/pages/shop/restaurant/attendance'))
            .default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('@/pages/shop/restaurant/settings')).default,
        }),
      },
      {
        path: 'extra-components',
        lazy: async () => ({
          Component: (await import('@/pages/extra-components')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className="h-[50svh]" minimal />,
          },
        ],
      },
    ],
  },

  //app routes
  {
    path: '/',
    element: (
      <AuthWrapper>
        <AppLayout />
      </AuthWrapper>
    ),

    // lazy: async () => {
    //   const ShopLayout = await import('./pages/shop/layout');
    //   const AuthWrapper = await import('@/components/wrapper/auth-wrapper');
    //   return {
    //     Component: (
    //       <AuthWrapper>
    //         <ShopLayout.default />
    //       </AuthWrapper>
    //     ),
    //   };

    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'tasks',
        lazy: async () => ({
          Component: (await import('@/pages/tasks')).default,
        }),
      },
      {
        path: 'chats',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'shops',
        lazy: async () => ({
          Component: (await import('@/pages/shops')).default,
        }),
      },
      {
        path: 'employees',
        lazy: async () => ({
          Component: (await import('@/pages/employees')).default,
        }),
      },
      {
        path: 'analysis',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'extra-components',
        lazy: async () => ({
          Component: (await import('@/pages/extra-components')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className="h-[50svh]" minimal />,
          },
        ],
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
]);

export default router;
