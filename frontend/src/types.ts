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
  average_rating: string | null;
  tasting_count: string;
  last_tasted_at: string | null;
  image_url: string | null;
}

export interface Tasting {
  id: number; 
  taster: string;
  whiskey_id: number; 
  user_id: number;
  tasted_on: string; 
  comment: string | null;
  rating: number | null; 
  created_at: string;
}