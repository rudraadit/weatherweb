const apiKey = "9916529507d4438dbba85359262610";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const errorMessage = document.getElementById("error-message");

// DOM Elements - Weather
const locationName = document.getElementById("location-name");
const localTime = document.getElementById("local-time");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weather-condition");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

// DOM Elements - AQI
const aqiStatusBox = document.getElementById("aqi-status-box");
const aqiText = document.getElementById("aqi-text");
const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");

// Maps US-EPA Index values to human-readable strings and color indicators
const epaIndexMap = {
    1: { text: "Good", color: "#2ecc71" },
    2: { text: "Moderate", color: "#f1c40f" },
    3: { text: "Unhealthy for Sensitive Groups", color: "#e67e22" },
    4: { text: "Unhealthy", color: "#e74c3c" },
    5: { text: "Very Unhealthy", color: "#9b59b6" },
    6: { text: "Hazardous", color: "#bdc3c7" }
};

async function fetchWeather(city) {
    if (!city.trim()) return;

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;

    try {
        errorMessage.classList.add("hidden");
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("City not found. Please try again.");
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherResult.classList.add("hidden");
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");
    }
}

function displayWeather(data) {
    // 1. Parse Primary Weather metrics
    locationName.textContent = `${data.location.name}, ${data.location.country}`;
    localTime.textContent = `Local time: ${data.location.localtime}`;
    temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
    weatherCondition.textContent = data.current.condition.text;
    weatherIcon.src = `https:${data.current.condition.icon}`;
    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;

    // 2. Parse and display Air Quality Metrics
    if (data.current.air_quality) {
        const aqiData = data.current.air_quality;
        const epaIndex = aqiData["us-epa-index"];
        
        // Match EPA bracket metadata or fallback to default
        const aqiInfo = epaIndexMap[epaIndex] || { text: "Unknown Data", color: "#7f8c8d" };
        
        aqiText.textContent = `${aqiInfo.text} (${epaIndex})`;
        aqiStatusBox.style.backgroundColor = aqiInfo.color;
        
        // Populate specific fine particulate concentrations
        pm25.textContent = `${aqiData.pm2_5.toFixed(1)} µg/m³`;
        pm10.textContent = `${aqiData.pm10.toFixed(1)} µg/m³`;
    } else {
        aqiText.textContent = "AQI Data Unavailable";
        aqiStatusBox.style.backgroundColor = "#7f8c8d";
        pm25.textContent = "--";
        pm10.textContent = "--";
    }

    weatherResult.classList.remove("hidden");
}

// Event Configuration
searchBtn.addEventListener("click", () => fetchWeather(cityInput.value));
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchWeather(cityInput.value);
});

// Initialization
window.addEventListener("DOMContentLoaded", () => {
    fetchWeather("London");
});
