import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { Layout, LayoutHeader, LayoutBody } from './custom/layout';
import ThemeSwitch from './theme-switch';
import { UserNav } from './user-nav';
// import { Search } from './search';
import { appSidelinks } from '@/data/appsidelinks';

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sidelinks={appSidelinks}
      />
      <main
        id="content"
        className={`fixed left-0 right-0 top-0 overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4">
            {/* <TopNav links={topNav} /> */}
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <ThemeSwitch />
              <UserNav />
            </div>
          </LayoutHeader>
          <LayoutBody>
            <Outlet />
          </LayoutBody>
        </Layout>
      </main>
    </div>
  );
}
