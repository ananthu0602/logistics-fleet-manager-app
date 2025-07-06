
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

export const useTrucks = () => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch trucks from Supabase
  const fetchTrucks = async () => {
    try {
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) {
        console.error('Error fetching trucks:', error);
        toast({ 
          title: "Error", 
          description: "Failed to fetch truck data", 
          variant: "destructive" 
        });
        return;
      }

      // Transform the data to match our interface
      const transformedData: TruckData[] = data.map(truck => ({
        id: truck.id,
        vehicleNumber: truck.vehicle_number || undefined,
        driver: truck.driver || undefined,
        datetime: truck.datetime,
        serviceCost: truck.service_cost ? Number(truck.service_cost) : undefined,
        maintenanceCost: truck.maintenance_cost ? Number(truck.maintenance_cost) : undefined,
        fuelCost: truck.fuel_cost ? Number(truck.fuel_cost) : undefined,
        dateAdded: truck.date_added
      }));

      setTrucks(transformedData);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch truck data", 
        variant: "destructive" 
      });
    }
  };

  // Add a new truck
  const addTruck = async (truckData: Omit<TruckData, 'id' | 'dateAdded'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('trucks')
        .insert({
          vehicle_number: truckData.vehicleNumber || null,
          driver: truckData.driver || null,
          datetime: truckData.datetime,
          service_cost: truckData.serviceCost || null,
          maintenance_cost: truckData.maintenanceCost || null,
          fuel_cost: truckData.fuelCost || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding truck:', error);
        toast({ 
          title: "Error", 
          description: "Failed to add truck entry", 
          variant: "destructive" 
        });
        return false;
      }

      // Transform and add to local state
      const newTruck: TruckData = {
        id: data.id,
        vehicleNumber: data.vehicle_number || undefined,
        driver: data.driver || undefined,
        datetime: data.datetime,
        serviceCost: data.service_cost ? Number(data.service_cost) : undefined,
        maintenanceCost: data.maintenance_cost ? Number(data.maintenance_cost) : undefined,
        fuelCost: data.fuel_cost ? Number(data.fuel_cost) : undefined,
        dateAdded: data.date_added
      };

      setTrucks(prev => [newTruck, ...prev]);
      toast({ title: "Success", description: "Truck added successfully!" });
      return true;
    } catch (error) {
      console.error('Error adding truck:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add truck entry", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load trucks on component mount
  useEffect(() => {
    fetchTrucks();
  }, []);

  return {
    trucks,
    isLoading,
    addTruck,
    refetch: fetchTrucks
  };
};
