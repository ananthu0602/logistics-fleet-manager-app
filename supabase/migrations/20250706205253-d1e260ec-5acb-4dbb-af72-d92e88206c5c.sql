
-- Create a table for truck fleet data
CREATE TABLE public.trucks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT,
  driver TEXT,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  service_cost DECIMAL(10,2),
  maintenance_cost DECIMAL(10,2),
  fuel_cost DECIMAL(10,2),
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for basic security
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read, insert, update, and delete
-- (You can make this more restrictive later if you add authentication)
CREATE POLICY "Allow all operations on trucks" 
  ON public.trucks 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
