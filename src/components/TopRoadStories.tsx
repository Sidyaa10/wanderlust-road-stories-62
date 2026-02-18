
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import StoryModal from "./StoryModal";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MapPin, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";

// Interface for our road trip stories
interface Story {
  id: string;
  title: string;
  highlight: string;
  images: string[];
  content: string;
  location: string;
  name: string;
  likes?: number;
  isLiked?: boolean;
  shareCount?: number;
}

// Fallback stories in case database fetch fails
const fallbackStories = [
  {
    id: "1",
    title: "Cruising the French Riviera",
    highlight: "A sun-drenched coast, turquoise waters, and endless charm.",
    images: [
      "https://travel.home.sndimg.com/content/dam/images/travel/stock/2016/8/26/0/shutterstock_LiliGraphie-185168879-French-Riviera.jpg.rend.hgtvcom.1280.720.suffix/1491594376304.jpeg",
      "https://staging.franceadventurer.com/wp-content/uploads/2024/01/plage-des-sablettes-beach-old-town-menton-france-1024x768.jpg",
      "https://rivierabarcrawltours.com/wp-content/uploads/2020/01/what-is-the-french-riviera-pic1-1080x675-1.jpg",
    ],
    content:
      "Last spring, I started my road trip in Nice and followed the winding coastal roads through Antibes, Cannes, and all the way to St Tropez. Every stop along the Côte d'Azur was bursting with vibrant color, fresh seafood, and golden-hour views over the Mediterranean. The blend of French culture and the sea breeze made this drive absolutely unforgettable!",
    location: "French Riviera, France",
    name: "Sid Kadam",
    likes: 42,
    isLiked: false,
  },
  {
    id: "2",
    title: "Highway to the Clouds: Pacific Coast USA",
    highlight: "Cliffs, surf towns, and the wild ocean drive.",
    images: [
      "https://www.clickandgo.com/blog/wp-content/uploads/2019/12/west-coast-usa.jpg",
      "https://www.uscoastlines.com/wp-content/uploads/2020/11/California-Pacific-Coast-1024x576.jpg",
      "https://www.travelandleisure.com/thmb/flyoiHUr0e_kjpghvM_fRcTNLFQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-viewpoint-pacific-coast-highway-california-NO1RT0824-0cef3f8952b84f02b586461f5076c7b3.jpg",
    ],
    content:
      "Driving down Highway 1 from San Francisco to Big Sur was a dream come true. The crashing waves and misty mornings set the perfect vibe for winding through redwoods and seaside cliffs. Each overlook along this legendary highway offered a new jaw-dropping perspective—don't miss sunset at Bixby Creek Bridge!",
    location: "California, USA",
    name: "Sid Kadam",
    likes: 37,
    isLiked: false,
  },
  {
    id: "3",
    title: "Bavarian Castles & Alpine Peaks",
    highlight: "From fairy-tale castles to the high Alps.",
    images: [
      "https://images.seattletimes.com/wp-content/uploads/2019/04/39d285fc-5bd5-11e9-80f3-f2ab2e152199.jpg?d=1560x1040",
      "https://successtours.s3.amazonaws.com/web/locations/Germany/Bavaria/_2000xAUTO_crop_center-center_90_none/Castle-Hohenschwangau-eternal-forest-with-blue-mountains-and-lakes-of-Bavaria-Germany.jpg",
      "https://www.traverse-blog.com/wp-content/uploads/2020/03/Swiss-Mountain-Towns-and-Scenery-4.jpg",
    ],
    content:
      "Exploring southern Germany by road took me from Munich to the magical Neuschwanstein Castle and through the Alps to Garmisch. The landscapes were like scenes from a picture book, with crystal lakes, dramatic peaks, and cozy Bavarian villages. Every curve in the road promised a new adventure and postcard-worthy scenery.",
    location: "Bavaria, Germany",
    name: "Sid Kadam",
    likes: 29,
    isLiked: false,
  },
];

interface TopRoadStoriesProps {
  featured?: boolean;
}

