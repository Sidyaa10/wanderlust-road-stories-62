import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api, RoadTrip } from '@/services/api';
import Layout from '@/components/Layout';
import RoadTripCard from '@/components/RoadTripCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import TripDetailPage from './TripDetailPage';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TripComments from '@/components/TripComments';

const BASE_AUTHOR = {
  id: 'sidkadam',
  username: 'sidkadam',
  name: 'Sid Kadam',
  bio: "Web App Developer",
  avatar: "https://avatars.githubusercontent.com/u/4149056?v=4",
  followers: 0,
  following: 0,
  created_at: new Date().toISOString(),
};

const sampleTrips: RoadTrip[] = [
  {
    id: 'eu1',
    title: "Romantic Road, Germany",
    description: "Explore scenic Bavarian towns, castles, and vineyards along Germany's most picturesque route.",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800",
    distance: 350,
    duration: 4,
    location: "Europe - Germany",
    difficulty: "Easy",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'eu2',
    title: "Alpine Wonders: Switzerland",
    description: "Journey through the Swiss Alps visiting Lucerne, Interlaken, and breathtaking mountain passes.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    distance: 420,
    duration: 5,
    location: "Europe - Switzerland",
    difficulty: "Moderate",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'eu3',
    title: "Tuscan Sun Drive",
    description: "Sunset drives through rolling vineyards and cypress-lined roads in Tuscany, Italy.",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800",
    distance: 190,
    duration: 3,
    location: "Europe - Italy",
    difficulty: "Easy",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'ap1',
    title: "Hokkaido Snow Route",
    description: "Drive through snow tunnels and hot springs across Japan's northernmost island.",
    image: "https://images.unsplash.com/photo-1518684079-5e7e9197a471?w=800",
    distance: 320,
    duration: 4,
    location: "Asia-Pacific - Japan",
    difficulty: "Moderate",
    average_rating: 4.6,
    averageRating: 4.6,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'ap2',
    title: "Great Ocean Road Expedition",
    description: "Drive along Australia's southeastern coast to see the Twelve Apostles and other natural wonders.",
    image: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800",
    distance: 243,
    duration: 3,
    location: "Asia-Pacific - Australia",
    difficulty: "Easy",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'ap3',
    title: "South Island Scenic Loop",
    description: "Mountains, lakes, and fiords await on this epic New Zealand drive.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    distance: 820,
    duration: 7,
    location: "Asia-Pacific - New Zealand",
    difficulty: "Moderate",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'am1',
    title: "Pacific Coast Highway Adventure",
    description: "Experience the breathtaking beauty of California's coastline on this iconic road trip from San Francisco to Los Angeles.",
    image: "https://images.unsplash.com/photo-1540820658190-4d1c2d4a1731?w=800",
    distance: 750,
    duration: 5,
    location: "Americas - California, USA",
    difficulty: "Moderate",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'am2',
    title: "Route 66 Classic",
    description: "Drive from Chicago to Santa Monica on America's most legendary route.",
    image: "https://images.unsplash.com/photo-1533907650686-70576141c030?w=800",
    distance: 3940,
    duration: 14,
    location: "Americas - USA",
    difficulty: "Moderate",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'am3',
    title: "Canadian Rockies Loop",
    description: "Alpine lakes, lush forests, and snowy peaks in Alberta, Canada.",
    image: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=800",
    distance: 900,
    duration: 8,
    location: "Americas - Canada",
    difficulty: "Easy",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'ap4',
    title: "Northern Thailand Road Loop",
    description: "Winding roads, lush mountains, and unique culture from Chiang Mai through Pai and Mae Hong Son.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    distance: 600,
    duration: 6,
    location: "Asia-Pacific - Thailand",
    difficulty: "Moderate",
    average_rating: 4.5,
    averageRating: 4.5,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  },
  {
    id: 'am4',
    title: "Monument Valley Dream",
    description: "Experience the dramatic red sandstone formations in the American Southwest.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800",
    distance: 80,
    duration: 2,
    location: "Americas - USA",
    difficulty: "Easy",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [],
    ratings: []
  }
];

type FilterState = {
  search: string;
  difficulty: string;
  duration: string;
  sortBy: string;
  region: string;
};

const REGION_BUTTONS = [
  { value: "all", label: "ALL REGIONS" },
  { value: "europe", label: "EUROPE" },
  { value: "asia-pacific", label: "ASIA-PACIFIC" },
  { value: "americas", label: "AMERICAS" },
  { value: "rest", label: "REST OF WORLD" }
];

