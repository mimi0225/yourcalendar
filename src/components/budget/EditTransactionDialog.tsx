
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, FileImage, X } from 'lucide-react';
import { Transaction } from '@/types/budget';
import { useBudget } from '@/context/BudgetContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  type: z.enum(['income', 'expense']),
  receiptImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({ 
  transaction, 
  open, 
  onOpenChange 
}) => {
  const { updateTransaction, categories } = useBudget();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Determine if it's income or expense based on amount
  const transactionType = transaction.amount > 0 ? 'income' : 'expense';
  const absoluteAmount = Math.abs(transaction.amount);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: transaction.id,
      description: transaction.description,
      amount: absoluteAmount,
      category: transaction.category,
      date: new Date(transaction.date),
      type: transactionType,
      receiptImage: transaction.receiptImage || '',
    },
  });

  // Update preview image when transaction changes
  useEffect(() => {
    if (transaction.receiptImage) {
      setPreviewImage(transaction.receiptImage);
    } else {
      setPreviewImage(null);
    }
  }, [transaction]);

  const onSubmit = (data: FormData) => {
    // Adjust amount based on transaction type
    const adjustedAmount = data.type === 'expense' 
      ? -Math.abs(data.amount) 
      : Math.abs(data.amount);
    
    updateTransaction({
      ...data,
      amount: adjustedAmount,
      date: new Date(data.date),
    });
    
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        form.setValue('receiptImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    form.setValue('receiptImage', '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Receipt Image (Optional)</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/*"
                      id="editReceiptImage"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('editReceiptImage')?.click()}
                    className="w-full"
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    {previewImage ? 'Change Image' : 'Upload Receipt'}
                  </Button>
                  
                  {previewImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearImage}
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  )}
                </div>
                
                {previewImage && (
                  <div className="mt-2 rounded-md border overflow-hidden relative">
                    <img 
                      src={previewImage} 
                      alt="Receipt preview" 
                      className="max-h-[200px] mx-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </FormItem>
            
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
