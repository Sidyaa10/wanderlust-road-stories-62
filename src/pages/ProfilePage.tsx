import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, User, RoadTrip } from '@/services/api';
import Layout from '@/components/Layout';
import RoadTripCard from '@/components/RoadTripCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get current user
          const userData = await api.getCurrentUser();
          setUser(userData);
          
          // Get all trips
          const allTrips = await api.getTrips();
          
          // Filter trips by the current user
          const userTrips = allTrips.filter(trip => trip.author.id === userData.id);
          setTrips(userTrips);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "You have been logged in successfully.",
        });
        
        navigate(0); // Refresh the page to update user state
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Success!",
        description: "You have been logged out successfully.",
      });
      navigate(0); // Refresh the page to update user state
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-48 w-full bg-gray-200 animate-pulse mb-8" />
          <div className="h-10 w-1/3 bg-gray-200 animate-pulse mb-4" />
          <div className="h-20 w-full bg-gray-200 animate-pulse mb-8" />
          {/* More skeleton loading states */}
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto px-4 py-12">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? 'Welcome Back!' : 'Create an Account'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to access your profile and road trips.' 
                  : 'Join our community of road trip enthusiasts.'}
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isLogin ? <LogIn className="mr-2" /> : <UserPlus className="mr-2" />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
            
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-forest-700 py-16">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
              <p className="text-lg text-white/80 mb-4">@{user?.username}</p>
              <p className="text-white/90 max-w-3xl mb-4">{user?.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user?.followers}</p>
                  <p className="text-sm text-white/80">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user?.following}</p>
                  <p className="text-sm text-white/80">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user?.createdTrips}</p>
                  <p className="text-sm text-white/80">Trips</p>
                </div>
              </div>
            </div>
            
            <div className="flex-grow"></div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <Button className="bg-white text-forest-700 hover:bg-gray-100">
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-forest-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogIn className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="trips" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="trips">My Road Trips</TabsTrigger>
            <TabsTrigger value="saved">Saved Trips</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trips">
            <div>
              {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => (
                    <RoadTripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="text-2xl font-semibold mb-4">No trips yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't created any road trips yet.
                    Share your journey with the community.
                  </p>
                  <Button asChild>
                    <a href="/create">Create a Trip</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-4">No saved trips</h3>
              <p className="text-gray-600 mb-6">
                You haven't saved any road trips yet.
                Explore and save trips for future reference.
              </p>
              <Button asChild>
                <a href="/explore">Explore Trips</a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-4">No reviews yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't reviewed any road trips yet.
                Share your experiences with the community.
              </p>
              <Button asChild>
                <a href="/explore">Write a Review</a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
