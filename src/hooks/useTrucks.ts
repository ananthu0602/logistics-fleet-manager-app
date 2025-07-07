
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

      // Transform the data to match our new interface
      const transformedData: TruckData[] = data.map(truck => ({
        id: truck.id,
        vehicle: truck.vehicle_number || undefined,
        hire: truck.hire ? Number(truck.hire) : undefined,
        expense: truck.expense ? Number(truck.expense) : undefined,
        trips: truck.trips ? Number(truck.trips) : undefined,
        fuel: truck.fuel_cost ? Number(truck.fuel_cost) : undefined,
        bata: truck.bata ? Number(truck.bata) : undefined,
        maintenance: truck.maintenance_cost ? Number(truck.maintenance_cost) : undefined,
        holding: truck.holding ? Number(truck.holding) : undefined,
        unloading: truck.unloading ? Number(truck.unloading) : undefined,
        toll: truck.toll ? Number(truck.toll) : undefined,
        rto: truck.rto ? Number(truck.rto) : undefined,
        misc: truck.misc ? Number(truck.misc) : undefined,
        balance: truck.balance ? Number(truck.balance) : undefined,
        datetime: truck.datetime,
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
          vehicle_number: truckData.vehicle || null,
          datetime: truckData.datetime,
          hire: truckData.hire || null,
          expense: truckData.expense || null,
          trips: truckData.trips || null,
          fuel_cost: truckData.fuel || null,
          bata: truckData.bata || null,
          maintenance_cost: truckData.maintenance || null,
          holding: truckData.holding || null,
          unloading: truckData.unloading || null,
          toll: truckData.toll || null,
          rto: truckData.rto || null,
          misc: truckData.misc || null,
          balance: truckData.balance || null
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
        vehicle: data.vehicle_number || undefined,
        hire: data.hire ? Number(data.hire) : undefined,
        expense: data.expense ? Number(data.expense) : undefined,
        trips: data.trips ? Number(data.trips) : undefined,
        fuel: data.fuel_cost ? Number(data.fuel_cost) : undefined,
        bata: data.bata ? Number(data.bata) : undefined,
        maintenance: data.maintenance_cost ? Number(data.maintenance_cost) : undefined,
        holding: data.holding ? Number(data.holding) : undefined,
        unloading: data.unloading ? Number(data.unloading) : undefined,
        toll: data.toll ? Number(data.toll) : undefined,
        rto: data.rto ? Number(data.rto) : undefined,
        misc: data.misc ? Number(data.misc) : undefined,
        balance: data.balance ? Number(data.balance) : undefined,
        datetime: data.datetime,
        dateAdded: data.date_added
      };

      setTrucks(prev => [newTruck, ...prev]);
      toast({ title: "Success", description: "Truck entry added successfully!" });
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
