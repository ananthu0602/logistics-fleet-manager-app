
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, AlertTriangle } from 'lucide-react';
import TruckChart from '@/components/TruckChart';
import TruckTable from '@/components/TruckTable';
import TruckForm from '@/components/TruckForm';
import ProfitabilityDashboard from '@/components/ProfitabilityDashboard';
import DashboardAnalytics from '@/components/DashboardAnalytics';
import { useTrucks } from '@/hooks/useTrucks';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const { trucks, isLoading, addTruck } = useTrucks();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  const handleDownloadExcel = () => {
    if (trucks.length === 0) {
      return;
    }

    // Create CSV content with new fields
    const headers = ['Vehicle', 'Date', 'Hire (₹)', 'Expense (₹)', 'Trips', 'Fuel (₹)', 'Bata (₹)', 'Maintenance (₹)', 'Holding (₹)', 'Unloading (₹)', 'Toll (₹)', 'RTO (₹)', 'Misc (₹)', 'Balance (₹)', 'Profit/Loss (₹)'];
    const csvContent = [
      headers.join(','),
      ...trucks.map(truck => {
        const profit = (truck.hire || 0) - ((truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0));
        return [
          truck.vehicle || '',
          new Date(truck.datetime).toLocaleDateString(),
          truck.hire || 0,
          truck.expense || 0,
          truck.trips || 0,
          truck.fuel || 0,
          truck.bata || 0,
          truck.maintenance || 0,
          truck.holding || 0,
          truck.unloading || 0,
          truck.toll || 0,
          truck.rto || 0,
          truck.misc || 0,
          truck.balance || 0,
          profit
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `harbour_traders_fleet_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
        <p className="text-gray-600">Monitor your fleet performance and identify optimization opportunities</p>
      </div>

      {/* Top 5 Analytics */}
      <DashboardAnalytics trucks={trucks} />

      {/* Profitability Dashboard */}
      <ProfitabilityDashboard trucks={trucks} />

      {/* Chart Section */}
      {trucks.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Financial Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TruckChart trucks={trucks} />
          </CardContent>
        </Card>
      )}

      {/* Download Button */}
      {trucks.length > 0 && (
        <div className="flex justify-center">
          <Button 
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel Report
          </Button>
        </div>
      )}

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
  );

  const renderVehicleEntry = () => (
    <div className="space-y-6">
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
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 flex items-center justify-between border-b bg-white/70 backdrop-blur-sm px-6">
            <SidebarTrigger className="h-8 w-8" />
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900">Harbour Traders</h1>
              <p className="text-sm text-gray-600">Fleet Management System</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {currentTab === 'vehicle-entry' ? renderVehicleEntry() : renderDashboard()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
