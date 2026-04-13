let coins = 0;

async function tap() {
  try {
    console.log("tap clicked");

    await fetch('https://tap-game-5271.onrender.com/tap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    coins++;

    const el = document.getElementById('coins');

    if (el) {
      el.innerText = coins;
    } else {
      console.log("coins element NOT found ❌");
    }

  } catch (e) {
    console.log("ERROR:", e);
  }
}
