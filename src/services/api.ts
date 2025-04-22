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

const sampleTrips: Partial<RoadTrip>[] = [
  {
    title: "Pacific Coast Highway Adventure",
    description: "Experience the breathtaking beauty of California's coastline on this iconic road trip from San Francisco to Los Angeles.",
    image: "https://images.unsplash.com/photo-1540820658190-4d1c2d4a1731?w=800",
    distance: 750,
    duration: 5,
    location: "California, USA",
    difficulty: "Moderate",
    average_rating: 4.8
  },
  {
    title: "Iceland Ring Road Journey",
    description: "Circle the entire island of Iceland on Route 1, experiencing waterfalls, glaciers, and volcanic landscapes.",
    image: "https://images.unsplash.com/photo-1520769490916-ee4266dd5b24?w=800",
    distance: 1332,
    duration: 7,
    location: "Iceland",
    difficulty: "Hard",
    average_rating: 4.9
  },
  {
    title: "Great Ocean Road Expedition",
    description: "Drive along Australia's southeastern coast to see the Twelve Apostles and other natural wonders.",
    image: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800",
    distance: 243,
    duration: 3,
    location: "Victoria, Australia",
    difficulty: "Easy",
    average_rating: 4.7
  }
];

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
    
    // If no trips found, add sample trips
    if (!data || data.length === 0) {
      // Add sample trips one by one
      for (const trip of sampleTrips) {
        const { error: insertError } = await supabase
          .from('road_trips')
          .insert(trip);
          
        if (insertError) console.warn('Error inserting sample trip:', insertError);
      }
      
      // Fetch trips again after inserting samples
      const { data: newData, error: fetchError } = await supabase
        .from('road_trips')
        .select(`
          *,
          author:users(*),
          stops:road_stops(*),
          ratings:ratings(*)
        `);
      
      if (fetchError) throw fetchError;
      return formatResponseData(newData || []) as RoadTrip[];
    }
    
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