const ExplorePage: React.FC = () => {
  const [allTrips, setAllTrips] = useState<RoadTrip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useLocalData, setUseLocalData] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    difficulty: '',
    duration: '',
    sortBy: 'rating',
    region: 'all'
  });
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedTripId = queryParams.get('selectedTrip');
  const [selectedTrip, setSelectedTrip] = useState<RoadTrip | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const trips = await api.getTrips();

        if (trips.length === 0) {
          setUseLocalData(true);
          setAllTrips(sampleTrips);
          setFilteredTrips(sampleTrips);
          toast({
            title: "Using sample data",
            description: "No trips found in the database. Using sample trips instead.",
          });
        } else {
          setAllTrips(trips);
          setFilteredTrips(trips);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        setUseLocalData(true);
        setAllTrips(sampleTrips);
        setFilteredTrips(sampleTrips);
        toast({
          title: "Connection error",
          description: "Could not connect to the database. Using sample trips instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId && allTrips.length > 0) {
      const trip = allTrips.find(trip => trip.id === selectedTripId);
      setSelectedTrip(trip || null);
    } else {
      setSelectedTrip(null);
    }
  }, [selectedTripId, allTrips]);

  const handleCloseTripDetail = () => {
    navigate('/explore');
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [filters, allTrips]);

  const applyFilters = () => {
    let filtered = [...allTrips];

    if (filters.region && filters.region !== 'all') {
      if (filters.region === 'rest') {
        filtered = filtered.filter(trip =>
          !trip.location.toLowerCase().includes('europe') &&
          !trip.location.toLowerCase().includes('asia-pacific') &&
          !trip.location.toLowerCase().includes('americas')
        );
      } else {
        filtered = filtered.filter(trip =>
          trip.location.toLowerCase().includes(filters.region)
        );
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchLower) ||
        trip.description.toLowerCase().includes(searchLower) ||
        trip.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.difficulty && filters.difficulty !== 'all-difficulties') {
      filtered = filtered.filter(trip => trip.difficulty === filters.difficulty);
    }

    if (filters.duration && filters.duration !== 'all-durations') {
      switch (filters.duration) {
        case 'short':
          filtered = filtered.filter(trip => trip.duration <= 3);
          break;
        case 'medium':
          filtered = filtered.filter(trip => trip.duration > 3 && trip.duration <= 7);
          break;
        case 'long':
          filtered = filtered.filter(trip => trip.duration > 7);
          break;
      }
    }

    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'distance':
        filtered.sort((a, b) => b.distance - a.distance);
        break;
      case 'duration':
        filtered.sort((a, b) => b.duration - a.duration);
        break;
    }

    setFilteredTrips(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      difficulty: '',
      duration: '',
      sortBy: 'rating',
      region: 'all'
    });
  };

  if (selectedTrip) {
    return <TripDetailPage tripData={selectedTrip} onClose={handleCloseTripDetail} />;
  }

  return (
    <Layout>
      <div className="bg-forest-700 py-16">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-6">Explore Road Trips</h1>
          <p className="text-lg text-white/90 mb-8 max-w-3xl">
            Discover amazing road trip adventures shared by our community.
            Find your next journey based on location, difficulty, or duration.
          </p>
          <div className="bg-white rounded-lg p-4 flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              type="text"
              placeholder="Search by destination, name, or description..."
              className="border-0 focus-visible:ring-0"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-5 mb-8">
          <span className="text-sm sm:text-base font-medium min-w-[68px]">Region:</span>
          <ToggleGroup
            type="single"
            value={filters.region}
            onValueChange={val => {
              if (val) setFilters(prev => ({ ...prev, region: val }));
            }}
            className="rounded-lg border bg-muted shadow-sm gap-0"
          >
            {REGION_BUTTONS.map((btn) => (
              <ToggleGroupItem
                key={btn.value}
                value={btn.value}
                className={`px-5 py-2 data-[state=on]:bg-gray-100 data-[state=on]:text-black
                   text-gray-700 font-semibold rounded-none border-r last:border-r-0 
                   border-gray-200 text-base hover:bg-gray-50 transition-all`}
                style={{
                  borderTopLeftRadius: btn.value === "all" ? "0.5rem" : undefined,
                  borderBottomLeftRadius: btn.value === "all" ? "0.5rem" : undefined,
                  borderTopRightRadius: btn.value === "rest" ? "0.5rem" : undefined,
                  borderBottomRightRadius: btn.value === "rest" ? "0.5rem" : undefined
                }}
              >
                {btn.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Select
                value={filters.difficulty}
                onValueChange={(value) => handleFilterChange('difficulty', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-difficulties">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={filters.duration}
                onValueChange={(value) => handleFilterChange('duration', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-durations">All Durations</SelectItem>
                  <SelectItem value="short">Short (1-3 days)</SelectItem>
                  <SelectItem value="medium">Medium (4-7 days)</SelectItem>
                  <SelectItem value="long">Long (8+ days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="distance">Longest Distance</SelectItem>
                <SelectItem value="duration">Longest Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {useLocalData && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Using sample trip data. {" "}
              {filteredTrips.length === 0 ? "Try clearing your filters to see the sample trips." : ""}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="flex flex-col">
                <RoadTripCard trip={trip} />
                <TripComments tripId={trip.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No trips found</h3>
            <p className="text-gray-600 mb-6">
              No road trips match your current search criteria.
              Try changing your filters or search term.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
