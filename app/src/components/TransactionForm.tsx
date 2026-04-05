import { useState, useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Transaction, TransactionType, TransactionCategory } from '@/types';
import { getCategoryName } from '@/data/mockData';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TransactionFormProps {
  transaction?: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionForm = ({ transaction, isOpen, onClose }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useAppState();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    category: '' as TransactionCategory | '',
    type: 'expense' as TransactionType,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        type: transaction.type,
      });
    } else {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        amount: '',
        category: '',
        type: 'expense',
      });
    }
    setErrors({});
  }, [transaction, isOpen]);

  const incomeCategories: TransactionCategory[] = ['salary', 'freelance', 'investment'];
  const expenseCategories: TransactionCategory[] = [
    'food', 'transport', 'utilities', 'entertainment', 'shopping', 'health', 'education', 'other',
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const amount = Number(formData.amount);
    const finalAmount = formData.type === 'expense' ? -amount : amount;

    if (isEditing && transaction) {
      updateTransaction({
        ...transaction,
        date: formData.date,
        description: formData.description.trim(),
        amount: finalAmount,
        category: formData.category as TransactionCategory,
        type: formData.type,
      });
    } else {
      addTransaction({
        date: formData.date,
        description: formData.description.trim(),
        amount: finalAmount,
        category: formData.category as TransactionCategory,
        type: formData.type,
      });
    }

    onClose();
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: '',
    }));
  };

  const availableCategories =
    formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="ultra-glass sm:max-w-[440px] border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 text-xl">
            <motion.div 
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${
                isEditing 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <span className="text-xl text-white font-bold">{isEditing ? '✎' : '+'}</span>
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-50" 
                style={{ background: isEditing ? '#f59e0b' : '#3b82f6' }} 
              />
            </motion.div>
            <div>
              <span className="font-bold">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</span>
              <p className="text-sm text-muted-foreground font-normal">
                {isEditing ? 'Update transaction details' : 'Create a new transaction'}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Transaction Type</Label>
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  formData.type === 'income'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white/40 dark:bg-black/30 text-muted-foreground hover:bg-white/60 dark:hover:bg-black/50'
                }`}
                whileHover={{ scale: formData.type === 'income' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Income
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  formData.type === 'expense'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-white/40 dark:bg-black/30 text-muted-foreground hover:bg-white/60 dark:hover:bg-black/50'
                }`}
                whileHover={{ scale: formData.type === 'expense' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Expense
              </motion.button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-foreground/80">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className={`h-12 rounded-xl glass-input ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground/80">Description</Label>
            <Input
              id="description"
              placeholder="Enter description..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`h-12 rounded-xl glass-input ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-foreground/80">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-lg">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className={`h-12 pl-10 rounded-xl glass-input text-lg ${errors.amount ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-foreground/80">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: TransactionCategory) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className={`h-12 rounded-xl glass-input ${errors.category ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="ultra-glass border-0">
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryName(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl h-12 px-6 glass-btn"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className={`rounded-xl h-12 px-8 ${
                isEditing
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white border-0 shadow-lg font-semibold`}
            >
              {isEditing ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
