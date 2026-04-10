const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const BOT_TOKEN = "YOUR_BOT_TOKEN";

app.get('/send-game', async (req, res) => {
  const chatId = req.query.chatId;

  if (!chatId) {
    return res.send("Missing chatId");
  }

  try {
    const response = await axios.post(
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
                  url: "https://your-game.vercel.app"
                }
              }
            ]
          ]
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error sending message");
  }
});

app.get('/', (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server started");
});
