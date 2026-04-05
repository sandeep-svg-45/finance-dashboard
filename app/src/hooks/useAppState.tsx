import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, TransactionFilters, DashboardStats, UserRole, AppState } from '@/types';
import { initialTransactions, mockUsers, generateMockTransactions } from '@/data/mockData';
import { parseISO, isWithinInterval, isSameMonth } from 'date-fns';

// Storage keys
const STORAGE_KEY = 'finance_dashboard_data';
const THEME_KEY = 'finance_dashboard_theme';

// Initial state
const getInitialState = (): AppState => {
  // Try to load from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isLoading: false,
        };
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
  }

  return {
    transactions: initialTransactions,
    user: mockUsers[0],
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      dateFrom: null,
      dateTo: null,
      sortBy: 'date',
      sortOrder: 'desc',
    },
    isDarkMode: false,
    isLoading: false,
  };
};

// Action types
type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TransactionFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'RESET_DATA' }
  | { type: 'IMPORT_DATA'; payload: Transaction[] };

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          search: '',
          type: 'all',
          category: 'all',
          dateFrom: null,
          dateTo: null,
          sortBy: 'date',
          sortOrder: 'desc',
        },
      };
    
    case 'SET_USER_ROLE':
      const targetUser = mockUsers.find((u) => u.role === action.payload) || mockUsers[0];
      return { ...state, user: targetUser };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    
    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload };
    
    case 'RESET_DATA':
      return {
        ...state,
        transactions: generateMockTransactions(60),
      };
    
    case 'IMPORT_DATA':
      return {
        ...state,
        transactions: [...action.payload, ...state.transactions],
      };
    
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Computed values
  filteredTransactions: Transaction[];
  dashboardStats: DashboardStats;
  isAdmin: boolean;
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  setUserRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  resetData: () => void;
  exportData: (format: 'json' | 'csv') => string;
  importData: (data: Transaction[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // Load theme preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        dispatch({ type: 'SET_DARK_MODE', payload: savedTheme === 'dark' });
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dispatch({ type: 'SET_DARK_MODE', payload: true });
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        transactions: state.transactions,
        user: state.user,
        filters: state.filters,
      }));
      localStorage.setItem(THEME_KEY, state.isDarkMode ? 'dark' : 'light');
    }
  }, [state.transactions, state.user, state.filters, state.isDarkMode]);

  // Apply dark mode class
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...state.transactions];

    // Search filter
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (state.filters.type !== 'all') {
      result = result.filter((t) => t.type === state.filters.type);
    }

    // Category filter
    if (state.filters.category !== 'all') {
      result = result.filter((t) => t.category === state.filters.category);
    }

    // Date range filter
    if (state.filters.dateFrom || state.filters.dateTo) {
      result = result.filter((t) => {
        const txnDate = parseISO(t.date);
        const fromDate = state.filters.dateFrom ? parseISO(state.filters.dateFrom) : new Date(0);
        const toDate = state.filters.dateTo ? parseISO(state.filters.dateTo) : new Date(9999, 11, 31);
        return isWithinInterval(txnDate, { start: fromDate, end: toDate });
      });
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (state.filters.sortBy) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'amount':
          comparison = Math.abs(b.amount) - Math.abs(a.amount);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return state.filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [state.transactions, state.filters]);

  // Calculate dashboard stats
  const dashboardStats = useMemo((): DashboardStats => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const currentMonth = new Date();
    const monthlyIncome = state.transactions
      .filter((t) => t.type === 'income' && isSameMonth(parseISO(t.date), currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = state.transactions
      .filter((t) => t.type === 'expense' && isSameMonth(parseISO(t.date), currentMonth))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      transactionCount: state.transactions.length,
      monthlyIncome,
      monthlyExpenses,
    };
  }, [state.transactions]);

  const isAdmin = state.user.role === 'admin';

  // Actions
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  }, []);

  const updateTransaction = useCallback((transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  const setFilters = useCallback((filters: Partial<TransactionFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const resetData = useCallback(() => {
    dispatch({ type: 'RESET_DATA' });
  }, []);

  const exportData = useCallback((format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(state.transactions, null, 2);
    } else {
      const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
      const rows = state.transactions.map((t) => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.amount.toString(),
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
  }, [state.transactions]);

  const importData = useCallback((data: Transaction[]) => {
    dispatch({ type: 'IMPORT_DATA', payload: data });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    filteredTransactions,
    dashboardStats,
    isAdmin,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    resetFilters,
    setUserRole,
    toggleDarkMode,
    resetData,
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useAppState = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
