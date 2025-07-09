import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin } from 'lucide-react';
import type { Trip, Vehicle, Driver } from '@/types';

const tripSchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle is required'),
  driver_id: z.string().min(1, 'Driver is required'),
  date: z.string().min(1, 'Date is required'),
  from_location: z.string().min(1, 'From location is required'),
  to_location: z.string().min(1, 'To location is required'),
  fuel_liters: z.coerce.number().min(0, 'Fuel liters must be non-negative'),
  fuel: z.coerce.number().min(0, 'Fuel cost must be non-negative'),
  bata: z.coerce.number().min(0, 'Bata must be non-negative'),
  toll: z.coerce.number().min(0, 'Toll must be non-negative'),
  rto: z.coerce.number().min(0, 'RTO must be non-negative'),
  misc: z.coerce.number().min(0, 'Misc must be non-negative'),
  hire: z.coerce.number().min(0, 'Hire must be non-negative'),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripFormProps {
  onSubmit: (data: Omit<Trip, 'id' | 'created_at'>) => Promise<boolean>;
  isLoading: boolean;
  vehicles: Vehicle[];
  drivers: Driver[];
  initialData?: Partial<Trip>;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, vehicles, drivers, initialData }) => {
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      vehicle_id: initialData?.vehicle_id || '',
      driver_id: initialData?.driver_id || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      from_location: initialData?.from_location || '',
      to_location: initialData?.to_location || '',
      fuel_liters: initialData?.fuel_liters || 0,
      fuel: initialData?.fuel || 0,
      bata: initialData?.bata || 0,
      toll: initialData?.toll || 0,
      rto: initialData?.rto || 0,
      misc: initialData?.misc || 0,
      hire: initialData?.hire || 0,
    },
  });

  const handleSubmit = async (data: TripFormData) => {
    const selectedVehicle = vehicles.find(v => v.id === data.vehicle_id);
    const selectedDriver = drivers.find(d => d.id === data.driver_id);
    
    const tripData = {
      ...data,
      vehicle_number: selectedVehicle?.vehicle_number || '',
      driver_name: selectedDriver?.name || '',
    } as Omit<Trip, 'id' | 'created_at'>;
    
    const success = await onSubmit(tripData);
    if (success) {
      form.reset();
    }
  };

  const tripExpense = (form.watch('fuel') || 0) + 
                     (form.watch('bata') || 0) + 
                     (form.watch('toll') || 0) + 
                     (form.watch('rto') || 0) + 
                     (form.watch('misc') || 0);

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Trip Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500">
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
                name="driver_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      className="border-gray-300 focus:border-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Location *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Starting location" 
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Location *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Destination" 
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fuel_liters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Liters</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Cost (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="bata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bata (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toll"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toll (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTO (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="misc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Misc (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        className="border-gray-300 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hire Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      {...field}
                      className="border-gray-300 focus:border-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800 font-medium">
                Trip Expense: ₹{tripExpense.toLocaleString()}
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Adding...' : 'Add Trip'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TripForm;