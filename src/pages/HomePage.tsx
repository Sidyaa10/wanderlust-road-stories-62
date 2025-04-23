import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { api, RoadTrip } from '@/services/api';
import Layout from '@/components/Layout';
import RoadTripCard from '@/components/RoadTripCard';
import { Separator } from '@/components/ui/separator';

const HomePage: React.FC = () => {
  const [featuredTrips, setFeaturedTrips] = useState<RoadTrip[]>([]);
  const [recentTrips, setRecentTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const allTrips = await api.getTrips();
        
        // Get top rated trips for featured section
        const sortedByRating = [...allTrips].sort((a, b) => b.averageRating - a.averageRating);
        setFeaturedTrips(sortedByRating.slice(0, 3));
        
        // Get latest trips
        const sortedByDate = [...allTrips].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentTrips(sortedByDate.slice(0, 6));
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] hero-pattern">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Discover Your Perfect Road Trip Adventure
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
              Join our community of travelers sharing the best road trip experiences 
              from around the world. Find inspiration for your next journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/explore" className="btn-primary px-8 py-3 rounded-full">
                Explore Trips
              </Link>
              <Link to="/create" className="btn-secondary px-8 py-3 rounded-full">
                Share Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Road Stories */}
      <TopRoadStories />

      {/* Featured Trips */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Road Trips</h2>
            <Link to="/explore" className="text-forest-700 hover:text-forest-800 font-medium">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTrips.map((trip) => (
                <RoadTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-forest-100 rounded-full p-5 mb-4">
                <Compass className="h-10 w-10 text-forest-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">
                Explore curated road trips shared by our community of travelers.
                Filter by location, duration, or difficulty to find your perfect adventure.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-terracotta-100 rounded-full p-5 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-terracotta-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan</h3>
              <p className="text-gray-600">
                Choose your favorite road trip and save all the details.
                Find top-rated stops along the way and prepare for an unforgettable journey.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-sky-100 rounded-full p-5 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">
                After your trip, share your experience with the community.
                Post photos, reviews, and tips to help other travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Trips */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Adventures</h2>
            <Link to="/explore" className="text-forest-700 hover:text-forest-800 font-medium">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTrips.map((trip) => (
                <RoadTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Community Says</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                "Thanks to Wanderlust, I discovered the most amazing Pacific Coast Highway route with all the best stops. The trip was even better than I imagined!"
              </p>
              <Separator className="mb-4" />
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop" 
                  alt="User avatar" 
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Jessica Williams</p>
                  <p className="text-sm text-gray-500">Adventure Enthusiast</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                "The user-generated stops along Route 66 were invaluable. I found hidden gems I would have never discovered on my own. Highly recommend!"
              </p>
              <Separator className="mb-4" />
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&auto=format&fit=crop" 
                  alt="User avatar" 
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-gray-500">Road Trip Enthusiast</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                "I planned my entire Iceland trip using this platform. The detailed itineraries and honest reviews from other travelers made planning so easy."
              </p>
              <Separator className="mb-4" />
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop" 
                  alt="User avatar" 
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Emily Johnson</p>
                  <p className="text-sm text-gray-500">Travel Blogger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-forest-700 text-white">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers sharing their road trip experiences.
            Start exploring or share your own journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore" className="bg-white text-forest-700 hover:bg-gray-100 transition-colors px-8 py-3 rounded-full font-medium">
              Start Exploring
            </Link>
            <Link to="/create" className="border border-white text-white hover:bg-white/10 transition-colors px-8 py-3 rounded-full font-medium">
              Share Your Trip
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
