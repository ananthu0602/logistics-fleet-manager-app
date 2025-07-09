import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { OperationalCost } from '@/types';

export const useOperationalCosts = () => {
  const [operationalCosts, setOperationalCosts] = useState<OperationalCost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOperationalCosts = async () => {
    try {
      const { data, error } = await supabase
        .from('operational_costs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operational costs:', error);
        toast({ 
          title: "Error", 
          description: "Failed to fetch operational costs", 
          variant: "destructive" 
        });
        return;
      }

      setOperationalCosts(data || []);
    } catch (error) {
      console.error('Error fetching operational costs:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch operational costs", 
        variant: "destructive" 
      });
    }
  };

  const addOperationalCost = async (costData: Omit<OperationalCost, 'id' | 'created_at'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('operational_costs')
        .insert(costData)
        .select()
        .single();

      if (error) {
        console.error('Error adding operational cost:', error);
        toast({ 
          title: "Error", 
          description: "Failed to add operational cost", 
          variant: "destructive" 
        });
        return false;
      }

      setOperationalCosts(prev => [data, ...prev]);
      toast({ title: "Success", description: "Operational cost added successfully!" });
      return true;
    } catch (error) {
      console.error('Error adding operational cost:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add operational cost", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOperationalCost = async (id: string, costData: Partial<Omit<OperationalCost, 'id' | 'created_at'>>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('operational_costs')
        .update(costData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating operational cost:', error);
        toast({ 
          title: "Error", 
          description: "Failed to update operational cost", 
          variant: "destructive" 
        });
        return false;
      }

      setOperationalCosts(prev => prev.map(cost => cost.id === id ? data : cost));
      toast({ title: "Success", description: "Operational cost updated successfully!" });
      return true;
    } catch (error) {
      console.error('Error updating operational cost:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update operational cost", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOperationalCost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operational_costs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting operational cost:', error);
        toast({ 
          title: "Error", 
          description: "Failed to delete operational cost", 
          variant: "destructive" 
        });
        return false;
      }

      setOperationalCosts(prev => prev.filter(cost => cost.id !== id));
      toast({ title: "Success", description: "Operational cost deleted successfully!" });
      return true;
    } catch (error) {
      console.error('Error deleting operational cost:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete operational cost", 
        variant: "destructive" 
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOperationalCosts();
  }, []);

  return {
    operationalCosts,
    isLoading,
    addOperationalCost,
    updateOperationalCost,
    deleteOperationalCost,
    refetch: fetchOperationalCosts
  };
};