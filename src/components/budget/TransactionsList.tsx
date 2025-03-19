
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Receipt, Pencil, Trash2, ArrowUp, ArrowDown, FileImage } from 'lucide-react';
import { Transaction } from '@/types/budget';
import { useBudget } from '@/context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import EditTransactionDialog from './EditTransactionDialog';

const TransactionsList = () => {
  const { transactions, categories, deleteTransaction } = useBudget();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Add your first transaction to start tracking your budget.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-center">Receipt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...transactions]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.amount > 0 ? (
                          <Badge variant="outline" className="bg-green-100">
                            <ArrowUp className="h-3 w-3 mr-1" /> Income
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100">
                            <ArrowDown className="h-3 w-3 mr-1" /> Expense
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                          {getCategoryName(transaction.category)} • {format(transaction.date, 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{getCategoryName(transaction.category)}</TableCell>
                      <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-center">
                        {transaction.receiptImage ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openImagePreview(transaction.receiptImage!)}
                          >
                            <FileImage className="h-4 w-4 text-blue-500" />
                            <span className="sr-only">View Receipt</span>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Receipt Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Image</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-2">
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Receipt" 
                className="max-h-[70vh] object-contain rounded-md" 
              />
            )}
          </div>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {selectedTransaction && (
        <EditTransactionDialog 
          transaction={selectedTransaction} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  );
};

export default TransactionsList;
