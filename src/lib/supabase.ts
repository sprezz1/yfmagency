import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ApplicationData {
  name: string;
  email: string;
  nationality: string;
  country_of_residence: string;
  discord_username: string;
  phone_type: string;
  created_at?: string;
}

export async function submitApplication(data: ApplicationData) {
  const { error } = await supabase
    .from('applications')
    .insert([{ ...data, created_at: new Date().toISOString() }]);

  if (error) {
    console.error('Error submitting application:', error);
    throw error;
  }

  return true;
}
