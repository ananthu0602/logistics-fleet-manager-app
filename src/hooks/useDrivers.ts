import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Driver } from '@/types';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching drivers:', error);
        toast({ 
          title: "Error", 
          description: "Failed to fetch drivers", 
          variant: "destructive" 
        });
        return;
      }

      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch drivers", 
        variant: "destructive" 
      });
    }
  };

  const addDriver = async (driverData: Omit<Driver, 'id' | 'created_at'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert(driverData)
        .select()
        .single();

      if (error) {
        console.error('Error adding driver:', error);
        toast({ 
          title: "Error", 
          description: "Failed to add driver", 
          variant: "destructive" 
        });
        return false;
      }

      setDrivers(prev => [data, ...prev]);
      toast({ title: "Success", description: "Driver added successfully!" });
      return true;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add driver", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriver = async (id: string, driverData: Partial<Omit<Driver, 'id' | 'created_at'>>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update(driverData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating driver:', error);
        toast({ 
          title: "Error", 
          description: "Failed to update driver", 
          variant: "destructive" 
        });
        return false;
      }

      setDrivers(prev => prev.map(driver => driver.id === id ? data : driver));
      toast({ title: "Success", description: "Driver updated successfully!" });
      return true;
    } catch (error) {
      console.error('Error updating driver:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update driver", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting driver:', error);
        toast({ 
          title: "Error", 
          description: "Failed to delete driver", 
          variant: "destructive" 
        });
        return false;
      }

      setDrivers(prev => prev.filter(driver => driver.id !== id));
      toast({ title: "Success", description: "Driver deleted successfully!" });
      return true;
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete driver", 
        variant: "destructive" 
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    isLoading,
    addDriver,
    updateDriver,
    deleteDriver,
    refetch: fetchDrivers
  };
};