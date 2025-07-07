
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

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

interface ProfitabilityDashboardProps {
  trucks: TruckData[];
}

const ProfitabilityDashboard: React.FC<ProfitabilityDashboardProps> = ({ trucks }) => {
  const calculateTruckProfit = (truck: TruckData) => {
    const income = (truck.hire || 0);
    const totalExpenses = (truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + 
                         (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + 
                         (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0);
    return income - totalExpenses;
  };

  const trucksWithProfit = trucks.map(truck => ({
    ...truck,
    profit: calculateTruckProfit(truck),
    totalExpenses: (truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + 
                   (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + 
                   (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0)
  }));

  const lossMakingTrucks = trucksWithProfit.filter(truck => truck.profit < 0);
  const profitableTrucks = trucksWithProfit.filter(truck => truck.profit > 0);
  const totalFleetProfit = trucksWithProfit.reduce((sum, truck) => sum + truck.profit, 0);

  if (trucks.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Profitability Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">No truck data available</p>
            <p className="text-sm">Add truck entries to see profitability analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Loss Making Trucks</p>
                <p className="text-2xl font-bold">{lossMakingTrucks.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Profitable Trucks</p>
                <p className="text-2xl font-bold">{profitableTrucks.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-r ${totalFleetProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'} text-white`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${totalFleetProfit >= 0 ? 'text-blue-100' : 'text-red-100'}`}>Total Fleet Profit</p>
                <p className="text-2xl font-bold">₹{totalFleetProfit.toLocaleString()}</p>
              </div>
              <DollarSign className={`h-8 w-8 ${totalFleetProfit >= 0 ? 'text-blue-200' : 'text-red-200'}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Fleet</p>
                <p className="text-2xl font-bold">{trucks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loss Making Trucks Detail */}
      {lossMakingTrucks.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Trucks Running at Loss
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {lossMakingTrucks.map((truck) => (
                <div key={truck.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-red-800">
                        {truck.vehicle || 'Unknown Vehicle'}
                      </h3>
                      <p className="text-sm text-red-600">
                        Date: {new Date(truck.datetime).toLocaleDateString()}
                      </p>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Hire:</span> ₹{(truck.hire || 0).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Expenses:</span> ₹{truck.totalExpenses.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Trips:</span> {truck.trips || 0}
                        </div>
                        <div>
                          <span className="font-medium">Balance:</span> ₹{(truck.balance || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        -₹{Math.abs(truck.profit).toLocaleString()}
                      </div>
                      <div className="text-sm text-red-500">Loss</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfitabilityDashboard;
