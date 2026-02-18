import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Clock, Calendar, User, MessageSquare, ArrowLeft, Map, Heart, Share2, Bookmark } from "lucide-react";
import { format } from "date-fns";
import { api, RoadTrip, User as AppUser } from "@/services/api";
import Layout from "@/components/Layout";
import StarRating from "@/components/StarRating";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/MapView";

interface TripDetailPageProps {
  tripData?: RoadTrip;
  onClose?: () => void;
  disableLayout?: boolean;
}

const TripDetailPage: React.FC<TripDetailPageProps> = ({ tripData, onClose, disableLayout }) => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<RoadTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(tripData ? false : true);
  const [newRating, setNewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isBuiltinTrip = (tripId?: string) => Boolean(tripId && !/^[a-f\d]{24}$/i.test(tripId));

  const refreshTrip = async (tripId: string) => {
    if (isBuiltinTrip(tripId)) return;
    const updated = await api.getTripById(tripId);
    if (updated) {
      setTrip(updated);
      setSaved(Boolean((updated as any).savedByMe));
      setLiked(Boolean(updated.likedByMe));
    }
  };

  useEffect(() => {
    if (tripData) {
      if (isBuiltinTrip(tripData.id)) {
        const builtin = api.getBuiltinTripState(tripData.id);
        setTrip({
          ...tripData,
          comments: builtin.comments,
          ratings: builtin.ratings,
          likesCount: builtin.likesCount,
          shareCount: builtin.shareCount,
          likedByMe: builtin.likedByMe,
          savedByMe: builtin.savedByMe,
          averageRating: builtin.averageRating || tripData.averageRating,
        });
        setSaved(builtin.savedByMe);
        setLiked(builtin.likedByMe);
      } else {
        setTrip(tripData);
        setSaved(Boolean((tripData as any).savedByMe));
        setLiked(Boolean(tripData.likedByMe));
      }
      setLoading(false);
      return;
    }
    const fetchTrip = async () => {
      if (!id) return;
      try {
        setLoading(true);
        await refreshTrip(id);
      } catch (_err) {
        toast({ title: "Error", description: "Could not load trip", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, tripData]);

  useEffect(() => {
    api.getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  const handleSubmitReview = async () => {
    if (!trip || !reviewComment.trim()) return;
    try {
      setSubmittingReview(true);
      await api.addRating(trip.id, newRating, reviewComment.trim());
      if (isBuiltinTrip(trip.id)) {
        const builtin = api.getBuiltinTripState(trip.id);
        setTrip((prev) =>
          prev
            ? {
                ...prev,
                ratings: builtin.ratings,
                averageRating: builtin.averageRating || prev.averageRating,
              }
            : prev
        );
      } else {
        await refreshTrip(trip.id);
      }
      setReviewComment("");
      setNewRating(5);
      toast({ title: "Review submitted", description: "Thank you for sharing your experience." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to submit review", variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddComment = async () => {
    if (!trip || !newComment.trim()) return;
    try {
      await api.addComment(trip.id, newComment.trim());
      if (isBuiltinTrip(trip.id)) {
        const builtin = api.getBuiltinTripState(trip.id);
        setTrip((prev) => (prev ? { ...prev, comments: builtin.comments } : prev));
      } else {
        await refreshTrip(trip.id);
      }
      setNewComment("");
    } catch (error: any) {
      toast({ title: "Comment failed", description: error.message || "Please login first", variant: "destructive" });
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip || !window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await api.deleteTrip(trip.id);
      toast({ title: "Trip deleted", description: "Your trip has been deleted." });
      navigate("/profile");
    } catch (_err) {
      toast({ title: "Error", description: "Failed to delete trip.", variant: "destructive" });
    }
  };

  const handleLikeTrip = async () => {
    if (!trip) return;
    try {
      const result = await api.toggleLikeTrip(trip.id);
      setLiked(result.liked);
      setTrip((prev) => (prev ? { ...prev, likesCount: result.likesCount, likedByMe: result.liked } : prev));
    } catch (error: any) {
      toast({ title: "Like failed", description: error.message || "Please login first", variant: "destructive" });
    }
  };

  const handleSaveTrip = async () => {
    if (!trip) return;
    try {
      const result = await api.toggleSaveTrip(trip.id);
      setSaved(result.saved);
      setTrip((prev) => (prev ? { ...prev, savedByMe: result.saved } : prev));
      toast({ title: result.saved ? "Trip saved" : "Trip removed", description: result.saved ? "Saved to your list." : "Removed from saved." });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message || "Please login first", variant: "destructive" });
    }
  };

  const handleShareTrip = async () => {
    if (!trip) return;
    const shareUrl = `${window.location.origin}/explore?selectedTrip=${trip.id}`;
    navigator.clipboard.writeText(shareUrl);
    try {
      const result = await api.shareTrip(trip.id);
      setTrip((prev) => (prev ? { ...prev, shareCount: result.shareCount } : prev));
    } catch (_err) {
      // no-op
    }
    toast({ title: "Link copied", description: "Trip link copied to clipboard." });
  };

  const canEditOrDelete = Boolean(currentUser && trip && trip.author?.id === currentUser.id);

  if (loading) {
    const content = (
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-80 w-full rounded-xl bg-gray-200 animate-pulse mb-8" />
      </div>
    );
    return disableLayout ? content : <Layout>{content}</Layout>;
  }

  if (!trip) {
    const content = (
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Trip Not Found</h1>
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
          <Button variant="ghost" onClick={() => (onClose ? onClose() : navigate("/explore"))} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Button>
        </div>
      )}

      <div className="relative h-[60vh] w-full">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">{trip.difficulty}</Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">{trip.distance} km</Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">{trip.duration} days</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{trip.title}</h1>
            <div className="flex items-center text-white/90 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{trip.location}</span>
            </div>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-400" /><span>{trip.averageRating?.toFixed(1) || "0.0"}</span></div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /><span>Created {format(new Date(trip.createdAt || trip.created_at), "MMM d, yyyy")}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stops">Stops</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <h2 className="text-2xl font-bold mb-4">About This Trip</h2>
                <p className="text-gray-700 mb-6">{trip.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg"><MapPin className="h-5 w-5 text-forest-700 mr-3" /><div><p className="text-sm text-gray-500">Location</p><p className="font-medium">{trip.location}</p></div></div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg"><Clock className="h-5 w-5 text-forest-700 mr-3" /><div><p className="text-sm text-gray-500">Duration</p><p className="font-medium">{trip.duration} days</p></div></div>
                </div>
              </TabsContent>

              <TabsContent value="stops">
                <div className="space-y-8">
                  {trip.stops.map((stop, index) => (
                    <div key={stop.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <img src={stop.image} alt={stop.name} className="w-full h-40 sm:h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-1">{index + 1}. {stop.name}</h3>
                        <p className="text-gray-600 mb-2">{stop.location}</p>
                        <p className="text-gray-700">{stop.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="map">
                <h2 className="text-2xl font-bold mb-6">Route View</h2>
                <MapView stops={trip.stops} startLocation={trip.stops[0]?.location || trip.location} endLocation={trip.stops[trip.stops.length - 1]?.location || trip.location} />
                <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <p className="flex items-center gap-2"><Map className="h-4 w-4" /><span>Route map shows approximate path and stops.</span></p>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                  <div className="mb-4">
                    <p className="mb-2 text-gray-700">Rate this trip:</p>
                    <StarRating rating={newRating} onChange={setNewRating} size="lg" />
                  </div>
                  <Textarea placeholder="Share your experience..." rows={4} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full mb-4" />
                  <Button onClick={handleSubmitReview} disabled={!reviewComment.trim() || submittingReview}>Submit Review</Button>
                </div>
                {trip.ratings.length > 0 ? (
                  <div className="space-y-6">
                    {trip.ratings.map((rating) => (
                      <div key={rating.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{rating.user?.name || "Anonymous"}</p>
                          <span className="text-sm text-gray-500">{format(new Date(rating.createdAt || rating.created_at), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center mb-2"><StarRating rating={rating.rating} size="sm" /></div>
                        <p className="text-gray-700">{rating.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No reviews yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
                  <Textarea placeholder="Add your comment..." rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full mb-4" />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>Post Comment</Button>
                </div>
                {(trip.comments || []).length > 0 ? (
                  <div className="space-y-4">
                    {(trip.comments || []).map((comment) => (
                      <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{comment.user?.name || "Anonymous"}</p>
                          <p className="text-sm text-gray-500">{format(new Date(comment.createdAt || comment.created_at), "MMM d, yyyy")}</p>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 sticky top-24">
              <div className="p-6">
                <div className="mb-6">
                  <p className="font-medium">Created by</p>
                  <p className="text-forest-700">{trip.author?.name || "Unknown"}</p>
                </div>
                <Separator className="mb-6" />
                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/profile/${trip.author?.id}`)}>
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button className="w-full" variant={liked ? "default" : "outline"} onClick={handleLikeTrip}>
                    <Heart className="h-4 w-4 mr-2" />
                    {liked ? "Liked" : "Like"} ({trip.likesCount || 0})
                  </Button>
                  <Button className="w-full bg-forest-700 hover:bg-forest-800 text-white" onClick={handleSaveTrip}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    {saved ? "Saved" : "Save Trip"}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShareTrip}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share ({trip.shareCount || 0})
                  </Button>
                  {canEditOrDelete && (
                    <Button variant="destructive" className="w-full mt-4" onClick={handleDeleteTrip}>
                      Delete Trip
                    </Button>
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
