// Transaction Types
export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 
  | 'salary' 
  | 'freelance' 
  | 'investment' 
  | 'food' 
  | 'transport' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'health' 
  | 'education' 
  | 'other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  createdAt: string;
}

// User Role Types
export type UserRole = 'viewer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Filter Types
export interface TransactionFilters {
  search: string;
  type: TransactionType | 'all';
  category: TransactionCategory | 'all';
  dateFrom: string | null;
  dateTo: string | null;
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}

// Dashboard Stats
export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

// Chart Data Types
export interface BalanceTrendData {
  date: string;
  balance: number;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// Insight Types
export interface SpendingInsight {
  type: 'highest' | 'trend' | 'comparison' | 'suggestion';
  title: string;
  description: string;
  value?: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

// App State
export interface AppState {
  transactions: Transaction[];
  user: User;
  filters: TransactionFilters;
  isDarkMode: boolean;
  isLoading: boolean;
}

// Theme
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
}
