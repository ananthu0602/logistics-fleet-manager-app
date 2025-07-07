
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, AlertTriangle, Wrench, Fuel, Clock } from 'lucide-react';

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

interface DashboardAnalyticsProps {
  trucks: TruckData[];
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ trucks }) => {
  const calculateProfit = (truck: TruckData) => {
    const income = truck.hire || 0;
    const totalExpenses = (truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + 
                         (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + 
                         (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0);
    return income - totalExpenses;
  };

  // Top 5 trucks running at loss
  const trucksAtLoss = trucks
    .map(truck => ({ ...truck, profit: calculateProfit(truck) }))
    .filter(truck => truck.profit < 0)
    .sort((a, b) => a.profit - b.profit)
    .slice(0, 5);

  // Top 5 trucks with least profit (but positive)
  const leastProfitableTrucks = trucks
    .map(truck => ({ ...truck, profit: calculateProfit(truck) }))
    .filter(truck => truck.profit > 0)
    .sort((a, b) => a.profit - b.profit)
    .slice(0, 5);

  // Top 5 trucks with highest maintenance cost
  const highestMaintenanceTrucks = trucks
    .filter(truck => (truck.maintenance || 0) > 0)
    .sort((a, b) => (b.maintenance || 0) - (a.maintenance || 0))
    .slice(0, 5);

  // Top 5 trucks with highest fuel cost
  const highestFuelTrucks = trucks
    .filter(truck => (truck.fuel || 0) > 0)
    .sort((a, b) => (b.fuel || 0) - (a.fuel || 0))
    .slice(0, 5);

  // Latest 5 submissions
  const latestSubmissions = trucks
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5);

  const AnalyticsCard = ({ title, icon: Icon, data, renderItem, emptyMessage, colorClass }: any) => (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className={`${colorClass} text-white rounded-t-lg`}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item: any, index: number) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{item.vehicle || 'Unknown Vehicle'}</span>
                  <div className="text-xs text-gray-500">
                    {new Date(item.datetime).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  {renderItem(item, index)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );

  const lastUpdated = trucks.length > 0 
    ? new Date(Math.max(...trucks.map(t => new Date(t.dateAdded).getTime())))
    : new Date();

  return (
    <div className="space-y-6">
      {/* Last Updated Timestamp */}
      <div className="text-right text-sm text-gray-600">
        Last updated: {lastUpdated.toLocaleString()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Trucks Running at Loss */}
        <AnalyticsCard
          title="Top 5 Trucks Running at Loss"
          icon={TrendingDown}
          data={trucksAtLoss}
          colorClass="bg-gradient-to-r from-red-600 to-red-700"
          renderItem={(truck: any) => (
            <div className="text-red-600 font-bold">
              -₹{Math.abs(truck.profit).toLocaleString()}
            </div>
          )}
          emptyMessage="No trucks running at loss"
        />

        {/* Top 5 Trucks with Least Profit */}
        <AnalyticsCard
          title="Top 5 Trucks with Least Profit"
          icon={AlertTriangle}
          data={leastProfitableTrucks}
          colorClass="bg-gradient-to-r from-yellow-600 to-yellow-700"
          renderItem={(truck: any) => (
            <div className="text-yellow-600 font-bold">
              ₹{truck.profit.toLocaleString()}
            </div>
          )}
          emptyMessage="No profitable trucks yet"
        />

        {/* Top 5 Trucks with Highest Maintenance Cost */}
        <AnalyticsCard
          title="Top 5 Trucks with Highest Maintenance"
          icon={Wrench}
          data={highestMaintenanceTrucks}
          colorClass="bg-gradient-to-r from-orange-600 to-orange-700"
          renderItem={(truck: any) => (
            <div className="text-orange-600 font-bold">
              ₹{(truck.maintenance || 0).toLocaleString()}
            </div>
          )}
          emptyMessage="No maintenance costs recorded"
        />

        {/* Top 5 Trucks with Highest Fuel Cost */}
        <AnalyticsCard
          title="Top 5 Trucks with Highest Fuel Cost"
          icon={Fuel}
          data={highestFuelTrucks}
          colorClass="bg-gradient-to-r from-purple-600 to-purple-700"
          renderItem={(truck: any) => (
            <div className="text-purple-600 font-bold">
              ₹{(truck.fuel || 0).toLocaleString()}
            </div>
          )}
          emptyMessage="No fuel costs recorded"
        />
      </div>

      {/* Latest 5 Submissions */}
      <AnalyticsCard
        title="Latest 5 Submissions"
        icon={Clock}
        data={latestSubmissions}
        colorClass="bg-gradient-to-r from-blue-600 to-blue-700"
        renderItem={(truck: any) => {
          const profit = calculateProfit(truck);
          return (
            <div className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profit >= 0 ? '₹' : '-₹'}{Math.abs(profit).toLocaleString()}
            </div>
          );
        }}
        emptyMessage="No submissions yet"
      />
    </div>
  );
};

export default DashboardAnalytics;
