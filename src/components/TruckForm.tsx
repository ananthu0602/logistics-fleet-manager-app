
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TruckFormData {
  vehicle: string;
  hire: string;
  expense: string;
  trips: string;
  fuel: string;
  bata: string;
  maintenance: string;
  holding: string;
  unloading: string;
  toll: string;
  rto: string;
  misc: string;
  balance: string;
}

interface TruckFormProps {
  onSubmit: (data: any) => Promise<boolean>;
  isLoading: boolean;
}

const TruckForm: React.FC<TruckFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TruckFormData>({
    vehicle: '',
    hire: '',
    expense: '',
    trips: '',
    fuel: '',
    bata: '',
    maintenance: '',
    holding: '',
    unloading: '',
    toll: '',
    rto: '',
    misc: '',
    balance: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const truckData = {
      vehicle: formData.vehicle || undefined,
      datetime: selectedDate.toISOString(),
      hire: formData.hire ? parseFloat(formData.hire) : undefined,
      expense: formData.expense ? parseFloat(formData.expense) : undefined,
      trips: formData.trips ? parseInt(formData.trips) : undefined,
      fuel: formData.fuel ? parseFloat(formData.fuel) : undefined,
      bata: formData.bata ? parseFloat(formData.bata) : undefined,
      maintenance: formData.maintenance ? parseFloat(formData.maintenance) : undefined,
      holding: formData.holding ? parseFloat(formData.holding) : undefined,
      unloading: formData.unloading ? parseFloat(formData.unloading) : undefined,
      toll: formData.toll ? parseFloat(formData.toll) : undefined,
      rto: formData.rto ? parseFloat(formData.rto) : undefined,
      misc: formData.misc ? parseFloat(formData.misc) : undefined,
      balance: formData.balance ? parseFloat(formData.balance) : undefined,
    };

    const success = await onSubmit(truckData);
    
    if (success) {
      // Reset form
      setFormData({
        vehicle: '',
        hire: '',
        expense: '',
        trips: '',
        fuel: '',
        bata: '',
        maintenance: '',
        holding: '',
        unloading: '',
        toll: '',
        rto: '',
        misc: '',
        balance: ''
      });
      setSelectedDate(new Date());
    }
  };

  const fields = [
    { name: 'vehicle', label: 'Vehicle', type: 'text', placeholder: 'Enter vehicle number' },
    { name: 'hire', label: 'Hire (₹)', type: 'number', placeholder: '0.00' },
    { name: 'expense', label: 'Expense (₹)', type: 'number', placeholder: '0.00' },
    { name: 'trips', label: 'Trips', type: 'number', placeholder: '0' },
    { name: 'fuel', label: 'Fuel (₹)', type: 'number', placeholder: '0.00' },
    { name: 'bata', label: 'Bata (₹)', type: 'number', placeholder: '0.00' },
    { name: 'maintenance', label: 'Maintenance (₹)', type: 'number', placeholder: '0.00' },
    { name: 'holding', label: 'Holding (₹)', type: 'number', placeholder: '0.00' },
    { name: 'unloading', label: 'Unloading (₹)', type: 'number', placeholder: '0.00' },
    { name: 'toll', label: 'Toll (₹)', type: 'number', placeholder: '0.00' },
    { name: 'rto', label: 'RTO (₹)', type: 'number', placeholder: '0.00' },
    { name: 'misc', label: 'Misc (₹)', type: 'number', placeholder: '0.00' },
    { name: 'balance', label: 'Balance (₹)', type: 'number', placeholder: '0.00' }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Truck Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                step={field.type === 'number' ? '0.01' : undefined}
                value={formData[field.name as keyof TruckFormData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                min={field.type === 'number' ? '0' : undefined}
                className="mt-1"
              />
            </div>
          ))}

          <div>
            <Label className="text-sm font-medium text-gray-700">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding Entry...
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TruckForm;
