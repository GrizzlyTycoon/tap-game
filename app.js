let coins = 0;

console.log("APP JS LOADED ✅");

window.tap = async function () {
  try {
    console.log("tap clicked");

    coins++;

    const el = document.getElementById('coins');
    if (el) {
      el.innerText = coins;
    }

    fetch('https://tap-game-5271.onrender.com/tap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (e) {
    console.log("ERROR:", e);
  }
};
