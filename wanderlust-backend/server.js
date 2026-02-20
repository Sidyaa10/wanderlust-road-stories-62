import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "Wanderlust-db";
const JWT_SECRET = process.env.JWT_SECRET || "wanderlust_local_dev_secret_change_me";
const MASTER_EMAIL = "sidkadam@gmail.com";
const MASTER_PASSWORD = "sidkadam10";

app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"] === "true") {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  next();
});
const corsOptions = {
  origin: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg").toLowerCase();
    cb(null, `${req.user?._id || "user"}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const stopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    location: { type: String, default: "" },
    position: { type: Number, default: 1 },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
    likedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    distance: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    location: { type: String, default: "" },
    difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"], default: "Moderate" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stops: [stopSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ratingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const commentSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, trim: true, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);
const Trip = mongoose.model("Trip", tripSchema);
const Rating = mongoose.model("Rating", ratingSchema);
const Comment = mongoose.model("Comment", commentSchema);

const toPublicUser = (userDoc) => ({
  id: userDoc._id.toString(),
  email: userDoc.email,
  username: userDoc.username,
  name: userDoc.name,
  bio: userDoc.bio || "",
  avatar: userDoc.avatar || "",
  followers: userDoc.followers || 0,
  following: userDoc.following || 0,
  created_at: userDoc.created_at,
});

const normalizeTrip = async (tripDoc, currentUserId = null) => {
  const [ratings, comments] = await Promise.all([
    Rating.find({ trip: tripDoc._id }).populate("user").sort({ created_at: -1 }),
    Comment.find({ trip: tripDoc._id }).populate("user").sort({ created_at: -1 }),
  ]);

  const ratingsOut = ratings.map((r) => ({
    id: r._id.toString(),
    trip_id: r.trip.toString(),
    user_id: r.user?._id?.toString() || "",
    user: r.user ? toPublicUser(r.user) : null,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    createdAt: r.created_at,
  }));

  const commentsOut = comments.map((c) => ({
    id: c._id.toString(),
    trip_id: c.trip.toString(),
    user_id: c.user?._id?.toString() || "",
    user: c.user ? toPublicUser(c.user) : null,
    comment: c.comment,
    created_at: c.created_at,
    createdAt: c.created_at,
  }));

  const avg =
    ratingsOut.length > 0
      ? ratingsOut.reduce((sum, r) => sum + r.rating, 0) / ratingsOut.length
      : 0;

  const stops = (tripDoc.stops || []).map((s, idx) => ({
    id: s._id.toString(),
    trip_id: tripDoc._id.toString(),
    name: s.name,
    description: s.description,
    image: s.image,
    location: s.location,
    position: s.position || idx + 1,
    created_at: tripDoc.created_at,
    latitude: s.latitude,
    longitude: s.longitude,
  }));

  return {
    id: tripDoc._id.toString(),
    title: tripDoc.title,
    description: tripDoc.description,
    image: tripDoc.image,
    distance: tripDoc.distance,
    duration: tripDoc.duration,
    location: tripDoc.location,
    difficulty: tripDoc.difficulty,
    created_at: tripDoc.created_at,
    createdAt: tripDoc.created_at,
    average_rating: Number(avg.toFixed(1)),
    averageRating: Number(avg.toFixed(1)),
    author: tripDoc.author ? toPublicUser(tripDoc.author) : null,
    stops,
    ratings: ratingsOut,
    comments: commentsOut,
    likesCount: (tripDoc.likes || []).length,
    shareCount: tripDoc.shareCount || 0,
    likedByMe: currentUserId ? (tripDoc.likes || []).some((id) => id.toString() === currentUserId) : false,
  };
};

const signToken = (userDoc) =>
  jwt.sign({ userId: userDoc._id.toString(), email: userDoc.email }, JWT_SECRET, { expiresIn: "7d" });

const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: MONGO_DB_NAME });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const username = String(email).split("@")[0];
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      username,
      name: username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (_err) {
    res.status(500).json({ message: "Failed to login" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const createdTrips = await Trip.countDocuments({ author: req.user._id });
  res.json({ user: { ...toPublicUser(req.user), createdTrips } });
});

app.patch("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;
    if (typeof name === "string") req.user.name = name.trim();
    if (typeof username === "string") req.user.username = username.trim();
    if (typeof bio === "string") req.user.bio = bio;
    if (typeof avatar === "string") req.user.avatar = avatar;
    await req.user.save();
    const createdTrips = await Trip.countDocuments({ author: req.user._id });
    res.json({ user: { ...toPublicUser(req.user), createdTrips } });
  } catch (_err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

app.post("/api/users/me/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Avatar file is required" });
    req.user.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    await req.user.save();
    const createdTrips = await Trip.countDocuments({ author: req.user._id });
    res.json({ user: { ...toPublicUser(req.user), createdTrips } });
  } catch (_err) {
    res.status(500).json({ message: "Failed to upload avatar" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const createdTrips = await Trip.countDocuments({ author: user._id });
  res.json({ user: { ...toPublicUser(user), createdTrips } });
});

app.get("/api/users/:id/trips", async (req, res) => {
  const trips = await Trip.find({ author: req.params.id }).populate("author").sort({ created_at: -1 });
  const normalized = await Promise.all(trips.map((t) => normalizeTrip(t)));
  res.json({ trips: normalized });
});

app.get("/api/users/me/saved-trips", authMiddleware, async (req, res) => {
  const trips = await Trip.find({ _id: { $in: req.user.savedTrips || [] } }).populate("author").sort({ created_at: -1 });
  const normalized = await Promise.all(trips.map((t) => normalizeTrip(t, req.user._id.toString())));
  res.json({ trips: normalized });
});

app.get("/api/trips", async (req, res) => {
  const auth = req.headers.authorization || "";
  let currentUserId = null;
  if (auth.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      const payload = jwt.verify(token, JWT_SECRET);
      currentUserId = payload.userId;
    } catch (_err) {
      currentUserId = null;
    }
  }

  const trips = await Trip.find().populate("author").sort({ created_at: -1 });
  const normalized = await Promise.all(trips.map((t) => normalizeTrip(t, currentUserId)));
  res.json({ trips: normalized });
});

app.get("/api/trips/:id", async (req, res) => {
  const auth = req.headers.authorization || "";
  let currentUserId = null;
  if (auth.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      const payload = jwt.verify(token, JWT_SECRET);
      currentUserId = payload.userId;
    } catch (_err) {
      currentUserId = null;
    }
  }

  const trip = await Trip.findById(req.params.id).populate("author");
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const normalized = await normalizeTrip(trip, currentUserId);
  res.json({ trip: normalized });
});

app.post("/api/trips", authMiddleware, async (req, res) => {
  try {
    const { title, description, image, distance, duration, location, difficulty, stops = [] } = req.body;
    if (!title) return res.status(400).json({ message: "Trip title is required" });

    const mappedStops = Array.isArray(stops)
      ? stops.map((s, idx) => ({
          name: s.name || `Stop ${idx + 1}`,
          description: s.description || "",
          image: s.image || "",
          location: s.location || "",
          position: s.position || idx + 1,
          latitude: typeof s.latitude === "number" ? s.latitude : undefined,
          longitude: typeof s.longitude === "number" ? s.longitude : undefined,
        }))
      : [];

    const trip = await Trip.create({
      title,
      description: description || "",
      image: image || "",
      distance: Number(distance || 0),
      duration: Number(duration || 0),
      location: location || "",
      difficulty: difficulty || "Moderate",
      author: req.user._id,
      stops: mappedStops,
    });

    const populated = await Trip.findById(trip._id).populate("author");
    res.status(201).json({ trip: await normalizeTrip(populated, req.user._id.toString()) });
  } catch (_err) {
    res.status(500).json({ message: "Failed to create trip" });
  }
});

app.patch("/api/trips/:id", authMiddleware, async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (trip.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

  const { title, description, image, distance, duration, location, difficulty, stops } = req.body;
  if (typeof title === "string") trip.title = title;
  if (typeof description === "string") trip.description = description;
  if (typeof image === "string") trip.image = image;
  if (typeof distance !== "undefined") trip.distance = Number(distance);
  if (typeof duration !== "undefined") trip.duration = Number(duration);
  if (typeof location === "string") trip.location = location;
  if (typeof difficulty === "string") trip.difficulty = difficulty;
  if (Array.isArray(stops)) {
    trip.stops = stops.map((s, idx) => ({
      name: s.name || `Stop ${idx + 1}`,
      description: s.description || "",
      image: s.image || "",
      location: s.location || "",
      position: s.position || idx + 1,
      latitude: typeof s.latitude === "number" ? s.latitude : undefined,
      longitude: typeof s.longitude === "number" ? s.longitude : undefined,
    }));
  }
  await trip.save();
  const populated = await Trip.findById(trip._id).populate("author");
  res.json({ trip: await normalizeTrip(populated, req.user._id.toString()) });
});

app.delete("/api/trips/:id", authMiddleware, async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (trip.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

  await Promise.all([
    Rating.deleteMany({ trip: trip._id }),
    Comment.deleteMany({ trip: trip._id }),
    User.updateMany({}, { $pull: { savedTrips: trip._id, likedTrips: trip._id } }),
    Trip.deleteOne({ _id: trip._id }),
  ]);

  res.json({ success: true });
});

app.post("/api/trips/:id/ratings", authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (!comment || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  const created = await Rating.create({
    trip: trip._id,
    user: req.user._id,
    rating: Number(rating),
    comment: String(comment),
  });

  const populated = await Rating.findById(created._id).populate("user");
  res.status(201).json({
    rating: {
      id: populated._id.toString(),
      trip_id: populated.trip.toString(),
      user_id: populated.user._id.toString(),
      user: toPublicUser(populated.user),
      rating: populated.rating,
      comment: populated.comment,
      created_at: populated.created_at,
      createdAt: populated.created_at,
    },
  });
});

app.delete("/api/ratings/:id", authMiddleware, async (req, res) => {
  const rating = await Rating.findById(req.params.id);
  if (!rating) return res.status(404).json({ message: "Rating not found" });
  if (rating.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await rating.deleteOne();
  res.json({ success: true });
});

app.post("/api/trips/:id/comments", authMiddleware, async (req, res) => {
  const { comment } = req.body;
  if (!comment || !String(comment).trim()) return res.status(400).json({ message: "Comment is required" });
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  const created = await Comment.create({
    trip: trip._id,
    user: req.user._id,
    comment: String(comment).trim(),
  });
  const populated = await Comment.findById(created._id).populate("user");
  res.status(201).json({
    comment: {
      id: populated._id.toString(),
      trip_id: populated.trip.toString(),
      user_id: populated.user._id.toString(),
      user: toPublicUser(populated.user),
      comment: populated.comment,
      created_at: populated.created_at,
      createdAt: populated.created_at,
    },
  });
});

app.post("/api/trips/:id/like", authMiddleware, async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const uid = req.user._id.toString();
  const alreadyLiked = trip.likes.some((id) => id.toString() === uid);

  if (alreadyLiked) {
    trip.likes = trip.likes.filter((id) => id.toString() !== uid);
    req.user.likedTrips = (req.user.likedTrips || []).filter((id) => id.toString() !== trip._id.toString());
  } else {
    trip.likes.push(req.user._id);
    req.user.likedTrips = [...(req.user.likedTrips || []), trip._id];
  }

  await Promise.all([trip.save(), req.user.save()]);
  res.json({ liked: !alreadyLiked, likesCount: trip.likes.length });
});

app.post("/api/trips/:id/save", authMiddleware, async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  const tid = trip._id.toString();
  const alreadySaved = (req.user.savedTrips || []).some((id) => id.toString() === tid);

  if (alreadySaved) {
    req.user.savedTrips = (req.user.savedTrips || []).filter((id) => id.toString() !== tid);
  } else {
    req.user.savedTrips = [...(req.user.savedTrips || []), trip._id];
  }
  await req.user.save();
  res.json({ saved: !alreadySaved });
});

app.post("/api/trips/:id/share", async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  trip.shareCount = Number(trip.shareCount || 0) + 1;
  await trip.save();
  res.json({ shareCount: trip.shareCount });
});

mongoose
  .connect(MONGO_URI, { dbName: MONGO_DB_NAME })
  .then(async () => {
    // Ensure the requested master account is always available.
    const existingMaster = await User.findOne({ email: MASTER_EMAIL });
    if (!existingMaster) {
      const passwordHash = await bcrypt.hash(MASTER_PASSWORD, 10);
      await User.create({
        email: MASTER_EMAIL,
        passwordHash,
        username: "sidkadam",
        name: "Sid Kadam",
        bio: "Web App Developer",
        avatar: "https://avatars.githubusercontent.com/u/4149056?v=4",
      });
    } else {
      let changed = false;
      if (existingMaster.username !== "sidkadam") {
        existingMaster.username = "sidkadam";
        changed = true;
      }
      if (existingMaster.name !== "Sid Kadam") {
        existingMaster.name = "Sid Kadam";
        changed = true;
      }
      if (!existingMaster.avatar) {
        existingMaster.avatar = "https://avatars.githubusercontent.com/u/4149056?v=4";
        changed = true;
      }
      if (changed) {
        await existingMaster.save();
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB", err.message);
    process.exit(1);
  });
