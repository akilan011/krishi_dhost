import { supabase } from './supabase';

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Check if farmers table exists by trying to select from it
    const { data, error } = await supabase
      .from('farmers')
      .select('count')
      .limit(1);
    
    if (error && error.message.includes('relation "public.farmers" does not exist')) {
      console.log('Farmers table does not exist, creating it...');
      
      // Create the farmers table using RPC call
      const { error: createError } = await supabase.rpc('create_farmers_table');
      
      if (createError) {
        console.error('Failed to create farmers table:', createError);
        // Table creation failed, but app can still work with localStorage fallback
        return false;
      }
      
      console.log('Farmers table created successfully!');
      return true;
    } else if (error) {
      console.error('Database check error:', error);
      return false;
    } else {
      console.log('Farmers table already exists');
      return true;
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};