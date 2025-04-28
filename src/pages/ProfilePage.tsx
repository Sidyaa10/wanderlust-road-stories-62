import React, { useEffect, useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, User, RoadTrip } from '@/services/api';
import Layout from '@/components/Layout';
import RoadTripCard from '@/components/RoadTripCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_ID = '986da716-10a1-4e37-a718-bc139424d0b6';
const ADMIN_EMAIL = 'sidkadam10@gmail.com';
const ADMIN_PROFILE = {
  id: ADMIN_ID,
  username: 'sidkadam',
  name: 'Sid Kadam',
  avatar: 'https://avatars.githubusercontent.com/u/4149056?v=4',
  followers: 0,
  following: 0,
  createdTrips: 0,
  bio: 'Web App Developer',
  created_at: new Date().toISOString(),
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let userId = profileId;
        let isAdmin = false;
        if (!userId) {
          // Supabase: Get current user
          const { data: { user } } = await supabase.auth.getUser();
          userId = user?.id;
          if (user && user.email === ADMIN_EMAIL) {
            userId = ADMIN_ID;
            isAdmin = true;
          }
        }
        if (userId) {
          // Fetch user profile from Supabase
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          if (!error && profile) {
            setUser({
              name: profile.name || '',
              username: (userId === ADMIN_ID && (!profile.username || profile.username === ADMIN_ID)) ? 'sidkadam' : (profile.username || ''),
              avatar: profile.avatar || '',
              followers: profile.followers || 0,
              following: profile.following || 0,
              createdTrips: profile.createdTrips || 0,
              bio: profile.bio || '',
              id: userId,
              created_at: profile.created_at || '',
            });
          }
        }
        if (userId === ADMIN_ID || isAdmin) {
          // Get all trips (sample + db)
          let allTrips = [];
          try {
            const dbTrips = await api.getTrips();
            const { sampleTrips } = await import('./ExplorePage');
            allTrips = [...sampleTrips, ...dbTrips];
          } catch {
            const { sampleTrips } = await import('./ExplorePage');
            allTrips = sampleTrips;
          }
          // Show ALL trips for admin profile except 'Western Ghats, India'
          const userTrips = allTrips.filter(trip => trip.title !== 'Western Ghats, India').map(trip => ({ ...trip, author: { ...ADMIN_PROFILE } }));
          setTrips(userTrips);
        } else {
          // Get all trips
          const allTrips = await api.getTrips();
          // Filter trips by the profile user
          const userTrips = userId ? allTrips.filter(trip => trip.author.id === userId) : [];
          setTrips(userTrips);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profileId]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: 'Success!',
          description: 'You have been logged in successfully.',
        });
        if (email === ADMIN_EMAIL) {
          setUser(ADMIN_PROFILE);
          window.location.href = `/profile/${ADMIN_ID}`;
          return;
        }
        // Get user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Always update missing name/username to email
          await supabase.from('profiles').update({
            name: user.email,
            username: user.email
          }).eq('id', user.id).or('name.is.null,username.is.null');
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (!error && profile) {
            setUser({
              name: profile.name || user.email,
              username: profile.username || user.email,
              avatar: profile.avatar || '',
              followers: profile.followers || 0,
              following: profile.following || 0,
              createdTrips: profile.createdTrips || 0,
              bio: profile.bio || '',
              id: user.id,
              created_at: profile.created_at || '',
            });
          }
        }
        window.location.reload();
      } else {
        // Register with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Set name, username, and avatar to email/default in profiles table
        if (data?.user?.id) {
          await supabase.from('profiles').update({
            name: email,
            username: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}`
          }).eq('id', data.user.id);
        }
        toast({
          title: 'Success!',
          description: 'Account created. You can now log in.',
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Success!',
      description: 'You have been logged out successfully.',
    });
    navigate(0);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = publicUrlData?.publicUrl;
    if (publicUrl) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', user.id);
      if (updateError) {
        toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
        return;
      }
      setUser({ ...user, avatar: publicUrl });
      toast({ title: 'Success', description: 'Profile picture updated!' });
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

  // Modern profile dashboard for logged-in user
  return (
    <Layout>
      <div className="bg-gradient-to-tr from-pink-200 via-orange-100 to-white min-h-[300px] pb-12">
        <div className="container max-w-5xl mx-auto px-4 pt-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 mb-4 relative group">
                <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded shadow group-hover:opacity-100 opacity-0 transition"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '0.75rem' }}
                >
                  Change
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="text-2xl font-bold mb-1 text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{user.createdTrips || 0}</div>
                  <div className="text-xs text-gray-500">Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{user.followers || 0}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
              </div>
              <Button className="w-full mb-2">Edit Profile</Button>
              <Button className="w-full mb-2" onClick={() => navigate('/triplist')}>My Saved Trips</Button>
              <Button variant="outline" className="w-full" onClick={handleLogout}>Sign Out</Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full">
              {/* Recent Trips or Welcome Message */}
              {trips.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Recent Road Trips</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {trips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white rounded-xl shadow p-4 flex flex-col cursor-pointer"
                        onClick={() => navigate(`/explore?selectedTrip=${trip.id}`)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/explore?selectedTrip=${trip.id}`); }}
                        style={{ outline: 'none' }}
                      >
                        <div className="h-40 w-full rounded-lg overflow-hidden mb-3">
                          <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">{trip.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{trip.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{trip.location}</span>
                          <span className="text-xs text-yellow-600 font-semibold flex items-center gap-1"><svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" /></svg>{trip.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">You haven't shared any road trips yet. Start your journey by adding your first adventure or browse trips from the community!</p>
                  <div className="flex gap-4">
                    <Button asChild>
                      <a href="/create">Add Your First Trip</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/explore">Browse Trips</a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
