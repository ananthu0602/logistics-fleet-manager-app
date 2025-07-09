import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Trip } from '@/types';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        toast({ 
          title: "Error", 
          description: "Failed to fetch trips", 
          variant: "destructive" 
        });
        return;
      }

      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch trips", 
        variant: "destructive" 
      });
    }
  };

  const addTrip = async (tripData: Omit<Trip, 'id' | 'created_at'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single();

      if (error) {
        console.error('Error adding trip:', error);
        toast({ 
          title: "Error", 
          description: "Failed to add trip", 
          variant: "destructive" 
        });
        return false;
      }

      setTrips(prev => [data, ...prev]);
      toast({ title: "Success", description: "Trip added successfully!" });
      return true;
    } catch (error) {
      console.error('Error adding trip:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add trip", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (id: string, tripData: Partial<Omit<Trip, 'id' | 'created_at'>>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .update(tripData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating trip:', error);
        toast({ 
          title: "Error", 
          description: "Failed to update trip", 
          variant: "destructive" 
        });
        return false;
      }

      setTrips(prev => prev.map(trip => trip.id === id ? data : trip));
      toast({ title: "Success", description: "Trip updated successfully!" });
      return true;
    } catch (error) {
      console.error('Error updating trip:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update trip", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting trip:', error);
        toast({ 
          title: "Error", 
          description: "Failed to delete trip", 
          variant: "destructive" 
        });
        return false;
      }

      setTrips(prev => prev.filter(trip => trip.id !== id));
      toast({ title: "Success", description: "Trip deleted successfully!" });
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete trip", 
        variant: "destructive" 
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    isLoading,
    addTrip,
    updateTrip,
    deleteTrip,
    refetch: fetchTrips
  };
};