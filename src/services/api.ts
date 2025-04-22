
import { supabase } from '@/lib/supabase';
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
        author:users(*),
        stops:road_stops(*),
        ratings:ratings(*)
      `);
    
    if (error) throw error;
    return formatResponseData(data) as RoadTrip[];
  },
  
  getTripById: async (id: string): Promise<RoadTrip | undefined> => {
    const { data, error } = await supabase
      .from('road_trips')
      .select(`
        *,
        author:users(*),
        stops:road_stops(*),
        ratings:ratings(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return formatResponseData(data) as RoadTrip;
  },
  
  createTrip: async (tripData: Partial<RoadTrip>): Promise<RoadTrip> => {
    const { data, error } = await supabase
      .from('road_trips')
      .insert(tripData)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponseData(data) as RoadTrip;
  },
  
  // Users
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    // Add createdTrips property (can be calculated from a query in a real implementation)
    const formattedData = formatResponseData(data).map((user: User) => ({
      ...user,
      createdTrips: 0 // Default value, would be calculated in a real implementation
    }));
    
    return formattedData as User[];
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const formattedData = formatResponseData(data);
    formattedData.createdTrips = 0; // Default value, would be calculated in a real implementation
    
    return formattedData as User;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No current user');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    const formattedData = formatResponseData(data);
    formattedData.createdTrips = 0; // Default value, would be calculated in a real implementation
    
    return formattedData as User;
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
      .select()
      .single();
    
    if (error) throw error;
    return formatResponseData(data) as Rating;
  }
};

// Export types for consistency
export type { User, RoadTrip, RoadStop, Rating };
