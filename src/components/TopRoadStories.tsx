
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import StoryModal from "./StoryModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Interface for our road trip stories
interface Story {
  id: string;
  title: string;
  highlight: string;
  images: string[];
  content: string;
  location: string;
  name: string;
}

// Fallback stories in case database fetch fails
const fallbackStories = [
  {
    id: "1",
    title: "Cruising the French Riviera",
    highlight: "A sun-drenched coast, turquoise waters, and endless charm.",
    images: [
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&q=80",
    ],
    content:
      "Last spring, I started my road trip in Nice and followed the winding coastal roads through Antibes, Cannes, and all the way to St Tropez. Every stop along the Côte d'Azur was bursting with vibrant color, fresh seafood, and golden-hour views over the Mediterranean. The blend of French culture and the sea breeze made this drive absolutely unforgettable!",
    location: "French Riviera, France",
    name: "Sid Kadam",
  },
  {
    id: "2",
    title: "Highway to the Clouds: Pacific Coast USA",
    highlight: "Cliffs, surf towns, and the wild ocean drive.",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
      "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=600&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    ],
    content:
      "Driving down Highway 1 from San Francisco to Big Sur was a dream come true. The crashing waves and misty mornings set the perfect vibe for winding through redwoods and seaside cliffs. Each overlook along this legendary highway offered a new jaw-dropping perspective—don't miss sunset at Bixby Creek Bridge!",
    location: "California, USA",
    name: "Sid Kadam",
  },
  {
    id: "3",
    title: "Bavarian Castles & Alpine Peaks",
    highlight: "From fairy-tale castles to the high Alps.",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&q=80",
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&q=80",
    ],
    content:
      "Exploring southern Germany by road took me from Munich to the magical Neuschwanstein Castle and through the Alps to Garmisch. The landscapes were like scenes from a picture book, with crystal lakes, dramatic peaks, and cozy Bavarian villages. Every curve in the road promised a new adventure and postcard-worthy scenery.",
    location: "Bavaria, Germany",
    name: "Sid Kadam",
  },
];

const TopRoadStories: React.FC = () => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const [stories, setStories] = useState<Story[]>(fallbackStories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadTrips() {
      try {
        const { data, error } = await supabase
          .from('road_trips')
          .select(`
            id,
            title,
            description,
            location,
            image,
            author:profiles(name)
          `)
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching road trips:", error);
          throw error;
        }

        if (data && data.length > 0) {
          // Transform the data to match our Story interface
          const transformedData: Story[] = data.map(trip => ({
            id: trip.id,
            title: trip.title,
            highlight: trip.description || "Explore this amazing road trip adventure.",
            images: trip.image ? [trip.image] : ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"],
            content: trip.description || "No details available for this trip yet.",
            location: trip.location || "Unknown location",
            name: trip.author?.name || "Road Trip Explorer",
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
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Road Stories</h2>
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {stories.map((story, idx) => (
              <button
                type="button"
                key={story.id}
                onClick={() => setOpenIdx(idx)}
                className="road-card relative focus:outline-none focus:ring-2 focus:ring-sky-500"
                style={{ textAlign: "left" }}
                aria-label={`Read story: ${story.title}`}
              >
                <Card className="h-full flex flex-col transition-shadow hover:shadow-lg">
                  <div className="relative h-48 rounded-t-lg overflow-hidden">
                    <img
                      src={story.images[0]}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-white/80 text-xs px-3 py-1 rounded font-medium">
                      {story.location}
                    </span>
                  </div>
                  <CardContent className="flex-1 flex flex-col">
                    <CardTitle className="text-lg font-bold mt-4">{story.title}</CardTitle>
                    <div className="mt-2 text-sm text-forest-700 font-medium">{story.highlight}</div>
                    <div className="mt-3 text-xs text-gray-500">{story.name}</div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
        
        {openIdx !== null && (
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
