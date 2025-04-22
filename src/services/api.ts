
import { supabase } from '@/integrations/supabase/client';
import { User, RoadTrip, RoadStop, Rating } from './types';

// Helper function to convert snake_case to camelCase for frontend consumption
const formatResponseData = (data: any): any => {
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
  getTrips: async (): Promise<RoadTrip[]> => {
    const { data, error } = await supabase
      .from('road_trips')
      .select(`
        *,
        author:profiles(*),
        stops:road_stops(*),
        ratings:ratings(*)
      `);
    
    if (error) throw error;
    
    return formatResponseData(data || []) as RoadTrip[];
  },
  
  getTripById: async (id: string): Promise<RoadTrip | undefined> => {
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
    return formatResponseData(data) as RoadTrip;
  },
  
  createTrip: async (tripData: Partial<RoadTrip>): Promise<RoadTrip> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to create a trip');

    const { data, error } = await supabase
      .from('road_trips')
      .insert({
        ...tripData,
        author_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return formatResponseData(data) as RoadTrip;
  },
  
  // Users
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    
    return formatResponseData(data) as User[];
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const formattedData = formatResponseData(data);
    return formattedData as User;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No current user');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return formatResponseData(data) as User;
  },
  
  // Ratings & Reviews
  addRating: async (tripId: string, rating: number, comment: string): Promise<Rating> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to rate');
    
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        rating,
        comment
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();
    
    if (error) throw error;
    return formatResponseData(data) as Rating;
  }
};

// Export types for consistency
export type { User, RoadTrip, RoadStop, Rating };
