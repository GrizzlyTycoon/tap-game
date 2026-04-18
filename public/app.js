const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ["https://tap-game-gray.vercel.app"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.options('*', cors()); // preflight

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

const userSchema = new mongoose.Schema({
  userId: String,
  coins: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send("Server running");
});

app.post('/user', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, coins: 0 });
      await user.save();
    }

    res.json({ coins: user.coins });

  } catch (err) {
    console.log("USER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/tap', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, coins: 0 });
    }

    user.coins += 1;
    await user.save();

    res.json({ coins: user.coins });

  } catch (err) {
    console.log("TAP ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
