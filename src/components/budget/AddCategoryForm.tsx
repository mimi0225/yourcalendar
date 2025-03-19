
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tags, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/context/BudgetContext';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  budget: z.coerce.number().min(0, 'Budget must be a positive number'),
  color: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddCategoryForm: React.FC = () => {
  const { addCategory } = useBudget();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      budget: 0,
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
    },
  });

  const onSubmit = (data: FormData) => {
    addCategory(data);
    form.reset({
      name: '',
      budget: 0,
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // New random color
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Add Budget Category
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
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget</FormLabel>
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (optional)</FormLabel>
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
            
            <Button type="submit" className="w-full">Add Category</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm;
