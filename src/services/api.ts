
// This file will simulate a backend API service

// Types for our application
export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  createdTrips: number;
}

export interface RoadTrip {
  id: string;
  title: string;
  description: string;
  image: string;
  author: User;
  distance: number;
  duration: number;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  stops: RoadStop[];
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
}

export interface RoadStop {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  position: number;
}

export interface Rating {
  id: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

// Mock data for users
const USERS: User[] = [
  {
    id: "1",
    username: "adventurer",
    name: "Alex Johnson",
    bio: "Travel enthusiast and photographer. Always seeking new adventures on the road.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop",
    followers: 542,
    following: 231,
    createdTrips: 15
  },
  {
    id: "2",
    username: "roadwarrior",
    name: "Sam Rodriguez",
    bio: "Road trip aficionado. I've driven across 42 states and 15 countries.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop",
    followers: 1248,
    following: 432,
    createdTrips: 27
  },
  {
    id: "3",
    username: "nomadlife",
    name: "Taylor Kim",
    bio: "Digital nomad traveling the world one road at a time.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&h=250&auto=format&fit=crop",
    followers: 892,
    following: 315,
    createdTrips: 19
  }
];

// Mock data for road trips
const ROAD_TRIPS: RoadTrip[] = [
  {
    id: "1",
    title: "Pacific Coast Highway Adventure",
    description: "Experience the breathtaking views of California's coast on this iconic road trip from San Francisco to Los Angeles.",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&auto=format&fit=crop",
    author: USERS[0],
    distance: 655,
    duration: 5,
    location: "California, USA",
    difficulty: "Moderate",
    stops: [
      {
        id: "s1",
        name: "Golden Gate Bridge",
        description: "Start your journey with views of this iconic San Francisco landmark.",
        image: "https://images.unsplash.com/photo-1541464522988-31b420f688b9?w=400&auto=format&fit=crop",
        location: "San Francisco, CA",
        position: 1
      },
      {
        id: "s2",
        name: "Monterey Bay",
        description: "Explore the famous Monterey Bay Aquarium and Cannery Row.",
        image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&auto=format&fit=crop",
        location: "Monterey, CA",
        position: 2
      },
      {
        id: "s3",
        name: "Big Sur",
        description: "Drive through one of the most scenic stretches of coastline in the world.",
        image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&auto=format&fit=crop",
        location: "Big Sur, CA",
        position: 3
      },
      {
        id: "s4",
        name: "Santa Barbara",
        description: "Enjoy this beautiful coastal city with Spanish architecture.",
        image: "https://images.unsplash.com/photo-1571189644547-c8cdce15b82c?w=400&auto=format&fit=crop",
        location: "Santa Barbara, CA",
        position: 4
      }
    ],
    ratings: [
      {
        id: "r1",
        user: USERS[1],
        rating: 5,
        comment: "One of the most beautiful drives I've ever taken! The views are absolutely worth it.",
        createdAt: "2023-05-15T10:30:00Z"
      },
      {
        id: "r2",
        user: USERS[2],
        rating: 4,
        comment: "Great trip, but be prepared for fog in some areas that can obscure the views.",
        createdAt: "2023-06-12T14:45:00Z"
      }
    ],
    averageRating: 4.5,
    createdAt: "2023-04-10T08:15:00Z"
  },
  {
    id: "2",
    title: "Grand Canyon Road Adventure",
    description: "Explore the natural wonders of the American Southwest, from the Grand Canyon to Monument Valley.",
    image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=600&auto=format&fit=crop",
    author: USERS[1],
    distance: 850,
    duration: 7,
    location: "Arizona & Utah, USA",
    difficulty: "Moderate",
    stops: [
      {
        id: "s5",
        name: "Grand Canyon South Rim",
        description: "Start with breathtaking views of one of the world's natural wonders.",
        image: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?w=400&auto=format&fit=crop",
        location: "Grand Canyon National Park, AZ",
        position: 1
      },
      {
        id: "s6",
        name: "Horseshoe Bend",
        description: "Marvel at this iconic meander of the Colorado River.",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop",
        location: "Page, AZ",
        position: 2
      },
      {
        id: "s7",
        name: "Antelope Canyon",
        description: "Explore the mesmerizing slot canyons with their wave-like structures.",
        image: "https://images.unsplash.com/photo-1602088693260-78f2c3c4a385?w=400&auto=format&fit=crop",
        location: "Page, AZ",
        position: 3
      },
      {
        id: "s8",
        name: "Monument Valley",
        description: "Drive through this iconic landscape featured in countless Western films.",
        image: "https://images.unsplash.com/photo-1539541417736-3d44c90da315?w=400&auto=format&fit=crop",
        location: "Monument Valley, UT",
        position: 4
      }
    ],
    ratings: [
      {
        id: "r3",
        user: USERS[0],
        rating: 5,
        comment: "The diversity of landscapes is incredible. Make sure to catch sunrise at the Grand Canyon!",
        createdAt: "2023-07-22T09:15:00Z"
      },
      {
        id: "r4",
        user: USERS[2],
        rating: 5,
        comment: "Absolutely stunning! I recommend adding Zion National Park if you have extra time.",
        createdAt: "2023-08-05T11:30:00Z"
      }
    ],
    averageRating: 5,
    createdAt: "2023-06-18T16:45:00Z"
  },
  {
    id: "3",
    title: "Blue Ridge Parkway Fall Foliage Tour",
    description: "Experience the stunning autumn colors along one of America's most scenic drives through the Appalachian Mountains.",
    image: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600&auto=format&fit=crop",
    author: USERS[2],
    distance: 469,
    duration: 4,
    location: "Virginia & North Carolina, USA",
    difficulty: "Easy",
    stops: [
      {
        id: "s9",
        name: "Shenandoah National Park",
        description: "Begin your journey in this beautiful park with abundant wildlife.",
        image: "https://images.unsplash.com/photo-1635377361665-865acd6dc982?w=400&auto=format&fit=crop",
        location: "Virginia",
        position: 1
      },
      {
        id: "s10",
        name: "Mabry Mill",
        description: "Visit this picturesque historic mill, one of the most photographed spots on the parkway.",
        image: "https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=400&auto=format&fit=crop",
        location: "Virginia",
        position: 2
      },
      {
        id: "s11",
        name: "Linn Cove Viaduct",
        description: "Drive on this engineering marvel that hugs the face of Grandfather Mountain.",
        image: "https://images.unsplash.com/photo-1590562182024-8aea1bd2bd9f?w=400&auto=format&fit=crop",
        location: "North Carolina",
        position: 3
      },
      {
        id: "s12",
        name: "Great Smoky Mountains",
        description: "End your journey in America's most visited national park.",
        image: "https://images.unsplash.com/photo-1578301978018-3c6b4893bd3d?w=400&auto=format&fit=crop",
        location: "North Carolina",
        position: 4
      }
    ],
    ratings: [
      {
        id: "r5",
        user: USERS[0],
        rating: 5,
        comment: "October is definitely the perfect time for this trip. The colors were magical!",
        createdAt: "2023-11-14T15:20:00Z"
      },
      {
        id: "r6",
        user: USERS[1],
        rating: 4,
        comment: "Beautiful drive, but it gets crowded during peak foliage season. Start early in the day!",
        createdAt: "2023-10-29T12:40:00Z"
      }
    ],
    averageRating: 4.5,
    createdAt: "2023-09-05T10:30:00Z"
  },
  {
    id: "4",
    title: "Iceland's Ring Road",
    description: "Circle the entire island of Iceland on this epic road trip featuring waterfalls, volcanoes, and stunning landscapes.",
    image: "https://images.unsplash.com/photo-1504284402001-53fd62ef7177?w=600&auto=format&fit=crop",
    author: USERS[0],
    distance: 1332,
    duration: 10,
    location: "Iceland",
    difficulty: "Hard",
    stops: [
      {
        id: "s13",
        name: "Reykjavik",
        description: "Start in Iceland's charming capital city.",
        image: "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=400&auto=format&fit=crop",
        location: "Reykjavik, Iceland",
        position: 1
      },
      {
        id: "s14",
        name: "Seljalandsfoss & Skógafoss",
        description: "Visit these iconic waterfalls on the south coast.",
        image: "https://images.unsplash.com/photo-1445874340810-56238ec5a3fa?w=400&auto=format&fit=crop",
        location: "South Region, Iceland",
        position: 2
      },
      {
        id: "s15",
        name: "Jökulsárlón Glacier Lagoon",
        description: "Marvel at the floating icebergs in this breathtaking lagoon.",
        image: "https://images.unsplash.com/photo-1455218873509-8097305ee378?w=400&auto=format&fit=crop",
        location: "Eastern Region, Iceland",
        position: 3
      },
      {
        id: "s16",
        name: "Myvatn Geothermal Area",
        description: "Experience the otherworldly geothermal landscapes of northern Iceland.",
        image: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=400&auto=format&fit=crop",
        location: "Northern Region, Iceland",
        position: 4
      }
    ],
    ratings: [
      {
        id: "r7",
        user: USERS[1],
        rating: 5,
        comment: "The most incredible landscapes I've ever seen. Worth every penny!",
        createdAt: "2023-08-19T17:30:00Z"
      },
      {
        id: "r8",
        user: USERS[2],
        rating: 4,
        comment: "Amazing trip but be prepared for rapidly changing weather conditions.",
        createdAt: "2023-07-30T14:15:00Z"
      }
    ],
    averageRating: 4.5,
    createdAt: "2023-05-25T13:45:00Z"
  },
  {
    id: "5",
    title: "Great Ocean Road Coastal Journey",
    description: "Drive along Australia's stunning southern coast to see the Twelve Apostles and other natural wonders.",
    image: "https://images.unsplash.com/photo-1614518619097-f0f46c5b9e46?w=600&auto=format&fit=crop",
    author: USERS[1],
    distance: 243,
    duration: 3,
    location: "Victoria, Australia",
    difficulty: "Easy",
    stops: [
      {
        id: "s17",
        name: "Torquay",
        description: "Begin your journey at this famous surf town and visit Bells Beach.",
        image: "https://images.unsplash.com/photo-1502901930015-158e72cff877?w=400&auto=format&fit=crop",
        location: "Torquay, Victoria",
        position: 1
      },
      {
        id: "s18",
        name: "Apollo Bay",
        description: "Enjoy this charming coastal town with beautiful beaches.",
        image: "https://images.unsplash.com/photo-1616461046858-16503b1c68f8?w=400&auto=format&fit=crop",
        location: "Apollo Bay, Victoria",
        position: 2
      },
      {
        id: "s19",
        name: "Twelve Apostles",
        description: "Marvel at these iconic limestone stacks rising from the Southern Ocean.",
        image: "https://images.unsplash.com/photo-1529108790734-d2797f7652fc?w=400&auto=format&fit=crop",
        location: "Port Campbell National Park, Victoria",
        position: 3
      },
      {
        id: "s20",
        name: "Bay of Islands",
        description: "Explore these spectacular rock formations and pristine beaches.",
        image: "https://images.unsplash.com/photo-1505881502353-a1ba27e85c98?w=400&auto=format&fit=crop",
        location: "Warrnambool, Victoria",
        position: 4
      }
    ],
    ratings: [
      {
        id: "r9",
        user: USERS[0],
        rating: 5,
        comment: "An absolute must-do when in Australia. Try to catch sunset at the Twelve Apostles!",
        createdAt: "2023-10-08T16:20:00Z"
      },
      {
        id: "r10",
        user: USERS[2],
        rating: 5,
        comment: "One of the world's best coastal drives. Abundant wildlife and beautiful scenery.",
        createdAt: "2023-11-22T09:45:00Z"
      }
    ],
    averageRating: 5,
    createdAt: "2023-09-17T11:30:00Z"
  },
  {
    id: "6",
    title: "Route 66: The Historic Mother Road",
    description: "Travel the iconic Route 66 from Chicago to Santa Monica, experiencing America's classic road trip.",
    image: "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=600&auto=format&fit=crop",
    author: USERS[2],
    distance: 3940,
    duration: 14,
    location: "USA (Multiple States)",
    difficulty: "Hard",
    stops: [
      {
        id: "s21",
        name: "Chicago",
        description: "Begin your journey at the starting point of Route 66.",
        image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&auto=format&fit=crop",
        location: "Chicago, Illinois",
        position: 1
      },
      {
        id: "s22",
        name: "St. Louis",
        description: "Visit the Gateway Arch and try some St. Louis-style BBQ.",
        image: "https://images.unsplash.com/photo-1543598385-667a4825b24a?w=400&auto=format&fit=crop",
        location: "St. Louis, Missouri",
        position: 2
      },
      {
        id: "s23",
        name: "Cadillac Ranch",
        description: "Check out this famous public art installation featuring buried Cadillacs.",
        image: "https://images.unsplash.com/photo-1629301771443-ea90d3e3327d?w=400&auto=format&fit=crop",
        location: "Amarillo, Texas",
        position: 3
      },
      {
        id: "s24",
        name: "Santa Monica Pier",
        description: "End your epic journey at this iconic pier on the Pacific Ocean.",
        image: "https://images.unsplash.com/photo-1587407627257-27b7127c868c?w=400&auto=format&fit=crop",
        location: "Santa Monica, California",
        position: 4
      }
    ],
    ratings: [
      {
        id: "r11",
        user: USERS[0],
        rating: 4,
        comment: "A fantastic historical experience, but be prepared for some sections of the original route to be gone.",
        createdAt: "2023-07-11T10:15:00Z"
      },
      {
        id: "r12",
        user: USERS[1],
        rating: 5,
        comment: "The quintessential American road trip! So many quirky roadside attractions along the way.",
        createdAt: "2023-06-28T13:50:00Z"
      }
    ],
    averageRating: 4.5,
    createdAt: "2023-04-30T09:20:00Z"
  }
];

// Mock APIs
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Road Trips
  getTrips: async (): Promise<RoadTrip[]> => {
    await delay(500); // Simulate network delay
    return [...ROAD_TRIPS];
  },
  
  getTripById: async (id: string): Promise<RoadTrip | undefined> => {
    await delay(300);
    return ROAD_TRIPS.find(trip => trip.id === id);
  },
  
  createTrip: async (tripData: Partial<RoadTrip>): Promise<RoadTrip> => {
    await delay(800);
    const newTrip: RoadTrip = {
      id: `trip_${Math.floor(Math.random() * 1000)}`,
      title: tripData.title || "Untitled Trip",
      description: tripData.description || "",
      image: tripData.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop",
      author: USERS[0], // Default to first user
      distance: tripData.distance || 0,
      duration: tripData.duration || 1,
      location: tripData.location || "Unknown Location",
      difficulty: tripData.difficulty || "Moderate",
      stops: tripData.stops || [],
      ratings: [],
      averageRating: 0,
      createdAt: new Date().toISOString()
    };
    
    ROAD_TRIPS.unshift(newTrip);
    return newTrip;
  },
  
  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(400);
    return [...USERS];
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(300);
    return USERS.find(user => user.id === id);
  },
  
  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    return USERS[0]; // Mock current user as the first user
  },
  
  // Ratings & Reviews
  addRating: async (tripId: string, rating: number, comment: string): Promise<Rating> => {
    await delay(600);
    
    const trip = ROAD_TRIPS.find(t => t.id === tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }
    
    const newRating: Rating = {
      id: `rating_${Math.floor(Math.random() * 1000)}`,
      user: USERS[0], // Current user
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    trip.ratings.push(newRating);
    
    // Update average rating
    const sum = trip.ratings.reduce((acc, r) => acc + r.rating, 0);
    trip.averageRating = sum / trip.ratings.length;
    
    return newRating;
  }
};
