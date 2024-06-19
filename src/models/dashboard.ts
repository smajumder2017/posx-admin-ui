export interface ISalesResponse {
  salesByDate: {
    [key: string]: ISalesData;
  };
  lastPeriodTotalSales: number;
}

export interface ISalesData {
  total: number;
  cash: number;
  upi: number;
  debitCard: number;
  creditCard: number;
}

export interface ISalesSeriesData extends ISalesData {
  name: string;
}

export interface IItemsSalesResponse {
  items: ItemsEntity[];
  headers: HeadersEntity[];
}
export interface ItemsEntity {
  itemName: string;
  quantitySold: number;
  price: number;
  date: string;
  day: string;
}
export interface HeadersEntity {
  date: string;
  day: string;
}
