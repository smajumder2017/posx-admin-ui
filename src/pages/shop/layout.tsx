import { Outlet, useParams } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Search } from '@/components/search';
import { sidelinks } from '@/data/sidelinks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getShopDetails } from '@/redux/features/shopSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

export default function ShopLayout() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const dispatch = useAppDispatch();
  const shopState = useAppSelector((state) => state.shop);
  const [scrolled, setScrolled] = useState(false);
  const content = useRef<HTMLDivElement>(null);

  const fetchShopDetails = useCallback(async (id: string) => {
    return dispatch(getShopDetails(id)).unwrap();
  }, []);

  useEffect(() => {
    if (shopId) fetchShopDetails(shopId);
  }, [shopId, fetchShopDetails]);

  useEffect(() => {
    if (content.current) {
      content.current.onscroll = () => {
        console.log(content.current?.scrollTop);
        if (content.current?.scrollTop === 0) {
          setScrolled(false);
        } else {
          setScrolled(true);
        }
      };
    }

    return () => {
      if (content.current) content.current.onscroll = null;
    };
  }, [content.current]);

  if (shopId && shopState.data?.shopType.value) {
    return (
      <div className="relative h-full overflow-hidden bg-background">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sidelinks={sidelinks(
            shopId,
            shopState.data.shopType.value.toLowerCase(),
          )}
        />
        <main
          id="content"
          className={`bg-muted/40 fixed left-0 right-0 top-0 overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
            <LayoutHeader
              className={`sticky top-0 justify-between px-4 py-3 ${
                scrolled ? 'shadow bg-background' : ''
              } md:px-4 backdrop-filter backdrop-blur-md z-[9999] transition-all duration-300`}
            >
              {/* <TopNav links={topNav} /> */}
              <div className="ml-auto flex items-center space-x-4">
                <Search />
                <ThemeSwitch />
                <UserNav />
              </div>
            </LayoutHeader>
            <LayoutBody className="space-y-4 overflow-y-auto" ref={content}>
              <Outlet />
            </LayoutBody>
          </Layout>
        </main>
      </div>
    );
  }
  return null;
}
