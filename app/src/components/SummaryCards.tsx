import { useAppState } from '@/hooks/useAppState';
import { TrendingUp, TrendingDown, Wallet, CreditCard, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

const SummaryCards = () => {
  const { dashboardStats } = useAppState();
  const { totalBalance, totalIncome, totalExpenses, monthlyIncome, monthlyExpenses } = dashboardStats;

  const cards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: Wallet,
      trend: totalBalance >= 0 ? 'positive' : 'negative',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      glowColor: 'rgba(99, 102, 241, 0.5)',
      description: 'Net worth',
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      trend: 'positive',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      description: 'All earnings',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      trend: 'negative',
      gradient: 'from-rose-400 via-pink-500 to-fuchsia-500',
      glowColor: 'rgba(244, 63, 94, 0.5)',
      description: 'All spending',
    },
    {
      title: 'Monthly Income',
      value: monthlyIncome,
      icon: DollarSign,
      trend: 'positive',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glowColor: 'rgba(139, 92, 246, 0.5)',
      description: 'This month',
    },
    {
      title: 'Monthly Expenses',
      value: monthlyExpenses,
      icon: CreditCard,
      trend: 'negative',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      description: 'This month',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div 
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.trend === 'positive';
        
        return (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            className="group relative"
          >
            {/* Glow Effect */}
            <motion.div 
              className="absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: card.glowColor }}
            />
            
            {/* Card */}
            <div className="ultra-glass relative h-full p-6">
              {/* Top Gradient Line */}
              <div 
                className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${card.gradient} rounded-t-3xl`}
              />
              
              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground/80">{card.title}</p>
                    <motion.div 
                      className="mt-2 text-3xl font-bold tracking-tight"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.4, type: "spring" }}
                    >
                      <span className={isPositive ? 'text-foreground' : 'text-foreground'}>
                        {formatCurrency(Math.abs(card.value))}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Icon */}
                  <motion.div 
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient}`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Icon className="h-6 w-6 text-white relative z-10" />
                    <div 
                      className="absolute inset-0 rounded-2xl blur-lg opacity-60"
                      style={{ background: card.glowColor }}
                    />
                  </motion.div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground/70">{card.description}</p>
                  
                  <motion.div
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isPositive 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </motion.div>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div 
                className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.08] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.15]`}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SummaryCards;
