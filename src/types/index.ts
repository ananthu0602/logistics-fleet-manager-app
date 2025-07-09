export interface Vehicle {
  id: string;
  vehicle_number: string;
  emi: number;
  insurance: number;
  tax: number;
  pucc: number;
  permit: number;
  created_at: string;
}

export interface Driver {
  id: string;
  name: string;
  license_no?: string;
  contact_no?: string;
  created_at: string;
}

export interface Trip {
  id: string;
  vehicle_id: string;
  driver_id: string;
  vehicle_number: string;
  driver_name: string;
  date: string;
  from_location: string;
  to_location: string;
  fuel_liters: number;
  fuel: number;
  bata: number;
  toll: number;
  rto: number;
  misc: number;
  hire: number;
  created_at: string;
}

export interface OperationalCost {
  id: string;
  vehicle_id: string;
  maintenance_charge: number;
  notes?: string;
  created_at: string;
}

export interface ProfitCalculation {
  vehicle_id: string;
  vehicle_number: string;
  total_hire: number;
  fixed_cost: number;
  variable_cost: number;
  profit: number;
}