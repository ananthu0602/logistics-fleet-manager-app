import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wrench } from 'lucide-react';
import type { OperationalCost, Vehicle } from '@/types';

const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle is required'),
  maintenance_charge: z.coerce.number().min(0, 'Maintenance charge must be non-negative'),
  notes: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  onSubmit: (data: Omit<OperationalCost, 'id' | 'created_at'>) => Promise<boolean>;
  isLoading: boolean;
  vehicles: Vehicle[];
  initialData?: Partial<OperationalCost>;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit, isLoading, vehicles, initialData }) => {
  const form = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicle_id: initialData?.vehicle_id || '',
      maintenance_charge: initialData?.maintenance_charge || 0,
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = async (data: MaintenanceFormData) => {
    const success = await onSubmit(data as Omit<OperationalCost, 'id' | 'created_at'>);
    if (success) {
      form.reset();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Maintenance/Operational Cost Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_number}
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
              name="maintenance_charge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Charge (₹) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      placeholder="Enter maintenance cost"
                      {...field}
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter maintenance details (optional)"
                      {...field}
                      className="border-gray-300 focus:border-orange-500 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Maintenance Cost'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;