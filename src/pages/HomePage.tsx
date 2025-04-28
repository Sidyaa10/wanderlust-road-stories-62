
import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components to improve initial load time
const TopRoadStories = lazy(() => import('@/components/TopRoadStories'));
const RoadTripCard = lazy(() => import('@/components/RoadTripCard'));

const HomePage: React.FC = () => {
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
      <Suspense fallback={<LoadingStoriesPlaceholder />}>
        <TopRoadStories />
      </Suspense>

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
                <svg xmlns="https://media.istockphoto.com/id/1140461954/photo/motorcycle-driving-on-the-asphalt-road-in-rural-landscape-at-sunset-with-dramatic-clouds.jpg?s=612x612&w=0&k=20&c=4ftammuQg8B6cyfzVPeUA0U7QVXYhKizsawcPo6Hq6I=" className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// Loading placeholder for stories section
const LoadingStoriesPlaceholder = () => (
  <section className="py-14 bg-white">
    <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomePage;
