import { useTheme } from '@/components/theme-provider';
import { ISalesSeriesData } from '@/models/dashboard';
import { formatPrice } from '@/utils/currency';
import moment from 'moment';
import React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  // CartesianGrid,
  ReferenceLine,
} from 'recharts';

// const data = [
//   {
//     name: 'Jan',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Feb',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Mar',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Apr',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'May',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Jun',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Jul',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Aug',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Sep',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Oct',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Nov',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Dec',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ];
interface IOverviewProps {
  data: ISalesSeriesData[];
  lastPeriodTotalSales: number;
}

// const CustomLabel = (props: any) => {
//   const { x, y, fill, value } = props;
//   if (!value) {
//     return null;
//   }
//   return (
//     <text x={x} y={y} dy={-4} fill={fill} fontSize={'12px'}>
//       {formatPrice(value, { maximumFractionDigits: 1 })}
//     </text>
//   );
// };
export const Overview: React.FC<IOverviewProps> = ({
  data,
  lastPeriodTotalSales,
}) => {
  const { theme } = useTheme();
  // console.log(theme);
  console.log(data.length);
  const isDark = theme === 'dark';
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 50 }}>
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        <XAxis
          dataKey="name"
          // stroke="#888888"
          className="fill-primary"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            data.length > 7
              ? moment(value.split('/').reverse().join('-')).format('D')
              : value
          }
        />
        <YAxis
          // stroke="#888888"
          className="fill-primary"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            `${formatPrice(value, { maximumFractionDigits: 0 })}`
          }
        />

        <Tooltip
          cursor={{ fill: isDark ? '#1e293b' : '#f3f4f6' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: 'bold',
          }}
          itemStyle={{
            color: 'hsl(var(--foreground))!',
            fontSize: '0.875rem',
            fontWeight: 'normal',
          }}
          // labelClassName={`color-primary ${theme === 'dark' ? 'bg-primary' : ''}`}
        />
        <Bar
          dataKey="cash"
          stackId={'1'}
          // fill="#e5e7eb"
          // radius={[4, 4, 0, 0]}
          className={'fill-muted'}
          // label={<CustomLabel />}
        ></Bar>
        <Bar
          stackId={'1'}
          dataKey="upi"
          // fill="currentColor"
          radius={[4, 4, 0, 0]}
          className={'fill-primary'}
          // label={<CustomLabel />}
        >
          <LabelList
            formatter={(value: number) =>
              value ? formatPrice(value, { maximumFractionDigits: 0 }) : ''
            }
            dataKey="total"
            position="top"
            fontSize={data.length > 7 ? '12px' : '14px'}
            offset={data.length > 7 ? 30 : 5}
            angle={data.length > 7 ? -90 : 0}
          />
        </Bar>
        {lastPeriodTotalSales && (
          <ReferenceLine
            ifOverflow="extendDomain"
            y={lastPeriodTotalSales / 7}
            label={`${formatPrice(lastPeriodTotalSales / 7, { maximumFractionDigits: 0 })}`}
            stroke="#888888"
            isFront={true}
            strokeDasharray="3 3"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
