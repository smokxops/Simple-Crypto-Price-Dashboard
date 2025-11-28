const cryptoList = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
  "usd-coin",
  "cardano",
  "dogecoin",
  "avalanche-2"
];

const container = document.getElementById("crypto-container");

async function fetchPrices() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoList.join(",")}`
    );
    
    const data = await response.json();
    container.innerHTML = ""; // Clear old data

    data.forEach(coin => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${coin.image}" alt="${coin.name}">
        <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
        <p class="price">$${coin.current_price.toLocaleString()}</p>
        <p class="change ${coin.price_change_percentage_24h >= 0 ? "green" : "red"}">
          ${coin.price_change_percentage_24h.toFixed(2)}% (24h)
        </p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

// Fetch every 10 seconds (optional)
fetchPrices();
setInterval(fetchPrices, 10000);
