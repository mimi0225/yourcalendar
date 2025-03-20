
import React, { useState } from 'react';
import { Tag, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { BudgetCategory } from '@/types/budget';
import { useBudget } from '@/context/BudgetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditCategoryDialog from './EditCategoryDialog';

const CategoriesList: React.FC = () => {
  const { categories, deleteCategory, transactions } = useBudget();
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEdit = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    // Check if category is in use
    const isInUse = transactions.some(t => t.category === id);
    
    if (isInUse) {
      alert("Cannot delete category because it's in use by transactions. Please reassign those transactions first.");
      return;
    }
    
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setCategoryToDelete(null);
  };

  const getSpentAmount = (categoryId: string) => {
    return transactions
      .filter(t => t.category === categoryId && t.amount < 0) // Only expenses
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getBudgetUsagePercentage = (categoryId: string, budget: number) => {
    const spent = getSpentAmount(categoryId);
    if (budget <= 0) return 0;
    return Math.min(100, Math.round((spent / budget) * 100));
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Budget Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories yet. Add your first category to organize your expenses.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead>Budget Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const spent = getSpentAmount(category.id);
                  const percentage = getBudgetUsagePercentage(category.id, category.budget);
                  
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color || '#CCCCCC' }} 
                        />
                        <span>{category.name}</span>
                      </TableCell>
                      <TableCell className="text-right">${category.budget.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${spent.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              percentage > 90 ? 'bg-red-500' : 
                              percentage > 70 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-right mt-1">{percentage}%</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedCategory && (
        <EditCategoryDialog 
          category={selectedCategory} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoriesList;
