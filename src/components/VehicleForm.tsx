import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Truck } from 'lucide-react';
import type { Vehicle } from '@/types';

const vehicleSchema = z.object({
  vehicle_number: z.string().min(1, 'Vehicle number is required'),
  emi: z.coerce.number().min(0, 'EMI must be non-negative'),
  insurance: z.coerce.number().min(0, 'Insurance must be non-negative'),
  tax: z.coerce.number().min(0, 'Tax must be non-negative'),
  pucc: z.coerce.number().min(0, 'PUCC must be non-negative'),
  permit: z.coerce.number().min(0, 'Permit must be non-negative'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit: (data: Omit<Vehicle, 'id' | 'created_at'>) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Partial<Vehicle>;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle_number: initialData?.vehicle_number || '',
      emi: initialData?.emi || 0,
      insurance: initialData?.insurance || 0,
      tax: initialData?.tax || 0,
      pucc: initialData?.pucc || 0,
      permit: initialData?.permit || 0,
    },
  });

  const handleSubmit = async (data: VehicleFormData) => {
    const success = await onSubmit(data as Omit<Vehicle, 'id' | 'created_at'>);
    if (success) {
      form.reset();
    }
  };

  const fixedCost = (form.watch('emi') || 0) + 
                   (form.watch('insurance') || 0) + 
                   (form.watch('tax') || 0) + 
                   (form.watch('pucc') || 0) + 
                   (form.watch('permit') || 0);

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Vehicle Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicle_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., KL07CY2255" 
                      {...field}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMI (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pucc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PUCC (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permit (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                Fixed Cost per Vehicle: ₹{fixedCost.toLocaleString()}
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;