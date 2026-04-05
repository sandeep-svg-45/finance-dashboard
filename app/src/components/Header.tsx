import { useAppState } from '@/hooks/useAppState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Shield, Eye, Download, RotateCcw, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { state, toggleDarkMode, setUserRole, isAdmin, exportData, resetData } = useAppState();
  const { user, isDarkMode } = state;

  const handleExport = (format: 'json' | 'csv') => {
    const data = exportData(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.header 
      className="sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glass Header Background */}
      <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-white/20 dark:border-white/5" />
      
      <div className="container mx-auto relative">
        <div className="flex h-20 items-center justify-between px-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
              <Wallet className="relative h-6 w-6 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 blur-lg opacity-50" />
            </motion.div>
            
            <div className="hidden sm:block">
              <motion.h1 
                className="text-xl font-bold gradient-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Finance Pro
              </motion.h1>
              <p className="text-xs text-muted-foreground/80">Smart Financial Tracking</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl glass-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-slate-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Export Dropdown - Admin Only */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl glass-btn text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="ultra-glass border-0">
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    Export Data
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={() => handleExport('json')} className="cursor-pointer rounded-lg">
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer rounded-lg">
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Reset Data - Admin Only */}
            {isAdmin && (
              <motion.button
                onClick={resetData}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl glass-btn text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </motion.button>
            )}

            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  className="flex items-center gap-3 px-3 py-2 rounded-xl glass-btn"
                  whileHover={{ scale: 1.01 }}
                >
                  <Avatar className="h-9 w-9 ring-2 ring-white/30">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold leading-tight">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge
                    className={`ml-1 hidden text-[10px] uppercase tracking-wider sm:inline-flex border-0 ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <Shield className="mr-1 h-3 w-3" />
                    ) : (
                      <Eye className="mr-1 h-3 w-3" />
                    )}
                    {user.role}
                  </Badge>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="ultra-glass border-0 w-56">
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Switch Role
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem
                  onClick={() => setUserRole('viewer')}
                  className="cursor-pointer rounded-lg flex items-center gap-2"
                >
                  <Eye className="h-4 w-4 text-slate-500" />
                  <span>Viewer</span>
                  {user.role === 'viewer' && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setUserRole('admin')}
                  className="cursor-pointer rounded-lg flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Admin</span>
                  {user.role === 'admin' && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <p className="px-2 py-1.5 text-[10px] text-muted-foreground leading-relaxed">
                  {user.role === 'admin'
                    ? 'Admin can add, edit, and delete transactions'
                    : 'Viewer can only view data and export'}
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
