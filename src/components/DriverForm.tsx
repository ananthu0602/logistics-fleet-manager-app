import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Users } from 'lucide-react';
import type { Driver } from '@/types';

const driverSchema = z.object({
  name: z.string().min(1, 'Driver name is required'),
  license_no: z.string().optional(),
  contact_no: z.string().optional(),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverFormProps {
  onSubmit: (data: Omit<Driver, 'id' | 'created_at'>) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Partial<Driver>;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: initialData?.name || '',
      license_no: initialData?.license_no || '',
      contact_no: initialData?.contact_no || '',
    },
  });

  const handleSubmit = async (data: DriverFormData) => {
    const success = await onSubmit(data as Omit<Driver, 'id' | 'created_at'>);
    if (success) {
      form.reset();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Driver Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter driver name" 
                      {...field}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="license_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter license number (optional)" 
                      {...field}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter contact number (optional)" 
                      {...field}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Driver'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DriverForm;