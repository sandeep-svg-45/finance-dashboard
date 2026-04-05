import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { categoryColors, getCategoryName } from '@/data/mockData';
import type { TransactionCategory } from '@/types';
import { motion } from 'framer-motion';

interface CategoryData {
  name: string;
  value: number;
  color: string;
  category: TransactionCategory;
}

const SpendingBreakdownChart = () => {
  const { state } = useAppState();
  const { transactions } = state;

  const chartData = useMemo((): CategoryData[] => {
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + Math.abs(t.amount));
      });

    const data: CategoryData[] = Array.from(categoryTotals.entries())
      .map(([category, value]) => ({
        name: getCategoryName(category as TransactionCategory),
        value: Math.round(value * 100) / 100,
        color: categoryColors[category as TransactionCategory],
        category: category as TransactionCategory,
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  }, [transactions]);

  const totalSpending = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalSpending > 0 ? ((data.value / totalSpending) * 100).toFixed(1) : '0';
      
      return (
        <div className="ultra-glass p-4 border-0 min-w-[160px]">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="h-3 w-3 rounded-full shadow-lg" 
              style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }}
            />
            <p className="font-semibold text-foreground">{data.name}</p>
          </div>
          <p className="text-xl font-bold" style={{ color: data.color }}>
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <motion.div 
        className="ultra-glass p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500">
            <PieChartIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Spending Breakdown</h3>
            <p className="text-sm text-muted-foreground">Expenses by category</p>
          </div>
        </div>
        <div className="h-[280px] flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="ultra-glass p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <PieChartIcon className="h-6 w-6 text-white relative z-10" />
          <div className="absolute inset-0 rounded-2xl bg-violet-500 blur-lg opacity-50" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Spending Breakdown</h3>
          <p className="text-sm text-muted-foreground">Expenses by category</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {chartData.slice(0, 4).map((item, index) => (
          <motion.div 
            key={item.category}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="h-2.5 w-2.5 rounded-full"
              style={{ 
                backgroundColor: item.color,
                boxShadow: `0 0 8px ${item.color}`
              }} 
            />
            <span className="text-xs font-medium">{item.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Category List */}
      <div className="mt-6 space-y-4">
        {chartData.slice(0, 5).map((item, index) => {
          const percentage = totalSpending > 0 ? ((item.value / totalSpending) * 100).toFixed(1) : '0';
          return (
            <motion.div 
              key={item.category}
              className="group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="h-3 w-3 rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`
                    }}
                    whileHover={{ scale: 1.5 }}
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                  <span className="w-12 text-right text-xs text-muted-foreground font-medium bg-secondary/50 px-2 py-1 rounded-full">
                    {percentage}%
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SpendingBreakdownChart;
