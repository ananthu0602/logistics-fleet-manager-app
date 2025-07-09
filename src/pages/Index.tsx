import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';
import VehicleForm from '@/components/VehicleForm';
import DriverForm from '@/components/DriverForm';
import TripForm from '@/components/TripForm';
import MaintenanceForm from '@/components/MaintenanceForm';
import ProfitDashboard from '@/components/ProfitDashboard';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import { useTrips } from '@/hooks/useTrips';
import { useOperationalCosts } from '@/hooks/useOperationalCosts';
const Index = () => {
  const {
    vehicles,
    isLoading: vehiclesLoading,
    addVehicle
  } = useVehicles();
  const {
    drivers,
    isLoading: driversLoading,
    addDriver
  } = useDrivers();
  const {
    trips,
    isLoading: tripsLoading,
    addTrip
  } = useTrips();
  const {
    operationalCosts,
    isLoading: costsLoading,
    addOperationalCost
  } = useOperationalCosts();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard';
  const isLoading = vehiclesLoading || driversLoading || tripsLoading || costsLoading;
  const renderDashboard = () => <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Logistics Dashboard</h2>
        <p className="text-gray-600">Monitor your fleet performance and profitability</p>
      </div>

      {/* Profit Dashboard */}
      <ProfitDashboard vehicles={vehicles} trips={trips} operationalCosts={operationalCosts} />
    </div>;
  const renderVehicles = () => <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
        <p className="text-gray-600">Register and manage your fleet vehicles</p>
      </div>
      <VehicleForm onSubmit={addVehicle} isLoading={vehiclesLoading} />
    </div>;
  const renderDrivers = () => <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
        <p className="text-gray-600">Register and manage your drivers</p>
      </div>
      <DriverForm onSubmit={addDriver} isLoading={driversLoading} />
    </div>;
  const renderTrips = () => <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Trip Management</h2>
        <p className="text-gray-600">Record trip details and expenses</p>
      </div>
      <TripForm onSubmit={addTrip} isLoading={tripsLoading} vehicles={vehicles} drivers={drivers} />
    </div>;
  const renderMaintenance = () => <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
        <p className="text-gray-600">Record maintenance and operational costs</p>
      </div>
      <MaintenanceForm onSubmit={addOperationalCost} isLoading={costsLoading} vehicles={vehicles} />
    </div>;
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 flex items-center justify-between border-b bg-white/70 backdrop-blur-sm px-[24px] rounded-none my-0 py-[40px]">
            <SidebarTrigger className="h-8 w-8" />
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900">Harbour Traders</h1>
              <p className="text-sm text-gray-600">Fleet Management System</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {currentTab === 'vehicles' ? renderVehicles() : currentTab === 'drivers' ? renderDrivers() : currentTab === 'trips' ? renderTrips() : currentTab === 'maintenance' ? renderMaintenance() : renderDashboard()}
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default Index;