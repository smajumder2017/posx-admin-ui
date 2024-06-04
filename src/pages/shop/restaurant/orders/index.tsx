import OrderList from './components/orders-list';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { IOrderResponse } from '@/models/order';
import * as apis from '@/apis';
import OrderDetails from './components/order-details';
import { useAppSelector } from '@/hooks/redux';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Paginate } from '@/components/custom/paginate';
import { Loader } from '@/components/custom/loader';

export default function Orders() {
  const { shopId } = useParams<{
    shopId: string;
  }>();

  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const authState = useAppSelector((state) => state.auth);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0');
  const itemsPerPage = 20;

  const fetchOrders = useCallback(
    async (args: {
      shopId: string;
      orderStatusId?: number;
      employeeId?: string;
      isClosed: boolean;
      skip?: number;
      take?: number;
    }) => {
      try {
        setLoading(true);
        const orderRes = await apis.getAllOrder({
          shopId: args.shopId,
          orderStatusId: args.orderStatusId,
          isClosed: args.isClosed,
          skip: args.skip || 0,
          take: args.take || itemsPerPage,
        });
        console.log(orderRes.data);
        setTotalCount(orderRes.data.count);
        setOrders(orderRes.data.orders);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (shopId) {
      const skip = itemsPerPage * page;
      fetchOrders({
        shopId,
        isClosed: true,
        employeeId: authState.data?.id,
        skip,
        take: itemsPerPage,
      });
    }
  }, [shopId, fetchOrders, authState.data, page]);

  const handlePageChange = (page: number) => {
    console.log(page);

    setSearchParams({ ...searchParams, page: page.toString() });
  };
  return (
    <>
      {/* ===== Main ===== */}

      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          All Orders
        </h1>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div
          className={`${selectedOrder ? 'col-span-9' : 'col-span-full'} flex flex-col gap-4`}
        >
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                (Showing {orders.length}/{totalCount}) Recent orders from your
                store.
              </CardDescription>
            </CardHeader>
            {loading && <Loader />}
            <CardContent>
              {orders.length ? (
                <OrderList
                  orders={orders}
                  onOrderSelect={setSelectedOrder}
                  selectedOrder={selectedOrder}
                />
              ) : null}
            </CardContent>
          </Card>
          {orders.length ? (
            <Paginate
              totalCount={totalCount}
              maxPages={5}
              itemsPerPage={itemsPerPage}
              value={page}
              onChange={handlePageChange}
            />
          ) : null}
        </div>

        {selectedOrder && (
          <div className={selectedOrder ? 'col-span-3' : ''}>
            <OrderDetails
              orderId={selectedOrder}
              onClose={() => setSelectedOrder('')}
            />
          </div>
        )}
      </div>
    </>
  );
}
