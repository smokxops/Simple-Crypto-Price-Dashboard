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

const tableBody = document.querySelector("#coins tbody");
const lastUpdateEl = document.getElementById("lastUpdate");
const errorEl = document.getElementById("error");
const searchEl = document.getElementById("search");
const sortByEl = document.getElementById("sortBy");
const sortDirEl = document.getElementById("sortDir");

let sortDir = "asc";
let coinData = [];

// Fetch crypto prices
async function fetchPrices() {
  try {
    errorEl.style.display = "none";

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoList.join(",")}`
    );

    coinData = await response.json();
    renderTable();
    lastUpdateEl.textContent = new Date().toLocaleTimeString();

  } catch (error) {
    errorEl.style.display = "block";
    errorEl.textContent = "Error fetching data.";
    console.log(error);
  }
}

// Render table rows
function renderTable() {
  const searchTerm = searchEl.value.toLowerCase().trim();

  let filtered = coinData.filter(c =>
    c.name.toLowerCase().includes(searchTerm) ||
    c.symbol.toLowerCase().includes(searchTerm)
  );

  filtered.sort((a, b) => {
    const field = sortByEl.value;
    return sortDir === "asc"
      ? a[field] - b[field]
      : b[field] - a[field];
  });

  tableBody.innerHTML = "";

  filtered.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.classList.add("coin-row");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="coin-name">
        <img src="${coin.image}" class="coin-img" width="26">
        <div>
          ${coin.name}<br>
          <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
        </div>
      </td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td class="${coin.price_change_percentage_24h >= 0 ? "price-up" : "price-down"}">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>$${coin.market_cap.toLocaleString()}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Search
searchEl.addEventListener("keyup", renderTable);

// Sorting
sortByEl.addEventListener("change", renderTable);

sortDirEl.addEventListener("click", () => {
  sortDir = sortDir === "asc" ? "desc" : "asc";
  sortDirEl.textContent = sortDir === "asc" ? "↑" : "↓";
  renderTable();
});

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light-theme");
});

// Refresh
document.getElementById("refresh").addEventListener("click", fetchPrices);

// Fetch on load + auto-refresh every 10 seconds
fetchPrices();
setInterval(fetchPrices, 10000);
