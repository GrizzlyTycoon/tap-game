let coins = 0;

const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
const userId = tgUser ? tgUser.id : "test_user";

console.log("USER ID:", userId);

window.onload = async function () {
  try {
    console.log("Loading coins...");

    const res = await fetch('https://tap-game-5271.onrender.com/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();

    coins = data.coins || 0;

    const el = document.getElementById('coins');
    if (el) el.innerText = coins;

    console.log("Loaded coins:", coins);

  } catch (e) {
    console.log("LOAD ERROR:", e);
  }
};

window.tap = async function () {
  console.log("tap clicked");

  coins++;
  const el = document.getElementById('coins');
  if (el) el.innerText = coins;

  try {
    const res = await fetch('https://tap-game-5271.onrender.com/tap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();

    console.log("Server response:", data);

    if (data.coins !== undefined) {
      coins = data.coins;
      if (el) el.innerText = coins;
    }

  } catch (e) {
    console.log("FETCH ERROR:", e);
  }
};
