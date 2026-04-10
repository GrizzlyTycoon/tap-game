const express = require('express');
const app = express();

app.use(express.json());

app.post('/tap', (req, res) => {
  res.json({ message: "Tap received!" });
});

app.get('/', (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server started");
});
app.get('/send-game', async (req, res) => {
  const chatId = req.query.chatId;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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
    });

    res.send("Game button sent");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});
