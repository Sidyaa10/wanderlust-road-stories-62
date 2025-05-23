export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  created_at: string;
  createdTrips?: number;
  email?: string;
}

export interface RoadTrip {
  id: string;
  title: string;
  description: string;
  image: string;
  author: User;
  distance: number;
  duration: number;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  stops: RoadStop[];
  ratings: Rating[];
  average_rating: number;
  created_at: string;
  
  // Add these for compatibility with existing code
  averageRating?: number;
  createdAt?: string;
}

export interface RoadStop {
  id: string;
  trip_id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  position: number;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

export interface Rating {
  id: string;
  trip_id: string;
  user_id: string;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
  createdAt?: string;
}
