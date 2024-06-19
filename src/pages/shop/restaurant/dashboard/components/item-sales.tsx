import { IItemsSalesResponse } from '@/models/dashboard';

import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/utils/currency';

interface ItemSalesProps {
  data?: IItemsSalesResponse;
}

const ItemSales: React.FC<ItemSalesProps> = ({ data }) => {
  if (!data) {
    return null;
  }
  const { headers } = data;

  const items = [...new Set(data.items.map((item) => item.itemName))];

  return (
    <div>
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Items Sold</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                {headers.map((header) => {
                  return (
                    <TableHead key={header.date} className="text-center">
                      <div>{header.day}</div>
                      <div className="text-muted-foreground md:inline text-xs">
                        {header.date}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((itemName) => {
                const itemData = data.items.filter(
                  (item) => item.itemName === itemName,
                );
                return (
                  <TableRow key={itemName}>
                    <TableCell className="font-medium">{itemName}</TableCell>
                    {headers.map((header) => {
                      const salesData = itemData.filter(
                        (item) => item.date === header.date,
                      );
                      return salesData.map((d) => (
                        <TableCell className="text-center">
                          <div className="font-medium">{d.quantitySold}</div>
                          <div className="text-muted-foreground md:inline text-xs">
                            {formatPrice(d.price, { maximumFractionDigits: 0 })}
                          </div>
                        </TableCell>
                      ));
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemSales;
