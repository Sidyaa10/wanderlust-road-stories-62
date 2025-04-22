
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RoadTrip } from '@/services/api';
import { Badge } from '@/components/ui/badge';

interface RoadTripCardProps {
  trip: RoadTrip;
}

const RoadTripCard: React.FC<RoadTripCardProps> = ({ trip }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Link to={`/trip/${trip.id}`} className="block">
      <div className="road-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
        <div className="relative h-48">
          <img 
            src={trip.image} 
            alt={trip.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-bold text-xl truncate">{trip.title}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{trip.location}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <img 
                src={trip.author.avatar} 
                alt={trip.author.name} 
                className="h-7 w-7 rounded-full"
              />
              <span className="text-sm text-gray-600">{trip.author.name}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{trip.averageRating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {trip.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={getDifficultyColor(trip.difficulty)}>
              {trip.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
              {trip.distance} km
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-100">
              {trip.duration} days
            </Badge>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDistanceToNow(new Date(trip.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoadTripCard;
