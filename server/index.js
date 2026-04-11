const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

const BOT_TOKEN = "8279491526:AAFPWzJ9ilRC0hH2-DXtKCXRGqU46UvlxwM";

console.log("Trying MongoDB...");

mongoose.connect("mongodb+srv://grizzlytycoon:Grizzly6869@grizzlytycoon.yewbdnt.mongodb.net/?appName=GrizzlyTycoon")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(express.json());

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

    console.log("Referrer ID:", referrerId);

    let user = await User.findOne({ userId: chatId });

    if (!user) {
      user = new User({
        userId: chatId,
        referredBy: referrerId
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

    // ✅ SEND MESSAGE (FIXED TOKEN)
    try {
      await axios.post(
        `https://api.telegram.org/bot${8279491526:AAFPWzJ9ilRC0hH2-DXtKCXRGqU46UvlxwM}/sendMessage`,
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

app.get('/', (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server started");
});
