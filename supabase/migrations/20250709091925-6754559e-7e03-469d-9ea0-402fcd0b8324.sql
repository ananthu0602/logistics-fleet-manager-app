-- Drop existing trucks table and create new schema
DROP TABLE IF EXISTS public.trucks;

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT NOT NULL UNIQUE,
  emi NUMERIC DEFAULT 0,
  insurance NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  pucc NUMERIC DEFAULT 0,
  permit NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles
CREATE POLICY "Allow all operations on vehicles" 
ON public.vehicles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  license_no TEXT,
  contact_no TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create policies for drivers
CREATE POLICY "Allow all operations on drivers" 
ON public.drivers 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  date DATE NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  fuel_liters NUMERIC DEFAULT 0,
  fuel NUMERIC DEFAULT 0,
  bata NUMERIC DEFAULT 0,
  toll NUMERIC DEFAULT 0,
  rto NUMERIC DEFAULT 0,
  misc NUMERIC DEFAULT 0,
  hire NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create policies for trips
CREATE POLICY "Allow all operations on trips" 
ON public.trips 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create operational_costs table
CREATE TABLE public.operational_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_charge NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on operational_costs
ALTER TABLE public.operational_costs ENABLE ROW LEVEL SECURITY;

-- Create policies for operational_costs
CREATE POLICY "Allow all operations on operational_costs" 
ON public.operational_costs 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_trips_vehicle_id ON public.trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON public.trips(driver_id);
CREATE INDEX idx_trips_date ON public.trips(date);
CREATE INDEX idx_operational_costs_vehicle_id ON public.operational_costs(vehicle_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;