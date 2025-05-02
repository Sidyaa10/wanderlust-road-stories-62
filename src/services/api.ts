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

    // Extract only the fields that the road_trips table accepts
    const { title, description, image, distance, duration, location, difficulty, stops } = tripData;
    
    // Ensure title is provided as it's required by the database
    if (!title) throw new Error('Trip title is required');

    // 1. Insert the trip
    const { data: trip, error } = await supabase
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

    // 2. Insert stops if provided
    if (stops && Array.isArray(stops) && stops.length > 0) {
      // Geocode each stop's location using OpenStreetMap Nominatim API, fallback to trip location if fails
      const fallbackCoords = [77.5946, 12.9716]; // Default: Bangalore, India (lng, lat)
      const geocodeStop = async (stop) => {
        try {
          // Try to geocode the stop's location
          const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stop.location)}`);
          const data = await resp.json();
          if (data && data.length > 0) {
            const latitude = parseFloat(data[0].lat);
            const longitude = parseFloat(data[0].lon);
            return { ...stop, latitude, longitude };
          }
        } catch {}
        // Fallback: try to geocode the trip's location
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
          const data = await resp.json();
          if (data && data.length > 0) {
            const latitude = parseFloat(data[0].lat);
            const longitude = parseFloat(data[0].lon);
            return { ...stop, latitude, longitude };
          }
        } catch {}
        // Fallback: use default coordinates
        return {
          ...stop,
          longitude: fallbackCoords[0],
          latitude: fallbackCoords[1]
        };
      };
      const stopsWithCoords = await Promise.all(stops.map(geocodeStop));
      await supabase.from('road_stops').insert(
        stopsWithCoords.map((stop, idx) => ({
          trip_id: trip.id,
          name: stop.name,
          description: stop.description,
          image: stop.image,
          location: stop.location,
          position: stop.position || idx + 1,
          latitude: stop.latitude,
          longitude: stop.longitude
        }))
      );
    }
    // 3. Return the trip with stops
    return await api.getTripById(trip.id);
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
  
  deleteTrip: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('road_trips').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  deleteRating: async (ratingId: string): Promise<boolean> => {
    const { error } = await supabase.from('ratings').delete().eq('id', ratingId);
    if (error) throw error;
    return true;
  }
};

// Export types for consistency
export type { User, RoadTrip, RoadStop, Rating };
