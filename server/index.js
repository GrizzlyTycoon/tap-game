const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const BOT_TOKEN = "8279491526:AAGLQO6MkX1eWzIV709uPfxTeBC-ighV4Cc"; //

// ✅ PASTE WEBHOOK HERE
app.post('/webhook', async (req, res) => {
  console.log("Webhook hit:", req.body);

  const message = req.body.message;

  if (message && message.text === "/start") {
    const chatId = message.chat.id;

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
                  url: "https://tap-game.vercel.app" // 🔴 replace with YOUR URL
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

// existing routes
app.get('/', (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server started");
});
