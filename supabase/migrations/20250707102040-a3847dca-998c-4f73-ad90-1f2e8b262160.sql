
-- Add the missing columns to the trucks table
ALTER TABLE public.trucks 
ADD COLUMN hire numeric,
ADD COLUMN expense numeric,
ADD COLUMN trips integer,
ADD COLUMN bata numeric,
ADD COLUMN maintenance numeric,
ADD COLUMN holding numeric,
ADD COLUMN unloading numeric,
ADD COLUMN toll numeric,
ADD COLUMN rto numeric,
ADD COLUMN misc numeric,
ADD COLUMN balance numeric;

-- Remove the old columns that are no longer needed
ALTER TABLE public.trucks 
DROP COLUMN IF EXISTS service_cost,
DROP COLUMN IF EXISTS driver;

-- Rename maintenance_cost to match the new schema
ALTER TABLE public.trucks 
RENAME COLUMN maintenance_cost TO maintenance_cost_old;

-- Update the maintenance column to use the old data
UPDATE public.trucks 
SET maintenance = maintenance_cost_old 
WHERE maintenance_cost_old IS NOT NULL;

-- Drop the old column
ALTER TABLE public.trucks 
DROP COLUMN maintenance_cost_old;
