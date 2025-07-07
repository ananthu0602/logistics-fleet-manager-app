import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TruckData {
  id: string;
  vehicle?: string;
  hire?: number;
  expense?: number;
  trips?: number;
  fuel?: number;
  bata?: number;
  maintenance?: number;
  holding?: number;
  unloading?: number;
  toll?: number;
  rto?: number;
  misc?: number;
  datetime: string;
  dateAdded: string;
}

interface EditTruckDialogProps {
  truck: TruckData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<TruckData, 'id' | 'dateAdded'>>) => Promise<boolean>;
  isLoading: boolean;
}

const EditTruckDialog: React.FC<EditTruckDialogProps> = ({
  truck,
  isOpen,
  onClose,
  onSave,
  isLoading
}) => {
  const [formData, setFormData] = useState({
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
    misc: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (truck) {
      setFormData({
        vehicle: truck.vehicle || '',
        hire: truck.hire?.toString() || '',
        expense: truck.expense?.toString() || '',
        trips: truck.trips?.toString() || '',
        fuel: truck.fuel?.toString() || '',
        bata: truck.bata?.toString() || '',
        maintenance: truck.maintenance?.toString() || '',
        holding: truck.holding?.toString() || '',
        unloading: truck.unloading?.toString() || '',
        toll: truck.toll?.toString() || '',
        rto: truck.rto?.toString() || '',
        misc: truck.misc?.toString() || ''
      });
      setSelectedDate(new Date(truck.datetime));
    }
  }, [truck]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truck) return;

    const updates = {
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
    };

    const success = await onSave(truck.id, updates);
    if (success) {
      onClose();
    }
  };

  const fields = [
    { name: 'vehicle', label: 'Vehicle Number', type: 'text', placeholder: 'Enter vehicle number' },
    { name: 'hire', label: 'Hire Amount (₹)', type: 'number', placeholder: '0.00' },
    { name: 'expense', label: 'General Expense (₹)', type: 'number', placeholder: '0.00' },
    { name: 'trips', label: 'Number of Trips', type: 'number', placeholder: '0' },
    { name: 'fuel', label: 'Fuel Cost (₹)', type: 'number', placeholder: '0.00' },
    { name: 'bata', label: 'Driver Allowance (₹)', type: 'number', placeholder: '0.00' },
    { name: 'maintenance', label: 'Maintenance Cost (₹)', type: 'number', placeholder: '0.00' },
    { name: 'holding', label: 'Holding Charges (₹)', type: 'number', placeholder: '0.00' },
    { name: 'unloading', label: 'Unloading Charges (₹)', type: 'number', placeholder: '0.00' },
    { name: 'toll', label: 'Toll Charges (₹)', type: 'number', placeholder: '0.00' },
    { name: 'rto', label: 'RTO Charges (₹)', type: 'number', placeholder: '0.00' },
    { name: 'misc', label: 'Miscellaneous (₹)', type: 'number', placeholder: '0.00' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Save className="h-5 w-5" />
            Edit Truck Entry - {truck?.vehicle || 'Vehicle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name} className="text-sm font-medium text-card-foreground">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  step={field.type === 'number' ? '0.01' : undefined}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  min={field.type === 'number' ? '0' : undefined}
                  className="mt-1 transition-all duration-200 focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
          </div>

          <div>
            <Label className="text-sm font-medium text-card-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1 transition-all duration-200",
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
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="transition-all duration-200 hover:bg-secondary"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Entry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTruckDialog;