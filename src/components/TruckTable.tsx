
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
            <TableHead className="font-semibold text-gray-700">Model</TableHead>
            <TableHead className="font-semibold text-gray-700">Year</TableHead>
            <TableHead className="font-semibold text-gray-700">Capacity</TableHead>
            <TableHead className="font-semibold text-gray-700">Monthly Charges</TableHead>
            <TableHead className="font-semibold text-gray-700">Notes</TableHead>
            <TableHead className="font-semibold text-gray-700">Date Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trucks.map((truck) => (
            <TableRow key={truck.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-mono text-sm bg-gray-100 rounded px-2 py-1 max-w-[150px] truncate">
                {truck.vin}
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
              <TableCell className="font-medium text-green-600">
                ${truck.charges.toLocaleString()}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-gray-600">
                {truck.notes || 'No notes'}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {new Date(truck.dateAdded).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TruckTable;
