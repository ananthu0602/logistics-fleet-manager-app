import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Vehicle } from '@/types';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        toast({ 
          title: "Error", 
          description: "Failed to fetch vehicles", 
          variant: "destructive" 
        });
        return;
      }

      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch vehicles", 
        variant: "destructive" 
      });
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single();

      if (error) {
        console.error('Error adding vehicle:', error);
        toast({ 
          title: "Error", 
          description: "Failed to add vehicle", 
          variant: "destructive" 
        });
        return false;
      }

      setVehicles(prev => [data, ...prev]);
      toast({ title: "Success", description: "Vehicle added successfully!" });
      return true;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add vehicle", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Omit<Vehicle, 'id' | 'created_at'>>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vehicle:', error);
        toast({ 
          title: "Error", 
          description: "Failed to update vehicle", 
          variant: "destructive" 
        });
        return false;
      }

      setVehicles(prev => prev.map(vehicle => vehicle.id === id ? data : vehicle));
      toast({ title: "Success", description: "Vehicle updated successfully!" });
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update vehicle", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting vehicle:', error);
        toast({ 
          title: "Error", 
          description: "Failed to delete vehicle", 
          variant: "destructive" 
        });
        return false;
      }

      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      toast({ title: "Success", description: "Vehicle deleted successfully!" });
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete vehicle", 
        variant: "destructive" 
      });
      return false;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    isLoading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
};