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
