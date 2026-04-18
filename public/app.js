let coins = 0;

const tg = window.Telegram?.WebApp;
let userId = "test_user";

if (tg) {
  tg.ready();
  const user = tg.initDataUnsafe.user;
  if (user) userId = user.id;
}

console.log("USER ID:", userId);

window.onload = async function () {
  try {
    const res = await fetch('https://tap-game-5271.onrender.com/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();
    coins = data.coins || 0;

    document.getElementById('coins').innerText = coins;

  } catch (e) {
    console.log("LOAD ERROR:", e);
  }
};

window.tap = async function () {
  coins++;
  document.getElementById('coins').innerText = coins;

  try {
    const res = await fetch('https://tap-game-5271.onrender.com/tap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (data.coins !== undefined) {
      coins = data.coins;
      document.getElementById('coins').innerText = coins;
    }

  } catch (e) {
    console.log("FETCH ERROR:", e);
  }
};
