
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface TruckTableProps {
  trucks: TruckData[];
}

const TruckTable: React.FC<TruckTableProps> = ({ trucks }) => {
  const calculateProfit = (truck: TruckData) => {
    const income = truck.hire || 0;
    const totalExpenses = (truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + 
                         (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + 
                         (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0);
    return income - totalExpenses;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Vehicle</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="font-semibold text-gray-700">Hire</TableHead>
            <TableHead className="font-semibold text-gray-700">Trips</TableHead>
            <TableHead className="font-semibold text-gray-700">Fuel</TableHead>
            <TableHead className="font-semibold text-gray-700">Maintenance</TableHead>
            <TableHead className="font-semibold text-gray-700">Balance</TableHead>
            <TableHead className="font-semibold text-gray-700">Profit/Loss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trucks.map((truck) => {
            const profit = calculateProfit(truck);
            return (
              <TableRow key={truck.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium text-gray-900">
                  {truck.vehicle || '-'}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {new Date(truck.datetime).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {truck.hire ? `₹${truck.hire.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className="text-gray-700">
                  {truck.trips || '-'}
                </TableCell>
                <TableCell className="font-medium text-red-600">
                  {truck.fuel ? `₹${truck.fuel.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className="font-medium text-orange-600">
                  {truck.maintenance ? `₹${truck.maintenance.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {truck.balance ? `₹${truck.balance.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TruckTable;
