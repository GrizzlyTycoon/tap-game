let coins = 0;

async function tap() {
    try {
        await fetch('https://tap-game-5271.onrender.com', {
            method: 'POST'
        });
    } catch (e) {
        console.log("API failed, ignoring...");
    }

    coins++;
    document.getElementById('coins').innerText = coins;
}

if (window.Telegram && Telegram.WebApp) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        console.log("User ID:", user.id);
    }
}
