
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, AlertTriangle, GraduationCap, Droplet, Trophy, Settings2, Clipboard, DollarSign, Receipt, PiggyBank, CreditCard, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/context/SettingsContext';
import LoginForm from '@/components/auth/LoginForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetSummary from '@/components/budget/BudgetSummary';
import AddTransactionForm from '@/components/budget/AddTransactionForm';
import TransactionsList from '@/components/budget/TransactionsList';
import AddCategoryForm from '@/components/budget/AddCategoryForm';
import CategoriesList from '@/components/budget/CategoriesList';
import AddSavingsAccountForm from '@/components/budget/AddSavingsAccountForm';
import SavingsAccountsList from '@/components/budget/SavingsAccountsList';
import AddCardForm from '@/components/budget/AddCardForm';
import CardsList from '@/components/budget/CardsList';

const Budget: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { tabSettings } = useSettings();
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="container max-w-7xl py-4 min-h-screen flex flex-col">
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground">
              Track your finances and manage your budget
            </p>
          </div>
        </div>
        
        {/* Mobile-optimized navigation tabs */}
        <div className="flex justify-center mt-4">
          <div className={`flex ${isMobile ? 'flex-wrap gap-2 justify-center' : 'gap-2'}`}>
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/">
                <Calendar className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Calendar</span>}
              </Link>
            </Button>
            
            {tabSettings.student && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/student">
                  <GraduationCap className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Student</span>}
                </Link>
              </Button>
            )}
            
            {tabSettings.period && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/period">
                  <Droplet className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Period</span>}
                </Link>
              </Button>
            )}
            
            {tabSettings.sports && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/sports">
                  <Trophy className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Sports</span>}
                </Link>
              </Button>
            )}
            
            {tabSettings.chores && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/chores">
                  <Clipboard className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Chores</span>}
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/budget">
                <DollarSign className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Budget</span>}
              </Link>
            </Button>
            
            {tabSettings.settings && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/settings">
                  <Settings2 className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Settings</span>}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {!isAuthenticated ? (
        <div className="my-8">
          <LoginForm />
        </div>
      ) : (
        <div className="flex-grow">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
              <TabsTrigger value="savings" className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4" />
                <span className="hidden sm:inline">Savings</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-4">
              <BudgetSummary />
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-6 mt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <AddTransactionForm />
                </div>
                <div className="md:col-span-2">
                  <TransactionsList />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cards" className="space-y-6 mt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <AddCardForm />
                </div>
                <div className="md:col-span-2">
                  <CardsList />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="savings" className="space-y-6 mt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <AddSavingsAccountForm />
                </div>
                <div className="md:col-span-2">
                  <SavingsAccountsList />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-6 mt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <AddCategoryForm />
                </div>
                <div className="md:col-span-2">
                  <CategoriesList />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Logout section at bottom */}
      {isAuthenticated && (
        <div className="mt-auto pt-6 border-t border-border flex flex-col items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="lg" className="w-full max-w-md">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Confirm Logout
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to sign in again to access your tracker.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {/* Moved logged in status to bottom */}
          {user && (
            <div className="mt-4 text-sm text-center">
              <span className="text-muted-foreground">Logged in as: </span>
              <span className="font-medium">{user.email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Budget;
