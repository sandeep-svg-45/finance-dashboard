import { useAppState } from '@/hooks/useAppState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, ArrowUpDown, Calendar } from 'lucide-react';
import type { TransactionType, TransactionCategory } from '@/types';
import { getCategoryName } from '@/data/mockData';
import { AnimatePresence, motion } from 'framer-motion';

const TransactionFilters = () => {
  const { state, setFilters, resetFilters } = useAppState();
  const { filters } = state;

  const categories: TransactionCategory[] = [
    'salary', 'freelance', 'investment', 'food', 'transport', 'utilities',
    'entertainment', 'shopping', 'health', 'education', 'other',
  ];

  const hasActiveFilters =
    filters.search ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <motion.div 
          className="relative flex-1 max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-11 h-11 rounded-xl glass-input"
          />
        </motion.div>

        {/* Filter Controls */}
        <motion.div 
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Type Filter */}
          <Select
            value={filters.type}
            onValueChange={(value: TransactionType | 'all') => setFilters({ type: value })}
          >
            <SelectTrigger className="w-[140px] h-11 rounded-xl glass-input">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="ultra-glass border-0">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={filters.category}
            onValueChange={(value: TransactionCategory | 'all') =>
              setFilters({ category: value })
            }
          >
            <SelectTrigger className="w-[160px] h-11 rounded-xl glass-input">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="ultra-glass border-0 max-h-[300px]">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {getCategoryName(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={filters.sortBy}
            onValueChange={(value: 'date' | 'amount' | 'category') =>
              setFilters({ sortBy: value })
            }
          >
            <SelectTrigger className="w-[140px] h-11 rounded-xl glass-input">
              <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="ultra-glass border-0">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
              }
              className="h-11 w-11 rounded-xl glass-btn"
              title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  filters.sortOrder === 'asc' ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </motion.div>

          {/* Reset Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters} 
                  className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Date Range */}
      <motion.div 
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Date Range:</span>
        </div>
        <Input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => setFilters({ dateFrom: e.target.value || null })}
          className="w-auto h-10 rounded-xl glass-input"
          placeholder="From"
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => setFilters({ dateTo: e.target.value || null })}
          className="w-auto h-10 rounded-xl glass-input"
          placeholder="To"
        />
      </motion.div>
    </div>
  );
};

export default TransactionFilters;
