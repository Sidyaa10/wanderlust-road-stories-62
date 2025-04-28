import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Calendar, User, MessageSquare, ArrowLeft, Map } from 'lucide-react';
import { format } from 'date-fns';
import { api, RoadTrip, Rating } from '@/services/api';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import MapView from '@/components/MapView';
import { supabase } from '@/integrations/supabase/client';

interface TripDetailPageProps {
  tripData?: RoadTrip;
  onClose?: () => void;
  disableLayout?: boolean;
}

const TripDetailPage: React.FC<TripDetailPageProps> = ({ tripData, onClose, disableLayout }) => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<RoadTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(tripData ? false : true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [newRating, setNewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const ADMIN_ID = 'sidkadam';

  useEffect(() => {
    if (tripData) {
      setTrip(tripData);
      setLoading(false);
      return;
    }

    const fetchTrip = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const tripData = await api.getTripById(id);
        if (tripData) {
          setTrip(tripData);
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, tripData]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Check if this trip is saved for the current user
    const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    setSaved(savedTrips.includes(trip?.id));
  }, [trip?.id]);

  const handleSubmitReview = async () => {
    if (!trip || !reviewComment.trim()) return;
    
    try {
      setSubmittingReview(true);
      await api.addRating(trip.id, newRating, reviewComment);
      
      if (id) {
        const updatedTrip = await api.getTripById(trip.id);
        if (updatedTrip) {
          setTrip(updatedTrip);
        }
      }
      
      setReviewComment('');
      setNewRating(5);
      
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience!",
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/explore');
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await api.deleteTrip(trip.id);
      toast({ title: 'Trip deleted', description: 'Your trip has been deleted.' });
      navigate('/profile');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete trip.', variant: 'destructive' });
    }
  };

  const handleEditTrip = () => {
    navigate(`/create?editTrip=${trip.id}`);
  };

  const handleSaveTrip = () => {
    let savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    if (saved) {
      savedTrips = savedTrips.filter((tid: string) => tid !== trip.id);
    } else {
      savedTrips.push(trip.id);
    }
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    setSaved(!saved);
  };

  const handleDeleteReview = async (ratingId: string) => {
    try {
      await api.deleteRating(ratingId);
      if (trip?.id) {
        const updatedTrip = await api.getTripById(trip.id);
        if (updatedTrip) {
          setTrip(updatedTrip);
        }
      }
      toast({ title: 'Review deleted', description: 'Your review has been deleted.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete review.', variant: 'destructive' });
    }
  };

  const canEditOrDelete = (
    currentUser && trip && (
      (trip.author.id === currentUser.id) ||
      (trip.author.id === ADMIN_ID && currentUser.id === ADMIN_ID)
    ) && !/^eu|ap|am/.test(trip.id)
  );

  if (loading) {
    const content = (
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-80 w-full rounded-xl bg-gray-200 animate-pulse mb-8" />
        <div className="h-10 w-1/3 bg-gray-200 animate-pulse mb-4" />
        <div className="h-20 w-full bg-gray-200 animate-pulse mb-8" />
        {/* More skeleton loading states */}
      </div>
    );
    return disableLayout ? content : <Layout>{content}</Layout>;
  }

  if (!trip) {
    const content = (
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Trip Not Found</h1>
        <p className="text-gray-600 mb-6">
          The road trip you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <a href="/explore">Explore Other Trips</a>
        </Button>
      </div>
    );
    return disableLayout ? content : <Layout>{content}</Layout>;
  }

  const mainContent = (
    <>
      {(onClose || id) && (
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Button>
        </div>
      )}
      
      <div className="relative h-[60vh] w-full">
        <img 
          src={trip.image} 
          alt={trip.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {trip.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {trip.distance} km
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {trip.duration} days
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{trip.title}</h1>
            <div className="flex items-center text-white/90 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{trip.location}</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-white/90">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>
                  {typeof trip.averageRating === 'number' ? trip.averageRating.toFixed(1) : '0.0'} ({trip.ratings.length} reviews)
                </span>
              </div>
              <div className="flex items-center text-white/90">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Created {format(new Date(trip.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="mb-12" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stops">Stops</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About This Trip</h2>
                  <p className="text-gray-700 mb-6">{trip.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-3">Trip Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-forest-700 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{trip.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-forest-700 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{trip.duration} days</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Difficulty</p>
                        <p className="font-medium">{trip.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="font-medium">{trip.distance} km</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Best Time to Visit</h3>
                  <p className="text-gray-700 mb-6">
                    The best time to experience this route is during the spring and fall months when the weather is mild and the crowds are smaller. Summer can be beautiful but expect more tourists, while winter may have some road closures in certain areas.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Preparation Tips</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Check road conditions and any closures before departing</li>
                    <li>Pack layers of clothing for changing weather</li>
                    <li>Download offline maps for areas with poor cell service</li>
                    <li>Book accommodations in advance during peak seasons</li>
                    <li>Have a full tank of gas before entering remote stretches</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="stops">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Journey Highlights</h2>
                  
                  <div className="space-y-8 z-0 relative">
                    {trip.stops.map((stop, index) => (
                      <div key={stop.id} className="relative">
                        {index < trip.stops.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 z-0" />
                        )}
                        <div className="relative z-10 flex gap-4 flex-col sm:flex-row items-start sm:items-center">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <div className="flex-grow w-full">
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full max-w-md sm:max-w-md mx-auto">
                              <img 
                                src={stop.image} 
                                alt={stop.name}
                                className="w-full h-40 sm:h-48 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="text-xl font-semibold mb-1 break-words">{stop.name}</h3>
                                <div className="flex items-center text-gray-500 text-sm mb-3">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="break-words">{stop.location}</span>
                                </div>
                                <p className="text-gray-700 break-words">
                                  {stop.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="map">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Satellite Route View</h2>
                  
                  <MapView 
                    stops={trip.stops}
                    startLocation={trip.stops[0]?.location || trip.location}
                    endLocation={trip.stops[trip.stops.length - 1]?.location || trip.location}
                  />
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Map className="h-4 w-4" />
                      <span>Route map shows approximate path and stops. Actual routes may vary.</span>
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Traveler Reviews</h2>
                  
                  <div className="mb-8">
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                      <div className="mb-4">
                        <p className="mb-2 text-gray-700">Rate this trip:</p>
                        <StarRating 
                          rating={newRating} 
                          onChange={setNewRating}
                          size="lg"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                          Your review:
                        </label>
                        <Textarea
                          id="review"
                          placeholder="Share your experience, tips, or thoughts about this road trip..."
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitReview} 
                        disabled={!reviewComment.trim() || submittingReview}
                      >
                        Submit Review
                      </Button>
                    </div>
                    
                    {trip.ratings.length > 0 ? (
                      <div className="space-y-6">
                        {(() => {
                          const seen = new Set<string>();
                          return trip.ratings.filter(rating => {
                            const key = (rating.user?.id || 'anon') + '|' + rating.comment;
                            if (seen.has(key)) return false;
                            seen.add(key);
                            return true;
                          }).map((rating) => (
                          <div key={rating.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <img 
                                    src={rating.user?.avatar || '/default-avatar.png'} 
                                    alt={rating.user?.username || rating.user?.name || rating.user?.email || (rating.user?.id === currentUser?.id ? currentUser?.email : undefined) || 'Anonymous'} 
                                  className="h-10 w-10 rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-medium">{
                                      rating.user?.username ||
                                      rating.user?.name ||
                                      rating.user?.email ||
                                      (rating.user?.id === currentUser?.id ? currentUser?.email : undefined) ||
                                      'No Name'
                                    }</p>
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(rating.createdAt), 'MMM d, yyyy')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <StarRating rating={rating.rating} size="sm" />
                                <span className="ml-2 font-medium">{rating.rating.toFixed(1)}</span>
                                {canEditOrDelete && (
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteReview(rating.id)} title="Delete review">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700">{rating.comment}</p>
                          </div>
                          ));
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No reviews yet. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 sticky top-24">
              <div className="p-6">
                <div className="mb-6">
                  <p className="font-medium">Created by</p>
                  <p className="text-forest-700">{trip.author.name}</p>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trips created:</span>
                    <span className="font-medium">{trip.author.createdTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers:</span>
                    <span className="font-medium">{trip.author.followers}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => {
                    if (currentUser && trip.author.id === currentUser.id) {
                      navigate('/profile');
                    } else if (trip.author.id === 'sidkadam' || trip.author.id === '986da716-10a1-4e37-a718-bc139424d0b6') {
                      navigate('/profile/986da716-10a1-4e37-a718-bc139424d0b6');
                    } else {
                      navigate(`/profile/${trip.author.id}`);
                    }
                  }}>
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button className="w-full bg-forest-700 hover:bg-forest-800 text-white" onClick={handleSaveTrip}>
                    {saved ? 'Saved' : 'Save Trip'}
                  </Button>
                  {canEditOrDelete && (
                    <div className="flex gap-2 mt-4">
                      <Button variant="destructive" className="w-full" onClick={handleDeleteTrip}>Delete</Button>
                      <Button variant="outline" className="w-full" onClick={handleEditTrip}>Edit</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return disableLayout ? mainContent : <Layout>{mainContent}</Layout>;
};

export default TripDetailPage;
