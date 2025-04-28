// Create a new trip
app.post('/api/trips', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Attach author info to the trip
    const tripData = {
      ...req.body,
      author: {
        _id: user._id,
        username: user.username,
        name: user.name,
        avatar: user.avatar
      }
    };
    const trip = new Trip(tripData);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token or server error' });
  }
}); 