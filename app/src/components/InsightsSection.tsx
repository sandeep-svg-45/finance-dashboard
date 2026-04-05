import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getCategoryName, categoryColors } from '@/data/mockData';
import { parseISO, isSameMonth, subMonths } from 'date-fns';
import { motion } from 'framer-motion';

const InsightsSection = () => {
  const { state, dashboardStats } = useAppState();
  const { transactions } = state;

  const insights = useMemo(() => {
    const result = [];

    // 1. Highest spending category
    const categoryTotals = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + Math.abs(t.amount));
      });

    let highestCategory = '';
    let highestAmount = 0;
    categoryTotals.forEach((amount, category) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = category;
      }
    });

    if (highestCategory) {
      result.push({
        type: 'highest' as const,
        title: 'Highest Spending',
        description: `Your highest spending is in ${getCategoryName(highestCategory as any)}`,
        value: formatCurrency(highestAmount),
        percentage: Math.round((highestAmount / dashboardStats.totalExpenses) * 100),
        icon: Target,
        color: categoryColors[highestCategory as keyof typeof categoryColors] || '#6b7280',
        gradient: 'from-violet-500 to-purple-500',
      });
    }

    // 2. Monthly comparison
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);

    const currentMonthExpenses = transactions
      .filter((t) => t.type === 'expense' && isSameMonth(parseISO(t.date), currentMonth))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const lastMonthExpenses = transactions
      .filter((t) => t.type === 'expense' && isSameMonth(parseISO(t.date), lastMonth))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (lastMonthExpenses > 0) {
      const change = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      result.push({
        type: 'comparison' as const,
        title: 'Monthly Trend',
        description:
          change > 0
            ? 'Spending increased vs last month'
            : 'Spending decreased vs last month',
        value: `${Math.abs(change).toFixed(1)}%`,
        trend: change > 0 ? ('up' as const) : ('down' as const),
        icon: change > 0 ? TrendingUp : TrendingDown,
        color: change > 0 ? '#ef4444' : '#22c55e',
        gradient: change > 0 ? 'from-rose-500 to-pink-500' : 'from-emerald-500 to-teal-500',
      });
    }

    // 3. Savings rate
    if (dashboardStats.monthlyIncome > 0) {
      const savingsRate =
        ((dashboardStats.monthlyIncome - dashboardStats.monthlyExpenses) /
          dashboardStats.monthlyIncome) *
        100;
      result.push({
        type: 'savings' as const,
        title: 'Savings Rate',
        description:
          savingsRate > 20
            ? 'Excellent! Saving over 20%'
            : savingsRate > 0
            ? 'Good progress, aim for 20%'
            : 'Spending exceeds income',
        value: `${savingsRate.toFixed(1)}%`,
        trend: savingsRate > 0 ? ('up' as const) : ('down' as const),
        icon: PiggyBank,
        color: savingsRate > 20 ? '#22c55e' : savingsRate > 0 ? '#f59e0b' : '#ef4444',
        gradient: savingsRate > 20 ? 'from-emerald-500 to-teal-500' : savingsRate > 0 ? 'from-amber-500 to-orange-500' : 'from-rose-500 to-pink-500',
      });
    }

    // 4. Budget alert
    if (dashboardStats.monthlyIncome > 0) {
      const spendingRatio =
        (dashboardStats.monthlyExpenses / dashboardStats.monthlyIncome) * 100;
      if (spendingRatio > 80) {
        result.push({
          type: 'alert' as const,
          title: 'Budget Alert',
          description: 'Spent over 80% of monthly income',
          value: `${spendingRatio.toFixed(1)}%`,
          icon: AlertTriangle,
          color: '#ef4444',
          gradient: 'from-rose-500 to-red-500',
        });
      }
    }

    // 5. Income vs Expense balance
    const netFlow = dashboardStats.monthlyIncome - dashboardStats.monthlyExpenses;
    result.push({
      type: 'balance' as const,
      title: 'Net Cash Flow',
      description:
        netFlow > 0
          ? 'Positive cash flow this month'
          : 'Negative cash flow this month',
      value: formatCurrency(Math.abs(netFlow)),
      trend: netFlow > 0 ? ('up' as const) : ('down' as const),
      icon: netFlow > 0 ? ArrowUpRight : ArrowDownRight,
      color: netFlow > 0 ? '#22c55e' : '#ef4444',
      gradient: netFlow > 0 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-pink-500',
    });

    return result;
  }, [transactions, dashboardStats]);

  const topCategories = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + Math.abs(t.amount));
      });

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        name: getCategoryName(category as any),
        color: categoryColors[category as keyof typeof categoryColors] || '#6b7280',
        percentage:
          dashboardStats.totalExpenses > 0
            ? (amount / dashboardStats.totalExpenses) * 100
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions, dashboardStats.totalExpenses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Insights Cards */}
      <motion.div 
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative"
            >
              {/* Glow */}
              <div 
                className="absolute -inset-0.5 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: `linear-gradient(135deg, ${insight.color}, transparent)` }}
              />
              
              <div className="ultra-glass relative h-full p-5">
                {/* Gradient Top */}
                <div 
                  className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${insight.gradient} rounded-t-3xl`}
                />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${insight.gradient}`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Icon className="h-5 w-5 text-white relative z-10" />
                      <div className="absolute inset-0 rounded-xl blur-lg opacity-50" />
                    </motion.div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                  </div>
                  
                  {insight.trend && (
                    <Badge
                      variant="secondary"
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 ${
                        insight.trend === 'up' 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {insight.trend === 'up' ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                    </Badge>
                  )}
                </div>

                <motion.div 
                  className="text-2xl font-bold mb-2"
                  style={{ color: insight.color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {insight.value}
                </motion.div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                
                {insight.percentage && (
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: insight.color,
                          boxShadow: `0 0 10px ${insight.color}`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {insight.percentage}% of total expenses
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Top Categories */}
      <motion.div 
        className="ultra-glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sparkles className="h-6 w-6 text-white relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-amber-500 blur-lg opacity-50" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold">Top Spending Categories</h3>
            <p className="text-sm text-muted-foreground">Where your money goes the most</p>
          </div>
        </div>

        {topCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No spending data available yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {topCategories.map((cat, index) => (
              <motion.div 
                key={cat.category}
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
                        backgroundColor: cat.color,
                        boxShadow: `0 0 8px ${cat.color}`
                      }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatCurrency(cat.amount)}</span>
                    <span className="w-12 text-right text-xs text-muted-foreground font-medium bg-secondary/50 px-2 py-1 rounded-full">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: cat.color,
                      boxShadow: `0 0 10px ${cat.color}`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InsightsSection;
