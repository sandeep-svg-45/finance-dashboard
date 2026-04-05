import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO, subDays, isAfter } from 'date-fns';
import { motion } from 'framer-motion';

interface ChartData {
  date: string;
  formattedDate: string;
  balance: number;
  income: number;
  expense: number;
}

const BalanceTrendChart = () => {
  const { state } = useAppState();
  const { transactions } = state;

  const chartData = useMemo((): ChartData[] => {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    
    const filteredTxns = transactions.filter((t) => {
      const txnDate = parseISO(t.date);
      return isAfter(txnDate, startDate) || t.date === format(startDate, 'yyyy-MM-dd');
    });

    const groupedByDate = new Map<string, { income: number; expense: number }>();
    
    for (let i = 0; i <= 30; i++) {
      const date = format(subDays(endDate, i), 'yyyy-MM-dd');
      groupedByDate.set(date, { income: 0, expense: 0 });
    }

    filteredTxns.forEach((t) => {
      const current = groupedByDate.get(t.date) || { income: 0, expense: 0 };
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += Math.abs(t.amount);
      }
      groupedByDate.set(t.date, current);
    });

    let runningBalance = 0;
    const sortedDates = Array.from(groupedByDate.keys()).sort();
    
    const beforeStartTxns = transactions.filter((t) => {
      const txnDate = parseISO(t.date);
      return txnDate < startDate;
    });
    
    runningBalance = beforeStartTxns.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -Math.abs(t.amount));
    }, 0);

    return sortedDates.map((date) => {
      const data = groupedByDate.get(date)!;
      runningBalance += data.income - data.expense;
      
      return {
        date,
        formattedDate: format(parseISO(date), 'MMM dd'),
        balance: Math.round(runningBalance * 100) / 100,
        income: Math.round(data.income * 100) / 100,
        expense: Math.round(data.expense * 100) / 100,
      };
    });
  }, [transactions]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="ultra-glass p-4 border-0 min-w-[180px]">
          <p className="font-semibold text-foreground mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                <span className="text-sm text-muted-foreground">Balance</span>
              </div>
              <span className="text-sm font-semibold text-blue-500">
                {formatCurrency(payload[0].value)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                <span className="text-sm text-muted-foreground">Income</span>
              </div>
              <span className="text-sm font-semibold text-emerald-500">
                {formatCurrency(payload[1].value)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                <span className="text-sm text-muted-foreground">Expense</span>
              </div>
              <span className="text-sm font-semibold text-rose-500">
                {formatCurrency(payload[2].value)}
              </span>
            </div>
          </div>
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
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Balance Trend</h3>
            <p className="text-sm text-muted-foreground">30-day balance history</p>
          </div>
        </div>
        <div className="h-[320px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="ultra-glass p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <TrendingUp className="h-6 w-6 text-white relative z-10" />
          <div className="absolute inset-0 rounded-2xl bg-blue-500 blur-lg opacity-50" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Balance Trend</h3>
          <p className="text-sm text-muted-foreground">30-day balance, income, and expense history</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBalance)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 0, fill: '#3b82f6' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BalanceTrendChart;
