
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TruckData {
  id: string;
  vin: string;
  vehicleNumber?: string;
  model: string;
  year: number;
  capacity: number;
  charges: number;
  driver?: string;
  datetime: string;
  serviceCost?: number;
  maintenanceCost?: number;
  fuelCost?: number;
  notes: string;
  dateAdded: string;
}

interface TruckTableProps {
  trucks: TruckData[];
}

const TruckTable: React.FC<TruckTableProps> = ({ trucks }) => {
  const getCapacityBadgeColor = (capacity: number) => {
    if (capacity < 15) return 'bg-green-100 text-green-800';
    if (capacity < 25) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getYearBadgeColor = (year: number) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    if (age <= 3) return 'bg-green-100 text-green-800';
    if (age <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">VIN</TableHead>
            <TableHead className="font-semibold text-gray-700">Vehicle #</TableHead>
            <TableHead className="font-semibold text-gray-700">Model</TableHead>
            <TableHead className="font-semibold text-gray-700">Year</TableHead>
            <TableHead className="font-semibold text-gray-700">Capacity</TableHead>
            <TableHead className="font-semibold text-gray-700">Driver</TableHead>
            <TableHead className="font-semibold text-gray-700">Date/Time</TableHead>
            <TableHead className="font-semibold text-gray-700">Service Cost</TableHead>
            <TableHead className="font-semibold text-gray-700">Maintenance</TableHead>
            <TableHead className="font-semibold text-gray-700">Fuel Cost</TableHead>
            <TableHead className="font-semibold text-gray-700">Monthly Charges</TableHead>
            <TableHead className="font-semibold text-gray-700">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trucks.map((truck) => (
            <TableRow key={truck.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-mono text-sm bg-gray-100 rounded px-2 py-1 max-w-[120px] truncate">
                {truck.vin}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {truck.vehicleNumber || '-'}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {truck.model}
              </TableCell>
              <TableCell>
                <Badge className={getYearBadgeColor(truck.year)}>
                  {truck.year}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getCapacityBadgeColor(truck.capacity)}>
                  {truck.capacity}t
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">
                {truck.driver || '-'}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {new Date(truck.datetime).toLocaleDateString()} {new Date(truck.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </TableCell>
              <TableCell className="font-medium text-blue-600">
                {truck.serviceCost ? `$${truck.serviceCost.toLocaleString()}` : '-'}
              </TableCell>
              <TableCell className="font-medium text-orange-600">
                {truck.maintenanceCost ? `$${truck.maintenanceCost.toLocaleString()}` : '-'}
              </TableCell>
              <TableCell className="font-medium text-red-600">
                {truck.fuelCost ? `$${truck.fuelCost.toLocaleString()}` : '-'}
              </TableCell>
              <TableCell className="font-medium text-green-600">
                ${truck.charges.toLocaleString()}
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-gray-600">
                {truck.notes || 'No notes'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TruckTable;
