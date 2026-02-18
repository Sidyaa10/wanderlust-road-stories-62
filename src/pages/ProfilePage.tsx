import React, { useEffect, useRef, useState } from "react";
import { api, RoadTrip, User } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sampleTrips } from "./ExplorePage";

const SAMPLE_AUTHOR_ID = "sidkadam";
const MASTER_EMAIL = "sidkadam@gmail.com";
const SAMPLE_AUTHOR: User = {
  id: SAMPLE_AUTHOR_ID,
  username: "sidkadam",
  name: "Sid Kadam",
  bio: "Web App Developer",
  avatar: "https://avatars.githubusercontent.com/u/4149056?v=4",
  followers: 0,
  following: 0,
  created_at: new Date().toISOString(),
  createdTrips: sampleTrips.length,
  email: "sidkadam10@gmail.com",
};

const isMasterAccount = (user?: User | null) =>
  Boolean(user && ((user.email || "").toLowerCase() === MASTER_EMAIL || user.username === "sidkadam"));

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const targetId = profileId || (await api.getCurrentUser().then((u) => u.id).catch(() => ""));
        if (!targetId) {
          setUser(null);
          setTrips([]);
          return;
        }
        if (targetId === SAMPLE_AUTHOR_ID) {
          setUser(SAMPLE_AUTHOR);
          setTrips(sampleTrips);
          return;
        }
        const [loadedUser, userTrips] = await Promise.all([
          api.getUserById(targetId),
          api.getTrips().then((all) => all.filter((trip) => trip.author?.id === targetId)),
        ]);

        if (isMasterAccount(loadedUser)) {
          const masterUser = {
            ...loadedUser!,
            username: "sidkadam",
            name: "Sid Kadam",
          };
          const masterSampleTrips = sampleTrips.map((trip) => ({
            ...trip,
            author: {
              ...trip.author,
              id: masterUser.id,
              username: masterUser.username,
              name: masterUser.name,
              avatar: masterUser.avatar || trip.author.avatar,
            },
          }));
          setUser(masterUser);
          setTrips([...masterSampleTrips, ...userTrips]);
          return;
        }
        setUser(loadedUser || null);
        setTrips(userTrips);
      } catch (_err) {
        setUser(null);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [profileId]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const loggedIn = await api.login(email, password);
        setUser(loggedIn);
        toast({ title: "Success", description: "You are now logged in." });
      } else {
        const registered = await api.register(email, password);
        setUser(registered);
        toast({ title: "Success", description: "Account created successfully." });
      }
      navigate("/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Authentication failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setTrips([]);
    toast({ title: "Success", description: "Logged out." });
    navigate("/profile");
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    try {
      setUploadingAvatar(true);
      const updated = await api.uploadAvatar(file);
      setUser(updated);
      toast({ title: "Success", description: "Profile image updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Update failed", variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-48 w-full bg-gray-200 animate-pulse mb-8" />
          <div className="h-10 w-1/3 bg-gray-200 animate-pulse mb-4" />
          <div className="h-20 w-full bg-gray-200 animate-pulse mb-8" />
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
              <h1 className="text-3xl font-bold mb-2">{isLogin ? "Welcome Back!" : "Create an Account"}</h1>
              <p className="text-gray-600">
                {isLogin ? "Sign in to access your profile and trips." : "Join and start sharing road trips."}
              </p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" className="w-full">
                {isLogin ? <LogIn className="mr-2" /> : <UserPlus className="mr-2" />}
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>
            <div className="text-center">
              <Button variant="link" onClick={() => setIsLogin((prev) => !prev)}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-tr from-pink-200 via-orange-100 to-white min-h-[300px] pb-12">
        <div className="container max-w-5xl mx-auto px-4 pt-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 mb-4">
                <img src={user.avatar || "/default-avatar.png"} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold mb-1 text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
              <div className="w-full mb-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <Button
                  className="w-full mt-2"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? "Uploading..." : "Upload Profile Photo"}
                </Button>
              </div>
              <Button className="w-full mb-2" onClick={() => navigate("/triplist")}>
                My Saved Trips
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>

            <div className="flex-1 w-full">
              {trips.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Recent Road Trips</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {trips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-[#f2e6d2] border border-[#d8c7b2] rounded-xl shadow p-4 flex flex-col cursor-pointer"
                        onClick={() => navigate(`/explore?selectedTrip=${trip.id}`)}
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
                          <span className="text-xs text-yellow-600 font-semibold">
                            {trip.averageRating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    You have not shared any trips yet. Start by adding your first adventure.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => navigate("/create")}>Add Your First Trip</Button>
                    <Button onClick={() => navigate("/explore")} variant="outline">
                      Browse Trips
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
