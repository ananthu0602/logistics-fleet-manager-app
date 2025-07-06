
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Download, Plus, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TruckChart from '@/components/TruckChart';
import TruckTable from '@/components/TruckTable';

interface TruckData {
  id: string;
  vin: string;
  model: string;
  year: number;
  capacity: number;
  charges: number;
  notes: string;
  dateAdded: string;
}

const Index = () => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [formData, setFormData] = useState({
    vin: '',
    model: '',
    year: '',
    capacity: '',
    charges: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load trucks from localStorage on component mount
  useEffect(() => {
    const savedTrucks = localStorage.getItem('truckFleetData');
    if (savedTrucks) {
      setTrucks(JSON.parse(savedTrucks));
    }
  }, []);

  // Save trucks to localStorage whenever trucks array changes
  useEffect(() => {
    localStorage.setItem('truckFleetData', JSON.stringify(trucks));
  }, [trucks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.vin.trim()) {
      toast({ title: "Error", description: "VIN is required", variant: "destructive" });
      return false;
    }
    if (!formData.model.trim()) {
      toast({ title: "Error", description: "Model is required", variant: "destructive" });
      return false;
    }
    if (!formData.year || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1) {
      toast({ title: "Error", description: "Please enter a valid year", variant: "destructive" });
      return false;
    }
    if (!formData.capacity || parseFloat(formData.capacity) <= 0) {
      toast({ title: "Error", description: "Capacity must be greater than 0", variant: "destructive" });
      return false;
    }
    if (!formData.charges || parseFloat(formData.charges) < 0) {
      toast({ title: "Error", description: "Charges cannot be negative", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTruck: TruckData = {
      id: Date.now().toString(),
      vin: formData.vin,
      model: formData.model,
      year: parseInt(formData.year),
      capacity: parseFloat(formData.capacity),
      charges: parseFloat(formData.charges),
      notes: formData.notes,
      dateAdded: new Date().toISOString()
    };

    setTrucks(prev => [...prev, newTruck]);
    
    // Reset form
    setFormData({
      vin: '',
      model: '',
      year: '',
      capacity: '',
      charges: '',
      notes: ''
    });

    setIsLoading(false);
    toast({ title: "Success", description: "Truck added successfully!" });
  };

  const handleDownloadExcel = () => {
    if (trucks.length === 0) {
      toast({ title: "No Data", description: "No truck data to download", variant: "destructive" });
      return;
    }

    // Create CSV content (since we can't generate actual Excel without backend)
    const headers = ['VIN', 'Model', 'Year', 'Capacity (tons)', 'Charges ($)', 'Notes', 'Date Added'];
    const csvContent = [
      headers.join(','),
      ...trucks.map(truck => [
        truck.vin,
        truck.model,
        truck.year,
        truck.capacity,
        truck.charges,
        `"${truck.notes.replace(/"/g, '""')}"`,
        new Date(truck.dateAdded).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `truck_fleet_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Download Started", description: "Your truck data is being downloaded as CSV" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Truck className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Fleet Manager</h1>
          </div>
          <p className="text-xl text-gray-600">Manage your truck fleet with ease</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Truck Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Truck
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="vin" className="text-sm font-medium text-gray-700">VIN *</Label>
                    <Input
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      placeholder="Enter VIN number"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model" className="text-sm font-medium text-gray-700">Model *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Freightliner Cascadia"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">Year *</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="capacity" className="text-sm font-medium text-gray-700">Capacity (tons) *</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      step="0.1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="25.5"
                      min="0"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="charges" className="text-sm font-medium text-gray-700">Monthly Charges ($) *</Label>
                    <Input
                      id="charges"
                      name="charges"
                      type="number"
                      step="0.01"
                      value={formData.charges}
                      onChange={handleInputChange}
                      placeholder="1500.00"
                      min="0"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes about the truck..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding Truck...
                      </div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Truck
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Trucks</p>
                      <p className="text-2xl font-bold">{trucks.length}</p>
                    </div>
                    <Truck className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Capacity</p>
                      <p className="text-2xl font-bold">
                        {trucks.reduce((sum, truck) => sum + truck.capacity, 0).toFixed(1)}t
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Monthly Costs</p>
                      <p className="text-2xl font-bold">
                        ${trucks.reduce((sum, truck) => sum + truck.charges, 0).toLocaleString()}
                      </p>
                    </div>
                    <Download className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Fleet Capacity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <TruckChart trucks={trucks} />
              </CardContent>
            </Card>

            {/* Download Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleDownloadExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                disabled={trucks.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Excel Report
              </Button>
            </div>
          </div>
        </div>

        {/* Truck Table */}
        {trucks.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
              <CardTitle>Fleet Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TruckTable trucks={trucks} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
