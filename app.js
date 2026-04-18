let coins = 0;

console.log("APP JS LOADED ✅");

window.tap = async function () {
  try {
    coins++;

    const el = document.getElementById('coins');
    if (el) {
      el.innerText = coins;
    }

    const res = await fetch('https://tap-game-5271.onrender.com/tap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: Telegram.WebApp.initDataUnsafe.user.id
  })
});

    const data = await res.json();

    coins = data.coins;
    el.innerText = coins;

  } catch (e) {
    console.log("ERROR:", e);
  }
};

window.onload = async function () {
  try {
    const res = await fetch('https://tap-game-5271.onrender.com/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: Telegram.WebApp.initDataUnsafe.user.id
      })
    });

    const data = await res.json();

    coins = data.coins || 0;

    const el = document.getElementById('coins');
    if (el) el.innerText = coins;

  } catch (e) {
    console.log("LOAD ERROR:", e);
  }
};
