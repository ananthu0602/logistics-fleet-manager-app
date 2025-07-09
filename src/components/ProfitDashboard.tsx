import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Vehicle, Trip, OperationalCost, ProfitCalculation } from '@/types';

interface ProfitDashboardProps {
  vehicles: Vehicle[];
  trips: Trip[];
  operationalCosts: OperationalCost[];
}

const ProfitDashboard: React.FC<ProfitDashboardProps> = ({ vehicles, trips, operationalCosts }) => {
  const profitCalculations = useMemo(() => {
    return vehicles.map(vehicle => {
      // Calculate fixed cost
      const fixedCost = (vehicle.emi || 0) + (vehicle.insurance || 0) + (vehicle.tax || 0) + (vehicle.pucc || 0) + (vehicle.permit || 0);
      
      // Calculate variable cost from trips
      const vehicleTrips = trips.filter(trip => trip.vehicle_id === vehicle.id);
      const tripExpenses = vehicleTrips.reduce((sum, trip) => {
        return sum + (trip.fuel || 0) + (trip.bata || 0) + (trip.toll || 0) + (trip.rto || 0) + (trip.misc || 0);
      }, 0);
      
      // Calculate maintenance costs
      const maintenanceCosts = operationalCosts
        .filter(cost => cost.vehicle_id === vehicle.id)
        .reduce((sum, cost) => sum + (cost.maintenance_charge || 0), 0);
      
      const variableCost = tripExpenses + maintenanceCosts;
      
      // Calculate total hire
      const totalHire = vehicleTrips.reduce((sum, trip) => sum + (trip.hire || 0), 0);
      
      // Calculate profit
      const profit = totalHire - fixedCost - variableCost;
      
      return {
        vehicle_id: vehicle.id,
        vehicle_number: vehicle.vehicle_number,
        total_hire: totalHire,
        fixed_cost: fixedCost,
        variable_cost: variableCost,
        profit,
      } as ProfitCalculation;
    });
  }, [vehicles, trips, operationalCosts]);

  const totalProfit = profitCalculations.reduce((sum, calc) => sum + calc.profit, 0);
  const profitableVehicles = profitCalculations.filter(calc => calc.profit > 0).length;
  const losingVehicles = profitCalculations.filter(calc => calc.profit < 0).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}₹{totalProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Profitable Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{profitableVehicles}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5" />
              Loss-Making Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-600">{losingVehicles}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Profit Table */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
          <CardTitle>Vehicle-wise Profit Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Vehicle</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Hire</TableHead>
                  <TableHead className="font-semibold text-gray-700">Fixed Cost</TableHead>
                  <TableHead className="font-semibold text-gray-700">Variable Cost</TableHead>
                  <TableHead className="font-semibold text-gray-700">Profit/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitCalculations.map((calc) => (
                  <TableRow key={calc.vehicle_id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      {calc.vehicle_number}
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">
                      ₹{calc.total_hire.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-orange-600">
                      ₹{calc.fixed_cost.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-purple-600">
                      ₹{calc.variable_cost.toLocaleString()}
                    </TableCell>
                    <TableCell className={`font-bold ${calc.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calc.profit >= 0 ? '+' : ''}₹{calc.profit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitDashboard;