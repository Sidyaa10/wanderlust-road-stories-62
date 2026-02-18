import { RoadTrip, RoadStop, Rating, TripComment, User } from "./types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:5000/api";
const TOKEN_KEY = "wanderlust_token";
const BUILTIN_STATE_KEY = "wanderlust_builtin_state_v1";

type ApiErrorShape = {
  message?: string;
  error?: string;
};

const getToken = () => localStorage.getItem(TOKEN_KEY);
const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload?.userId || null;
  } catch {
    return null;
  }
};

type BuiltinState = {
  likes: Record<string, string[]>;
  saves: Record<string, string[]>;
  shares: Record<string, number>;
  comments: Record<string, TripComment[]>;
  ratings: Record<string, Rating[]>;
};

const readBuiltinState = (): BuiltinState => {
  try {
    const raw = localStorage.getItem(BUILTIN_STATE_KEY);
    if (!raw) {
      return { likes: {}, saves: {}, shares: {}, comments: {}, ratings: {} };
    }
    return JSON.parse(raw) as BuiltinState;
  } catch {
    return { likes: {}, saves: {}, shares: {}, comments: {}, ratings: {} };
  }
};

const writeBuiltinState = (state: BuiltinState) => {
  localStorage.setItem(BUILTIN_STATE_KEY, JSON.stringify(state));
};

const setToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorShape;
    throw new Error(payload.message || payload.error || "Request failed");
  }

  return (await response.json()) as T;
};

const uploadAvatarRequest = async <T>(file: File): Promise<T> => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized");
  const form = new FormData();
  form.append("avatar", file);

  const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorShape;
    throw new Error(payload.message || payload.error || "Avatar upload failed");
  }
  return (await response.json()) as T;
};

const formatResponseData = (data: any): any => {
  if (Array.isArray(data)) return data.map((item) => formatResponseData(item));
  if (data === null || data === undefined || typeof data !== "object") return data;

  const formattedData = { ...data };
  if ("average_rating" in formattedData) formattedData.averageRating = formattedData.average_rating;
  if ("created_at" in formattedData) formattedData.createdAt = formattedData.created_at;
  Object.keys(formattedData).forEach((key) => {
    if (formattedData[key] && typeof formattedData[key] === "object") {
      formattedData[key] = formatResponseData(formattedData[key]);
    }
  });
  return formattedData;
};

type AuthResponse = { token: string; user: User };
type TripsResponse = { trips: RoadTrip[] };
type TripResponse = { trip: RoadTrip };
type UsersResponse = { user: User };
type RatingResponse = { rating: Rating };
type CommentResponse = { comment: TripComment };
type SavedResponse = { saved: boolean };
type LikeResponse = { liked: boolean; likesCount: number };
type ShareResponse = { shareCount: number };

export const api = {
  getToken,
  isAuthenticated: (): boolean => Boolean(getToken()),

  register: async (email: string, password: string): Promise<User> => {
    const data = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return formatResponseData(data.user) as User;
  },

  login: async (email: string, password: string): Promise<User> => {
    const data = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return formatResponseData(data.user) as User;
  },

  logout: async (): Promise<void> => {
    setToken(null);
  },

  getCurrentUser: async (): Promise<User> => {
    const data = await request<UsersResponse>("/auth/me");
    return formatResponseData(data.user) as User;
  },

  updateCurrentUser: async (payload: Partial<Pick<User, "name" | "username" | "bio" | "avatar">>): Promise<User> => {
    const data = await request<UsersResponse>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return formatResponseData(data.user) as User;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const data = await uploadAvatarRequest<UsersResponse>(file);
    return formatResponseData(data.user) as User;
  },

  getUsers: async (): Promise<User[]> => {
    return [];
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const data = await request<UsersResponse>(`/users/${id}`);
    return formatResponseData(data.user) as User;
  },

  getTrips: async (): Promise<RoadTrip[]> => {
    const data = await request<TripsResponse>("/trips");
    return formatResponseData(data.trips || []) as RoadTrip[];
  },

  getTripById: async (id: string): Promise<RoadTrip | undefined> => {
    if (!isMongoId(id)) return undefined;
    const data = await request<TripResponse>(`/trips/${id}`);
    return formatResponseData(data.trip) as RoadTrip;
  },

  createTrip: async (tripData: Partial<RoadTrip>): Promise<RoadTrip> => {
    const data = await request<TripResponse>("/trips", {
      method: "POST",
      body: JSON.stringify(tripData),
    });
    return formatResponseData(data.trip) as RoadTrip;
  },

  deleteTrip: async (id: string): Promise<boolean> => {
    await request<{ success: boolean }>(`/trips/${id}`, { method: "DELETE" });
    return true;
  },

  addRating: async (tripId: string, rating: number, comment: string): Promise<Rating> => {
    if (!isMongoId(tripId)) {
      const uid = getUserIdFromToken();
      if (!uid) throw new Error("Please login first");
      const state = readBuiltinState();
      const created: Rating = {
        id: `local-rating-${Date.now()}`,
        trip_id: tripId,
        user_id: uid,
        user: {
          id: uid,
          username: "traveler",
          name: "Traveler",
          bio: "",
          avatar: "",
          followers: 0,
          following: 0,
          created_at: new Date().toISOString(),
        },
        rating: Number(rating),
        comment: String(comment),
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const list = state.ratings[tripId] || [];
      state.ratings[tripId] = [created, ...list];
      writeBuiltinState(state);
      return created;
    }
    const data = await request<RatingResponse>(`/trips/${tripId}/ratings`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
    return formatResponseData(data.rating) as Rating;
  },

  deleteRating: async (ratingId: string): Promise<boolean> => {
    await request<{ success: boolean }>(`/ratings/${ratingId}`, { method: "DELETE" });
    return true;
  },

  addComment: async (tripId: string, comment: string): Promise<TripComment> => {
    if (!isMongoId(tripId)) {
      const uid = getUserIdFromToken();
      if (!uid) throw new Error("Please login first");
      const state = readBuiltinState();
      const created: TripComment = {
        id: `local-comment-${Date.now()}`,
        trip_id: tripId,
        user_id: uid,
        user: {
          id: uid,
          username: "traveler",
          name: "Traveler",
          bio: "",
          avatar: "",
          followers: 0,
          following: 0,
          created_at: new Date().toISOString(),
        },
        comment: String(comment),
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const list = state.comments[tripId] || [];
      state.comments[tripId] = [created, ...list];
      writeBuiltinState(state);
      return created;
    }
    const data = await request<CommentResponse>(`/trips/${tripId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    });
    return formatResponseData(data.comment) as TripComment;
  },

  toggleLikeTrip: async (tripId: string): Promise<LikeResponse> => {
    if (!isMongoId(tripId)) {
      const uid = getUserIdFromToken();
      if (!uid) throw new Error("Please login first");
      const state = readBuiltinState();
      const current = new Set(state.likes[tripId] || []);
      if (current.has(uid)) current.delete(uid);
      else current.add(uid);
      state.likes[tripId] = Array.from(current);
      writeBuiltinState(state);
      return { liked: current.has(uid), likesCount: current.size };
    }
    return await request<LikeResponse>(`/trips/${tripId}/like`, { method: "POST" });
  },

  toggleSaveTrip: async (tripId: string): Promise<SavedResponse> => {
    if (!isMongoId(tripId)) {
      const uid = getUserIdFromToken();
      if (!uid) throw new Error("Please login first");
      const state = readBuiltinState();
      const current = new Set(state.saves[uid] || []);
      if (current.has(tripId)) current.delete(tripId);
      else current.add(tripId);
      state.saves[uid] = Array.from(current);
      writeBuiltinState(state);
      return { saved: current.has(tripId) };
    }
    return await request<SavedResponse>(`/trips/${tripId}/save`, { method: "POST" });
  },

  shareTrip: async (tripId: string): Promise<ShareResponse> => {
    if (!isMongoId(tripId)) {
      const state = readBuiltinState();
      const nextCount = Number(state.shares[tripId] || 0) + 1;
      state.shares[tripId] = nextCount;
      writeBuiltinState(state);
      return { shareCount: nextCount };
    }
    return await request<ShareResponse>(`/trips/${tripId}/share`, { method: "POST" });
  },

  getSavedTrips: async (): Promise<RoadTrip[]> => {
    const data = await request<TripsResponse>("/users/me/saved-trips");
    return formatResponseData(data.trips || []) as RoadTrip[];
  },

  getBuiltinTripState: (tripId: string) => {
    const uid = getUserIdFromToken();
    const state = readBuiltinState();
    const ratings = state.ratings[tripId] || [];
    const comments = state.comments[tripId] || [];
    const likes = state.likes[tripId] || [];
    const shareCount = Number(state.shares[tripId] || 0);
    const savedByMe = uid ? (state.saves[uid] || []).includes(tripId) : false;
    const likedByMe = uid ? likes.includes(uid) : false;
    const avg = ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;

    return {
      ratings,
      comments,
      likesCount: likes.length,
      shareCount,
      likedByMe,
      savedByMe,
      averageRating: Number(avg.toFixed(1)),
    };
  },

  getBuiltinSavedTripIds: (): string[] => {
    const uid = getUserIdFromToken();
    if (!uid) return [];
    const state = readBuiltinState();
    return state.saves[uid] || [];
  },
};

export type { User, RoadTrip, RoadStop, Rating, TripComment };
