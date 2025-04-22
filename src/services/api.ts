
import { supabase } from '@/lib/supabase';
import { User, RoadTrip, RoadStop, Rating } from './types';

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
    return data as RoadTrip[];
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
    return data as RoadTrip;
  },
  
  createTrip: async (tripData: Partial<RoadTrip>): Promise<RoadTrip> => {
    const { data, error } = await supabase
      .from('road_trips')
      .insert(tripData)
      .select()
      .single();
    
    if (error) throw error;
    return data as RoadTrip;
  },
  
  // Users
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    return data as User[];
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as User;
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
    return data as User;
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
    return data as Rating;
  }
};

// Export types for consistency
export type { User, RoadTrip, RoadStop, Rating };
