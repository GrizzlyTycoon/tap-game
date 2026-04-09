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
