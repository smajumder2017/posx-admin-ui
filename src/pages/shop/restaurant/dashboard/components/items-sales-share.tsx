import { useTheme } from '@/components/theme-provider';
import { IItemsSalesResponse } from '@/models/dashboard';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

interface IItemSalesShareProps {
  data?: IItemsSalesResponse;
}
const ItemSalesShare: React.FC<IItemSalesShareProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  if (!data) {
    return null;
  }

  const groupedData = data.items.reduce<{ [key: string]: number }>(
    (acc, curr) => {
      acc[curr.itemName] = curr.quantitySold + (acc[curr.itemName] || 0);
      return acc;
    },
    {},
  );

  const chartData = Object.keys(groupedData).map((itemName) => ({
    name: itemName,
    value: groupedData[itemName],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        {/* <Pie
          dataKey="quantity"
          isAnimationActive={false}
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        /> */}
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          className={'fill-primary'}
          paddingAngle={2}
          labelLine={false}
          label
          legendType="circle"
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
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ItemSalesShare;
