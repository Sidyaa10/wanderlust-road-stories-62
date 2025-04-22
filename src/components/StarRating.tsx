
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  onChange
}) => {
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };
  
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= (hoverRating || rating);
    
    stars.push(
      <Star
        key={i}
        className={cn(
          getSizeClass(),
          'transition-colors cursor-pointer',
          isFilled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        )}
        onClick={() => onChange && onChange(i)}
        onMouseEnter={() => onChange && setHoverRating(i)}
        onMouseLeave={() => onChange && setHoverRating(0)}
      />
    );
  }
  
  return (
    <div className="flex space-x-1">
      {stars}
    </div>
  );
};

export default StarRating;
