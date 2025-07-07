import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, AlertTriangle, Trash2 } from 'lucide-react';
import TruckChart from '@/components/TruckChart';
import TruckTable from '@/components/TruckTable';
import TruckForm from '@/components/TruckForm';
import ProfitabilityDashboard from '@/components/ProfitabilityDashboard';
import DashboardAnalytics from '@/components/DashboardAnalytics';
import EditTruckDialog from '@/components/EditTruckDialog';
import { useTrucks } from '@/hooks/useTrucks';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
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
const Index = () => {
  const {
    trucks,
    isLoading,
    addTruck,
    updateTruck,
    deleteTruck
  } = useTrucks();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard';
  const [editingTruck, setEditingTruck] = useState<TruckData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const handleEdit = (truck: TruckData) => {
    setEditingTruck(truck);
    setIsEditDialogOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this truck entry?')) {
      await deleteTruck(id);
    }
  };
  const handleDownloadExcel = () => {
    if (trucks.length === 0) {
      toast({
        title: "No Data",
        description: "No truck data available to export",
        variant: "destructive"
      });
      return;
    }

    // Create CSV content with new fields
    const headers = ['Vehicle', 'Date', 'Hire (₹)', 'Expense (₹)', 'Trips', 'Fuel (₹)', 'Bata (₹)', 'Maintenance (₹)', 'Holding (₹)', 'Unloading (₹)', 'Toll (₹)', 'RTO (₹)', 'Misc (₹)', 'Profit/Loss (₹)'];
    const csvContent = [headers.join(','), ...trucks.map(truck => {
      const profit = (truck.hire || 0) - ((truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0));
      return [truck.vehicle || '', new Date(truck.datetime).toLocaleDateString(), truck.hire || 0, truck.expense || 0, truck.trips || 0, truck.fuel || 0, truck.bata || 0, truck.maintenance || 0, truck.holding || 0, truck.unloading || 0, truck.toll || 0, truck.rto || 0, truck.misc || 0, profit].join(',');
    })].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `harbour_traders_fleet_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Successful",
      description: "Fleet data has been exported to CSV"
    });
  };
  const renderDashboard = () => <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>
        <p className="text-muted-foreground">Monitor your fleet performance and identify optimization opportunities</p>
      </div>

      {/* Top 5 Analytics */}
      <DashboardAnalytics trucks={trucks} />

      {/* Profitability Dashboard */}
      <ProfitabilityDashboard trucks={trucks} />

      {/* Chart Section */}
      {trucks.length > 0 && <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Financial Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TruckChart trucks={trucks} />
          </CardContent>
        </Card>}

      {/* Download Button */}
      {trucks.length > 0 && <div className="flex justify-center">
          <Button onClick={handleDownloadExcel} className="bg-success hover:bg-success/90 text-success-foreground font-medium py-2 px-6 rounded-md transition-all duration-200 shadow-md hover:shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Download Excel Report
          </Button>
        </div>}

      {/* Truck Table */}
      {trucks.length > 0 && <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/80 text-foreground rounded-t-lg">
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TruckTable trucks={trucks} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>}
    </div>;
  const renderVehicleEntry = () => <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">Vehicle Entry</h2>
        <p className="text-muted-foreground">Add new vehicle entries to your fleet</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <TruckForm onSubmit={addTruck} isLoading={isLoading} />
      </div>
    </div>;
  const renderManageEntries = () => <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Truck Data Entry</h2>
        <p className="text-gray-600">Add new truck entries and view fleet statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Truck Form */}
        <div className="lg:col-span-1">
          <TruckForm onSubmit={addTruck} isLoading={isLoading} />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Vehicles:</span>
                  <span className="font-bold text-2xl text-blue-600">{trucks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profitable Vehicles:</span>
                  <span className="font-bold text-2xl text-green-600">
                    {trucks.filter(truck => {
                    const profit = (truck.hire || 0) - ((truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0));
                    return profit > 0;
                  }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loss-Making Vehicles:</span>
                  <span className="font-bold text-2xl text-red-600">
                    {trucks.filter(truck => {
                    const profit = (truck.hire || 0) - ((truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0));
                    return profit < 0;
                  }).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 flex items-center justify-between border-b bg-card shadow-sm px-6">
            <SidebarTrigger className="h-8 w-8" />
            <div className="text-right">
              <h1 className="text-xl font-bold text-primary">Harbour Traders</h1>
              <p className="text-sm text-muted-foreground">Fleet Management System</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            {currentTab === 'vehicle-entry' ? renderVehicleEntry() : currentTab === 'manage-entries' ? renderManageEntries() : renderDashboard()}
          </main>
        </div>

        {/* Edit Dialog */}
        <EditTruckDialog truck={editingTruck} isOpen={isEditDialogOpen} onClose={() => {
        setIsEditDialogOpen(false);
        setEditingTruck(null);
      }} onSave={updateTruck} isLoading={isLoading} />
      </div>
    </SidebarProvider>;
};
export default Index;