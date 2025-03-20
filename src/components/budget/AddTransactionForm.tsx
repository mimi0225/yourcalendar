
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, FileImage, X, CreditCard, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBudget } from '@/context/BudgetContext';

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  type: z.enum(['income', 'expense']),
  paymentMethod: z.enum(['cash', 'card']),
  cardId: z.string().optional(),
  receiptImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddTransactionForm: React.FC = () => {
  const { addTransaction, categories, cards } = useBudget();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: categories.length > 0 ? categories[0].id : '',
      date: new Date(),
      type: 'expense',
      paymentMethod: 'cash',
      cardId: '',
      receiptImage: '',
    },
  });

  // Watch the payment method to show/hide card selection
  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = (data: FormData) => {
    // Adjust amount to negative for expenses
    const adjustedAmount = data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount);
    
    addTransaction({
      ...data,
      amount: adjustedAmount,
    });
    
    // Reset form
    form.reset({
      ...form.getValues(),
      description: '',
      amount: 0,
      receiptImage: '',
    });
    
    // Clear image preview
    setPreviewImage(null);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                    <Input placeholder="e.g., Groceries" {...field} />
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
                        placeholder="0.00"
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
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" id="cash" />
                        </FormControl>
                        <FormLabel htmlFor="cash" className="flex items-center font-normal">
                          <Wallet className="mr-1.5 h-4 w-4" />
                          Cash
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="card" id="card" />
                        </FormControl>
                        <FormLabel htmlFor="card" className="flex items-center font-normal">
                          <CreditCard className="mr-1.5 h-4 w-4" />
                          Card
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {paymentMethod === 'card' && cards.length > 0 && (
              <FormField
                control={form.control}
                name="cardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Card</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a card" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name} {card.cardNumber ? `(${card.cardNumber})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {paymentMethod === 'card' && cards.length === 0 && (
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                No cards available. Please add a card in the Cards tab first.
              </div>
            )}
            
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
                      id="receiptImage"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('receiptImage')?.click()}
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
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={paymentMethod === 'card' && cards.length === 0}
            >
              Add Transaction
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
