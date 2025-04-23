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

const sampleTrips: RoadTrip[] = [
  {
    id: '4',
    title: "Romantic Road, Germany",
    description: "Explore scenic Bavarian towns, castles, and vineyards along Germany's most picturesque route.",
    image: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=800",
    distance: 350,
    duration: 4,
    location: "Europe - Germany",
    difficulty: "Easy",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: {
      id: '4',
      username: 'euro_wanderer',
      name: 'Euro Wanderer',
      bio: 'Lover of European landscapes',
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
      followers: 90,
      following: 48,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '5',
    title: "Amalfi Coast Drive",
    description: "Winding roads and lemon groves along Italy's enchanting coastline.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    distance: 80,
    duration: 2,
    location: "Europe - Italy",
    difficulty: "Moderate",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: {
      id: '5',
      username: 'italian_roamer',
      name: 'Italian Roamer',
      bio: 'Dolce vita connoisseur',
      avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400',
      followers: 110,
      following: 34,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '6',
    title: "Norwegian Fjord Adventure",
    description: "Experience majestic fjords, glaciers, and waterfalls on Norway's Atlantic Road.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
    distance: 500,
    duration: 6,
    location: "Europe - Norway",
    difficulty: "Hard",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: {
      id: '6',
      username: 'fjord_friend',
      name: 'Fjord Friend',
      bio: 'Scandanavia explorer',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
      followers: 104,
      following: 54,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '7',
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
    author: {
      id: '3',
      username: 'aussie_traveler',
      name: 'Aussie Traveler',
      bio: 'Down under explorer',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400',
      followers: 180,
      following: 95,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '8',
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
    author: {
      id: '8',
      username: 'jp_drives',
      name: 'JP Drives',
      bio: 'Japan explorer',
      avatar: 'https://images.unsplash.com/photo-1517363898873-c9230949a976?w=400',
      followers: 90,
      following: 40,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '9',
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
    author: {
      id: '9',
      username: 'nz_roadie',
      name: 'NZ Roadie',
      bio: 'Kia ora, let\'s explore!',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
      followers: 112,
      following: 53,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '10',
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
    author: {
      id: '10',
      username: 'classic_usa',
      name: 'Classic USA',
      bio: 'American historian',
      avatar: 'https://images.unsplash.com/photo-1519340333755-c9230949a976?w=400',
      followers: 190,
      following: 114,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '11',
    title: "Patagonian Andes Quest",
    description: "Vast wild steppes and dramatic mountains await you in Argentina and Chile.",
    image: "https://images.unsplash.com/photo-1465101050700-1b421d89757f?w=800",
    distance: 2000,
    duration: 10,
    location: "Americas - Argentina & Chile",
    difficulty: "Hard",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: {
      id: '11',
      username: 'andes_seeker',
      name: 'Andes Seeker',
      bio: 'South American adventurer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      followers: 132,
      following: 65,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '12',
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
    author: {
      id: '12',
      username: 'canada_rover',
      name: 'Canada Rover',
      bio: 'Great white North expert',
      avatar: 'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?w=400',
      followers: 81,
      following: 41,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '1',
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
    author: {
      id: '1',
      username: 'roadtripper',
      name: 'Road Tripper',
      bio: 'Adventure enthusiast',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      followers: 120,
      following: 80,
      created_at: new Date().toISOString(),
    },
    stops: [],
    ratings: []
  },
  {
    id: '2',
    title: "Iceland Ring Road Journey",
    description: "Circle the entire island of Iceland on Route 1, experiencing waterfalls, glaciers, and volcanic landscapes.",
    image: "https://images.unsplash.com/photo-1520769490916-ee4266dd5b24?w=800",
    distance: 1332,
    duration: 7,
    location: "Europe - Iceland",
    difficulty: "Hard",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: {
      id: '2',
      username: 'nordic_explorer',
      name: 'Nordic Explorer',
      bio: 'Cold climate adventurer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      followers: 250,
      following: 120,
      created_at: new Date().toISOString(),
    },
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
              <RoadTripCard key={trip.id} trip={trip} />
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
