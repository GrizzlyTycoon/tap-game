let coins = 0;

async function tap() {
  const res = await fetch('https://tap-game-527l.onrender.com', {
    method: 'POST'
  });

  const data = await res.json();

  coins++;
  document.getElementById('coins').innerText = coins;
}
if (window.Telegram && Telegram.WebApp) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        console.log("User ID:", user.id);
    }
}
