import React, { useEffect, useState } from 'react';
import { api, RoadTrip } from '@/services/api';
import Layout from '@/components/Layout';
import RoadTripCard from '@/components/RoadTripCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { sampleTrips } from './ExplorePage';

const TripListPage: React.FC = () => {
  const [trips, setTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      if (savedTrips.length === 0) {
        setTrips([]);
        setLoading(false);
        return;
      }
      try {
        const dbTrips = await api.getTrips();
        const allTrips = [...sampleTrips, ...dbTrips];
        setTrips(allTrips.filter(trip => savedTrips.includes(trip.id)));
      } catch {
        setTrips(sampleTrips.filter(trip => savedTrips.includes(trip.id)));
      }
      setLoading(false);
    };
    fetchTrips();
    // Listen for storage changes (other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'savedTrips') fetchTrips();
    };
    window.addEventListener('storage', onStorage);
    // Reload on focus (same tab)
    const onFocus = () => fetchTrips();
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <Layout>
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Saved Trips</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <div key={trip.id} className="cursor-pointer" onClick={() => navigate(`/explore?selectedTrip=${trip.id}`)}>
                <RoadTripCard trip={trip} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No saved trips</h3>
            <p className="text-gray-600 mb-6">You haven't saved any trips yet. Go explore and save your favorites!</p>
            <Button onClick={() => navigate('/explore')}>Explore Trips</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TripListPage; 