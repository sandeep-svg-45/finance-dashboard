import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, MoreHorizontal, Pencil, Trash2, ListFilter, FileText } from 'lucide-react';
import type { Transaction } from '@/types';
import { getCategoryName, categoryColors } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import TransactionFilters from './TransactionFilters';
import TransactionForm from './TransactionForm';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionList = () => {
  const { filteredTransactions, isAdmin, deleteTransaction } = useAppState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const confirmDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const getCategoryColor = (category: string): string => {
    return categoryColors[category as keyof typeof categoryColors] || '#6b7280';
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div 
      className="ultra-glass overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 dark:border-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <ListFilter className="h-6 w-6 text-white relative z-10" />
              <div className="absolute inset-0 rounded-2xl bg-amber-500 blur-lg opacity-50" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold">Transactions</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transaction
                {filteredTransactions.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleAdd} 
                className="gap-2 rounded-xl gradient-btn"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-white/10 dark:border-white/5 bg-white/30 dark:bg-black/20">
        <TransactionFilters />
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredTransactions.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileText className="h-12 w-12 text-slate-500" />
            </motion.div>
            <h3 className="mt-8 text-xl font-semibold">No transactions found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Try adjusting your filters or add a new transaction to get started.
            </p>
            {isAdmin && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
                <Button 
                  onClick={handleAdd} 
                  className="gap-2 rounded-xl gradient-btn"
                >
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <ScrollArea className="h-[450px] rounded-2xl border border-white/10 dark:border-white/5">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/30 dark:bg-black/20 hover:bg-transparent border-b border-white/10">
                  <TableHead className="font-semibold text-foreground/80">Date</TableHead>
                  <TableHead className="font-semibold text-foreground/80">Description</TableHead>
                  <TableHead className="font-semibold text-foreground/80">Category</TableHead>
                  <TableHead className="font-semibold text-foreground/80">Type</TableHead>
                  <TableHead className="text-right font-semibold text-foreground/80">Amount</TableHead>
                  {isAdmin && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      custom={index}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="group border-b border-white/5 transition-all duration-300 hover:bg-blue-500/5"
                      layout
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-slate-400/50" />
                          {formatDate(transaction.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground font-medium">{transaction.description}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="gap-2 rounded-full px-3 py-1.5 font-medium border-0 bg-white/40 dark:bg-black/30"
                          style={{ color: getCategoryColor(transaction.category) }}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ 
                              backgroundColor: getCategoryColor(transaction.category),
                              boxShadow: `0 0 8px ${getCategoryColor(transaction.category)}`
                            }}
                          />
                          {getCategoryName(transaction.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full px-3 py-1.5 font-medium border-0 ${
                            transaction.type === 'income'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span 
                            className={`mr-2 h-1.5 w-1.5 rounded-full ${
                              transaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{
                              boxShadow: transaction.type === 'income' 
                                ? '0 0 8px #10b981' 
                                : '0 0 8px #f43f5e'
                            }}
                          />
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold text-base ${
                          transaction.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </motion.span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="ultra-glass border-0">
                              <DropdownMenuItem
                                onClick={() => handleEdit(transaction)}
                                className="gap-2 cursor-pointer rounded-lg"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(transaction)}
                                className="gap-2 text-rose-600 cursor-pointer rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        transaction={editingTransaction}
        isOpen={isFormOpen}
        onClose={closeForm}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingTransaction}
        onOpenChange={() => setDeletingTransaction(null)}
      >
        <AlertDialogContent className="ultra-glass border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-rose-500" />
              </div>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete the transaction &quot;
              <span className="font-medium text-foreground">{deletingTransaction?.description}</span>
              &quot; for{' '}
              <span className="font-medium text-foreground">
                {deletingTransaction && formatCurrency(Math.abs(deletingTransaction.amount))}
              </span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl glass-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TransactionList;
