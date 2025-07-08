import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save } from 'lucide-react';
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
  balance?: number;
  datetime: string;
  dateAdded: string;
}

interface EditTruckDialogProps {
  truck: TruckData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<boolean>;
  isLoading: boolean;
}

const EditTruckDialog: React.FC<EditTruckDialogProps> = ({
  truck,
  isOpen,
  onClose,
  onUpdate,
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
    };

    const success = await onUpdate(truck.id, truckData);
    if (success) {
      onClose();
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
    { name: 'misc', label: 'Misc (₹)', type: 'number', placeholder: '0.00' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Edit Truck Entry
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  min={field.type === 'number' ? '0' : undefined}
                  className="mt-1"
                />
              </div>
            ))}
          </div>

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
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={isLoading}
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTruckDialog;