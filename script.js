// RESPONSIVENESS 
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector(".menu");
const icons = document.querySelectorAll("i");
    
hamburger.addEventListener("click", function (event) {
    const isVisible = menu.getAttribute('data-visible');
    if (isVisible == "true") {
        // qari hiding
        menu.setAttribute('data-visible', "false");
        icons[0].setAttribute('data-visible', "true");
        icons[1].setAttribute('data-visible', "false");
    } else if (isVisible == "false") {
        // soo bandhig showing
        menu.setAttribute('data-visible', "true");
        icons[0].setAttribute('data-visible', "false");
        icons[1].setAttribute('data-visible', "true");
    }
});
// ------------- weather App
// -- const API_KEY = "YOUR_API_KEY_HERE";
const apiKey = "8517eaaf954d571233b1dfeae0606ef3";

const weatherContainer = document.getElementById('weather-container');
const forecastDiv = document.getElementById("forecast");
const historyDiv = document.getElementById("history");
const errorMsg = document.getElementById("errorMsg");

async function getWeather(city = null) {
  const cityName = city || document.getElementById("cityInput").value.trim();
  if (!cityName) return;

  try {
    errorMsg.textContent = "";
    // 1. Current weather
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    if (data.cod !== 200) {
    throw new Error(data.message);

}
// input empty 
document.getElementById("cityInput").value = "";
// weather 
const weatherDiv = document.createElement('div');
weatherDiv.className = 'weather';

weatherDiv.innerHTML = `
  <h2>${data.name}, ${data.sys.country}</h2>
  <p>🌡️ Temp: ${data.main.temp}°C</p>
  <p>☁️ Weather: ${data.weather[0].description}</p>
  <p>💨 Wind: ${data.wind.speed} m/s</p>
  <p>💧 Humidity: ${data.main.humidity}%</p>
`;

weatherContainer.appendChild(weatherDiv);
// Save search history
saveHistory(data.name);

// 2. Forecast
getForecast(cityName);

} catch (error) {
    errorMsg.textContent = error.message;
    weatherDiv.innerHTML = "";
    forecastDiv.innerHTML = "";
      }
}

async function getForecast(cityName) {
  try {
const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
const data = await res.json();

if (data.cod !== "200") {
  throw new Error(data.message);
}

forecastDiv.innerHTML = "";
const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

daily.forEach(day => {
  forecastDiv.innerHTML += `
    <div class="card">
    <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
    <p>🌡️ ${day.main.temp}°C</p>
    <p>☁️ ${day.weather[0].description}</p>
    <p>💧 ${day.main.humidity}%</p>
    </div>
  `;
});
  } catch (error) {
    errorMsg.textContent = "❌ Forecast error: " + error.message;
    forecastDiv.innerHTML = "";
  }
}

function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
  displayHistory();
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyDiv.innerHTML = "";
  history.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => getWeather(city);
    historyDiv.appendChild(btn);
  });
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  displayHistory();
}
// Load history on page load
displayHistory();
