export interface Whiskey {
  id: number; 
  name: string;
  distillery: string | null;
  region: string | null;
  type: string | null; 
  age_years: number | null; 
  abv: string | null; 
  notes: string | null; 
  created_at: string; 
}

export interface Tasting {
  id: number; 
  whiskey_id: number; 
  taster: string; 
  tasted_on: string; 
  comment: string | null;
  rating: number | null; 
  created_at: string;
}