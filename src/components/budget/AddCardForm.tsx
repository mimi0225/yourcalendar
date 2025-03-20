
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBudget } from '@/context/BudgetContext';

const formSchema = z.object({
  name: z.string().min(1, 'Card name is required'),
  balance: z.coerce.number(),
  cardNumber: z.string().optional(),
  cardType: z.enum(['credit', 'debit']),
  color: z.string().optional(),
  expiryDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddCardForm: React.FC = () => {
  const { addCard } = useBudget();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      balance: 0,
      cardNumber: '',
      cardType: 'debit',
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
      expiryDate: '',
    },
  });

  const onSubmit = (data: FormData) => {
    addCard(data);
    form.reset({
      name: '',
      balance: 0,
      cardNumber: '',
      cardType: 'debit',
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // New random color
      expiryDate: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Add Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Debit Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Card Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="debit" />
                        </FormControl>
                        <FormLabel className="font-normal">Debit</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="credit" />
                        </FormControl>
                        <FormLabel className="font-normal">Credit</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
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
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number (last 4 digits)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 1234" 
                      maxLength={4} 
                      {...field} 
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (MM/YY)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 04/25" 
                      maxLength={5} 
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d/]/g, '');
                        
                        // Add slash after 2 digits if not already there
                        if (value.length === 2 && !value.includes('/')) {
                          value += '/';
                        }
                        
                        // Prevent more than one slash
                        if (value.split('/').length > 2) {
                          value = value.substring(0, value.lastIndexOf('/'));
                        }
                        
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: field.value || '#CCCCCC' }}
                      />
                      <Input type="color" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Add Card</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCardForm;