const TopRoadStories: React.FC<TopRoadStoriesProps> = ({ featured = false }) => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const [stories, setStories] = useState<Story[]>(fallbackStories);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRoadTrips() {
      try {
        const trips = await api.getTrips();
        const limited = trips.slice(0, featured ? 6 : 3);
        if (limited.length > 0) {
          const transformedData: Story[] = limited.map((trip) => ({
            id: trip.id,
            title: trip.title,
            highlight: trip.description || "Explore this amazing road trip adventure.",
            images: trip.image ? [trip.image] : ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"],
            content: trip.description || "No details available for this trip yet.",
            location: trip.location || "Unknown location",
            name: trip.author?.name || "Road Trip Explorer",
            likes: trip.likesCount || 0,
            isLiked: Boolean(trip.likedByMe),
            shareCount: trip.shareCount || 0,
          }));
          setStories(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch road trips:", error);
        toast({
          title: "Failed to load stories",
          description: "Using fallback data instead. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRoadTrips();
  }, [featured]);

  const handleLike = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    api
      .toggleLikeTrip(stories[idx].id)
      .then((result) => {
        setStories((prev) =>
          prev.map((story, i) =>
            i === idx ? { ...story, isLiked: result.liked, likes: result.likesCount } : story
          )
        );
      })
      .catch((err) => {
        toast({
          title: "Like failed",
          description: err.message || "Please login first",
          variant: "destructive",
        });
      });
  };

  const handleShare = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/explore?selectedTrip=${stories[idx].id}`;
    navigator.clipboard.writeText(shareUrl);
    api.shareTrip(stories[idx].id).catch(() => undefined);
    toast({ title: "Link copied!", description: "Share link copied to clipboard" });
  };

  const handleViewAllStories = () => {
    navigate('/explore');
  };

  const handleStoryClick = (idx: number) => {
    if (featured) {
      // In featured mode, navigate to trip detail page
      navigate(`/explore?selectedTrip=${stories[idx].id}`);
    } else {
      // In normal mode, open modal
      setOpenIdx(idx);
    }
  };

  return (
    <section className="py-14 bg-white">
      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {featured ? "Featured Road Trips" : "Top Road Stories"}
          </h2>
          {featured && (
            <Button 
              variant="outline" 
              onClick={handleViewAllStories}
              className="hidden sm:flex"
            >
              View All Trips
            </Button>
          )}
        </div>
        
        {loading ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {stories.map((story, idx) => (
              <div
                key={story.id}
                className="road-card relative focus:outline-none focus:ring-2 focus:ring-sky-500 group"
                aria-label={`Read story: ${story.title}`}
              >
                <Card className="h-full flex flex-col transition-shadow hover:shadow-lg overflow-hidden bg-[#f2e6d2] border-[#d8c7b2]">
                  <div 
                    className="relative h-48 cursor-pointer"
                    onClick={() => handleStoryClick(idx)}
                  >
                    <img
                      src={story.images[0]}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-white/80 text-xs px-3 py-1 rounded font-medium">
                      {story.location}
                    </span>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white text-gray-800 hover:bg-white/90"
                        onClick={() => handleStoryClick(idx)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  <CardContent className="flex-1 flex flex-col pt-5">
                    <CardTitle 
                      className="text-lg font-bold cursor-pointer hover:text-forest-700 transition-colors"
                      onClick={() => handleStoryClick(idx)}
                    >
                      {story.title}
                    </CardTitle>
                    <div className="mt-2 text-sm text-forest-700 font-medium line-clamp-2">
                      {story.highlight}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-600 mt-2 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{story.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>3-5 days</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-500">{story.name}</div>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => handleLike(idx, e)}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Like this story"
                        >
                          <Heart 
                            className={`h-4 w-4 ${story.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                        <span className="text-xs text-gray-500">{story.likes}</span>
                        <button 
                          onClick={(e) => handleShare(idx, e)}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors ml-2"
                          aria-label="Share this story"
                        >
                          <Share2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
        
        {featured && (
          <div className="mt-8 text-center sm:hidden">
            <Button onClick={handleViewAllStories}>
              View All Road Trips
            </Button>
          </div>
        )}
        
        {openIdx !== null && !featured && (
          <StoryModal
            open={openIdx !== null}
            onOpenChange={() => setOpenIdx(null)}
            story={stories[openIdx]}
          />
        )}
      </div>
    </section>
  );
};

export default TopRoadStories;
