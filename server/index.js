const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log("Connecting MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post('/webhook', async (req, res) => {
  console.log("Webhook hit:", req.body);

  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  if (message.text && message.text.startsWith("/start")) {
    const chatId = message.chat.id;

    let referrerId = null;

    try {
      const parts = message.text.split(" ");
      if (parts.length > 1 && parts[1].startsWith("ref_")) {
        referrerId = parts[1].replace("ref_", "");
      }
    } catch (e) {
      console.log(e);
    }

    console.log("Referrer:", referrerId);

    let user = await User.findOne({ userId: chatId });

    if (!user) {
      user = new User({
        userId: chatId,
        coins: 0,
        referrals: 0,
        referredBy: referrerId || null
      });

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

    try {
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
    } catch (err) {
      console.error("Telegram error:", err.response?.data || err.message);
    }
  }

  res.sendStatus(200);
});

// ✅ TAP API (SAVE COINS)
app.post('/tap', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "No userId" });
    }

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
    console.log(err);
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

app.post('/user', async (req, res) => {
  const { userId } = req.body;

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({ userId, coins: 0 });
    await user.save();
  }

  res.json({ coins: user.coins });
});
