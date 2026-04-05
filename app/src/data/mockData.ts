import type { Transaction, User, TransactionCategory, TransactionType } from '@/types';
import { format, subDays } from 'date-fns';

// Generate a random date within the last 90 days
const getRandomDate = (daysBack: number = 90): string => {
  const randomDays = Math.floor(Math.random() * daysBack);
  return format(subDays(new Date(), randomDays), 'yyyy-MM-dd');
};

// Categories with their typical ranges
const categoryConfig: Record<TransactionCategory, { type: TransactionType; min: number; max: number }> = {
  salary: { type: 'income', min: 3000, max: 8000 },
  freelance: { type: 'income', min: 500, max: 3000 },
  investment: { type: 'income', min: 100, max: 1500 },
  food: { type: 'expense', min: 10, max: 150 },
  transport: { type: 'expense', min: 5, max: 100 },
  utilities: { type: 'expense', min: 50, max: 300 },
  entertainment: { type: 'expense', min: 20, max: 200 },
  shopping: { type: 'expense', min: 30, max: 500 },
  health: { type: 'expense', min: 20, max: 300 },
  education: { type: 'expense', min: 50, max: 1000 },
  other: { type: 'expense', min: 10, max: 200 },
};

const categoryNames: Record<TransactionCategory, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  investment: 'Investment',
  food: 'Food & Dining',
  transport: 'Transportation',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  health: 'Health & Medical',
  education: 'Education',
  other: 'Other',
};

const descriptions: Record<TransactionCategory, string[]> = {
  salary: ['Monthly Salary', 'Bi-weekly Paycheck', 'Bonus Payment'],
  freelance: ['Web Design Project', 'Consulting Fee', 'Freelance Writing', 'Graphic Design'],
  investment: ['Stock Dividend', 'Crypto Gains', 'Interest Income', 'Rental Income'],
  food: ['Grocery Shopping', 'Restaurant Dinner', 'Coffee Shop', 'Lunch with Colleagues', 'Food Delivery'],
  transport: ['Uber Ride', 'Gas Station', 'Public Transit', 'Car Maintenance', 'Parking Fee'],
  utilities: ['Electric Bill', 'Internet Bill', 'Water Bill', 'Phone Bill', 'Gas Bill'],
  entertainment: ['Movie Tickets', 'Streaming Subscription', 'Concert Tickets', 'Game Purchase', 'Hobby Supplies'],
  shopping: ['Clothing Purchase', 'Electronics', 'Home Decor', 'Online Shopping', 'Department Store'],
  health: ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Health Insurance', 'Dental Checkup'],
  education: ['Online Course', 'Books', 'Workshop Fee', 'Certification', 'Tutoring'],
  other: ['Miscellaneous', 'Gift Purchase', 'Donation', 'Unexpected Expense'],
};

// Generate random transactions
export const generateMockTransactions = (count: number = 50): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories = Object.keys(categoryConfig) as TransactionCategory[];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const config = categoryConfig[category];
    const amount = Math.round((Math.random() * (config.max - config.min) + config.min) * 100) / 100;
    const descList = descriptions[category];
    const description = descList[Math.floor(Math.random() * descList.length)];
    
    transactions.push({
      id: `txn_${Date.now()}_${i}`,
      date: getRandomDate(),
      amount: config.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      description,
      category,
      type: config.type,
      createdAt: new Date().toISOString(),
    });
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
];

// Category colors for charts
export const categoryColors: Record<TransactionCategory, string> = {
  salary: '#22c55e',
  freelance: '#16a34a',
  investment: '#15803d',
  food: '#f97316',
  transport: '#3b82f6',
  utilities: '#8b5cf6',
  entertainment: '#ec4899',
  shopping: '#f59e0b',
  health: '#ef4444',
  education: '#06b6d4',
  other: '#6b7280',
};

// Export category names helper
export const getCategoryName = (category: TransactionCategory): string => {
  return categoryNames[category] || category;
};

// Initial mock data
export const initialTransactions = generateMockTransactions(60);
