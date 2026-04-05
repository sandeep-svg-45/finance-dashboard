import { AppProvider } from '@/hooks/useAppState';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import BalanceTrendChart from '@/components/BalanceTrendChart';
import SpendingBreakdownChart from '@/components/SpendingBreakdownChart';
import TransactionList from '@/components/TransactionList';
import InsightsSection from '@/components/InsightsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, List, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen relative">
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Content */}
        <div className="relative z-10">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            <Tabs defaultValue="dashboard" className="space-y-8">
              {/* Tabs Navigation */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <TabsList className="ultra-glass p-1.5 h-auto">
                  <TabsTrigger 
                    value="dashboard" 
                    className="glass-tab data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline font-medium">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transactions" 
                    className="glass-tab data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <List className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline font-medium">Transactions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="glass-tab data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline font-medium">Insights</span>
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-8 mt-0">
                <SummaryCards />

                <div className="grid gap-6 lg:grid-cols-2">
                  <BalanceTrendChart />
                  <SpendingBreakdownChart />
                </div>

                <TransactionList />
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="mt-0">
                <TransactionList />
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="mt-0">
                <InsightsSection />
              </TabsContent>
            </Tabs>
          </main>

          {/* Footer */}
          <motion.footer 
            className="mt-20 pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="container mx-auto px-4">
              <div className="ultra-glass py-6 px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      }}
                    >
                      <span className="text-sm font-bold text-white">F</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Finance Pro Dashboard</p>
                      <p className="text-xs text-muted-foreground">Built with React, TypeScript & Tailwind CSS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground bg-white/30 dark:bg-black/30 px-4 py-2 rounded-full">
                      Data persists in local storage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.footer>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
