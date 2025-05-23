import { supabase } from '@/integrations/supabase/client';

// Helper function to convert snake_case to camelCase for frontend consumption
const formatResponseData = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => formatResponseData(item));
  }
  
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  
  const formattedData = { ...data };
  
  // Add camelCase versions of snake_case properties
  if ('average_rating' in formattedData) {
    formattedData.averageRating = formattedData.average_rating;
  }
  
  if ('created_at' in formattedData) {
    formattedData.createdAt = formattedData.created_at;
  }
  
  // Process nested objects
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] && typeof formattedData[key] === 'object') {
      formattedData[key] = formatResponseData(formattedData[key]);
    }
  });
  
  return formattedData;
};

export const api = {
  // Road Trips
  getTrips: async () => {
    const { data, error } = await supabase
      .from('road_trips')
      .select(`
        *,
        author:profiles(*),
        stops:road_stops(*),
        ratings:ratings(*)
      `);
    
    if (error) throw error;
    
    return formatResponseData(data || []);
  },
  
  getTripById: async (id) => {
    const { data, error } = await supabase
      .from('road_trips')
      .select(`
        *,
        author:profiles(*),
        stops:road_stops(*),
        ratings:ratings(*, user:profiles(*))
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return formatResponseData(data);
  },
  
  createTrip: async (tripData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to create a trip');

    // Extract only the fields that the road_trips table accepts
    const { title, description, image, distance, duration, location, difficulty } = tripData;
    
    // Ensure title is provided as it's required by the database
    if (!title) throw new Error('Trip title is required');

    const { data, error } = await supabase
      .from('road_trips')
      .insert({
        title,
        description,
        image,
        distance,
        duration,
        location,
        difficulty,
        author_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return formatResponseData(data);
  },
  
  // Users
  getUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    
    return formatResponseData(data);
  },
  
  getUserById: async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const formattedData = formatResponseData(data);
    return formattedData;
  },
  
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No current user');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return formatResponseData(data);
  },
  
  // Ratings & Reviews
  addRating: async (tripId, rating, comment) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to rate');
    
    // First get the user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Then create the rating with the profile data
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        rating,
        comment
      })
      .select()
      .single();
    
    if (error) throw error;

    // Combine the rating data with the user profile
    return formatResponseData({
      ...data,
      user: profile
    });
  },
  
  deleteTrip: async (id) => {
    const { error } = await supabase.from('road_trips').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
