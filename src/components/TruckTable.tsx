
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TruckData {
  id: string;
  vehicleNumber?: string;
  driver?: string;
  datetime: string;
  serviceCost?: number;
  maintenanceCost?: number;
  fuelCost?: number;
  dateAdded: string;
}

interface TruckTableProps {
  trucks: TruckData[];
}

const TruckTable: React.FC<TruckTableProps> = ({ trucks }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Vehicle #</TableHead>
            <TableHead className="font-semibold text-gray-700">Driver</TableHead>
            <TableHead className="font-semibold text-gray-700">Date/Time</TableHead>
            <TableHead className="font-semibold text-gray-700">Service Cost</TableHead>
            <TableHead className="font-semibold text-gray-700">Maintenance</TableHead>
            <TableHead className="font-semibold text-gray-700">Fuel Cost</TableHead>
            <TableHead className="font-semibold text-gray-700">Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trucks.map((truck) => (
            <TableRow key={truck.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-900">
                {truck.vehicleNumber || '-'}
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
                ${((truck.serviceCost || 0) + (truck.maintenanceCost || 0) + (truck.fuelCost || 0)).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TruckTable;
