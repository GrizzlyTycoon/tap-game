const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const app = express();

app.use(cors({
  origin: ["https://tap-game-gray.vercel.app"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log("Connecting MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  if (message.text && message.text.startsWith("/start")) {
    const chatId = message.chat.id;

    let referrerId = null;

    const parts = message.text.split(" ");
    if (parts.length > 1 && parts[1].startsWith("ref_")) {
      referrerId = parts[1].replace("ref_", "");
    }

    let user = await User.findOne({ userId: chatId });

    if (!user) {
      user = new User({
        userId: chatId,
        coins: 0,
        referrals: 0,
        referredBy: referrerId || null
      });

      // referral reward
      if (referrerId) {
        const refUser = await User.findOne({ userId: referrerId });

        if (refUser) {
          refUser.coins += 500;
          refUser.referrals += 1;
          await refUser.save();
        }
      }

      await user.save();
    }

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: "Play now 🎮",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Play Game",
                web_app: {
                  url: "https://tap-game-gray.vercel.app/"
                }
              }
            ]
          ]
        }
      }
    );
  }

  res.sendStatus(200);
});

app.post('/user', async (req, res) => {
  try {
    const { userId } = req.body;

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

    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({
        userId,
        coins: 0,
        referrals: 0
      });
    }

    user.coins += 1;
    await user.save();

    res.json({ coins: user.coins });

  } catch (err) {
    console.log("TAP ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/', (req, res) => {
  res.send("Server running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
